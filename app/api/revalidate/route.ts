import { NextResponse, type NextRequest } from 'next/server'
import { revalidatePath } from 'next/cache'
import crypto from 'node:crypto'
import { i18n, type Locale } from '@/i18n-config'

const SIGNATURE_HEADER = 'sanity-webhook-signature'
const REPLAY_TOLERANCE_MS = 5 * 60 * 1000

type SanityWebhookBody = {
  _id?: string
  _type?: string
  slugs?: Partial<Record<Locale, string | null>>
  slug?: Partial<Record<Locale, { current?: string } | null>>
}

function parseSignatureHeader(
  header: string
): { ts: number; v1: string } | null {
  const parts: Record<string, string> = {}
  for (const segment of header.split(',')) {
    const [k, v] = segment.trim().split('=', 2)
    if (k && v) parts[k] = v
  }
  const ts = Number(parts.t)
  if (!Number.isFinite(ts) || !parts.v1) return null
  return { ts, v1: parts.v1 }
}

function verifySignature(
  rawBody: string,
  header: string | null,
  secret: string
): boolean {
  if (!header) return false
  const parsed = parseSignatureHeader(header)
  if (!parsed) return false
  if (Date.now() - parsed.ts > REPLAY_TOLERANCE_MS) return false
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${parsed.ts}.${rawBody}`)
    .digest('base64url')
  if (expected.length !== parsed.v1.length) return false
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parsed.v1))
}

function extractSlugs(
  body: SanityWebhookBody
): Partial<Record<Locale, string>> {
  const slugs: Partial<Record<Locale, string>> = {}
  for (const lang of i18n.locales) {
    const fromProjection = body.slugs?.[lang]
    const fromRaw = body.slug?.[lang]?.current
    const slug =
      typeof fromProjection === 'string'
        ? fromProjection
        : typeof fromRaw === 'string'
          ? fromRaw
          : null
    if (slug) slugs[lang] = slug
  }
  return slugs
}

export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json(
      { error: 'webhook secret not configured' },
      { status: 500 }
    )
  }

  const rawBody = await req.text()
  if (!verifySignature(rawBody, req.headers.get(SIGNATURE_HEADER), secret)) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let body: SanityWebhookBody
  try {
    body = JSON.parse(rawBody) as SanityWebhookBody
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 })
  }

  if (body._type !== 'newsPost') {
    return NextResponse.json({ ok: true, ignored: true })
  }

  const slugs = extractSlugs(body)
  const revalidated: string[] = []

  for (const lang of i18n.locales) {
    const listPath = `/${lang}/news`
    revalidatePath(listPath)
    revalidated.push(listPath)

    const home = `/${lang}`
    revalidatePath(home)
    revalidated.push(home)

    const slug = slugs[lang]
    if (slug) {
      const detailPath = `/${lang}/news/${slug}`
      revalidatePath(detailPath)
      revalidated.push(detailPath)
    }
  }

  return NextResponse.json({ ok: true, revalidated })
}

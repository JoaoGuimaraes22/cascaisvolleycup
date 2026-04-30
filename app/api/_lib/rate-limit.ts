// In-memory IP-based rate limiter. State is per Vercel instance — a determined
// attacker hitting different regions can bypass it. Adequate for a low-traffic
// marketing site's email endpoints; swap to Redis/Upstash if abuse escalates.

type RateLimitOptions = {
  max?: number
  windowMs?: number
}

type RateLimitResult = {
  ok: boolean
  retryAfter?: number
}

const DEFAULT_MAX = 5
const DEFAULT_WINDOW_MS = 10 * 60 * 1000

const buckets = new Map<string, number[]>()
let lastSweep = Date.now()

function sweepStale(now: number, windowStart: number): void {
  for (const [ip, timestamps] of buckets) {
    const fresh = timestamps.filter(ts => ts > windowStart)
    if (fresh.length === 0) buckets.delete(ip)
    else if (fresh.length !== timestamps.length) buckets.set(ip, fresh)
  }
  lastSweep = now
}

function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) {
    const first = xff.split(',')[0]?.trim()
    if (first) return first
  }
  const xri = req.headers.get('x-real-ip')
  if (xri) return xri.trim()
  return 'anonymous'
}

export function rateLimit(
  req: Request,
  opts: RateLimitOptions = {}
): RateLimitResult {
  const max = opts.max ?? DEFAULT_MAX
  const windowMs = opts.windowMs ?? DEFAULT_WINDOW_MS
  const ip = getClientIp(req)
  const now = Date.now()
  const windowStart = now - windowMs

  if (now - lastSweep > windowMs) sweepStale(now, windowStart)

  const recent = (buckets.get(ip) ?? []).filter(ts => ts > windowStart)

  if (recent.length >= max) {
    buckets.set(ip, recent)
    const oldest = recent[0]!
    return { ok: false, retryAfter: Math.ceil((oldest + windowMs - now) / 1000) }
  }

  recent.push(now)
  buckets.set(ip, recent)
  return { ok: true }
}

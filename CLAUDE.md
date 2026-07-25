# CLAUDE.md — Cascais Volley Cup 2026

Project reference for Claude Code. Read this before making changes.

This project follows the same conventions as `services/web-dev/base/` — read the base CLAUDE.md too if you're unsure about a pattern.

---

## Project Overview

A multilingual tournament website for the **Cascais Volley Cup 2026** — a girls volleyball tournament in Cascais, Portugal. The site serves as both an information hub and registration system targeting international volleyball teams.

**Live site:** https://cascaisvolley.com
**Deployment:** Vercel
**Stack:** Next.js 16 · React 19 · Tailwind 4 · TypeScript

---

## Key Stakeholders

| Entity     | Role                                              | Email                  |
| ---------- | ------------------------------------------------- | ---------------------- |
| Volley4All | Tournament organizer, receives registrations      | info@volley4all.com    |
| O-Sports   | Accommodation partner, receives hotel inquiries   | info@o-sports.pt       |

---

## Tech Stack

| Layer       | Technology                                                          |
| ----------- | ------------------------------------------------------------------- |
| Framework   | Next.js 16 (App Router, Turbopack)                                  |
| Language    | TypeScript 5                                                        |
| UI          | React 19                                                            |
| Styling     | Tailwind CSS 4 (CSS-first via `@theme` in `app/globals.css`)        |
| i18n        | Custom dict pattern — no library; matches ignite-base               |
| Locale match| `@formatjs/intl-localematcher` + `negotiator` in `proxy.ts`         |
| Images      | Cloudinary via `next-cloudinary` (gallery only) + `next/image`      |
| Email       | Resend API (form submissions)                                       |
| Form valid. | `zod` server-side + custom `_lib/validation.ts` client-side         |
| Carousel    | `keen-slider`                                                       |
| Icons       | `react-icons`                                                       |
| Lint        | ESLint 9 (flat config) + `eslint-config-next` 16                    |
| Deployment  | Vercel (auto-deploys on push to main)                               |

---

## Internationalization (dict pattern)

**Locales:** `en` (default), `pt`, `es`, `fr`. Every route is prefix-always (`/en/...`, `/pt/...`).

- `i18n-config.ts` (root) — defines `locales` + `defaultLocale` + `Locale` type.
- `proxy.ts` (root) — Next 16 middleware (renamed from `middleware.ts`). Detects locale from `Accept-Language` and redirects un-prefixed URLs to `/{lang}{pathname}`.
- `app/[lang]/dictionaries/<locale>.json` — translation source. Top-level keys: `metadata`, `ui`, `localeNames`, `Header`, `LandingPage`, `AboutPage`, `AccommodationPage`, `ProgramPage`, `CompetitionPage`, `GalleryPage`, `NewsPage`, `HallOfFamePage`, `RegistrationPage`, `ContactModal`, `Footer`.
- `app/[lang]/dictionaries.ts` — exports `getDictionary(lang)`, `hasLocale(locale)`, `Dict` type. Server-only (`import "server-only"`).

### How to use translations

**Server Components** (default): receive `dict` as a prop from the page.

```tsx
// app/[lang]/about/page.tsx
const { lang } = await params;
if (!hasLocale(lang)) notFound();
const dict = await getDictionary(lang);
return <AboutHero lang={lang} dict={dict.AboutPage.Hero} />;
```

**Client Components**: same pattern — accept dict prop. Never import `useTranslations` (we don't use next-intl anymore).

**Adding a translation key:**
1. Add the key to all 4 dict JSONs (`en`, `pt`, `es`, `fr`). Translate it.
2. Reference via `dict.<namespace>.<key>` in the component.
3. TypeScript infers the shape from the JSON on the server side; declare a local `type ComponentDict = { ... }` matching the keys you consume.

**Locale-aware links:** use `localeHref(lang, "/about")` from `app/[lang]/_lib/seo.ts`. Returns `/{lang}/about`. Pair with `next/link`:

```tsx
import Link from "next/link";
import { localeHref } from "../../_lib/seo";

<Link href={localeHref(lang, "/registration")}>Register</Link>
```

### Brochure PDFs

Locale-specific PDFs use the `LANGUAGE_CODES` map in `app/[lang]/_lib/constants.ts`:
- `en` → `CVCUP-2026-CONVITE-UK.pdf`
- `pt` → `CVCUP-2026-CONVITE-PT.pdf`
- `es` → `CVCUP-2026-CONVITE-ESP.pdf`
- `fr` → `CVCUP-2026-CONVITE-FRAN.pdf`

`getBrochureFileName(lang)` returns the right filename.

---

## Routes / Pages

| Path             | Description                                |
| ---------------- | ------------------------------------------ |
| `/`              | Home / landing                             |
| `/about`         | About the tournament                       |
| `/program`       | Tournament schedule                        |
| `/competition`   | Competition info & divisions               |
| `/registration`  | Registration form + pricing                |
| `/accommodation` | Hotel accommodation (O-Sports)             |
| `/gallery`       | Gallery overview (all years)               |
| `/gallery/2025`  | 2025 photos                                |
| `/gallery/2024`  | 2024 photos                                |
| `/gallery/2023`  | 2023 photos                                |
| `/news`          | News articles (currently a stub)           |
| `/hall-of-fame`  | Hall of fame                               |

All routes prefixed with `/{lang}/`. All 12 routes × 4 locales = 48 pages, all SSG'd at build time.

---

## Project Structure

```
cascaisvolleycup/
├── i18n-config.ts                 # locale config (root)
├── proxy.ts                       # Next 16 middleware (root)
├── next.config.ts                 # Next config (TS)
├── eslint.config.mjs              # ESLint 9 flat config
├── postcss.config.mjs             # @tailwindcss/postcss only
├── tsconfig.json                  # paths: @/*: ./*
├── package.json                   # standalone pnpm app
├── pnpm-lock.yaml
│
├── app/
│   ├── globals.css                # Tailwind 4 @theme
│   ├── robots.ts                  # AI_CRAWLERS allowlist
│   ├── sitemap.ts                 # 48 entries with hreflang
│   ├── api/
│   │   ├── _lib/escape-html.ts
│   │   ├── register/route.ts      # zod-validated, escapes HTML
│   │   ├── osports-contact/route.ts
│   │   └── cloudinary/route.ts
│   └── [lang]/
│       ├── layout.tsx             # JSON-LD @graph (WebSite + Org + SportsEvent)
│       ├── page.tsx               # home (no route-level loading.tsx — see Performance / CLS)
│       ├── error.tsx
│       ├── not-found.tsx
│       ├── dictionaries.ts        # getDictionary(lang) loader
│       ├── dictionaries/{en,pt,es,fr}.json
│       ├── about/page.tsx
│       ├── accommodation/page.tsx
│       ├── competition/page.tsx
│       ├── gallery/page.tsx + {2023,2024,2025}/page.tsx
│       ├── hall-of-fame/page.tsx
│       ├── news/page.tsx
│       ├── program/page.tsx
│       ├── registration/page.tsx
│       ├── _components/           # private; not routable
│       │   ├── json-ld.tsx
│       │   ├── global/{header,footer,scroll-to-top-button,locale-switcher,contact-toast}.tsx
│       │   ├── about/{hero,villa,portugal}.tsx
│       │   ├── accommodation/hero.tsx
│       │   ├── competition/{hero,info,facts}.tsx
│       │   ├── gallery/{hero,gallery,optimized-cloudinary-image}.tsx
│       │   ├── hall-of-fame/{hero,participants,winners}.tsx
│       │   ├── landing/{welcome,location,news,news-card,news-section,news-section-skeleton,registration-toast}.tsx
│       │   ├── program/hero.tsx
│       │   └── registration/{hero,form}.tsx
│       ├── _hooks/{use-intersection-observer,use-optimized-gallery}.ts
│       └── _lib/
│           ├── seo.ts             # SITE_URL, localeHref, schemaIds, buildBreadcrumb, bcp47Locale, ogLocale
│           ├── constants.ts       # WAVE_HEIGHT, GLOBAL_ASSETS, getBrochureFileName
│           ├── validation.ts      # validateRegistrationForm + validateAccommodationForm
│           └── data/winners.ts    # Hall-of-fame data
```

### Naming conventions

- **Files:** `kebab-case` (e.g. `locale-switcher.tsx`)
- **Components:** `PascalCase` exports (`export default function LocaleSwitcher`)
- **Default exports** for components
- **Underscore-prefix folders** (`_components`, `_lib`, `_hooks`) for private/non-routable code

---

## Coding Conventions

### Components

- Server Components by default. Add `"use client"` only when you need state, effects, refs, or browser APIs.
- Accept a `dict` prop for any visible text. Never hardcode user-facing strings (English fallback strings like `t('foo') || 'Foo'` were removed during the migration — dict guarantees keys exist).
- Accept a `lang: Locale` prop for any component that builds links or loads locale-derived assets.
- Use `clsx` for conditional class merging.
- Use `next/image` with explicit `width`, `height`, `sizes`, `quality`, `loading`. Static asset imports work: `import Logo from "@/public/img/.../logo.webp"`.
- Use `Link` from `next/link` paired with `localeHref(lang, path)`.

### Styling

- **Tailwind 4 only** — no separate config file. All theme tokens are in `@theme` blocks inside `app/globals.css`.
- Custom CSS vars: `--primary`, `--background`, `--header-h`. Theme maps these via `--color-primary` etc.
- `motion-safe:` prefix for all animation/transition classes.
- Hover animations: `hover:scale-105` + `transition-all duration-200`.
- Entrance animations: `useStaggeredAnimation` from `_hooks/use-intersection-observer.ts`.

### Page-level pattern

```tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.AboutPage.Hero.heading,
    description: dict.AboutPage.Hero.subheading,
    alternates: { canonical: `/${lang}/about` },
  };
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  return (
    <>
      <AboutHero lang={lang} dict={dict.AboutPage.Hero} />
      {/* ... */}
    </>
  );
}
```

### Forms

- Always use `validateRegistrationForm` / `validateAccommodationForm` from `app/[lang]/_lib/validation.ts`.
- Pass a `t` adapter built from the dict: `const t = (k: string) => (dict.ValidationErrors as Record<string, string>)[k] ?? k;`
- Submit via `fetch('/api/register')` or `fetch('/api/osports-contact')`.
- API routes validate request bodies with zod and HTML-escape user input before sending email.

### SEO / metadata

- Layout `generateMetadata` builds per-locale canonical + hreflang × 4 + OG locale.
- Layout JSON-LD: `@graph` with `WebSite` + `Organization` (Volley4All) + `SportsEvent` (Cascais Volley Cup 2026), all linked via `@id` from `schemaIds(lang)`.
- `_lib/seo.ts` helpers: `SITE_URL`, `bcp47Locale(lang)`, `ogLocale(lang)`, `schemaIds(lang)` → `{ website, organization, event }`, `buildBreadcrumb(lang, items)`, `breadcrumbLabel(lang, key)`, `buildPageMetadata(lang, { title, description, path, image? })`, `buildPageGraph(lang, { type, path, name, description?, eventRef?, breadcrumb, dateCreated?, withPublisher? })`, `localeHref(lang, path)`.
- **Use `buildPageMetadata` in every page-level `generateMetadata` (including layout)** — returns full Metadata with hreflang × 4 + `x-default`, canonical, OG (localized URL + locale), Twitter card. Don't hand-roll the alternates.
- **Use `buildPageGraph` for per-page JSON-LD.** Returns the `@graph` (page-typed node + BreadcrumbList) with all `@id` plumbing handled. `type` ∈ `AboutPage` | `WebPage` | `CollectionPage` | `ImageGallery`; `eventRef` is `mainEntity` (page IS about the event, e.g. about/program/registration) or `about` (page is a collection that references the event, e.g. gallery/hall-of-fame); omit `eventRef` for pages with no event linkage (e.g. news stub). `withPublisher: true` and `dateCreated` apply to ImageGallery only. See `app/[lang]/about/page.tsx` for the canonical pattern.
- Sitemap auto-generates 48 entries (12 routes × 4 locales) with hreflang alternates.
- Robots allows AI crawlers (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, etc.).

---

## API Routes

### `POST /api/register`
Sends registration email to Volley4All via Resend. Validates with `zod`. Body fields: `name`, `email`, `mobile`, `club`, `city`, `country`, `questions`.

**Required env vars:** `RESEND_API_KEY`, `EMAIL_FROM`, `VOLLEY4ALL_EMAIL_TO`.

### `POST /api/osports-contact`
Sends accommodation inquiry to O-Sports via Resend. Validates with `zod`. Body fields: `teamName`, `country`, `teamManagerName`, `phone`, `email`, `ageGroup`, `numberOfPeople`, `message`.

**Required env vars:** `RESEND_API_KEY`, `EMAIL_FROM`, `OSPORT_EMAIL_TO`.

### `GET /api/cloudinary`
Fetches gallery images from Cloudinary. Supports year-based folder queries (`?folder=cascaiscup/2024&max=30&offset=0`) or batch all-years.

**Required env vars:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

---

## Sanity / news

News articles are authored in Sanity Studio embedded at `/studio`. Content is field-level multi-locale (every text field carries `en/pt/es/fr` in one document).

**Files**

- `sanity.config.ts` / `sanity.cli.ts` — Studio config (basePath `/studio`).
- `sanity/env.ts` — reads `NEXT_PUBLIC_SANITY_*` env vars.
- `sanity/schemas/` — `newsPost` document + `localeString`/`localeText`/`localeSlug`/`localeBlockContent` object types.
- `app/studio/[[...tool]]/page.tsx` + `studio.tsx` — Studio mount point.
- `app/[lang]/_lib/sanity-client.ts` — singleton `@sanity/client` (server-only, `useCdn: true`, `perspective: 'published'`).
- `app/[lang]/_lib/sanity-image.ts` — `urlFor(source)` builder for image transforms (safe in client + server).
- `app/[lang]/_lib/news.ts` — `getAllPosts`, `getRecentPosts`, `getPostBySlug`, `getAllSlugsForStaticParams`. GROQ uses `coalesce(field[$lang], field.en)` for graceful EN fallback.
- `app/[lang]/news/page.tsx` + `news/[slug]/page.tsx` — list + detail routes (ISR 1 h).
- `app/[lang]/_components/news/` — `hero`, `list`, `empty`, `article`, `portable-text-components`.
- `app/api/revalidate/route.ts` — Sanity webhook handler, HMAC-verifies signature with `SANITY_WEBHOOK_SECRET`, calls `revalidatePath` per locale.

**Adding a schema field**

1. Add the `defineField` in `sanity/schemas/news-post.ts` (or a new object type under `sanity/schemas/objects/`).
2. Project it in the GROQ queries in `app/[lang]/_lib/news.ts`.
3. Extend the `NewsCardData` / `NewsPostData` types.
4. Render it in `article.tsx` (or `list.tsx`).
5. No build step needed for the Studio — it picks up schema changes from the running file system.

**Manually triggering a revalidation**

From the Sanity dashboard or your own API client, send a POST to `/api/revalidate` with a properly signed body (`sanity-webhook-signature: t=<ms>,v1=<base64url(hmac-sha256(secret, "<ms>.<body>"))>`). For local debugging without HMAC: temporarily comment out the `verifySignature` call. **Do not deploy that change.**

**Configuring the webhook in Sanity**

Dashboard → Settings → API → Webhooks → Create:

- URL: `https://cascaisvolley.com/api/revalidate`
- Trigger on: Create + Update + Delete, filter `_type == "newsPost"`
- Projection (so the handler can extract slugs without re-fetching):

  ```groq
  {
    _id,
    _type,
    "slugs": {
      "en": slug.en.current,
      "pt": slug.pt.current,
      "es": slug.es.current,
      "fr": slug.fr.current
    }
  }
  ```

- Secret: paste `SANITY_WEBHOOK_SECRET`

CORS origins (Settings → API → CORS): add `http://localhost:3000` (untrusted, no credentials) and `https://cascaisvolley.com` (trusted, with credentials so Studio session cookies work).

**Seeding a sample post**

`node scripts/seed-news.mjs` — uploads `public/img/news/news1.webp` as a Sanity asset and publishes one sample article in EN/PT/ES/FR. Idempotent (skips if a post with the seed slug already exists). Requires `SANITY_WRITE_TOKEN`.

---

## Common Gotchas

- **Never import `Link` from `@/src/navigation`** — that file no longer exists. Use `next/link` + `localeHref`.
- **Never use `useTranslations`** — we use the dict pattern; pass `dict` props.
- **Translation keys must exist in all 4 locale files** before using them. Build will fail if a key is missing because of TypeScript inference across the union.
- **`params` is a Promise** in Next 16 — always `await params`.
- **Use `proxy.ts` not `middleware.ts`** — Next 16 renamed.
- **API routes use `route.ts` with named HTTP method exports** (already so).
- **Cloudinary `<CldImage>` requires `'use client'`** — `OptimizedCloudinaryImage` is a client wrapper to keep gallery pages partially server-rendered.

---

## Performance / CLS

- **No route-level `loading.tsx` under `[lang]`.** It wraps the whole segment in a `<Suspense>`; because every page is `async` (`await params`), the entire body gets deferred behind the tiny spinner fallback and swapped in on the client → ~0.5 CLS on the home page. Removed 2026-06-03. **Don't re-add a blanket `loading.tsx`.** If a route needs a loading state, scope it per-section (see below).
- **The home page must not `await` slow data at the top level.** The Sanity news fetch lives in `landing/news-section.tsx` (async) behind its own `<Suspense fallback={<NewsSectionSkeleton/>}>` in `page.tsx`, so the above-the-fold hero/location render inline and only the below-the-fold news strip streams. Keep new network dependencies out of the page's render-blocking path the same way.
- **`--header-h` is static per-breakpoint in `globals.css`** (51/64/66/73px at base/sm/md/lg), empirically measured from the closed header. There is **no** JS that measures the header — re-measure and update those four values if you change header padding or logo `max-h-*`.
- **Hero parallax (`.hero-parallax-bg`, `animation-timeline: scroll(root)`) is disabled in Firefox** via a `@supports (-moz-…)` guard — Firefox resolves the scroll-0 state to the end keyframe and shifts the bg down (white gap). Chrome keeps the effect. See `reference_nextjs_loading_tsx_cls` in memory.

---

## Development

This project is a standalone pnpm app inside the ignite monorepo. Always pass `--ignore-workspace`.

```bash
pnpm install --ignore-workspace
pnpm dev                     # localhost:3000
pnpm build                   # production build
pnpm lint                    # ESLint
pnpm format                  # Prettier (app/**/*.{ts,tsx,json})
```

Deployment is automatic via Vercel on push to main.

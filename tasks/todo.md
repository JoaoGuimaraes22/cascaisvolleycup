# Cascais Volley Cup — TODO

Post-migration polish items. Branch `refactor/migrate-to-ignite-base` is pushed
but not yet merged to main — Vercel will only redeploy after merge.

## Translation gaps (ES) — done 2026-04-30

- [x] Translate `app/[lang]/dictionaries/es.json` → `ContactModal` block
      (top-level). Full Spanish translation applied (title, fields,
      placeholders, validation messages).
- [x] Translate `app/[lang]/dictionaries/es.json` → `GalleryPage.Main` block.
      Tightened to match inline-usage casing (lowercase `imagen`/`imágenes`
      mid-sentence) and EN semantics (`load_more` → "Cargar más imágenes",
      `all_loaded` → "Todas las imágenes cargadas", `loading` → "Cargando
      galería...").

## SEO verification (build inspection) — 2026-04-30

All 48 SSG pages (12 routes × 4 locales, including home) ship: full
hreflang × 4 + `x-default`, canonical, OG (with `og:locale` per locale),
Twitter card, and JSON-LD `@graph`. Verified via build artifact grep —
all five SEO features render on 48/48 pages. Sitemap has 48 valid entries
(removed the dead `/location` route that never had a page). Home pages
also fixed — they were missing hreflang because the home page-level
`alternates` was overriding the layout's languages map.

## SEO enrichment — done 2026-04-30

- [x] Emit `BreadcrumbList` JSON-LD on every non-home page. All 12 inner pages
      (about, program, competition, registration, accommodation, gallery
      overview + 2023/2024/2025, hall-of-fame, news) now emit a unified
      `@graph` containing a page-typed node (`AboutPage`/`WebPage`/
      `CollectionPage`/`ImageGallery`) linked via `isPartOf` to website and
      `mainEntity`/`about` to the SportsEvent, plus a `BreadcrumbList`.
- [x] Centralized per-page metadata via `buildPageMetadata(lang, opts)` in
      `_lib/seo.ts` — every page now ships full hreflang × 4 + `x-default`,
      OG (with localized URL + locale), and Twitter card. Replaces ~15 lines
      of boilerplate per page.
- [x] Gallery year pages (2023/2024/2025): converted inline raw `<script>`
      tags to the `<JsonLd>` component (consistent `<` escape) and merged
      breadcrumb + ImageGallery into one `@graph` linked via shared `@id`.
- [N/A] FAQPage JSON-LD on `/registration` — no FAQ section exists in the
      registration dict.

## Lint polish (React 19 perf hints) — done 2026-04-30

All `react-hooks/set-state-in-effect` and `react-hooks/immutability` warnings
resolved; eslint config restored to defaults (no rule overrides). Fixes:

- [x] `header.tsx` — replaced pathname-reset useEffect with the "store info
      from previous renders" pattern (set during render when pathname differs).
- [x] `registration-toast.tsx` + `testimonials.tsx` + `welcome.tsx` —
      replaced `setMounted(true)` mount-effect pattern with new shared
      `_hooks/use-is-client.ts` (`useSyncExternalStore` returning false on
      server, true on client).
- [x] `welcome.tsx` — replaced `setIsDesktop(mediaQuery.matches)` mount
      effect + change listener with new shared `_hooks/use-media-query.ts`
      (`useSyncExternalStore` over `matchMedia`).
- [x] `gallery.tsx` `useProgressiveGallery` — restructured around a
      `requestKey` derived from `year`/`folder`. Sync state reset happens
      during render (key-mismatch detection), the effect only kicks off
      the async fetch (no sync setState before await). Stale responses
      ignored via key comparison + cancellation flag. `loadMore` now an
      event-handler async function.
- [x] `use-optimized-gallery.ts` — full rewrite. Dropped unused returns
      (`refresh`, `clearCache`, `fromCache`, `isStale`, `lastFetch`,
      `getTotalImagesCount`, `imagesByYear`, `errors`, `data`) since
      `hero.tsx` only consumes `availableYears`/`loading`/`error`/
      `getImagesForYear`/`isEmpty`. Replaced recursive `useCallback`
      with a module-level `fetchGalleryWithRetry(maxPerYear, signal,
      attempt)` async function. Mount + visibility effects use async
      IIFE with cancellation flag — all setState calls happen post-await.

## Backlog

- [ ] **Extract `GradientButton` primitive** — sky-600/sky-700 gradient
      button styles are inlined in `_components/global/footer.tsx`,
      `_components/competition/hero.tsx`, and the new
      `_components/landing/plan-trip-cta.tsx`. Consolidate into a shared
      component once a 4th use case appears (rule of three).

## Misc

- [x] `news/page.tsx` i18n — done 2026-04-30. Added `NewsPage` block
      (`title`, `description`, `comingSoon`) to all 4 locale dicts —
      EN "News" / PT "Notícias" / ES "Noticias" / FR "Actualités" — and
      replaced the `NEWS_TITLE`/`NEWS_DESCRIPTION` constants + the
      hardcoded "Coming soon" body with `dict.NewsPage.*` references.
      Page is still a stub ("Coming soon" body); when real content
      ships, expand `NewsPage` with `Hero` / article keys mirroring
      other page blocks.
- [x] Gallery year pages (`gallery/{2023,2024,2025}/page.tsx`) mix PT/ES/FR
      dict text with hardcoded English suffixes — fixed 2026-04-30. Replaced
      `yearDescription`/`yearSubtitle` with templated `yearMetaDescription`,
      `yearGalleryName`, `yearGalleryDescription`, `yearFullDescription` keys
      in all 4 locale dicts (with `{year}` placeholder, swapped via a small
      `withYear()` helper per page). Verified rendered HTML on PT/ES/FR is
      now fully translated across Twitter/OG description + JSON-LD
      ImageGallery name/description + Gallery component description prop.
- [x] Bumped `prettier-plugin-tailwindcss` 0.6 → 0.8 — done 2026-04-30. Done
      in two commits: first a drift-only `pnpm format` pass on 0.6 (the
      codebase had drifted from project `.prettierrc` because VS Code was
      formatting with the user's *global* config — quotes/semis/commas/
      printWidth all flipped). After that commit, the 0.8 bump itself
      produced **zero** Tailwind class reorders for this codebase — 0.6.14
      and 0.8.0 produce identical output here. Final commit is just the
      version bump in `package.json` + `pnpm-lock.yaml`.
- [N/A] Centralize `revalidate` magic numbers in `_lib/revalidate.ts` —
      attempted 2026-04-30, reverted. Next.js requires route segment config
      exports (`revalidate`, `dynamic`, etc.) to be **statically
      analyzable**: imported identifiers fail the build with `Invalid
      segment configuration export detected`. The bundler reads these via
      AST, not runtime evaluation. Lesson recorded in
      `tasks/lessons/build.md`. Keeping inline literals (`3600`, `86400`).
- [ ] Consider migrating CSS animations to the `motion` library to match
      ignite-base. Out-of-scope for this branch; revisit only when
      redesigning a section.

## Performance quick wins — done 2026-04-30

- [x] **Logo `priority`** — `_components/global/header.tsx`: replaced
      `loading='eager'` with `priority` on the header logo. Above-the-fold
      LCP element; `priority` adds `<link rel="preload">` and overrides
      lazy decode. Estimated 10-20ms LCP win.
- [x] **Revalidate consistency** — bumped 4 pages from `3600` to `86400`
      (home, gallery overview, registration, news). All 12 routes now at
      24h, matching the gallery year pages. Content is dict-driven and
      changes < weekly; hourly ISR was wasteful.
- [x] **Gallery cache versioning** — `_hooks/use-optimized-gallery.ts`:
      `cascais-gallery-cache` → `-v1`. Future-proofs against silent
      data-shape drift; bump suffix to invalidate all client caches.
- [x] **Teams data extraction** — moved hardcoded `SAMPLE_TEAMS` array out
      of `_components/hall-of-fame/participants.tsx` into new
      `_lib/data/teams.ts` (mirrors existing `_lib/data/winners.ts`).
      Team names are proper nouns + ISO country codes — not translatable,
      so a TS data file is more correct than the dict.
- [x] **Dict-first fix** — `participants.tsx` had a hardcoded
      `"See N more teams"` mobile-only button. Added `seeMoreTeams` key
      with `{count}` placeholder to all 4 locale dicts under
      `HallOfFamePage.Participants` and replaced via `dict.seeMoreTeams.replace`.

## Performance audit — investigated, not changed

- [N/A] **react-icons barrel** — proposed by audit, but `next.config.ts`
      already has `experimental.optimizePackageImports: ["react-icons",
      "keen-slider"]`. Subpath imports (`react-icons/fi`) are tree-shaken
      optimally. A barrel would only add indirection.
- [N/A] **Lazy-load `nextjs-toploader`** — savings <2KB and the loader
      needs to register early to catch first navigation. Risk > reward.

## Performance medium-effort items — investigated 2026-04-30

- [x] **`/api/cloudinary` cache headers** — bumped both response branches
      (batch + per-folder) from `max-age=300` to
      `max-age=86400, stale-while-revalidate=604800`. Tournament photos
      are immutable once uploaded; weekly SWR window covers any late
      uploads. Reduces Cloudinary API hits ~96% during steady state.
- [N/A] **Lazy-load `keen-slider` + CSS** — superseded by full removal
      of `keen-slider` (see "Drop keen-slider entirely" below).
- [N/A] **`villa-bg.webp` responsive variants** — overstated by audit.
      `villa.tsx:62` uses `<Image fill sizes='100vw' quality={75}>`;
      Next/Image already serves per-viewport optimized webp/avif at
      runtime. The 4.5MB is the source the optimizer reads, not what
      mobile users download (~150-300KB after avif optimization).
      Recent `b10fbc6` already bounded sizes correctly.

## Drop keen-slider entirely — done 2026-04-30 (branch `refactor/drop-keen-slider`)

Replaced `keen-slider` (^6.8.6) across all 4 carousels with native CSS
scroll-snap matching the canonical ignite pattern (reference:
`services/web-dev/templates/barbershop/app/[lang]/_components/reviews.tsx`).

- [x] **Shared hook** — new `_hooks/use-snap-carousel.ts` (~85 LOC).
      API: `{ scrollRef, activeIndex, goToSlide, next, prev }`. Single
      option: `loop`. Active index derived from `scrollLeft / cardWidth`
      via passive scroll listener + rAF debounce.
- [x] **`landing/news.tsx`** — loop carousel.
      `basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(25%-0.75rem)]`.
- [x] **`landing/testimonials.tsx`** — loop carousel (manual nav only,
      no auto-rotate per UX call).
      `basis-[calc(50%-0.375rem)] lg:basis-[calc(33.3333%-0.6667rem)]`.
      Mobile-first stacked view unchanged (3 testimonials).
- [x] **`about/portugal.tsx`** — peek slides at mobile/tablet
      (`basis-[83%] sm:basis-[calc(45%-0.625rem)]`); desktop renders the
      4-col grid as before.
- [x] **`program/hero.tsx`** — peek slides at three breakpoints
      (`basis-[83%] sm:basis-[calc(45%-0.5rem)] md:basis-[calc(31%-0.5rem)]`);
      desktop renders the 5-col grid.
- [x] **`@utility scrollbar-hide`** added to `globals.css` (Tailwind 4
      doesn't ship this by default; matches ignite-base templates that
      reference the class).
- [x] **Dep removed** — `keen-slider` dropped from `package.json` and
      lockfile; dropped from `experimental.optimizePackageImports` in
      `next.config.ts`. `pnpm install --ignore-workspace` to refresh.

**Net change:** −281 / +73 in components (~−208 LOC) + 120 LOC for the
shared hook = ~−90 LOC overall, plus removed library + CSS import.

**Build verification:** `pnpm lint && pnpm exec tsc --noEmit && pnpm build`
all pass; all 48 SSG routes generate.

**Limitations vs keen-slider:**
- No free mouse-drag (click-and-drag with pointer); touch drag works
  natively, desktop users use prev/next or wheel-scroll. Matches ignite
  barbershop pattern.

## Security hardening — done 2026-04-30 (branch `security/headers-and-rate-limit`)

Application-layer hardening pass. Audit confirmed perf is mature; gaps were
firmly on the security side (no rate limit, no captcha/honeypot, no CSP/HSTS,
unbounded inputs on the Cloudinary route).

- [x] **Security headers** in `next.config.ts` — added HSTS
      (`max-age=63072000; includeSubDomains; preload`), Permissions-Policy
      (camera/microphone/geolocation/payment/interest-cohort/browsing-topics
      all `()`), and a pragmatic CSP. CSP is `isDev`-aware: prod uses strict
      `script-src 'self' 'unsafe-inline'` + Vercel scripts allowlist +
      `upgrade-insecure-requests`; dev adds `'unsafe-eval'` (React dev
      callstack reconstruction + Next HMR) and `ws: wss:` (HMR socket).
      `frame-ancestors`, `base-uri`, `form-action`, `object-src 'none'`
      locked down in both modes.
- [x] **Rate limiter** — new `app/api/_lib/rate-limit.ts`. In-memory IP token
      bucket, 5 req / 10 min / IP. Time-based sweep prunes stale buckets
      once per window so the Map stays bounded on long-running instances.
      Per-Vercel-instance limitation documented at top of file (swap to
      Upstash if abuse escalates). Wired into both email routes; returns
      429 + `Retry-After`.
- [x] **Honeypot** — new `app/api/_lib/honeypot.ts` (server-side
      `isBotSubmission(body)` checking the `website` field) and new
      `app/[lang]/_components/global/honeypot-field.tsx` (React 19
      ref-as-prop component, visually hidden via inline `position: absolute;
      left: -9999px`). Used by all 3 forms (registration page, home-page
      modal, accommodation modal). Bot submissions return silent 200 so the
      trap doesn't reveal itself; Resend never called.
- [x] **Cloudinary input validation** in `app/api/cloudinary/route.ts` —
      `ALLOWED_FOLDERS` whitelist (only `cascaiscup/{2023,2024,2025}` →
      400 on anything else); `parseClampedInt` clamps `max`/`offset`/
      `maxPerYear` to `[1, MAX_IMAGES_PER_YEAR]` / `[0, MAX_IMAGES_PER_YEAR]`.
      Replaces bare `parseInt()` which accepted negatives + NaN.

**Verification (local, dev mode):**

- `pnpm lint && pnpm exec tsc --noEmit && pnpm build` all clean (48 SSG routes).
- `curl 'http://localhost:3000/api/cloudinary?folder=foo/bar'` → 400.
- `curl 'http://localhost:3000/api/cloudinary?folder=cascaiscup/2024&max=999999'`
  → 200, clamped to MAX_IMAGES_PER_YEAR.
- POST register with `{...payload, website: 'spam'}` → silent 200, no email.
- 7× rapid POST register → 5×400, 6th–7th = 429 with `retry-after: 600`.
- `curl -I /en` → HSTS, Permissions-Policy, CSP all present.
- Real form submit → email arrives in inbox.

**Notes for prod:**

- Vercel reads its own dashboard env vars; local `.env.local` overrides do
  not affect prod. Email targets in prod stay on `info@volley4all.com` /
  `info@o-sports.pt` regardless of local edits.
- CSP in prod drops `'unsafe-eval'` + `ws:`/`wss:`, adds
  `upgrade-insecure-requests`. React/Next prod don't use eval, so no
  breakage expected.
- Rate limit is per-Vercel-instance — at scale, an attacker hitting
  different regions can bypass. Acceptable for a marketing-site contact
  form; Upstash swap is a one-file change if abuse appears.

## Mobile performance pass — done 2026-04-30 (branch `perf/home-page-rsc`)

Lighthouse baseline (mobile, home, pre-pass):

| Metric | Value | Verdict |
| ------ | ----- | ------- |
| Performance score | 59 | needs improvement |
| FCP | 1.6 s | OK |
| LCP | 3.6 s | needs improvement (target <2.5s) |
| **TBT** | **1,090 ms** | **POOR (target <200ms)** |
| CLS | 0 | perfect |
| Speed Index | 8.2 s | poor |

**Hypothesis:** TBT (JS hydration) is the dominant problem. The home
page chain `LandingWelcome` → `LandingUpdates` → `LandingLocation`
hydrated ~3 large client components on first paint, plus eagerly
mounted Vercel Analytics + SpeedInsights + NextTopLoader.

### Changes shipped

- [x] **Welcome → Server Component** (`_components/landing/welcome.tsx`).
      Removed parallax JS (rAF + scroll listener), `useIsClient` fade-in
      gates, `useMediaQuery`. Replaced JS parallax with CSS
      `animation-timeline: scroll(root)` keyframe in `globals.css` —
      pure CSS scroll-driven animation on Chromium/Firefox; Safari
      falls back to static bg. Hero now ships zero JS.
- [x] **Updates → Server Component** (`_components/landing/updates.tsx`).
      Dropped redundant `useIntersectionObserver` gate around bg + wave
      images. `next/image` already lazy-loads below-fold images
      natively (same `rootMargin: ~200px` behavior). `LandingTestimonials`
      remains the only client island in this section.
- [x] **Location → Server Component + tiny CTA island**
      (`_components/landing/location.tsx` + new
      `_components/landing/plan-trip-cta.tsx`). Dropped IO gate.
      Extracted button + `RegistrationToast` mount into a small client
      island. The toast itself is now `next/dynamic`-loaded — its
      form-validation chunk only ships when a button is clicked.
- [x] **Defer third-party scripts** (new
      `_components/global/deferred-third-party.tsx`). `<Analytics />`,
      `<SpeedInsights />`, `<NextTopLoader />` now mount via
      `requestIdleCallback` (with `setTimeout(1500)` fallback). Each
      is `next/dynamic`-loaded so chunks are not in the initial bundle.
      Tradeoff: NextTopLoader misses the very first navigation if a
      user clicks within ~1.5s of paint — acceptable.
- [x] **`page.tsx` cleanup** — dropped `next/dynamic` wrappers around
      Updates/Location now that they're light RSC.
- [x] `RegistrationFormDict` exported from `registration-toast.tsx` so
      the new island can import it without duplication.

### Files NOT changed (intentional)

- `_components/landing/testimonials.tsx` — must stay client (carousel)
- `_components/landing/registration-toast.tsx` — already lazy on click;
      now also code-split via `next/dynamic`
- `_hooks/use-intersection-observer.ts`, `use-is-client.ts`,
      `use-media-query.ts` — still used by inner pages
- Header / Footer / ScrollToTopButton / LocaleSwitcher — justified
      client cost or already RSC

### Verification

- `pnpm lint` — clean
- `pnpm exec tsc --noEmit` — clean
- `pnpm build` — all 48 SSG pages emit
- Lighthouse re-measure pending user smoke test on branch
      `perf/home-page-rsc` (or after merge to main → Vercel deploy)

## News / Sanity CMS — shipped 2026-05-12 (branch `feat/news-sanity`, merged to main)

Replaced the `/news` stub with a full Sanity-CMS-powered news section. Studio
embedded at `/studio`, field-level multi-locale schema (each text field carries
en/pt/es/fr in one document), Portable Text body rendering, ISR (1h) + webhook
revalidation, top and bottom wave decoration matching the Location section.
Landing strip pulls top 4 below the Location section.

- Sanity project `usmxu3p8` / dataset `production` / embedded Studio at `/studio`
- Webhook → `/api/revalidate` (HMAC-verified, revalidates list + home + per-locale detail)
- Schema in `sanity/schemas/` (newsPost + 4 locale object types: localeString, localeText, localeSlug, localeBlockContent)
- Data layer in `app/[lang]/_lib/news.ts` (server-only, React `cache()` on `getPostBySlug`)
- Full Sanity setup docs in the project `CLAUDE.md` ("Sanity / news" section)
- Seed script: `node scripts/seed-news.mjs` (idempotent; uses `SANITY_WRITE_TOKEN`)
- Editor access: client invited to Sanity as Editor; both sign in with their own Google accounts

### Backlog (news enhancements)

- [ ] **Per-article sitemap entries**. `/news` is in `sitemap.ts` but per-slug entries are missing — search engines have to crawl the list page to discover articles. Add a Sanity fetch in `sitemap.ts` to enumerate published slugs per locale. ~20 LoC.
- [ ] **GROQ-level pagination for `getAllPosts`**. Currently returns every post. Fine until the archive grows past ~100; then switch to `[$offset...$offset+$limit]` with offset-based "Load more" that fetches the next batch from a route handler instead of client-side slicing.
- [ ] **Sanity Visual Editing**. Wire up `next-sanity/visual-editing` so the client can click any element on a draft preview and jump straight into Studio at that field. Big editor-UX win. ~half-day effort.
- [ ] **Tags / categories / search** — add when content volume justifies it.
- [ ] **RSS feed** at `/news/feed.xml` — small effort, only worth it if anyone actually subscribes.

## Desktop CLS + INP fix — done 2026-06-03

Vercel Speed Insights flagged the home page on Desktop: **CLS 0.56**, **INP 768ms**
(worse in Firefox). Root-caused empirically (Playwright + CDP 4× CPU throttle +
buffered `layout-shift` observer; confirmed against a local prod build).

- [x] **Root cause: `loading.tsx` whole-page Suspense gate.** `app/[lang]/loading.tsx`
      wrapped the segment in `<Suspense>`; the `async` page (`await params`/Sanity)
      deferred the **entire** body behind a 40px spinner, then `$RC`-swapped in the
      3330px content → 0.508 CLS every load. Scoping the Sanity fetch alone did NOT
      fix it (still 0.54) — the page suspends on `await params` regardless. **Deleted
      `loading.tsx`** → content renders inline in the static HTML. **CLS 0.56 → ~0.013.**
- [x] **Scoped the Sanity news fetch** into `landing/news-section.tsx` (async) behind
      `<Suspense fallback={<NewsSectionSkeleton/>}>` in `page.tsx`, so the news strip
      is the only thing that streams (below the fold). New: `news-section.tsx`,
      `news-section-skeleton.tsx`.
- [x] **Static `--header-h`** per breakpoint in `globals.css` (51/64/66/73px), deleted
      the `useHeaderHeight` JS hook (ResizeObserver + setTimeout) in `header.tsx`.
      Kills the 64→73px hydration shift + that main-thread work (helps INP).
- [x] **Firefox hero gap** — `@supports (-moz-…)` guard disables the
      `animation-timeline: scroll(root)` parallax in Firefox only (it resolved the
      scroll-0 state to the end keyframe, shifting the bg down 30vh). Chrome untouched.

Verified: lint + tsc + build clean (57 static pages, home SSG); Chrome CLS 0.0067 on
local prod build; Chrome parallax confirmed still active.

### Follow-up (same antipattern, lower priority)

- [ ] `/news` and `/news/[slug]` also `await` Sanity under what was the shared
      `loading.tsx`. Lower priority (the awaited data IS the page's main content), but
      the spinner-swap CLS applies there too — scope the same way if Speed Insights flags them.

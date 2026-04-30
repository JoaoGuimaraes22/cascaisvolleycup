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

## Mobile performance pass — next session

Lighthouse baseline (2026-04-30, mobile, home page, post all today's
changes):

| Metric | Value | Verdict |
| ------ | ----- | ------- |
| Performance score | 59 | needs improvement |
| FCP | 1.6 s | OK |
| LCP | 3.6 s | needs improvement (target <2.5s) |
| **TBT** | **1,090 ms** | **POOR (target <200ms)** |
| CLS | 0 | perfect |
| Speed Index | 8.2 s | poor |

**Hypothesis:** TBT (JS hydration) is the dominant problem; Speed Index
follows it. The home page chain `LandingWelcome` (parallax + matchMedia
+ scroll listeners) → `LandingUpdates` (Testimonials + News, all client)
→ `LandingLocation` hydrates ~3 large client components on first paint.
React 19 + throttled mobile CPU = >1s blocking.

**Suggested approach next session** (~half day to a day):

1. **Audit `'use client'` boundaries** — many components are marked
   client just for `useIntersectionObserver` (fade-in animations).
   Convert to RSC where possible. Move animation triggers to CSS
   (`animation-timeline: view()` if browser support is OK; else keep
   IO but only on the few sections that actually need it).
2. **Kill the welcome.tsx parallax `requestAnimationFrame` loop** —
   parallax is "nice to have", costs main-thread time on every scroll
   frame. Replace with `background-attachment: fixed` (CSS-only) or
   drop entirely on mobile.
3. **Defer Vercel Analytics + SpeedInsights** — they currently load
   eagerly in the layout. Use `<Script strategy="afterInteractive">`
   or `next/dynamic`.
4. **Hero LCP image** — verify the welcome section's main image is
   `priority`, has tight `sizes`, and is appropriately compressed.
   3.6s LCP suggests it's still being decoded late.
5. **Re-measure** Lighthouse after each change; expect the score to
   move into the 75-85 range with the above changes done.

**Don't touch:** CLS (already 0). Carousels (just refactored, fine).

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

- [ ] `app/[lang]/news/page.tsx` hardcodes English `"News"` title and
      description (no `NewsPage` block in dicts). Once the news page ships
      real content, add a `NewsPage` block to all 4 dict locales mirroring
      `GalleryPage`, and replace the `NEWS_TITLE`/`NEWS_DESCRIPTION`
      constants with dict references. PT/ES/FR users currently get an
      English `<title>` for `/news`.
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

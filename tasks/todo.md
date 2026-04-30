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

## Lint polish (React 19 perf hints)

Currently `react-hooks/set-state-in-effect` and `react-hooks/immutability` are
demoted to warn in `eslint.config.mjs`. The 6 warnings flag legitimate
patterns that React 19's docs prefer to express differently:

- [ ] `app/[lang]/_components/global/header.tsx:69` — `setMenuOpen(false)`
      on pathname change. Cleaner: derive open state from pathname or use
      `useSyncExternalStore`.
- [ ] `app/[lang]/_components/landing/registration-toast.tsx:145` —
      `setMounted(true)` hydration guard. Replace with
      `useSyncExternalStore` or a `useId`-driven CSS class trick.
- [ ] `app/[lang]/_components/landing/testimonials.tsx:124` — same
      `setIsMounted(true)` hydration pattern.
- [ ] `app/[lang]/_components/gallery/gallery.tsx:148` — `loadImages(false)`
      called in effect. Refactor to use a query-key pattern that triggers
      load on render rather than effect.
- [ ] `app/[lang]/_hooks/use-optimized-gallery.ts:251` —
      `fetchGalleryData()` in effect on mount. Same fix.
- [ ] `app/[lang]/_hooks/use-optimized-gallery.ts:166` — `fetchGalleryData`
      `useCallback` redefining identity each render
      (`react-hooks/immutability`). Probably needs the dep array tightened.

After cleanup, restore the rules to `error` in `eslint.config.mjs`.

## Misc

- [ ] `app/[lang]/news/page.tsx` hardcodes English `"News"` title and
      description (no `NewsPage` block in dicts). Once the news page ships
      real content, add a `NewsPage` block to all 4 dict locales mirroring
      `GalleryPage`, and replace the `NEWS_TITLE`/`NEWS_DESCRIPTION`
      constants with dict references. PT/ES/FR users currently get an
      English `<title>` for `/news`.
- [ ] Gallery year pages (`gallery/{2023,2024,2025}/page.tsx`) mix PT/ES/FR
      dict text with hardcoded English suffixes in three places:
      Twitter/OG description (`...View photos and highlights from the Cascais
      Cup 2025 volleyball tournament.`), `<JsonLd>` `ImageGallery`
      description/name (`Official photo gallery of Cascais Cup 2025
      volleyball tournament`, `Cascais Cup 2025 Photo Gallery`), and the
      Gallery component `description` prop. Add per-locale year-meta keys
      to `GalleryPage` (e.g. `yearMetaDescription`, `yearGalleryName`)
      and reuse them across metadata + JSON-LD + component. Pre-existing
      from before the SEO migration — verified by build inspection
      2026-04-30.
- [ ] Re-evaluate `prettier-plugin-tailwindcss` 0.6 → 0.8 (latest). Trivial
      bump but may reorder some Tailwind classes; run formatter and review
      diff.
- [ ] Drop `revalidate = 3600` magic numbers and centralize in a
      `_lib/revalidate.ts` constants file (currently 3600 on home/news,
      86400 on gallery years). Minor housekeeping.
- [ ] Consider migrating CSS animations to the `motion` library to match
      ignite-base. Out-of-scope for this branch; revisit only when
      redesigning a section.

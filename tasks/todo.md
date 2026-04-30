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

## SEO enrichment

- [ ] Emit `BreadcrumbList` JSON-LD on every non-home page using
      `buildBreadcrumb(lang, items)` from `_lib/seo.ts` + `<JsonLd data={...}/>`
      from `_components/json-ld.tsx`. Pattern:
      ```tsx
      const breadcrumb = buildBreadcrumb(lang, [
        { name: dict.AboutPage.Hero.heading, path: "/about" },
      ]);
      return (
        <>
          <JsonLd data={breadcrumb} />
          ...
        </>
      );
      ```
      Pages: about, program, competition, registration, accommodation,
      gallery (and 2023/2024/2025), hall-of-fame, news.
- [ ] Consider `FAQPage` JSON-LD on `/registration` if there's an FAQ
      section. Same pattern with `@type: FAQPage`.

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

- [ ] Re-evaluate `prettier-plugin-tailwindcss` 0.6 → 0.8 (latest). Trivial
      bump but may reorder some Tailwind classes; run formatter and review
      diff.
- [ ] Drop `revalidate = 3600` magic numbers and centralize in a
      `_lib/revalidate.ts` constants file (currently 3600 on home/news,
      86400 on gallery years). Minor housekeeping.
- [ ] Consider migrating CSS animations to the `motion` library to match
      ignite-base. Out-of-scope for this branch; revisit only when
      redesigning a section.

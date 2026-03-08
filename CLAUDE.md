# CLAUDE.md — Cascais Volley Cup 2026

Project reference for Claude Code. Read this before making changes.

---

## Project Overview

A multilingual tournament website for the **Cascais Volley Cup 2026** — a girls volleyball tournament in Cascais, Portugal. The site serves as both an information hub and registration system targeting international volleyball teams.

**Live site:** https://cascaisvolley.com  
**Deployment:** Vercel  
**Stack:** Next.js 14 · TypeScript · Tailwind CSS · next-intl

---

## Key Stakeholders

| Entity | Role | Email |
|---|---|---|
| Volley4All | Tournament organizer, receives registrations | info@volley4all.com |
| O-Sports | Accommodation partner, receives hotel inquiries | info@o-sports.pt |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| i18n | next-intl v3 |
| Images | Cloudinary (`next-cloudinary`) |
| Email | Resend API |
| Carousel | keen-slider |
| Icons | react-icons |
| Deployment | Vercel |

---

## Internationalization

**Supported locales:** `en`, `pt`, `fr`, `es`  
**Default locale:** `en`  
**Locale prefix:** always (e.g. `/en/`, `/pt/`)

Translation files live in `messages/{locale}.json`.  
The i18n config is in `src/i18n.ts` and routing in `src/navigation.ts`.

### Adding/editing translations
- Edit all four `messages/*.json` files
- Use `useTranslations('Namespace.Key')` in client components
- Use `pickMessages()` from `src/lib/pickMessages` to scope messages per page (reduces bundle size)

### Brochure PDFs
Locale-specific PDFs use the `LANGUAGE_CODES` map from `src/lib/constants.ts`:
```
en → CVCUP-2026-CONVITE-UK.pdf
es → CVCUP-2026-CONVITE-ESP.pdf
pt → CVCUP-2026-CONVITE-PT.pdf
fr → CVCUP-2026-CONVITE-FRAN.pdf
```

---

## Routes / Pages

| Path | Description |
|---|---|
| `/` | Home / landing |
| `/about` | About the tournament |
| `/program` | Tournament schedule |
| `/competition` | Competition info & divisions |
| `/registration` | Registration form + pricing |
| `/accommodation` | Hotel accommodation (O-Sports) |
| `/location` | Cascais location info |
| `/gallery` | Gallery overview (all years) |
| `/gallery/2025` | 2025 photos |
| `/gallery/2024` | 2024 photos |
| `/gallery/2023` | 2023 photos |
| `/news` | News articles |
| `/hall-of-fame` | Hall of fame |

All routes are prefixed by locale: `/{locale}/...`

---

## Project Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── components/         # Page-specific components (organized by page)
│   │   │   ├── Global/         # Header, Footer, shared UI
│   │   │   ├── Gallery/        # GalleryHero, OptimizedCloudinaryImage, etc.
│   │   │   ├── Registration/   # RegistrationForm, RegistrationHero
│   │   │   ├── Program/        # ProgramHero, DayCard
│   │   │   └── ...             # One folder per page
│   │   └── {page}/page.tsx     # Page-level files
│   └── api/
│       ├── register/           # Tournament registration email → Volley4All
│       ├── osports-contact/    # Accommodation inquiry email → O-Sports
│       └── cloudinary/         # Gallery image fetching
├── hooks/
│   ├── useIntersectionObserver.ts  # Shared scroll/animation observers
│   └── useOptimizedGallery.ts      # Cloudinary image fetching hook
├── lib/
│   ├── constants.ts            # WAVE_HEIGHT, GLOBAL_ASSETS, SITE_URL, etc.
│   ├── validation.ts           # Unified form validation
│   └── pickMessages.ts         # Scoped i18n message loader
├── i18n.ts                     # next-intl config
├── navigation.ts               # Localized routes & Link/useRouter exports
└── middleware.ts               # next-intl locale middleware

messages/
├── en.json
├── pt.json
├── fr.json
└── es.json
```

---

## Shared Utilities — Always Use These

### `src/lib/constants.ts`
Central source of truth for repeated values:
- `WAVE_HEIGHT` / `WAVE_HEIGHT_TALL` — wave overlay heights
- `GLOBAL_ASSETS` — logo, tagline, wave image paths
- `SITE_URL` — `https://cascaisvolley.com`
- `BLUR_DATA_URL` — shared blur placeholder for `<Image>`
- `getBrochureFileName(locale)` — locale-aware PDF filename

### `src/lib/validation.ts`
Unified form validators (do **not** write new ones inline):
- `validateRegistrationForm(data, t)` — registration form
- `validateAccommodationForm(data, t)` — O-Sports contact form
- `isValidEmail`, `isValidPhone`, `isNonEmpty`, `hasMinLength`
- `REGISTRATION_INITIAL_DATA`, `ACCOMMODATION_INITIAL_DATA`

### `src/hooks/useIntersectionObserver.ts`
Shared scroll animation hook. Use `useStaggeredAnimation` for entrance animations.

### Navigation (never use Next.js `Link` directly)
```tsx
// Always import from src/navigation, not from next/link
import { Link, useRouter, usePathname } from '@/src/navigation'
```

---

## API Routes

### `POST /api/register`
Sends registration email to Volley4All via Resend.

**Required env vars:** `RESEND_API_KEY`, `EMAIL_FROM`, `VOLLEY4ALL_EMAIL_TO`

**Body:**
```json
{ "name", "email", "mobile", "club", "city", "country", "questions" }
```

### `POST /api/osports-contact`
Sends accommodation inquiry to O-Sports via Resend.

**Required env vars:** `RESEND_API_KEY`, `EMAIL_FROM`, `OSPORT_EMAIL_TO`

**Body:**
```json
{ "teamName", "country", "teamManagerName", "phone", "email", "ageGroup", "numberOfPeople", "message" }
```

### `GET /api/cloudinary`
Fetches gallery images from Cloudinary. Supports year-based folder queries.  
Folder structure: `cascaiscup/{year}` (e.g. `cascaiscup/2024`)

**Required env vars:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

---

## Environment Variables

```bash
# Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=
VOLLEY4ALL_EMAIL_TO=      # info@volley4all.com
OSPORT_EMAIL_TO=           # info@o-sports.pt

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## Coding Conventions

### Components
- All components are TypeScript (`.tsx`)
- Client components use `'use client'` at the top
- Use `clsx` for conditional class merging (already installed)
- Import images via `next/image` with explicit `width`, `height`, `sizes`, `quality`
- Use `loading='eager'` for above-the-fold images, `loading='lazy'` below

### Styling
- Tailwind CSS only — no custom CSS files
- `motion-safe:` prefix for all animation/transition classes (respects prefers-reduced-motion)
- Hover animations use `hover:scale-105` + `transition-all duration-200`
- Entrance animations use translate + opacity with `useStaggeredAnimation`

### Page-level patterns
Each page follows this structure:
```tsx
// page.tsx (server component)
export const revalidate = 3600 // set appropriate revalidation

export default function PageName() {
  const messages = useMessages()
  const pageMessages = pickMessages(messages, ['NamespaceA', 'NamespaceB'])

  return (
    <NextIntlClientProvider messages={pageMessages}>
      <HeroComponent />
      <ContentComponent />
    </NextIntlClientProvider>
  )
}
```

### Forms
- Always use `validateRegistrationForm` or `validateAccommodationForm` from `src/lib/validation.ts`
- Never write inline validation logic
- Submit via `fetch('/api/register')` or `fetch('/api/osports-contact')`

---

## Performance Rules

These are non-negotiable for maintaining Lighthouse scores (mobile ~85):

1. **Dynamic imports** for heavy components not needed on initial render
2. **Scope `pickMessages`** per page — never pass all messages to a client component
3. **`export const revalidate`** on all pages (set based on how often content changes)
4. **Add `export const dynamic = 'force-dynamic'`** to API routes that shouldn't be cached
5. **Always use `next/image`** — never `<img>` tags
6. **`motion-safe:` prefix** on all CSS transitions
7. **Prefer `loading='eager'`** only for above-the-fold hero images

---

## Gallery System

- Images stored in Cloudinary under `cascaiscup/{year}`
- Fetched via `/api/cloudinary` with year-based queries
- Gallery overview shows 6 images per year
- Full gallery pages (`/gallery/2025`, etc.) are static routes
- Use `OptimizedCloudinaryImage` component for gallery images (handles transformations)
- Use `useOptimizedGallery` hook for data fetching

---

## Common Gotchas

- **Never import `Link` from `next/link`** — always use `@/src/navigation`
- **Never write duplicate validation logic** — use `src/lib/validation.ts`
- **Always add `export const dynamic = 'force-dynamic'`** to API routes using external APIs
- **Translation keys must exist in all 4 locale files** before using them in components
- Middleware only matches `/(fr|en|es|pt)/:path*` and `/` — check `src/middleware.ts` before adding new patterns
- `next-intl` v3 requires `useTranslations` to be called in client components; use `getTranslations` in server components

---

## Development

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint
```

Deployment is automatic via Vercel on push to main.

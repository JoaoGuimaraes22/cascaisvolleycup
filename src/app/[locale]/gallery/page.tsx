import { NextIntlClientProvider, useMessages } from 'next-intl'
import type { AbstractIntlMessages } from 'next-intl'
import { pickMessages } from '@/src/lib/pickMessages'
import OptimizedGalleryHero from '../components/Gallery/GalleryHero'

export const revalidate = 3600 // Hourly — gallery images may update

const PAGE_NAMESPACES = ['GalleryPage']

export default function GalleryPage() {
  const messages = useMessages()
  const pageMessages = pickMessages(
    messages as Record<string, unknown>,
    PAGE_NAMESPACES
  )

  return (
    <NextIntlClientProvider messages={pageMessages as AbstractIntlMessages}>
      <section>
        <OptimizedGalleryHero />
      </section>
    </NextIntlClientProvider>
  )
}

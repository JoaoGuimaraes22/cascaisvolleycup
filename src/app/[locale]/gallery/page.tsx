import { NextIntlClientProvider, useMessages } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { AbstractIntlMessages } from 'next-intl'
import type { Metadata } from 'next'
import { pickMessages } from '@/src/lib/pickMessages'
import OptimizedGalleryHero from '../components/Gallery/GalleryHero'

export const revalidate = 3600 // Hourly — gallery images may update

export async function generateMetadata({
  params: { locale }
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'GalleryPage' })

  return {
    title: t('title'),
    description: t('metaDescription'),
    alternates: { canonical: `/${locale}/gallery` }
  }
}

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

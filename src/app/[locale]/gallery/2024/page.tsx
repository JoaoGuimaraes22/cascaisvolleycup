// ===== src/app/[locale]/gallery/2024/page.tsx =====
import { getTranslations } from 'next-intl/server'
import OptimizedGallery from '../../components/Gallery/Gallery'

interface Gallery2024PageProps {
  params: {
    locale: string
  }
}

// Generate metadata for 2024 gallery
export async function generateMetadata({ params }: Gallery2024PageProps) {
  const t = await getTranslations('GalleryPage')

  return {
    title: `${t('title')} 2024 | Cascais Cup`,
    description: `${t('description')} 2024. View photos and highlights from the Cascais Cup 2024 volleyball tournament.`,
    keywords: `Cascais Cup 2024, volleyball tournament, beach volleyball, Portugal, photo gallery`,
    openGraph: {
      title: `Cascais Cup 2024 Gallery`,
      description: `Photo gallery from Cascais Cup 2024 volleyball tournament`,
      type: 'website',
      images: [
        {
          url: '/img/gallery/hero-bg.png',
          width: 1200,
          height: 600,
          alt: `Cascais Cup 2024 Gallery`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Cascais Cup 2024 Gallery`,
      description: `Photo gallery from Cascais Cup 2024 volleyball tournament`
    },
    alternates: {
      canonical: `/${params.locale}/gallery/2024`
    }
  }
}

// JSON-LD structured data for 2024
function generateStructuredData2024(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `Cascais Cup 2024 Photo Gallery`,
    description: `Official photo gallery of Cascais Cup 2024 volleyball tournament`,
    url: `https://cascaisvolley.com/${locale}/gallery/2024`,
    dateCreated: `2024-01-01`,
    about: {
      '@type': 'SportsEvent',
      name: `Cascais Cup 2024`,
      sport: 'Volleyball',
      startDate: `2024-01-01`,
      location: {
        '@type': 'Place',
        name: 'Cascais, Portugal',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Cascais',
          addressCountry: 'PT'
        }
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'Cascais Cup',
      url: 'https://cascaisvolley.com'
    }
  }
}

export default async function Gallery2024Page({
  params
}: Gallery2024PageProps) {
  const t = await getTranslations('GalleryPage')
  const structuredData = generateStructuredData2024(params.locale)

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* Main gallery component */}
      <main>
        <OptimizedGallery
          year={2024}
          title={`${t('title')} 2024`}
          description={`${t('yearDescription')} 2024 - ${t('yearSubtitle')} volleyball tournament in Cascais, Portugal.`}
        />
      </main>
    </>
  )
}

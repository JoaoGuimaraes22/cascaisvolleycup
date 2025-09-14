// ===== src/app/[locale]/gallery/2023/page.tsx =====
import { getTranslations } from 'next-intl/server'
import OptimizedGallery from '../../components/Gallery/Gallery'

interface Gallery2023PageProps {
  params: {
    locale: string
  }
}

// Generate metadata for 2023 gallery
export async function generateMetadata({ params }: Gallery2023PageProps) {
  const t = await getTranslations('GalleryPage')

  return {
    title: `${t('title')} 2023 | Cascais Cup`,
    description: `${t('description')} 2023. View photos and highlights from the Cascais Cup 2023 volleyball tournament.`,
    keywords: `Cascais Cup 2023, volleyball tournament, beach volleyball, Portugal, photo gallery`,
    openGraph: {
      title: `Cascais Cup 2023 Gallery`,
      description: `Photo gallery from Cascais Cup 2023 volleyball tournament`,
      type: 'website',
      images: [
        {
          url: '/img/gallery/hero-bg.png',
          width: 1200,
          height: 600,
          alt: `Cascais Cup 2023 Gallery`
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: `Cascais Cup 2023 Gallery`,
      description: `Photo gallery from Cascais Cup 2023 volleyball tournament`
    },
    alternates: {
      canonical: `/${params.locale}/gallery/2023`
    }
  }
}

// JSON-LD structured data for 2023
function generateStructuredData2023(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: `Cascais Cup 2023 Photo Gallery`,
    description: `Official photo gallery of Cascais Cup 2023 volleyball tournament`,
    url: `https://yourdomain.com/${locale}/gallery/2023`,
    dateCreated: `2023-01-01`,
    about: {
      '@type': 'SportsEvent',
      name: `Cascais Cup 2023`,
      sport: 'Volleyball',
      startDate: `2023-01-01`,
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
      url: 'https://yourdomain.com'
    }
  }
}

export default async function Gallery2023Page({
  params
}: Gallery2023PageProps) {
  const t = await getTranslations('GalleryPage')
  const structuredData = generateStructuredData2023(params.locale)

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
          year={2023}
          title={`${t('title')} 2023`}
          description={`${t('yearDescription')} 2023 - ${t('yearSubtitle')} volleyball tournament in Cascais, Portugal.`}
        />
      </main>
    </>
  )
}

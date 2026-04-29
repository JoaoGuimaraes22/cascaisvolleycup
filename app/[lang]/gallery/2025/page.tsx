import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../../dictionaries";
import Gallery from "../../_components/gallery/gallery";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/gallery/2025">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const gallery = dict.GalleryPage;

  return {
    title: `${gallery.title} 2025 | Cascais Cup`,
    description: `${gallery.description} 2025. View photos and highlights from the Cascais Cup 2025 volleyball tournament.`,
    keywords: `Cascais Cup 2025, volleyball tournament, beach volleyball, Portugal, photo gallery`,
    openGraph: {
      title: `Cascais Cup 2025 Gallery`,
      description: `Photo gallery from Cascais Cup 2025 volleyball tournament`,
      type: "website",
      images: [
        {
          url: "/img/gallery/hero-bg.png",
          width: 1200,
          height: 600,
          alt: `Cascais Cup 2025 Gallery`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Cascais Cup 2025 Gallery`,
      description: `Photo gallery from Cascais Cup 2025 volleyball tournament`,
    },
    alternates: {
      canonical: `/${lang}/gallery/2025`,
    },
  };
}

function generateStructuredData(lang: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `Cascais Cup 2025 Photo Gallery`,
    description: `Official photo gallery of Cascais Cup 2025 volleyball tournament`,
    url: `https://cascaisvolley.com/${lang}/gallery/2025`,
    dateCreated: `2025-01-01`,
    about: {
      "@type": "SportsEvent",
      name: `Cascais Cup 2025`,
      sport: "Volleyball",
      startDate: `2025-01-01`,
      location: {
        "@type": "Place",
        name: "Cascais, Portugal",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cascais",
          addressCountry: "PT",
        },
      },
    },
    publisher: {
      "@type": "Organization",
      name: "Cascais Cup",
      url: "https://cascaisvolley.com",
    },
  };
}

export default async function Gallery2025PageRoute({
  params,
}: PageProps<"/[lang]/gallery/2025">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const gallery = dict.GalleryPage;
  const structuredData = generateStructuredData(lang);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <Gallery
        year={2025}
        title={`${gallery.title} 2025`}
        description={`${gallery.yearDescription} 2025 - ${gallery.yearSubtitle} volleyball tournament in Cascais, Portugal.`}
        dict={gallery.Main}
      />
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../../dictionaries";
import Gallery from "../../_components/gallery/gallery";
import JsonLd from "../../_components/json-ld";
import {
  buildPageMetadata,
  buildPageGraph,
  breadcrumbLabel,
} from "../../_lib/seo";

const YEAR = 2025;

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/gallery/2025">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const gallery = dict.GalleryPage;

  return buildPageMetadata(lang, {
    title: `${gallery.title} ${YEAR} | Cascais Cup`,
    description: `${gallery.description} ${YEAR}. View photos and highlights from the Cascais Cup ${YEAR} volleyball tournament.`,
    path: `/gallery/${YEAR}`,
  });
}

export default async function Gallery2025PageRoute({
  params,
}: PageProps<"/[lang]/gallery/2025">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const gallery = dict.GalleryPage;

  const jsonLd = buildPageGraph(lang, {
    type: "ImageGallery",
    path: `/gallery/${YEAR}`,
    name: `Cascais Cup ${YEAR} Photo Gallery`,
    description: `Official photo gallery of Cascais Cup ${YEAR} volleyball tournament`,
    eventRef: "about",
    dateCreated: `${YEAR}-07-01`,
    withPublisher: true,
    breadcrumb: [
      { name: breadcrumbLabel(lang, "gallery"), path: "/gallery" },
      { name: String(YEAR), path: `/gallery/${YEAR}` },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <Gallery
        year={YEAR}
        title={`${gallery.title} ${YEAR}`}
        description={`${gallery.yearDescription} ${YEAR} - ${gallery.yearSubtitle} volleyball tournament in Cascais, Portugal.`}
        dict={gallery.Main}
      />
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import GalleryHero from "../_components/gallery/hero";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/gallery">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const gallery = dict.GalleryPage;

  return {
    title: gallery.title,
    description: gallery.metaDescription,
    alternates: { canonical: `/${lang}/gallery` },
  };
}

export default async function GalleryPageRoute({
  params,
}: PageProps<"/[lang]/gallery">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return <GalleryHero lang={lang} dict={dict.GalleryPage.Hero} />;
}

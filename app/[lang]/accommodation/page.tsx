import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import AccommodationHero from "../_components/accommodation/hero";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/accommodation">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const hero = dict.AccommodationPage.Hero;

  return {
    title: hero.title,
    description: hero.schools.p1,
    alternates: { canonical: `/${lang}/accommodation` },
  };
}

export default async function AccommodationPageRoute({
  params,
}: PageProps<"/[lang]/accommodation">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <AccommodationHero
      dict={dict.AccommodationPage.Hero}
      contactToastDict={dict.ContactModal}
    />
  );
}

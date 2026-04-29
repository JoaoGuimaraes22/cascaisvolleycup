import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import AboutHero from "../_components/about/hero";
import AboutPortugal from "../_components/about/portugal";
import AboutVilla from "../_components/about/villa";

export const revalidate = 86400; // Revalidate every 24 hours

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) return {};

  const dict = await getDictionary(lang);

  return {
    title: dict.AboutPage.Hero.title,
    description: dict.AboutPage.Hero.p1,
    alternates: { canonical: `/${lang}/about` },
  };
}

export default async function AboutPage({
  params,
}: PageProps<"/[lang]/about">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <AboutHero dict={dict.AboutPage.Hero} />
      <AboutPortugal dict={dict.AboutPage.Portugal} />
      <AboutVilla dict={dict.AboutPage.Villa} />
    </>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import ProgramHero from "../_components/program/hero";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/program">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const hero = dict.ProgramPage.Hero;

  return {
    title: hero.title,
    description: `Cascais Volley Cup 2026 — ${hero.title}. ${hero.checkin.label}, ${hero.checkout.label}.`,
    alternates: { canonical: `/${lang}/program` },
  };
}

export default async function ProgramPage({
  params,
}: PageProps<"/[lang]/program">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div>
      <ProgramHero lang={lang} dict={dict.ProgramPage.Hero} />
    </div>
  );
}

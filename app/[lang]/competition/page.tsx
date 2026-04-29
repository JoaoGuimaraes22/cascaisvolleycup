import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import CompetitionHero from "../_components/competition/hero";
import CompetitionFacts from "../_components/competition/facts";
import CompetitionInfo from "../_components/competition/info";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/competition">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const hero = dict.CompetitionPage.Hero;

  return {
    title: hero.title,
    description: hero.p1,
    alternates: { canonical: `/${lang}/competition` },
  };
}

export default async function CompetitionPage({
  params,
}: PageProps<"/[lang]/competition">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <CompetitionHero
        dict={dict.CompetitionPage.Hero}
        logoDict={dict.CompetitionPage.LogoTaglineHero}
      />
      <CompetitionFacts dict={dict.CompetitionPage.Facts} />
      <CompetitionInfo dict={dict.CompetitionPage.Info} />
    </>
  );
}

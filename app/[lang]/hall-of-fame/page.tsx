import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import HallOfFameHero from "../_components/hall-of-fame/hero";
import HallOfFameParticipants from "../_components/hall-of-fame/participants";
import HallOfFameWinners from "../_components/hall-of-fame/winners";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/hall-of-fame">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const hero = dict.HallOfFamePage.Hero;

  return {
    title: hero.title,
    description: hero.intro,
    alternates: { canonical: `/${lang}/hall-of-fame` },
  };
}

export default async function HallOfFamePage({
  params,
}: PageProps<"/[lang]/hall-of-fame">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div>
      <HallOfFameHero dict={dict.HallOfFamePage.Hero} />
      <HallOfFameParticipants dict={dict.HallOfFamePage.Participants} />
      <HallOfFameWinners dict={dict.HallOfFamePage.Winners} />
    </div>
  );
}

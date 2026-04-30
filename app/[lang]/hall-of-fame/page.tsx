import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import HallOfFameHero from "../_components/hall-of-fame/hero";
import HallOfFameParticipants from "../_components/hall-of-fame/participants";
import HallOfFameWinners from "../_components/hall-of-fame/winners";
import JsonLd from "../_components/json-ld";
import {
  buildPageMetadata,
  buildPageGraph,
  breadcrumbLabel,
} from "../_lib/seo";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/hall-of-fame">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return buildPageMetadata(lang, {
    title: dict.HallOfFamePage.Hero.title,
    description: dict.HallOfFamePage.Hero.intro,
    path: "/hall-of-fame",
  });
}

export default async function HallOfFamePage({
  params,
}: PageProps<"/[lang]/hall-of-fame">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  const jsonLd = buildPageGraph(lang, {
    type: "CollectionPage",
    path: "/hall-of-fame",
    name: dict.HallOfFamePage.Hero.title,
    description: dict.HallOfFamePage.Hero.intro,
    eventRef: "about",
    breadcrumb: [
      { name: breadcrumbLabel(lang, "hallOfFame"), path: "/hall-of-fame" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <div>
        <HallOfFameHero dict={dict.HallOfFamePage.Hero} />
        <HallOfFameParticipants dict={dict.HallOfFamePage.Participants} />
        <HallOfFameWinners dict={dict.HallOfFamePage.Winners} />
      </div>
    </>
  );
}

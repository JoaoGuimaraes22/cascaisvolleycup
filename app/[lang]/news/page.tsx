import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";
import JsonLd from "../_components/json-ld";
import {
  buildPageMetadata,
  buildPageGraph,
  breadcrumbLabel,
} from "../_lib/seo";

const NEWS_TITLE = "News";
const NEWS_DESCRIPTION =
  "Latest news and updates from the Cascais Volley Cup tournament.";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/news">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  return buildPageMetadata(lang, {
    title: NEWS_TITLE,
    description: NEWS_DESCRIPTION,
    path: "/news",
  });
}

export default async function NewsPage({ params }: PageProps<"/[lang]/news">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const jsonLd = buildPageGraph(lang, {
    type: "WebPage",
    path: "/news",
    name: NEWS_TITLE,
    breadcrumb: [{ name: breadcrumbLabel(lang, "news"), path: "/news" }],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="px-32 py-24 text-center text-2xl">Coming soon</div>
    </>
  );
}

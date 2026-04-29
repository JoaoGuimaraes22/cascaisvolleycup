import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { hasLocale } from "../dictionaries";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/news">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  return {
    title: "News",
    description:
      "Latest news and updates from the Cascais Volley Cup tournament.",
    alternates: { canonical: `/${lang}/news` },
  };
}

export default async function NewsPage({
  params,
}: PageProps<"/[lang]/news">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <div className="px-32 py-24 text-center text-2xl">Coming soon</div>
  );
}

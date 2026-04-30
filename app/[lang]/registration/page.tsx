import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import RegistrationHero from "../_components/registration/hero";
import RegistrationForm from "../_components/registration/form";
import JsonLd from "../_components/json-ld";
import {
  buildPageMetadata,
  buildPageGraph,
  breadcrumbLabel,
} from "../_lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/registration">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const hero = dict.RegistrationPage.RegistrationHero;

  return buildPageMetadata(lang, {
    title: hero.title,
    description: `${hero.title} — Cascais Volley Cup 2026. Cascais, Portugal.`,
    path: "/registration",
  });
}

export default async function RegistrationPageRoute({
  params,
}: PageProps<"/[lang]/registration">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const hero = dict.RegistrationPage.RegistrationHero;

  const jsonLd = buildPageGraph(lang, {
    type: "WebPage",
    path: "/registration",
    name: hero.title,
    description: `${hero.title} — Cascais Volley Cup 2026. Cascais, Portugal.`,
    eventRef: "mainEntity",
    breadcrumb: [
      { name: breadcrumbLabel(lang, "registration"), path: "/registration" },
    ],
  });

  return (
    <>
      <JsonLd data={jsonLd} />
      <RegistrationHero
        lang={lang}
        dict={dict.RegistrationPage.RegistrationHero}
        contactToastDict={dict.ContactModal}
      />
      <RegistrationForm dict={dict.RegistrationPage.Form} />
    </>
  );
}

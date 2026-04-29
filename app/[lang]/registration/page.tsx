import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "../dictionaries";
import RegistrationHero from "../_components/registration/hero";
import RegistrationForm from "../_components/registration/form";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/registration">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  const hero = dict.RegistrationPage.RegistrationHero;

  return {
    title: hero.title,
    description: `${hero.title} — Cascais Volley Cup 2026. Cascais, Portugal.`,
    alternates: { canonical: `/${lang}/registration` },
  };
}

export default async function RegistrationPageRoute({
  params,
}: PageProps<"/[lang]/registration">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <RegistrationHero
        lang={lang}
        dict={dict.RegistrationPage.RegistrationHero}
        contactToastDict={dict.ContactModal}
      />
      <RegistrationForm dict={dict.RegistrationPage.Form} />
    </>
  );
}

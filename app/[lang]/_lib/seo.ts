export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cascaisvolley.com";

type LabelKey =
  | "home"
  | "about"
  | "program"
  | "competition"
  | "registration"
  | "accommodation"
  | "gallery"
  | "news"
  | "hallOfFame"
  | "location";

const BREADCRUMB_LABELS: Record<string, Record<LabelKey, string>> = {
  en: {
    home: "Home",
    about: "About",
    program: "Program",
    competition: "Competition",
    registration: "Registration",
    accommodation: "Accommodation",
    gallery: "Gallery",
    news: "News",
    hallOfFame: "Hall of Fame",
    location: "Location",
  },
  pt: {
    home: "Início",
    about: "Sobre",
    program: "Programa",
    competition: "Competição",
    registration: "Inscrição",
    accommodation: "Alojamento",
    gallery: "Galeria",
    news: "Notícias",
    hallOfFame: "Hall da Fama",
    location: "Localização",
  },
  es: {
    home: "Inicio",
    about: "Acerca de",
    program: "Programa",
    competition: "Competición",
    registration: "Inscripción",
    accommodation: "Alojamiento",
    gallery: "Galería",
    news: "Noticias",
    hallOfFame: "Salón de la Fama",
    location: "Ubicación",
  },
  fr: {
    home: "Accueil",
    about: "À propos",
    program: "Programme",
    competition: "Compétition",
    registration: "Inscription",
    accommodation: "Hébergement",
    gallery: "Galerie",
    news: "Actualités",
    hallOfFame: "Hall of Fame",
    location: "Localisation",
  },
};

export function bcp47Locale(lang: string): string {
  switch (lang) {
    case "pt":
      return "pt-PT";
    case "es":
      return "es-ES";
    case "fr":
      return "fr-FR";
    default:
      return "en";
  }
}

export function ogLocale(lang: string): string {
  switch (lang) {
    case "pt":
      return "pt_PT";
    case "es":
      return "es_ES";
    case "fr":
      return "fr_FR";
    default:
      return "en_US";
  }
}

export function breadcrumbLabel(lang: string, key: LabelKey): string {
  return (BREADCRUMB_LABELS[lang] ?? BREADCRUMB_LABELS.en)[key];
}

export function schemaIds(lang: string) {
  const base = `${SITE_URL}/${lang}`;
  return {
    website: `${base}#website`,
    organization: `${base}#organization`,
    event: `${base}#event`,
  };
}

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildBreadcrumb(lang: string, items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: breadcrumbLabel(lang, "home"),
        item: `${SITE_URL}/${lang}`,
      },
      ...items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: it.name,
        item: `${SITE_URL}/${lang}${it.path}`,
      })),
    ],
  };
}

export function localeHref(lang: string, path: string): string {
  if (path === "/") return `/${lang}`;
  if (path.startsWith("/")) return `/${lang}${path}`;
  return `/${lang}/${path}`;
}

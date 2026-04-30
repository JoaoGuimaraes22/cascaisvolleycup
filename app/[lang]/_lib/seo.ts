import type { Metadata } from "next";
import { i18n } from "@/i18n-config";

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

type PageMetadataOptions = {
  title: string;
  description: string;
  /** Path under the locale segment, e.g. "/about" or "/gallery/2025". Use "" for the home page. */
  path: string;
  /** OG image URL relative to SITE_URL (defaults to /img/og-image.png). */
  image?: string;
};

export function buildPageMetadata(
  lang: string,
  { title, description, path, image = "/img/og-image.png" }: PageMetadataOptions
): Metadata {
  const canonical = `/${lang}${path}`;
  const url = `${SITE_URL}/${lang}${path}`;

  const languages: Record<string, string> = Object.fromEntries(
    i18n.locales.map((l) => [l, `/${l}${path}`])
  );
  languages["x-default"] = `/${i18n.defaultLocale}${path}`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url,
      locale: ogLocale(lang),
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

type PageGraphType = "AboutPage" | "WebPage" | "CollectionPage" | "ImageGallery";

type PageGraphOptions = {
  type: PageGraphType;
  /** Path under the locale segment, e.g. "/about" or "/gallery/2025". */
  path: string;
  name: string;
  description?: string;
  /** Property linking the page to the SportsEvent. Omit for pages with no event linkage (e.g. stubs). */
  eventRef?: "mainEntity" | "about";
  /** Breadcrumb segments after Home. */
  breadcrumb: BreadcrumbItem[];
  /** ImageGallery only — ISO date the gallery was created. */
  dateCreated?: string;
  /** ImageGallery only — emit publisher: { @id: ids.organization }. */
  withPublisher?: boolean;
};

export function buildPageGraph(lang: string, opts: PageGraphOptions) {
  const ids = schemaIds(lang);
  const url = `${SITE_URL}/${lang}${opts.path}`;
  const pageId = `${url}#${opts.type.toLowerCase()}`;
  const breadcrumbId = `${url}#breadcrumb`;

  const breadcrumb = {
    ...buildBreadcrumb(lang, opts.breadcrumb),
    "@id": breadcrumbId,
  };

  const pageNode: Record<string, unknown> = {
    "@type": opts.type,
    "@id": pageId,
    url,
    name: opts.name,
    inLanguage: bcp47Locale(lang),
    isPartOf: { "@id": ids.website },
    breadcrumb: { "@id": breadcrumbId },
  };

  if (opts.description) pageNode.description = opts.description;
  if (opts.eventRef) pageNode[opts.eventRef] = { "@id": ids.event };
  if (opts.dateCreated) pageNode.dateCreated = opts.dateCreated;
  if (opts.withPublisher) pageNode.publisher = { "@id": ids.organization };

  return {
    "@context": "https://schema.org",
    "@graph": [pageNode, breadcrumb],
  };
}

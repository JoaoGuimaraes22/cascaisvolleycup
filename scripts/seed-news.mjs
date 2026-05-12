#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

function loadEnvFile(relPath) {
  const p = path.join(projectRoot, relPath);
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env.local"
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
});

const SEED_SLUG_EN = "cascais-volley-cup-2026-open-for-registration";

const SLUGS = {
  en: SEED_SLUG_EN,
  pt: "cascais-volley-cup-2026-inscricoes-abertas",
  es: "cascais-volley-cup-2026-inscripciones-abiertas",
  fr: "cascais-volley-cup-2026-inscriptions-ouvertes",
};

const TITLES = {
  en: "Cascais Volley Cup 2026 — Open for Registration",
  pt: "Cascais Volley Cup 2026 — Inscrições Abertas",
  es: "Cascais Volley Cup 2026 — Inscripciones Abiertas",
  fr: "Cascais Volley Cup 2026 — Inscriptions Ouvertes",
};

const DESCRIPTIONS = {
  en: "The 2026 edition is now open for team registration. Join us 8–12 July in Cascais, Portugal.",
  pt: "A edição de 2026 já tem inscrições abertas. Junte-se a nós de 8 a 12 de julho em Cascais, Portugal.",
  es: "La edición 2026 ya tiene inscripciones abiertas. Únete a nosotros del 8 al 12 de julio en Cascais, Portugal.",
  fr: "L'édition 2026 ouvre ses inscriptions. Rejoignez-nous du 8 au 12 juillet à Cascais, Portugal.",
};

const IMAGE_ALTS = {
  en: "Volleyball action on the court during the Cascais Volley Cup",
  pt: "Ação de voleibol na quadra durante o Cascais Volley Cup",
  es: "Acción de voleibol en la cancha durante la Cascais Volley Cup",
  fr: "Action de volleyball sur le terrain pendant la Cascais Volley Cup",
};

const INTRO = {
  en: "Registration is now open for the 2026 edition of the Cascais Volley Cup — Portugal's premier international girls volleyball tournament.",
  pt: "As inscrições estão abertas para a edição de 2026 do Cascais Volley Cup — o principal torneio internacional de voleibol feminino de Portugal.",
  es: "Las inscripciones están abiertas para la edición 2026 de la Cascais Volley Cup, el principal torneo internacional de voleibol femenino de Portugal.",
  fr: "Les inscriptions sont ouvertes pour l'édition 2026 de la Cascais Volley Cup, le principal tournoi international de volleyball féminin du Portugal.",
};

const DATES_PARA = {
  en: "Held from 8 to 12 July 2026 in Cascais, the tournament welcomes teams in Sub-15, Sub-17 and Open divisions. Last year drew teams from 8 countries.",
  pt: "Realizado de 8 a 12 de julho de 2026 em Cascais, o torneio recebe equipas nas divisões Sub-15, Sub-17 e Open. No ano passado contámos com equipas de 8 países.",
  es: "Celebrado del 8 al 12 de julio de 2026 en Cascais, el torneo recibe equipos en las divisiones Sub-15, Sub-17 y Open. El año pasado contó con equipos de 8 países.",
  fr: "Organisé du 8 au 12 juillet 2026 à Cascais, le tournoi accueille des équipes dans les divisions Sub-15, Sub-17 et Open. L'an dernier, des équipes de 8 pays ont participé.",
};

const SECTION_HEADING = {
  en: "What to expect",
  pt: "O que esperar",
  es: "Qué esperar",
  fr: "À quoi s'attendre",
};

const BULLETS = {
  en: [
    "Five days of intense competition on multiple indoor courts",
    "Welcome dinner and beach social events",
    "Official accommodation packages with our partner O-Sports",
    "Live streaming, awards ceremony and MVP recognition",
  ],
  pt: [
    "Cinco dias de competição intensa em vários pavilhões",
    "Jantar de boas-vindas e eventos sociais na praia",
    "Pacotes oficiais de alojamento com o nosso parceiro O-Sports",
    "Transmissão ao vivo, cerimónia de prémios e reconhecimento de MVPs",
  ],
  es: [
    "Cinco días de competición intensa en múltiples pabellones",
    "Cena de bienvenida y eventos sociales en la playa",
    "Paquetes oficiales de alojamiento con nuestro socio O-Sports",
    "Retransmisión en directo, ceremonia de premios y reconocimiento MVP",
  ],
  fr: [
    "Cinq jours de compétition intense sur plusieurs salles",
    "Dîner d'accueil et événements sociaux à la plage",
    "Forfaits hébergement officiels avec notre partenaire O-Sports",
    "Diffusion en direct, cérémonie de remise des prix et reconnaissance MVP",
  ],
};

const CLOSING = {
  en: "Spots are limited and historically fill up by early spring. Reserve your team's spot via the registration page.",
  pt: "As vagas são limitadas e historicamente esgotam-se no início da primavera. Reserve o lugar da sua equipa através da página de inscrições.",
  es: "Las plazas son limitadas y suelen agotarse a principios de primavera. Reserve el lugar de su equipo en la página de inscripciones.",
  fr: "Les places sont limitées et se remplissent généralement au début du printemps. Réservez la place de votre équipe sur la page d'inscription.",
};

function k() {
  return crypto.randomUUID().slice(0, 12);
}

function block(style, text, opts = {}) {
  return {
    _type: "block",
    _key: k(),
    style,
    markDefs: [],
    children: [{ _type: "span", _key: k(), text, marks: [] }],
    ...opts,
  };
}

function bullet(text) {
  return block("normal", text, { listItem: "bullet", level: 1 });
}

function buildBody(lang) {
  return [
    block("normal", INTRO[lang]),
    block("normal", DATES_PARA[lang]),
    block("h2", SECTION_HEADING[lang]),
    ...BULLETS[lang].map(bullet),
    block("normal", CLOSING[lang]),
  ];
}

function localized(map) {
  return { en: map.en, pt: map.pt, es: map.es, fr: map.fr };
}

function localizedSlug(map) {
  return {
    en: { _type: "slug", current: map.en },
    pt: { _type: "slug", current: map.pt },
    es: { _type: "slug", current: map.es },
    fr: { _type: "slug", current: map.fr },
  };
}

function localizedBody() {
  return {
    en: buildBody("en"),
    pt: buildBody("pt"),
    es: buildBody("es"),
    fr: buildBody("fr"),
  };
}

async function main() {
  const existing = await client.fetch(
    `*[_type == "newsPost" && slug.en.current == $slug][0]{_id}`,
    { slug: SEED_SLUG_EN }
  );
  if (existing) {
    console.log(
      `Seed post already exists (${existing._id}). Nothing to do.`
    );
    return;
  }

  const imagePath = path.join(projectRoot, "public/img/news/news1.webp");
  if (!fs.existsSync(imagePath)) {
    console.error(`Hero image not found: ${imagePath}`);
    process.exit(1);
  }
  console.log("Uploading hero image to Sanity assets…");
  const asset = await client.assets.upload(
    "image",
    fs.createReadStream(imagePath),
    { filename: "news1.webp", contentType: "image/webp" }
  );
  console.log(`  → asset ${asset._id}`);

  const doc = {
    _type: "newsPost",
    title: localized(TITLES),
    description: localized(DESCRIPTIONS),
    slug: localizedSlug(SLUGS),
    image: {
      _type: "image",
      asset: { _type: "reference", _ref: asset._id },
    },
    imageAlt: localized(IMAGE_ALTS),
    body: localizedBody(),
    publishedAt: new Date().toISOString(),
  };

  console.log("Publishing seed newsPost…");
  const created = await client.create(doc);
  console.log(`  → published ${created._id}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

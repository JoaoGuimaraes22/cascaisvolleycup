import type { FC, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMail, FiPhone, FiMapPin, FiGlobe } from "react-icons/fi";
import { FaInstagram, FaYoutube } from "react-icons/fa";
import type { Locale } from "@/i18n-config";
import { localeHref } from "../../_lib/seo";
import { getBrochureFileName } from "../../_lib/constants";

type FooterDict = {
  logoAria: string;
  description: string;
  quickLinks: string;
  about: string;
  program: string;
  competition: string;
  accommodation: string;
  gallery: string;
  hallOfFame: string;
  contact: string;
  email: string;
  phone: string;
  location: string;
  followUs: string;
  website: string;
  instagram: string;
  youtube: string;
  registrationCTA: string;
  registration: string;
  sponsors: string;
  allRightsReserved: string;
  brochure: string;
  regulations: string;
};

type Props = {
  lang: Locale;
  dict: FooterDict;
};

type Sponsor = {
  src: string;
  alt: string;
  w: number;
  h: number;
  url?: string;
};

const LOGO = "/img/global/cascais-volley-cup-1.webp";
const EMAIL = "info@volley4all.com";
const PHONE = "(00351) 964 415 632";
const WEBSITE_URL = "https://www.volley4all.com";
const INSTAGRAM_URL = "https://www.instagram.com/cascais_volley_cup";
const YOUTUBE_URL = "https://www.youtube.com/@cascais_volley4all/";

const SPONSORS: Sponsor[] = [
  { src: "/img/sponsors/cam-ford.webp", alt: "C.A.M. Ford", w: 220, h: 80, url: "https://www.cam.pt" },
  { src: "/img/sponsors/cascais-camara.webp", alt: "Cascais Câmara Municipal", w: 220, h: 80, url: "https://www.visitcascais.com" },
  { src: "/img/sponsors/fpv.webp", alt: "Federação Portuguesa de Voleibol", w: 220, h: 80, url: "https://www.fpvoleibol.pt" },
  { src: "/img/sponsors/cascais-estoril.webp", alt: "Cascais Estoril", w: 220, h: 80, url: "https://www.jf-cascaisestoril.pt" },
  { src: "/img/sponsors/volley4all.webp", alt: "Volley4All Sparrows", w: 220, h: 80, url: "https://www.volley4all.com" },
  { src: "/img/sponsors/o-sports.webp", alt: "Feel the summer", w: 220, h: 80, url: "https://www.o-sports.pt" },
];

export default function Footer({ lang, dict }: Props) {
  const currentYear = new Date().getFullYear();
  const brochureFile = getBrochureFileName(lang);

  const quickLinks = [
    { href: "/competition", label: dict.competition },
    { href: "/program", label: dict.program },
    { href: "/accommodation", label: dict.accommodation },
    { href: "/hall-of-fame", label: dict.hallOfFame },
    { href: "/about", label: dict.about },
  ];

  return (
    <footer
      role="contentinfo"
      className="relative w-full border-t border-slate-200/60 bg-slate-100/95 bg-[url('/img/footer/footer-bg.webp')] bg-cover bg-center backdrop-blur"
    >
      <div className="mx-auto max-w-screen-lg px-4 py-8 sm:py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href={`/${lang}`}
              aria-label={dict.logoAria}
              className="inline-block rounded-sm motion-safe:transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
            >
              <Image
                src={LOGO}
                alt="Cascais Volley Cup"
                width={200}
                height={72}
                className="h-12 w-auto md:h-14"
                loading="lazy"
                quality={80}
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">
              {dict.description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800">
              {dict.quickLinks}
            </h3>
            <nav aria-label="Footer navigation">
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={localeHref(lang, link.href)}
                      className="text-sm text-slate-600 motion-safe:transition-colors hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800">
              {dict.contact}
            </h3>
            <div className="space-y-3">
              <ContactItem
                icon={<FiMail className="h-4 w-4" />}
                href={`mailto:${EMAIL}`}
                text={EMAIL}
                label={dict.email}
              />
              <ContactItem
                icon={<FiPhone className="h-4 w-4" />}
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                text={PHONE}
                label={dict.phone}
              />
              <ContactItem
                icon={<FiMapPin className="h-4 w-4" />}
                text="Cascais, Portugal"
                label={dict.location}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-800">
              {dict.followUs}
            </h3>

            <div className="mb-6 flex items-center gap-3">
              <SocialIcon
                href={WEBSITE_URL}
                ariaLabel={dict.website}
                title="Website"
                icon={<FiGlobe className="h-4 w-4" />}
              />
              <SocialIcon
                href={INSTAGRAM_URL}
                ariaLabel={dict.instagram}
                title="Instagram"
                icon={<FaInstagram className="h-4 w-4" />}
              />
              <SocialIcon
                href={YOUTUBE_URL}
                ariaLabel={dict.youtube}
                title="YouTube"
                icon={<FaYoutube className="h-4 w-4" />}
              />
            </div>

            <Link
              href={localeHref(lang, "/registration")}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-600 to-sky-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-black/10 motion-safe:transition-all hover:scale-105 hover:from-sky-700 hover:to-sky-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
              aria-label={dict.registrationCTA}
            >
              {dict.registration}
            </Link>
          </div>
        </div>

        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-slate-300/60 to-transparent" />

        <div className="text-center">
          <h3 className="mb-6 text-lg font-semibold text-slate-800">
            {dict.sponsors}
          </h3>
          <div className="mx-auto grid max-w-screen-lg grid-cols-2 items-center justify-items-center gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {SPONSORS.map((sponsor, index) => (
              <SponsorLogo key={index} sponsor={sponsor} />
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200/60 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-xs text-slate-500">
              © {currentYear} Cascais Volley Cup. {dict.allRightsReserved}
            </div>
            <div className="flex gap-4 text-xs">
              <a
                href={`/docs/${brochureFile}`}
                download={brochureFile}
                className="text-sky-700 motion-safe:transition-colors sm:text-slate-500 sm:hover:text-slate-700"
              >
                {dict.brochure}
              </a>
              <a
                href="/docs/CVCUP-2026-Regulamento-PT.pdf"
                download="CVCUP-2026-Regulamento-PT.pdf"
                className="text-sky-700 motion-safe:transition-colors sm:text-slate-500 sm:hover:text-slate-700"
              >
                {dict.regulations}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const ContactItem: FC<{
  icon: ReactNode;
  href?: string;
  text: string;
  label: string;
}> = ({ icon, href, text, label }) => {
  const content = (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="text-sky-600" aria-hidden="true">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={label}
        className="block rounded-sm motion-safe:transition-colors hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
      >
        {content}
      </a>
    );
  }

  return <div aria-label={label}>{content}</div>;
};

const SocialIcon: FC<{
  href: string;
  ariaLabel: string;
  title: string;
  icon: ReactNode;
}> = ({ href, ariaLabel, title, icon }) => (
  <a
    href={href}
    aria-label={ariaLabel}
    title={title}
    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-700 shadow-sm ring-1 ring-slate-300 motion-safe:transition-all hover:scale-105 hover:bg-sky-50 hover:text-sky-800 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
    rel="noopener noreferrer"
    target="_blank"
  >
    {icon}
  </a>
);

const SponsorLogo: FC<{ sponsor: Sponsor }> = ({ sponsor }) => {
  const logoElement = (
    <Image
      src={sponsor.src}
      alt={sponsor.alt}
      width={sponsor.w}
      height={sponsor.h}
      className="h-auto max-h-16 w-auto object-contain motion-safe:transition-all hover:scale-105"
      sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 160px"
      loading="lazy"
      quality={80}
    />
  );

  if (sponsor.url) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-sm opacity-70 motion-safe:transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2"
        aria-label={`Visit ${sponsor.alt} website`}
      >
        {logoElement}
      </a>
    );
  }

  return (
    <div className="opacity-70 motion-safe:transition-opacity hover:opacity-100">
      {logoElement}
    </div>
  );
};

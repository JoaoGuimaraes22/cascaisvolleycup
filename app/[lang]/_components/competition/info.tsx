"use client";

import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import { FiDownload } from "react-icons/fi";
import clsx from "clsx";
import { useIntersectionObserver } from "../../_hooks/use-intersection-observer";
import { BLUR_DATA_URL, GLOBAL_ASSETS } from "../../_lib/constants";

// Types
interface RuleItemProps {
  children: ReactNode;
  index: number;
  isVisible: boolean;
}

// Constants for better maintainability
const ASSETS = {
  background: "/img/about/about-bg.webp",
  waveTop: "/img/global/ondas-5.webp",
  waveBottom: GLOBAL_ASSETS.wave,
  sponsors: {
    fpv: "/img/sponsors/fpv.webp",
    cascais: "/img/sponsors/cascais-camara.webp",
    camFord: "/img/sponsors/cam-ford.webp",
    cascaisEstoril: "/img/sponsors/cascais-estoril.webp",
  },
} as const;

type CompetitionInfoDict = {
  title: string;
  intro: string;
  rules: {
    item1: string;
    item2: string;
    item3: string;
    item4: string;
    item5: string;
  };
  notes: {
    p1: string;
    p2: string;
    p3: string;
    p4: string;
  };
  playerAlt: string;
  sponsorAlt: string;
};

type Props = {
  dict: CompetitionInfoDict;
};

// Parse <b>...</b> tags into <strong> elements (mirrors next-intl t.rich behavior)
function parseBoldHtml(text: string): ReactNode[] {
  const parts = text.split(/(<b>[\s\S]*?<\/b>)/g);
  return parts.map((part, index) => {
    const match = part.match(/^<b>([\s\S]*?)<\/b>$/);
    if (match) {
      return (
        <strong key={index} className="font-extrabold text-sky-700">
          {match[1]}
        </strong>
      );
    }
    return <Fragment key={index}>{part}</Fragment>;
  });
}

export default function CompetitionInfo({ dict }: Props) {
  const { ref: sectionRef, isVisible } = useIntersectionObserver<HTMLElement>();

  // Sponsor data for the 2x2 grid
  const sponsors = [
    {
      src: ASSETS.sponsors.fpv,
      alt: "Federação Portuguesa de Voleibol",
      width: 160,
      height: 64,
    },
    {
      src: ASSETS.sponsors.cascais,
      alt: "Câmara Municipal de Cascais",
      width: 160,
      height: 64,
    },
    {
      src: ASSETS.sponsors.camFord,
      alt: "C.A.M. Ford",
      width: 160,
      height: 64,
    },
    {
      src: ASSETS.sponsors.cascaisEstoril,
      alt: "Cascais Estoril",
      width: 160,
      height: 64,
    },
  ] as const;

  // Prepare rule items
  const ruleItems = [
    parseBoldHtml(dict.rules.item1),
    parseBoldHtml(dict.rules.item2),
    parseBoldHtml(dict.rules.item3),
    parseBoldHtml(dict.rules.item4),
    parseBoldHtml(dict.rules.item5),
  ].filter(Boolean);

  const noteItems = [
    parseBoldHtml(dict.notes.p1),
    dict.notes.p2,
    parseBoldHtml(dict.notes.p3),
    parseBoldHtml(dict.notes.p4),
  ].filter(Boolean);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      aria-labelledby="competition-info-title"
    >
      {/* Background Layer */}
      <BackgroundImage />

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-screen-xl px-4 pb-12 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Content Section */}
          <ContentSection
            title={dict.title}
            intro={dict.intro}
            ruleItems={ruleItems}
            noteItems={noteItems}
            isVisible={isVisible}
          />

          {/* Sponsors Section - Right Side */}
          <SponsorsSection sponsors={sponsors} isVisible={isVisible} />
        </div>
      </div>

      {/* Wave Section - No sponsor overlay here now */}
      <WaveSection />
    </section>
  );
}

// Background component
function BackgroundImage() {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src={ASSETS.background}
        alt=""
        fill
        className="object-cover"
        quality={75}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
        loading="eager"
        aria-hidden="true"
      />
    </div>
  );
}

// Content section component
function ContentSection({
  title,
  intro,
  ruleItems,
  noteItems,
  isVisible,
}: {
  title: string;
  intro: string;
  ruleItems: ReactNode[];
  noteItems: ReactNode[];
  isVisible: boolean;
}) {
  return (
    <div className="space-y-6 lg:col-span-7">
      {/* Title */}
      <header>
        <h1
          id="competition-info-title"
          className={clsx(
            "text-2xl font-extrabold uppercase tracking-wide text-sky-500 sm:text-3xl lg:text-4xl",
            "motion-safe:transition-all duration-1000 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          {title}
        </h1>
      </header>

      {/* Introduction */}
      {intro && (
        <div
          className={clsx(
            "motion-safe:transition-all delay-200 duration-1000 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <p className="text-sm leading-relaxed text-slate-800/90 sm:text-base lg:text-lg">
            {intro}
          </p>
        </div>
      )}

      {/* Rules List */}
      {ruleItems.length > 0 && (
        <div
          className={clsx(
            "delay-400 motion-safe:transition-all duration-1000 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          <RulesList items={ruleItems} isVisible={isVisible} />
        </div>
      )}

      {/* Notes Section */}
      {noteItems.length > 0 && (
        <div
          className={clsx(
            "delay-600 space-y-4 motion-safe:transition-all duration-1000 ease-out",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
        >
          {noteItems.map((note, index) => (
            <p
              key={index}
              className="text-sm leading-relaxed text-slate-800/90 sm:text-base lg:text-lg"
            >
              {note}
            </p>
          ))}
        </div>
      )}

      {/* Regulations Download Button */}
      <div
        className={clsx(
          "delay-800 motion-safe:transition-all duration-1000 ease-out",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        )}
      >
        <RegulationsButton />
      </div>
    </div>
  );
}

// Rules list component
function RulesList({
  items,
  isVisible,
}: {
  items: ReactNode[];
  isVisible: boolean;
}) {
  return (
    <ul className="space-y-3 pl-5" role="list" aria-label="Competition rules">
      {items.map((item, index) => (
        <RuleItem key={index} index={index} isVisible={isVisible}>
          {item}
        </RuleItem>
      ))}
    </ul>
  );
}

// Individual rule item with staggered animation
function RuleItem({ children, index, isVisible }: RuleItemProps) {
  return (
    <li
      className={clsx(
        "relative text-sm leading-relaxed text-slate-800/90 motion-safe:transition-all duration-700 ease-out sm:text-base lg:text-lg",
        "before:absolute before:-left-5 before:top-2 before:h-1.5 before:w-1.5 before:rounded-full before:bg-sky-500",
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
      )}
      style={{
        transitionDelay: `${800 + index * 100}ms`,
      }}
    >
      <div className="pl-1">{children}</div>
    </li>
  );
}

// Sponsors section component with 2x2 grid
function SponsorsSection({
  sponsors,
  isVisible,
}: {
  sponsors: readonly {
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
  isVisible: boolean;
}) {
  return (
    <div className="flex items-center lg:col-span-5">
      <div
        className={clsx(
          "sponsors-container relative z-20 mx-auto flex h-auto w-full max-w-[400px] flex-col items-center justify-center",
          "motion-safe:transition-all delay-300 duration-1000 ease-out",
          isVisible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-12 scale-95 opacity-0"
        )}
      >
        {/* Desktop: 2x2 Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-10 lg:gap-16">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.alt}
              className={clsx(
                "flex items-center justify-center motion-safe:transition-all duration-700 ease-out",
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              )}
              style={{
                transitionDelay: `${500 + index * 150}ms`,
              }}
            >
              <Image
                src={sponsor.src}
                alt={sponsor.alt}
                width={sponsor.width}
                height={sponsor.height}
                className="h-auto w-full max-w-[160px] object-contain drop-shadow-lg motion-safe:transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 1024px) 160px, 160px"
                quality={80}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Mobile: 2x2 Grid with smaller spacing */}
        <div className="grid grid-cols-2 gap-10 sm:hidden">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.alt}
              className={clsx(
                "flex items-center justify-center motion-safe:transition-all duration-700 ease-out",
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              )}
              style={{
                transitionDelay: `${500 + index * 150}ms`,
              }}
            >
              <Image
                src={sponsor.src}
                alt={sponsor.alt}
                width={sponsor.width}
                height={sponsor.height}
                className="h-auto w-full max-w-[120px] object-contain drop-shadow-lg motion-safe:transition-transform duration-300 hover:scale-105"
                sizes="120px"
                quality={80}
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Simplified Regulations download button component
function RegulationsButton() {
  return (
    <a
      href="/docs/CVCUP-2026-Regulamento-PT.pdf"
      download="CVCUP-2026-Regulamento-PT.pdf"
      className={clsx(
        "group inline-flex items-center gap-3 rounded-lg px-6 py-3 font-semibold text-white shadow-lg motion-safe:transition-all duration-300",
        "bg-gradient-to-r from-sky-600 to-sky-700",
        "hover:scale-105 hover:from-sky-700 hover:to-sky-800 hover:shadow-xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2",
        "active:scale-95"
      )}
      aria-label="Download tournament regulations PDF"
    >
      <FiDownload
        className="h-4 w-4 motion-safe:transition-transform duration-300 group-hover:scale-110"
        aria-hidden="true"
      />
      <span className="text-sm sm:text-base">Regulations</span>
    </a>
  );
}

// Wave section without sponsor overlay
function WaveSection() {
  return (
    <div className="relative -mt-6 sm:-mt-8 lg:-mt-10">
      {/* Wave Image */}
      <div className="relative h-[110px] sm:h-[130px] lg:h-[160px]">
        <Image
          src={ASSETS.waveBottom}
          alt=""
          fill
          className="object-cover lg:object-contain"
          unoptimized
          sizes="100vw"
          loading="lazy"
          draggable={false}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

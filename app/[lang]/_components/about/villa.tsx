"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useIntersectionObserver } from "../../_hooks/use-intersection-observer";
import { FiExternalLink } from "react-icons/fi";
import clsx from "clsx";
import { WAVE_HEIGHT, GLOBAL_ASSETS } from "../../_lib/constants";

type AboutVillaDict = {
  taglineAlt: string;
  title: string;
  p1: string;
  p2: string;
  p3: string;
  p4: string;
  eventLogoAlt: string;
  sponsorAlt: string;
  cta: string;
};

type Props = {
  dict: AboutVillaDict;
};

export default function AboutVilla({ dict }: Props) {
  const { ref: sectionRef, isVisible } = useIntersectionObserver<HTMLElement>();
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  // ===== Constants =====
  const ASSETS = {
    background: "/img/about/villa-bg.webp",
    bottomWave: GLOBAL_ASSETS.wave,
    tagline: GLOBAL_ASSETS.taglineWhite,
    logo: GLOBAL_ASSETS.logoWhite,
    sponsor: "/img/sponsors/cascais-camara-w.webp",
  } as const;

  const PARAGRAPHS: Array<"p1" | "p2" | "p3" | "p4"> = ["p1", "p2", "p3", "p4"];

  return (
    <section
      ref={sectionRef}
      className="relative max-h-[95vh] min-h-[640px] w-full overflow-hidden"
      style={{ paddingBottom: `${WAVE_HEIGHT}px` }}
      aria-labelledby="villa-title"
    >
      {/* Enhanced Background with Loading State and Dark Overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-blue-800" />
        <Image
          src={ASSETS.background}
          alt=""
          role="presentation"
          fill
          quality={75}
          className={clsx(
            "object-cover motion-safe:transition-opacity duration-700",
            backgroundLoaded ? "opacity-100" : "opacity-0"
          )}
          sizes="100vw"
          draggable={false}
          onLoad={() => setBackgroundLoaded(true)}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex h-full max-h-[95vh] min-h-[640px] max-w-screen-xl flex-col px-4 py-4 pb-24 pt-16 sm:py-6 md:py-12 md:pb-40">
        {/* Desktop: Small Tagline top right */}
        <div className="hidden md:block">
          <div
            className={clsx(
              "mb-8 flex justify-end motion-safe:transition-all duration-1000 ease-out",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
          >
            <Image
              src={ASSETS.tagline}
              alt={dict.taglineAlt}
              width={520}
              quality={75}
              loading="lazy"
              height={220}
              className="h-auto w-[280px] object-contain drop-shadow motion-safe:transition-transform duration-300 hover:scale-105 lg:w-[320px]"
              sizes="(max-width: 1024px) 280px, 320px"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>

        {/* Main content area - grows to fill space */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Mobile: Title and Logo in same row */}
          <div className="flex items-start justify-between gap-4 md:block">
            <h2
              id="villa-title"
              className="text-2xl font-extrabold uppercase tracking-wide text-white drop-shadow sm:text-3xl md:text-4xl"
            >
              <span className="md:hidden">
                {dict.title.split(" - ")[0]} -<br />
                {dict.title.split(" - ")[1]}
              </span>
              <span className="hidden md:inline">{dict.title}</span>
            </h2>

            {/* Mobile: Logo on the right of title */}
            <div className="shrink-0 md:hidden">
              <Image
                src={ASSETS.logo}
                alt={dict.eventLogoAlt}
                width={260}
                height={80}
                quality={80}
                loading="lazy"
                className="h-auto w-[120px] object-contain drop-shadow motion-safe:transition-transform duration-300 hover:scale-105"
                sizes="120px"
                decoding="async"
                draggable={false}
              />
            </div>
          </div>

          {/* Content paragraphs */}
          <div
            className={clsx(
              "mt-6 space-y-4 text-white drop-shadow motion-safe:transition-all duration-1000 ease-out",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            {PARAGRAPHS.map((key, index) => (
              <p
                key={key}
                className={clsx(
                  "text-sm leading-relaxed motion-safe:transition-all duration-700 ease-out sm:text-base",
                  index === 2 && "hidden sm:block",
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                )}
                style={{
                  transitionDelay: `${400 + index * 100}ms`,
                }}
              >
                {dict[key]}
              </p>
            ))}
          </div>

          {/* Mobile: Sponsor and CTA at bottom */}
          <div className="mt-6 flex items-center justify-end gap-4 md:mt-8 md:hidden">
            <div className="group">
              <Image
                src={ASSETS.sponsor}
                alt={dict.sponsorAlt}
                width={240}
                height={80}
                className="h-auto w-[120px] object-contain drop-shadow motion-safe:transition-transform duration-300 group-hover:scale-105"
                sizes="120px"
                decoding="async"
                draggable={false}
                loading="lazy"
              />
            </div>

            <EnhancedButton
              href="https://www.visitcascais.com/en"
              ariaLabel={dict.cta}
            >
              {dict.cta}
            </EnhancedButton>
          </div>
        </div>

        {/* Desktop: Bottom Row - Logo left, Sponsor + CTA right */}
        <div
          className={clsx(
            "mt-8 hidden items-end justify-between motion-safe:transition-all duration-1000 ease-out md:flex",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          style={{ transitionDelay: "800ms" }}
        >
          {/* Left: Logo */}
          <div className="group">
            <Image
              src={ASSETS.logo}
              alt={dict.eventLogoAlt}
              width={260}
              height={80}
              className="h-auto w-[220px] object-contain drop-shadow motion-safe:transition-transform duration-300 group-hover:scale-105 lg:w-[260px]"
              sizes="(max-width: 1024px) 220px, 260px"
              decoding="async"
              draggable={false}
              loading="lazy"
              quality={80}
            />
          </div>

          {/* Right: Sponsor + CTA */}
          <div className="flex items-center gap-5">
            <div className="group">
              <Image
                src={ASSETS.sponsor}
                alt={dict.sponsorAlt}
                width={240}
                height={80}
                className="h-auto w-[200px] object-contain drop-shadow motion-safe:transition-transform duration-300 group-hover:scale-105 lg:w-[240px]"
                sizes="(max-width: 1024px) 200px, 240px"
                decoding="async"
                draggable={false}
                loading="lazy"
                quality={80}
              />
            </div>

            <EnhancedButton
              href="https://www.visitcascais.com/en"
              ariaLabel={dict.cta}
            >
              {dict.cta}
            </EnhancedButton>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-1/2 w-screen -translate-x-1/2">
        <div className="relative" style={{ height: `${WAVE_HEIGHT}px` }}>
          <Image
            src={ASSETS.bottomWave}
            alt=""
            role="presentation"
            fill
            className="-mb-px object-cover"
            sizes="100vw"
            loading="lazy"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}

/* --- Enhanced Button Component --- */
interface EnhancedButtonProps {
  href: string;
  ariaLabel: string;
  children: React.ReactNode;
}

function EnhancedButton({ href, ariaLabel, children }: EnhancedButtonProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-sky-700 shadow-lg ring-1 ring-black/10 motion-safe:transition-all duration-300 hover:scale-105 hover:bg-sky-700 hover:text-white hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:text-base"
      aria-label={ariaLabel}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <FiExternalLink className="h-4 w-4 motion-safe:transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>

      {/* Hover shimmer effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent motion-safe:transition-transform duration-500 group-hover:translate-x-full" />
    </Link>
  );
}

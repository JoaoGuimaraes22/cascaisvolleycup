"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FiDownload, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import clsx from "clsx";
import type { Locale } from "@/i18n-config";
import { useIntersectionObserver } from "../../_hooks/use-intersection-observer";
import {
  WAVE_HEIGHT,
  GLOBAL_ASSETS,
  getBrochureFileName,
} from "../../_lib/constants";

type DayBlock = {
  title?: string;
  subtitle?: string;
  times?: string;
  note?: string;
};

type ProgramHeroDict = {
  title: string;
  taglineAlt: string;
  playersAlt: string;
  downloadBrochure: string;
  checkin: { label: string; text: string };
  days: {
    d1: {
      weekday: string;
      date: string;
      block1: { title: string; subtitle: string; times: string };
    };
    d2: {
      weekday: string;
      date: string;
      block1: { title: string; subtitle: string; times: string };
    };
    d3: {
      weekday: string;
      date: string;
      block1: { title: string };
    };
    d4: {
      weekday: string;
      date: string;
      block1: { title: string };
      block2: { title: string };
      block3: { subtitle: string; times: string };
    };
    d5: {
      weekday: string;
      date: string;
      block1: { title: string };
      block2: { title: string };
      block3: { title: string };
      block4: { subtitle: string; times: string };
      block5: { note: string };
    };
  };
  checkout: { label: string; text: string };
  layDay: {
    title: string;
    content1: string;
    bold1: string;
    content2: string;
    bold2: string;
    content3: string;
    note: string;
  };
};

type Props = {
  lang: Locale;
  dict: ProgramHeroDict;
};

export default function ProgramHero({ lang, dict }: Props) {
  const { ref: sectionRef, isVisible } = useIntersectionObserver<HTMLElement>();
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ===== Constants =====
  const ASSETS = {
    background: "/img/program/program-bg.webp",
    tagline: GLOBAL_ASSETS.tagline,
    players: "/img/program/players.webp",
    wave: GLOBAL_ASSETS.wave,
  } as const;

  // Days configuration with new design
  const DAYS = [
    {
      key: "d1",
      weekday: dict.days.d1.weekday,
      date: dict.days.d1.date,
      blocks: [
        { title: dict.days.d1.block1.title },
        { subtitle: dict.days.d1.block1.subtitle },
        { times: dict.days.d1.block1.times },
      ] as DayBlock[],
    },
    {
      key: "d2",
      weekday: dict.days.d2.weekday,
      date: dict.days.d2.date,
      blocks: [
        { title: dict.days.d2.block1.title },
        { subtitle: dict.days.d2.block1.subtitle },
        { times: dict.days.d2.block1.times },
      ] as DayBlock[],
    },
    {
      key: "d3",
      weekday: dict.days.d3.weekday,
      date: dict.days.d3.date,
      blocks: [{ title: dict.days.d3.block1.title }] as DayBlock[],
    },
    {
      key: "d4",
      weekday: dict.days.d4.weekday,
      date: dict.days.d4.date,
      blocks: [
        { title: dict.days.d4.block1.title },
        { title: dict.days.d4.block2.title },
        { subtitle: dict.days.d4.block3.subtitle },
        { times: dict.days.d4.block3.times },
      ] as DayBlock[],
    },
    {
      key: "d5",
      weekday: dict.days.d5.weekday,
      date: dict.days.d5.date,
      blocks: [
        { title: dict.days.d5.block1.title },
        { title: dict.days.d5.block2.title },
        { title: dict.days.d5.block3.title },
        { subtitle: dict.days.d5.block4.subtitle },
        { times: dict.days.d5.block4.times },
        { note: dict.days.d5.block5.note },
      ] as DayBlock[],
    },
  ] as const;

  // Slider setup
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: { perView: 1.2, spacing: 16 },
    breakpoints: {
      "(min-width: 480px)": { slides: { perView: 2.2, spacing: 16 } },
      "(min-width: 768px)": { slides: { perView: 3.2, spacing: 16 } },
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const goToPrevious = useCallback(() => {
    instanceRef.current?.prev();
  }, [instanceRef]);

  const goToNext = useCallback(() => {
    instanceRef.current?.next();
  }, [instanceRef]);

  const goToSlide = useCallback(
    (index: number) => {
      instanceRef.current?.moveToIdx(index);
    },
    [instanceRef]
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      aria-labelledby="program-title"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={ASSETS.background}
          alt=""
          role="presentation"
          fill
          onLoad={() => setBackgroundLoaded(true)}
          className={clsx(
            "object-cover motion-safe:transition-opacity duration-700",
            backgroundLoaded ? "opacity-20" : "opacity-0"
          )}
          sizes="100vw"
          quality={80}
          loading="eager"
        />
      </div>

      <div className="mx-auto max-w-screen-xl px-4 pb-48 pt-8 sm:pb-36 sm:pt-12 lg:pb-0">
        {/* Title & Tagline Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left: Title */}
          <div
            className={clsx(
              "motion-safe:transition-all duration-1000 ease-out lg:col-span-7",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
          >
            <h1
              id="program-title"
              className="mb-6 text-2xl font-extrabold uppercase tracking-wide text-sky-500 sm:text-3xl"
            >
              {dict.title}
            </h1>
          </div>

          {/* Right: Tagline - Hidden on mobile, will be shown at bottom */}
          <div
            className={clsx(
              "hidden items-start justify-end motion-safe:transition-all duration-1000 ease-out lg:col-span-5 lg:flex",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <Image
              src={ASSETS.tagline}
              alt={dict.taglineAlt}
              width={400}
              height={140}
              className="h-auto w-[240px] object-contain motion-safe:transition-transform duration-300 hover:scale-105 sm:w-[320px] lg:w-[420px]"
              sizes="(max-width:640px) 240px, (max-width:1024px) 320px, 420px"
              quality={80}
              loading="eager"
            />
          </div>
        </div>

        {/* Reordered Content Structure */}
        <div className="mt-8 space-y-8">
          {/* 1. July 7 - Weekday */}
          <InfoSection
            title={dict.checkin.label}
            content={dict.checkin.text}
            isVisible={isVisible}
            delay={400}
            isWeekday={true}
          />

          {/* 3. Day Cards/Boxes */}
          {/* Desktop Grid */}
          <div
            className={clsx(
              "hidden motion-safe:transition-all duration-1000 ease-out lg:block",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {DAYS.map((day, index) => (
                <DayCard
                  key={day.key}
                  day={{ ...day, blocks: [...day.blocks] }}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </div>

          {/* Mobile/Tablet Slider */}
          <div
            className={clsx(
              "motion-safe:transition-all duration-1000 ease-out lg:hidden",
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            {/* Slider */}
            <div className="relative">
              <div
                ref={sliderRef}
                className="keen-slider"
                aria-labelledby="program-title"
              >
                {DAYS.map((day, index) => (
                  <div key={day.key} className="keen-slider__slide px-2">
                    <DayCard
                      day={{ ...day, blocks: [...day.blocks] }}
                      index={index}
                      isVisible={isVisible}
                    />
                  </div>
                ))}
              </div>

              {/* Navigation controls */}
              <div className="mt-4 flex items-center justify-center gap-4">
                {/* Navigation arrows */}
                <button
                  onClick={goToPrevious}
                  aria-label="Previous day"
                  className="rounded-full bg-sky-500/20 p-2 backdrop-blur-sm motion-safe:transition-all hover:bg-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50"
                >
                  <FiChevronLeft className="h-4 w-4 text-sky-500" />
                </button>

                {/* Dots */}
                <div className="flex gap-2">
                  {DAYS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to day ${index + 1}`}
                      className={clsx(
                        "h-2 w-2 rounded-full motion-safe:transition-all",
                        currentSlide === index
                          ? "scale-125 bg-sky-500"
                          : "bg-sky-500/50 hover:bg-sky-500/80"
                      )}
                    />
                  ))}
                </div>

                <button
                  onClick={goToNext}
                  aria-label="Next day"
                  className="rounded-full bg-sky-500/20 p-2 backdrop-blur-sm motion-safe:transition-all hover:bg-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50"
                >
                  <FiChevronRight className="h-4 w-4 text-sky-500" />
                </button>
              </div>
            </div>
          </div>

          {/* 4-6. Side by Side: July 13, Checkout, Lay Day, Button on Left | Image on Right */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left: All Text Content */}
            <div className="space-y-6 lg:col-span-7">
              {/* July 13 - Weekday */}
              <InfoSection
                title={dict.checkout.label}
                content=""
                isVisible={isVisible}
                delay={1200}
                isWeekday={true}
              />

              {/* Checkout Text */}
              <InfoSection
                title=""
                content={dict.checkout.text}
                isVisible={isVisible}
                delay={1400}
              />

              {/* Lay Day Section */}
              <div
                className={clsx(
                  "space-y-4 motion-safe:transition-all duration-700 ease-out",
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                )}
                style={{ transitionDelay: "1600ms" }}
              >
                <InfoSection
                  title={dict.layDay.title}
                  content=""
                  isVisible={isVisible}
                  delay={0}
                  isLayDay={true}
                />
                <div className="text-sm leading-relaxed text-slate-800/90 sm:text-base">
                  <p className="mb-4">
                    {dict.layDay.content1}
                    <strong>{dict.layDay.bold1}</strong>
                    {dict.layDay.content2}
                    <strong>{dict.layDay.bold2}</strong>
                    {dict.layDay.content3}
                  </p>
                  <p className="text-sm font-medium text-slate-700">
                    {dict.layDay.note}
                  </p>
                </div>
              </div>

              {/* Download Brochure Button */}
              <div
                className={clsx(
                  "motion-safe:transition-all duration-700 ease-out",
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                )}
                style={{ transitionDelay: "1800ms" }}
              >
                <DownloadButton filename={getBrochureFileName(lang)}>
                  {dict.downloadBrochure}
                </DownloadButton>
              </div>
            </div>

            {/* Right: Players Image - Desktop Only, Hidden on Mobile WITH FADE EFFECT */}
            <div
              className={clsx(
                "hidden motion-safe:transition-all duration-1000 ease-out lg:col-span-5 lg:block",
                // Add the fade mask effect here
                "[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]",
                "[mask-image:linear-gradient(to_bottom,black_0%,black_75%,transparent_100%)]",
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: "2000ms" }}
            >
              <Image
                src={ASSETS.players}
                alt={dict.playersAlt}
                width={600}
                height={400}
                className="h-auto w-full object-contain motion-safe:transition-transform duration-300 hover:scale-105"
                sizes="(max-width:1024px) 100vw, 42vw"
                quality={80}
              />
            </div>
          </div>
        </div>

        {/* Mobile: Tagline at bottom right */}
        <div
          className={clsx(
            "mt-6 flex justify-end motion-safe:transition-all duration-1000 ease-out lg:hidden",
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          )}
          style={{ transitionDelay: "2200ms" }}
        >
          <Image
            src={ASSETS.tagline}
            alt={dict.taglineAlt}
            width={320}
            height={120}
            className="h-auto w-[200px] object-contain motion-safe:transition-transform duration-300 hover:scale-105 sm:w-[240px]"
            sizes="(max-width:640px) 200px, 240px"
            quality={80}
            loading="lazy"
          />
        </div>
      </div>

      {/* Wave positioned responsively */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 w-screen -translate-x-1/2 lg:bottom-[50px]">
        {/* Desktop */}
        <div
          className="relative hidden lg:block"
          style={{ height: `${WAVE_HEIGHT}px` }}
        >
          <Image
            src={ASSETS.wave}
            alt=""
            role="presentation"
            fill
            className="z-10 -mb-px object-cover"
            sizes="100vw"
            unoptimized
            loading="lazy"
          />
        </div>

        {/* Mobile */}
        <div
          className="relative block lg:hidden"
          style={{
            backgroundImage: `url(${ASSETS.wave})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            height: `${WAVE_HEIGHT}px`,
          }}
        />
      </div>
    </section>
  );
}

/* --- Enhanced Components --- */

interface DayCardProps {
  day: {
    weekday: string;
    date: string;
    blocks: Array<{
      title?: string;
      subtitle?: string;
      times?: string;
      note?: string;
    }>;
  };
  index: number;
  isVisible: boolean;
}

function DayCard({ day, index, isVisible }: DayCardProps) {
  return (
    <article
      className={clsx(
        "group text-center text-white motion-safe:transition-all duration-300 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
      style={{
        transitionDelay: `${800 + index * 100}ms`,
      }}
    >
      {/* Top Header: Weekday + Date - Outside the box */}
      <div className="mb-3 px-3 py-2">
        <span className="text-sm font-bold uppercase tracking-wide text-sky-600 sm:text-base">
          {day.weekday}
        </span>
        <div className="text-xs font-light text-sky-500 sm:text-sm">
          {day.date}
        </div>
      </div>

      {/* Main Blue Box: Group Stage and Game Times */}
      <div className="overflow-hidden rounded-2xl bg-sky-500 shadow-lg ring-1 ring-black/10 motion-safe:transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:ring-sky-400/30">
        <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 px-4 py-5 sm:min-h-[220px]">
          {day.blocks.map((block, blockIndex) => {
            if (block.title) {
              return (
                <p
                  key={blockIndex}
                  className="text-base font-black uppercase tracking-wide text-white sm:text-lg"
                >
                  {block.title}
                </p>
              );
            }
            if (block.subtitle || block.times) {
              return (
                <p
                  key={blockIndex}
                  className="text-sm font-light text-white/95 sm:text-base"
                >
                  {block.subtitle || block.times}
                </p>
              );
            }
            if (block.note) {
              return (
                <p
                  key={blockIndex}
                  className="mt-2 max-w-[18ch] text-xs font-medium uppercase text-white/90 sm:text-sm"
                >
                  {block.note}
                </p>
              );
            }
            return null;
          })}
        </div>
      </div>
    </article>
  );
}

interface InfoSectionProps {
  title: string;
  content: string;
  isVisible: boolean;
  delay: number;
  isWeekday?: boolean;
  isLayDay?: boolean;
}

// Utility function to parse text with **bold** markers
function parseBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const boldText = part.slice(2, -2);
      return (
        <span key={index} className="font-bold">
          {boldText}
        </span>
      );
    }
    return part;
  });
}

function InfoSection({
  title,
  content,
  isVisible,
  delay,
  isWeekday = false,
  isLayDay = false,
}: InfoSectionProps) {
  if (!title && !content) return null;

  return (
    <div
      className={clsx(
        "motion-safe:transition-all duration-700 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {title && (
        <h3
          className={clsx(
            "mb-3 font-extrabold uppercase tracking-wide",
            isWeekday
              ? "text-xl text-sky-700 sm:text-2xl"
              : isLayDay
                ? "text-lg text-sky-500 sm:text-xl"
                : "text-lg text-sky-500 sm:text-xl"
          )}
        >
          {title}
        </h3>
      )}
      {content && (
        <p className="text-sm leading-relaxed text-slate-800/90 sm:text-base">
          {parseBoldText(content)}
        </p>
      )}
    </div>
  );
}

function DownloadButton({
  filename,
  children,
}: {
  filename: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={`/docs/${filename}`}
      download={filename}
      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-sky-600 px-6 py-3 text-sm font-bold text-white shadow-lg ring-1 ring-black/10 motion-safe:transition-all duration-300 hover:scale-105 hover:bg-sky-700 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 sm:text-base"
    >
      <FiDownload className="h-4 w-4 motion-safe:transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span>{children}</span>
    </a>
  );
}

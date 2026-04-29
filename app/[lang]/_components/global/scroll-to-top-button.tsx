"use client";

import { useCallback, useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import clsx from "clsx";

interface Props {
  threshold?: number;
  className?: string;
  ariaLabel?: string;
}

export default function ScrollToTopButton({
  threshold = 300,
  className,
  ariaLabel = "Scroll to top of page",
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToTop();
      }
    },
    [scrollToTop]
  );

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      className={clsx(
        "group fixed bottom-6 right-6 z-50",
        "flex h-12 w-12 items-center justify-center",
        "rounded-full bg-sky-700 text-white shadow-lg",
        "duration-300 ease-out motion-safe:transition-all",
        "hover:scale-110 hover:bg-sky-800 hover:shadow-xl",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2",
        "active:scale-95",
        "translate-y-0 opacity-100",
        className
      )}
    >
      <FaChevronUp
        className={clsx(
          "h-5 w-5 duration-200 motion-safe:transition-transform",
          "group-hover:-translate-y-0.5"
        )}
        aria-hidden="true"
      />
      <span
        className="absolute inset-0 scale-0 rounded-full bg-white/20 duration-300 motion-safe:transition-transform group-active:scale-100"
        aria-hidden="true"
      />
    </button>
  );
}

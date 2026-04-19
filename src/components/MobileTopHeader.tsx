"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GlobalContent } from "@/lib/content/schema";

const HIDE_THRESHOLD = 80; // px — sempre visível antes desse scroll
const DELTA = 6; // px de variação mínima para alternar visibilidade

export default function MobileTopHeader({
  globalContent,
}: {
  globalContent?: GlobalContent;
}) {
  const logo =
    globalContent?.brand.logo ||
    "/LOGO ACOMAC Joinville - 2020 - FINAL-01.avif";
  const logoAlt = globalContent?.brand.logoAlt || "ACOMAC Joinville";

  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (y < HIDE_THRESHOLD) {
        setHidden(false);
      } else if (y > lastY.current + DELTA) {
        setHidden(true);
      } else if (y < lastY.current - DELTA) {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="md:hidden fixed top-0 left-0 right-0 z-50"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition:
          "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, box-shadow 0.25s ease, backdrop-filter 0.25s ease",
        background: scrolled ? "rgba(255,255,255,0.96)" : "#ffffff",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px)" : "none",
        boxShadow: scrolled
          ? "0 1px 0 rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.05)"
          : "0 1px 0 rgba(0,0,0,0.04)",
      }}
      aria-hidden={hidden}
    >
      <div className="flex items-center justify-center h-14 px-4">
        <Link
          href="/"
          aria-label={logoAlt}
          className="inline-flex items-center"
        >
          <Image
            src={logo}
            alt={logoAlt}
            width={140}
            height={40}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>
      </div>
    </header>
  );
}

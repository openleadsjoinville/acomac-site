"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import type { GlobalContent, HomeContent } from "@/lib/content/schema";
import { resolveWhatsappCtaHref } from "@/lib/whatsapp";

export default function HeroSection({
  data,
  globalContent,
}: {
  data?: HomeContent["hero"];
  globalContent?: GlobalContent;
} = {}) {
  const hero = data ?? {
    badge: "Desde 1983 — Joinville, SC",
    title: "A força do",
    titleHighlight: "varejo",
    titleSuffix: "da construção em SC",
    subtitle:
      "A maior associação do varejo de material de construção de Santa Catarina. Unindo empresários, promovendo capacitação e impulsionando negócios há mais de 40 anos.",
    backgroundVideo: "/hero-bg.mp4",
    backgroundImage: "",
    ctaPrimary: { label: "Associe-se agora", href: "/participe-do-conecta-associados" },
    ctaSecondary: { label: "Conheça a ACOMAC", href: "/sobre" },
    stats: [
      { value: "40+", label: "Anos de história" },
      { value: "350", label: "Associados" },
      { value: "1.500m²", label: "Sede própria" },
    ],
  };
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background video or image */}
      {hero.backgroundVideo ? (
        <video
          className="absolute inset-0 z-0 w-full h-full object-cover"
          src={hero.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          key={hero.backgroundVideo}
        />
      ) : hero.backgroundImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="absolute inset-0 z-0 w-full h-full object-cover"
          src={hero.backgroundImage}
          alt=""
        />
      ) : null}

      {/* Blue overlay — same feel as the original image */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, rgba(0,20,50,0.88) 0%, rgba(0,20,50,0.75) 45%, rgba(0,20,50,0.55) 100%)",
        }}
      />

      {/* Grid pattern — same as PartnersSection */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[3]"
        style={{
          background:
            "linear-gradient(to top, rgba(0,10,30,0.6) 0%, transparent 100%)",
        }}
      />

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: slideUp 0.8s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.1s; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; opacity: 0; }
        .delay-300 { animation-delay: 0.3s; opacity: 0; }
        .delay-400 { animation-delay: 0.4s; opacity: 0; }
        .delay-500 { animation-delay: 0.5s; opacity: 0; }
      `}</style>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-8 animate-in"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#F6811E" }}
            />
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "rgba(255,255,255,0.9)" }}
            >
              {hero.badge}
            </span>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] mb-7 tracking-tight animate-in delay-100"
            style={{ color: "#ffffff" }}
          >
            {hero.title}{" "}
            <span className="relative inline-block">
              <span style={{ color: "#F6811E" }}>{hero.titleHighlight}</span>
              <span
                className="absolute -bottom-1.5 left-0 right-0 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E", opacity: 0.5 }}
              />
            </span>{" "}
            {hero.titleSuffix}
          </h1>

          {/* Description */}
          <p
            className="text-base sm:text-lg md:text-xl leading-relaxed mb-10 max-w-xl animate-in delay-200"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            {hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 items-center mb-16 animate-in delay-300">
            {(() => {
              const associateCta = globalContent?.whatsappCtas?.associateNow;
              const primaryHref = associateCta
                ? resolveWhatsappCtaHref(
                    associateCta,
                    globalContent?.whatsapp?.number
                  )
                : hero.ctaPrimary.href;
              const primaryLabel = associateCta?.label || hero.ctaPrimary.label;
              const isWa = primaryHref.startsWith("https://wa.me");
              return (
                <a
                  href={primaryHref}
                  target={isWa ? "_blank" : undefined}
                  rel={isWa ? "noopener noreferrer" : undefined}
                  data-track="hero_cta_primary"
                  data-track-label={primaryLabel}
                  className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:-translate-y-0.5 group"
                  style={{
                    backgroundColor: "#F6811E",
                    boxShadow: "0 4px 20px rgba(246,129,30,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#d96a0a";
                    e.currentTarget.style.boxShadow =
                      "0 8px 30px rgba(246,129,30,0.45)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F6811E";
                    e.currentTarget.style.boxShadow =
                      "0 4px 20px rgba(246,129,30,0.35)";
                  }}
                >
                  {primaryLabel}
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              );
            })()}
            <a
              href={hero.ctaSecondary.href}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold transition-all duration-300"
              style={{
                color: "#ffffff",
                backgroundColor: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.1)";
              }}
            >
              {hero.ctaSecondary.label}
            </a>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-10 animate-in delay-400">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: "#ffffff" }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-xs font-medium mt-1 uppercase tracking-wider"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#sobre"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-opacity duration-300"
        style={{ color: "rgba(255,255,255,0.4)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "rgba(255,255,255,0.8)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
        }
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
          Saiba mais
        </span>
        <ChevronDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
}

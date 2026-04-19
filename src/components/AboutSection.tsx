"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Target,
  Eye,
  Heart,
  ChevronRight,
  Building2,
  GraduationCap,
  MapPinned,
  Trophy,
  ArrowRight,
  Play,
} from "lucide-react";
import type { GlobalContent, HomeContent, SobreContent } from "@/lib/content/schema";
import { resolveWhatsappCtaHref } from "@/lib/whatsapp";

/* ────────────────────────── data ────────────────────────── */

const pillars = [
  {
    icon: Target,
    title: "Missão",
    description:
      "Representar e fortalecer o setor varejista de materiais de construção, promovendo ações que proporcionem benefícios diretos e indiretos aos associados.",
    color: "#0059AB",
  },
  {
    icon: Eye,
    title: "Visão",
    description:
      "Ser referência nacional como associação do varejo de materiais de construção, reconhecida pela excelência em representatividade e geração de valor.",
    color: "#F6811E",
  },
  {
    icon: Heart,
    title: "Valores",
    description:
      "Ética, transparência, cooperação, inovação e compromisso com o desenvolvimento sustentável do setor da construção civil.",
    color: "#0059AB",
  },
];

const STAT_ICON_CYCLE = [Building2, Trophy, MapPinned, GraduationCap];

const fallbackStats: { value: string; label: string }[] = [
  { value: "350", label: "Empresas associadas" },
  { value: "40+", label: "Anos de história" },
  { value: "8", label: "Municípios atendidos" },
  { value: "1.500m²", label: "De infraestrutura" },
];

/** Separa "180+" → { num: 180, suffix: "+" } e "1.000m²" → { num: 1000, suffix: "m²" } */
function parseStatValue(raw: string): { num: number | null; suffix: string } {
  const m = raw.trim().match(/^([\d.,]+)\s*(.*)$/);
  if (!m) return { num: null, suffix: raw };
  const digitsOnly = m[1].replace(/[.,]/g, "");
  const num = parseInt(digitsOnly, 10);
  return {
    num: Number.isNaN(num) ? null : num,
    suffix: (m[2] || "").trim(),
  };
}

const timeline = [
  {
    year: "1983",
    title: "Fundação",
    icon: Building2,
    description:
      "Nasce a ACOMAC Joinville, reunindo lojistas do setor da construção civil.",
    accent: "#0059AB",
  },
  {
    year: "1990",
    title: "Sede própria",
    icon: Building2,
    description:
      "Conquista da sede no bairro Costa e Silva, marco de solidez institucional.",
    accent: "#F6811E",
  },
  {
    year: "2000",
    title: "Academia da Construção",
    icon: GraduationCap,
    description:
      "Criação do programa de capacitação técnica e gerencial para o setor.",
    accent: "#0059AB",
  },
  {
    year: "2010",
    title: "Expansão regional",
    icon: MapPinned,
    description:
      "Ampliação da cobertura para 8 municípios do norte de Santa Catarina.",
    accent: "#F6811E",
  },
  {
    year: "Hoje",
    title: "Referência em SC",
    icon: Trophy,
    description:
      "Maior associação do varejo de materiais de construção do estado.",
    accent: "#0059AB",
  },
];

/* ────────────────────────── hooks ────────────────────────── */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start]);
  return count;
}

/* ────────────────────────── component ────────────────────── */

export default function AboutSection({
  about,
  stats: statsProp,
  timelineOverride,
  globalContent,
}: {
  about?: HomeContent["about"];
  stats?: HomeContent["stats"];
  timelineOverride?: SobreContent["timeline"];
  globalContent?: GlobalContent;
} = {}) {
  const aboutData = about;
  const statsData =
    statsProp && statsProp.length > 0 ? statsProp : fallbackStats;
  const contactCta = globalContent?.whatsappCtas?.contactUs;
  const aboutCtaHref = contactCta
    ? resolveWhatsappCtaHref(contactCta, globalContent?.whatsapp?.number)
    : aboutData?.ctaHref ?? "/contato";
  const aboutCtaLabel =
    contactCta?.label || aboutData?.ctaLabel || "Fale conosco";
  const aboutCtaIsWa = aboutCtaHref.startsWith("https://wa.me");
  const timelineData = (timelineOverride ?? timeline.map((t) => ({
    year: t.year,
    title: t.title,
    description: t.description,
  }))).map((item, i) => ({
    ...item,
    accent: i % 2 === 0 ? "#0059AB" : "#F6811E",
    icon: timeline[Math.min(i, timeline.length - 1)]?.icon ?? Building2,
  }));
  const header = useInView(0.15);
  const photoSection = useInView(0.1);
  const statsSection = useInView(0.15);
  const timelineSection = useInView(0.08);
  const pillarsSection = useInView(0.1);

  return (
    <section id="sobre" className="relative overflow-hidden bg-white">
      {/* ── Subtle background decorations ─────────── */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(0,89,171,0.03) 0%, transparent 50%), radial-gradient(circle at 85% 80%, rgba(246,129,30,0.02) 0%, transparent 50%)",
        }}
      />

      {/* ══════════════════════════════════════════════
          HERO BLOCK — Text + Photo side by side
         ══════════════════════════════════════════════ */}
      <div className="relative pt-28 pb-0 max-w-7xl mx-auto px-6">
        <div
          ref={header.ref}
          className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center"
        >
          {/* ── Left column: text ── */}
          <div
            className="lg:col-span-5"
            style={{
              opacity: header.inView ? 1 : 0,
              transform: header.inView ? "translateY(0)" : "translateY(36px)",
              transition:
                "opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "#0059AB" }}
              >
                {aboutData?.badge ?? "Quem somos"}
              </span>
            </div>

            <h2
              className="text-4xl md:text-5xl font-extrabold leading-[1.08] tracking-tight mb-6"
              style={{ color: "#0e1a2b" }}
            >
              {aboutData?.title ?? (
                <>
                  Construindo o futuro do{" "}
                  <span
                    className="relative inline-block"
                    style={{ color: "#0059AB" }}
                  >
                    varejo
                    <svg
                      className="absolute -bottom-1 left-0 w-full"
                      viewBox="0 0 120 8"
                      fill="none"
                      preserveAspectRatio="none"
                      style={{ height: "8px" }}
                    >
                      <path
                        d="M2 6c20-4 40-4 58-2s40 2 58-2"
                        stroke="#F6811E"
                        strokeWidth="3"
                        strokeLinecap="round"
                        style={{
                          strokeDasharray: 200,
                          strokeDashoffset: header.inView ? 0 : 200,
                          transition: "stroke-dashoffset 1.2s ease 0.6s",
                        }}
                      />
                    </svg>
                  </span>{" "}
                  da construção
                </>
              )}
            </h2>

            {aboutData?.paragraphs && aboutData.paragraphs.length > 0 ? (
              aboutData.paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-base md:text-[17px] leading-[1.8] mb-4 last:mb-8"
                  style={{ color: "#5a6577" }}
                >
                  {p}
                </p>
              ))
            ) : (
              <>
                <p
                  className="text-base md:text-[17px] leading-[1.8] mb-4"
                  style={{ color: "#5a6577" }}
                >
                  <strong style={{ color: "#0e1a2b" }}>A ACOMAC Joinville</strong> é
                  a maior associação do varejo de materiais de construção de Santa
                  Catarina. Fundada em 1983, nascemos da união de empresários que
                  acreditavam na força coletiva para transformar o mercado.
                </p>
                <p
                  className="text-base md:text-[17px] leading-[1.8] mb-8"
                  style={{ color: "#5a6577" }}
                >
                  Ao longo de mais de quatro décadas, construímos uma trajetória de
                  conquistas: capacitação profissional, representatividade, rodadas
                  de negócios com a indústria e pesquisa de mercado que orienta
                  decisões estratégicas.
                </p>
              </>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={aboutCtaHref}
                target={aboutCtaIsWa ? "_blank" : undefined}
                rel={aboutCtaIsWa ? "noopener noreferrer" : undefined}
                data-track="about_cta_contact"
                data-track-label={aboutCtaLabel}
                className="group/btn inline-flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-xl text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#0059AB",
                  boxShadow: "0 4px 20px rgba(0,89,171,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(0,89,171,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0,89,171,0.25)";
                }}
              >
                {aboutCtaLabel}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover/btn:translate-x-1"
                />
              </a>
              <a
                href="#beneficios"
                className="inline-flex items-center gap-2 text-sm font-bold px-7 py-3.5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
                style={{ border: "2px solid #e0e4ea", color: "#0059AB" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0059AB";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e0e4ea";
                }}
              >
                Ver benefícios
                <ChevronRight size={15} />
              </a>
            </div>
          </div>

          {/* ── Right column: photo composition ── */}
          <div
            ref={photoSection.ref}
            className="lg:col-span-7 relative"
            style={{
              opacity: photoSection.inView ? 1 : 0,
              transform: photoSection.inView
                ? "translateY(0) scale(1)"
                : "translateY(20px) scale(0.98)",
              transition:
                "opacity 1s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 1s cubic-bezier(0.16,1,0.3,1) 0.2s",
            }}
          >
            {/* Main photo */}
            <div
              className="relative rounded-3xl overflow-hidden"
              style={{
                aspectRatio: "16/10",
                boxShadow: "0 24px 64px rgba(0,20,60,0.12)",
              }}
            >
              <Image
                src={aboutData?.image || "/Fachada acomac.png"}
                alt="Fachada da sede da ACOMAC Joinville"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
              {/* Gradient overlay bottom */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,20,40,0.6) 0%, rgba(10,20,40,0.15) 35%, transparent 65%)",
                }}
              />

              {/* Bottom info bar */}
              <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.25em] mb-1"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    Sede ACOMAC
                  </p>
                  <p className="text-white text-lg font-bold">
                    Joinville, Santa Catarina
                  </p>
                </div>
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-md cursor-pointer transition-transform hover:scale-110"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <Play size={16} fill="white" style={{ color: "white", marginLeft: "2px" }} />
                </div>
              </div>
            </div>

            {/* Floating stat card — top left */}
            <div
              className="absolute -left-4 lg:-left-8 top-8 rounded-2xl px-5 py-4 hidden md:flex items-center gap-4"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 12px 40px rgba(0,20,60,0.1)",
                border: "1px solid rgba(0,0,0,0.06)",
                opacity: photoSection.inView ? 1 : 0,
                transform: photoSection.inView
                  ? "translateX(0)"
                  : "translateX(-20px)",
                transition:
                  "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.6s",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#eef4fd" }}
              >
                <Building2 size={22} style={{ color: "#0059AB" }} />
              </div>
              <div>
                <p
                  className="text-2xl font-extrabold leading-none"
                  style={{ color: "#0059AB" }}
                >
                  {aboutData?.highlights?.[0]?.value ?? "1983"}
                </p>
                <p
                  className="text-[11px] font-medium mt-0.5"
                  style={{ color: "#8a94a6" }}
                >
                  {aboutData?.highlights?.[0]?.label ?? "Ano de fundação"}
                </p>
              </div>
            </div>

            {/* Floating stat card — bottom right */}
            <div
              className="absolute -right-4 lg:-right-6 bottom-16 rounded-2xl px-5 py-4 hidden md:flex items-center gap-4"
              style={{
                backgroundColor: "#ffffff",
                boxShadow: "0 12px 40px rgba(0,20,60,0.1)",
                border: "1px solid rgba(0,0,0,0.06)",
                opacity: photoSection.inView ? 1 : 0,
                transform: photoSection.inView
                  ? "translateX(0)"
                  : "translateX(20px)",
                transition:
                  "opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.75s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.75s",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "#fff7ee" }}
              >
                <MapPinned size={22} style={{ color: "#F6811E" }} />
              </div>
              <div>
                <p
                  className="text-2xl font-extrabold leading-none"
                  style={{ color: "#F6811E" }}
                >
                  {aboutData?.highlights?.[1]?.value ?? "1.500m²"}
                </p>
                <p
                  className="text-[11px] font-medium mt-0.5"
                  style={{ color: "#8a94a6" }}
                >
                  {aboutData?.highlights?.[1]?.label ?? "De infraestrutura"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          STATS — Glassmorphism strip
         ══════════════════════════════════════════════ */}
      <div ref={statsSection.ref} className="max-w-7xl mx-auto px-6 py-20">
        <div
          className="rounded-3xl p-8 md:p-10 grid grid-cols-2 lg:grid-cols-4 gap-8"
          style={{
            background:
              "linear-gradient(135deg, #0059AB 0%, #003d7a 100%)",
            boxShadow: "0 20px 60px rgba(0,89,171,0.2)",
          }}
        >
          {statsData.map((stat, i) => {
            const Icon = STAT_ICON_CYCLE[i % STAT_ICON_CYCLE.length];
            return (
              <StatCard
                key={`${stat.label}-${i}`}
                stat={stat}
                icon={Icon}
                index={i}
                inView={statsSection.inView}
              />
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          TIMELINE — Horizontal modern flow
         ══════════════════════════════════════════════ */}
      <div
        ref={timelineSection.ref}
        className="max-w-7xl mx-auto px-6 pb-24"
      >
        {/* Section header */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          style={{
            opacity: timelineSection.inView ? 1 : 0,
            transform: timelineSection.inView
              ? "translateY(0)"
              : "translateY(24px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "#0059AB" }}
              >
                Nossa trajetória
              </span>
            </div>
            <h3
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
              style={{ color: "#0e1a2b" }}
            >
              Marcos da nossa{" "}
              <span style={{ color: "#0059AB" }}>história</span>
            </h3>
          </div>
          <p
            className="text-sm max-w-xs md:text-right"
            style={{ color: "#8a94a6" }}
          >
            Mais de quatro décadas construindo o futuro do setor da construção
            civil.
          </p>
        </div>

        {/* Desktop timeline — horizontal cards with connecting line */}
        <div className="hidden lg:block relative">
          {/* Connecting line */}
          <div
            className="absolute top-[52px] left-[10%] right-[10%] h-[2px]"
            style={{
              background:
                "linear-gradient(to right, #0059AB20, #0059AB40, #F6811E40, #F6811E20)",
            }}
          />

          <div className="grid grid-cols-5 gap-5">
            {timeline.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.year}
                  className="group relative flex flex-col items-center text-center"
                  style={{
                    opacity: timelineSection.inView ? 1 : 0,
                    transform: timelineSection.inView
                      ? "translateY(0)"
                      : "translateY(32px)",
                    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.1}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.1}s`,
                  }}
                >
                  {/* Year circle */}
                  <div
                    className="relative z-10 w-[104px] h-[104px] rounded-full flex flex-col items-center justify-center mb-6 transition-all duration-400"
                    style={{
                      backgroundColor: "#ffffff",
                      border: `3px solid ${item.accent}30`,
                      boxShadow: `0 4px 20px ${item.accent}12`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = item.accent;
                      e.currentTarget.style.boxShadow = `0 8px 32px ${item.accent}25`;
                      e.currentTarget.style.transform = "scale(1.08)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = `${item.accent}30`;
                      e.currentTarget.style.boxShadow = `0 4px 20px ${item.accent}12`;
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.7}
                      style={{ color: item.accent, marginBottom: "4px" }}
                    />
                    <span
                      className="text-lg font-extrabold leading-none"
                      style={{ color: item.accent }}
                    >
                      {item.year}
                    </span>
                  </div>

                  {/* Card content */}
                  <h4
                    className="text-[15px] font-bold mb-2"
                    style={{ color: "#0e1a2b" }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-[13px] leading-relaxed max-w-[180px]"
                    style={{ color: "#8a94a6" }}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="lg:hidden space-y-0">
          {timeline.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.year}
                className="flex gap-5"
                style={{
                  opacity: timelineSection.inView ? 1 : 0,
                  transform: timelineSection.inView
                    ? "translateX(0)"
                    : "translateX(-20px)",
                  transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.1}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.1}s`,
                }}
              >
                {/* Left: circle + line */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "#ffffff",
                      border: `3px solid ${item.accent}30`,
                      boxShadow: `0 4px 16px ${item.accent}10`,
                    }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.7}
                      style={{ color: item.accent }}
                    />
                  </div>
                  {i < timeline.length - 1 && (
                    <div
                      className="w-[2px] flex-1 min-h-[24px] my-1"
                      style={{
                        background: `linear-gradient(to bottom, ${item.accent}30, ${timeline[i + 1]?.accent ?? item.accent}30)`,
                      }}
                    />
                  )}
                </div>
                {/* Right: content */}
                <div className="flex-1 pb-8">
                  <span
                    className="text-xs font-bold"
                    style={{ color: item.accent }}
                  >
                    {item.year}
                  </span>
                  <h4
                    className="text-[15px] font-bold mt-0.5 mb-1"
                    style={{ color: "#0e1a2b" }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: "#8a94a6" }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          PILLARS — Mission / Vision / Values
         ══════════════════════════════════════════════ */}
      <div
        className="relative pb-28 max-w-7xl mx-auto px-6"
        ref={pillarsSection.ref}
      >
        {/* Section header */}
        <div
          className="text-center max-w-2xl mx-auto mb-16"
          style={{
            opacity: pillarsSection.inView ? 1 : 0,
            transform: pillarsSection.inView
              ? "translateY(0)"
              : "translateY(24px)",
            transition:
              "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <div className="flex items-center gap-3 justify-center mb-5">
            <div
              className="w-10 h-[3px] rounded-full"
              style={{ backgroundColor: "#F6811E" }}
            />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.25em]"
              style={{ color: "#0059AB" }}
            >
              Nossos pilares
            </span>
            <div
              className="w-10 h-[3px] rounded-full"
              style={{ backgroundColor: "#F6811E" }}
            />
          </div>
          <h3
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
            style={{ color: "#0e1a2b" }}
          >
            O que nos <span style={{ color: "#0059AB" }}>guia</span>
          </h3>
        </div>

        {/* Pillar cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            const accentBg =
              pillar.color === "#F6811E" ? "#fff7ee" : "#eef4fd";
            return (
              <div
                key={pillar.title}
                className="group relative rounded-3xl overflow-hidden transition-all duration-400"
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #eceef2",
                  opacity: pillarsSection.inView ? 1 : 0,
                  transform: pillarsSection.inView
                    ? "translateY(0)"
                    : "translateY(32px)",
                  transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.15}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.15}s, box-shadow 0.4s ease, border-color 0.3s ease`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 20px 48px ${pillar.color}14`;
                  e.currentTarget.style.borderColor = `${pillar.color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#eceef2";
                }}
              >
                {/* Top accent line */}
                <div
                  className="h-1 transition-all duration-500"
                  style={{
                    background: `linear-gradient(to right, ${pillar.color}, ${pillar.color}80)`,
                  }}
                />

                {/* Header area */}
                <div className="px-7 pt-8 pb-4 relative overflow-hidden">
                  {/* Background decoration */}
                  <div
                    className="absolute -top-12 -right-12 w-40 h-40 rounded-full transition-transform duration-700 group-hover:scale-150"
                    style={{ backgroundColor: `${pillar.color}05` }}
                  />

                  <div className="relative z-10 flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-400 group-hover:scale-110 group-hover:rotate-[-3deg]"
                      style={{ backgroundColor: accentBg }}
                    >
                      <Icon
                        size={26}
                        strokeWidth={1.7}
                        style={{ color: pillar.color }}
                      />
                    </div>
                    <div>
                      <span
                        className="text-[10px] font-bold uppercase tracking-[0.2em] block mb-0.5"
                        style={{ color: "#b0b8c8" }}
                      >
                        Pilar {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3
                        className="text-xl font-extrabold"
                        style={{ color: "#0e1a2b" }}
                      >
                        {pillar.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="px-7 pb-8 pt-1">
                  <p
                    className="text-sm leading-[1.8]"
                    style={{ color: "#6b7586" }}
                  >
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────── sub-components ───────────────── */

function StatCard({
  stat,
  icon: Icon,
  index,
  inView,
}: {
  stat: { value: string; label: string };
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  index: number;
  inView: boolean;
}) {
  const parsed = parseStatValue(stat.value);
  const count = useCountUp(parsed.num ?? 0, 2200, inView && parsed.num !== null);
  const display =
    parsed.num !== null ? count.toLocaleString("pt-BR") : stat.value;

  return (
    <div
      className="text-center relative"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      }}
    >
      {index > 0 && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-12 hidden lg:block"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        />
      )}
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3"
        style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
      >
        <Icon size={20} style={{ color: "rgba(255,255,255,0.8)" }} />
      </div>
      <p className="text-3xl md:text-4xl font-extrabold text-white tabular-nums">
        {display}
        {parsed.num !== null && parsed.suffix && (
          <span
            className="text-lg md:text-xl font-bold"
            style={{ color: "#F6811E" }}
          >
            {parsed.suffix}
          </span>
        )}
      </p>
      <p
        className="mt-1.5 text-[11px] font-semibold uppercase tracking-[0.15em]"
        style={{ color: "rgba(255,255,255,0.5)" }}
      >
        {stat.label}
      </p>
    </div>
  );
}

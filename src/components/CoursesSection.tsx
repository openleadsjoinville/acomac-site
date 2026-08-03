"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import {
  Paintbrush,
  Wrench,
  Zap,
  HardHat,
  Forklift,
  ShoppingCart,
  UserCog,
  Users,
  ArrowRight,
  ArrowLeft,
  Clock,
  Award,
  ChevronRight,
} from "lucide-react";
import { useInView, useCountUp, fadeIn, staggerStyle } from "@/hooks/useAnimations";

type Category = string;

interface Course {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties; strokeWidth?: number }>;
  title: string;
  description: string;
  duration: string;
  category: Category;
  level: string;
  image: string;
  ctaMessage?: string;
  ctaWhatsapp?: string;
}

const COURSE_ICONS: Course["icon"][] = [
  Paintbrush,
  Wrench,
  Zap,
  HardHat,
  ShoppingCart,
  UserCog,
  Users,
  Forklift,
];

const stats = [
  { end: 40, suffix: "+", label: "Cursos por ano" },
  { end: 2, suffix: "", label: "Salas equipadas" },
  { end: 100, suffix: "%", label: "Foco no setor" },
];

import type { HomeContent } from "@/lib/content/schema";
import { useCollection } from "@/hooks/useCollection";
import { whatsappLink } from "@/lib/utils";

type DBCourse = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  image: string;
  ctaLabel?: string;
  ctaHref?: string;
};

type GlobalLite = { whatsapp?: { number?: string } };

function autoCourseMessage(title: string): string {
  return `Olá! Tenho interesse no curso "${title}" da ACOMAC. Gostaria de receber mais informações sobre datas, valores e como me inscrever.`;
}

export default function CoursesSection({
  data,
}: {
  data?: HomeContent["courses"];
} = {}) {
  const dbCourses = useCollection<DBCourse>("/api/public/courses");
  const [globalWa, setGlobalWa] = useState<string>("");

  useEffect(() => {
    fetch("/api/public/global")
      .then((r) => r.json())
      .then((g: GlobalLite) => setGlobalWa(g?.whatsapp?.number ?? ""))
      .catch(() => {});
  }, []);
  const [activeFilter, setActiveFilter] = useState<Category>("todos");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref: headerRef, inView: headerInView } = useInView(0.15);
  const { ref: statsRef, inView: statsInView } = useInView(0.2);
  const { ref: carouselRef, inView: carouselInView } = useInView(0.08);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.15);

  const count0 = useCountUp(stats[0].end, 1800, statsInView);
  const count1 = useCountUp(stats[1].end, 1200, statsInView);
  const count2 = useCountUp(stats[2].end, 2000, statsInView);
  const counts = [count0, count1, count2];

  // Fonte única: cursos publicados no painel admin. Sem fallback fictício —
  // o carrossel só mostra o que existe de verdade no catálogo.
  const carregando = dbCourses === null;
  const courseList: Course[] = (dbCourses ?? []).map((c, i) => ({
    icon: COURSE_ICONS[i % COURSE_ICONS.length],
    title: c.title,
    description: c.description,
    duration: c.duration || "—",
    category: c.category || "Geral",
    level: c.level || "Básico",
    image: c.image,
    ctaMessage: c.ctaLabel || autoCourseMessage(c.title),
    ctaWhatsapp: c.ctaHref || globalWa,
  }));

  // Trilhas geradas a partir das categorias reais dos cursos publicados
  const categories: { key: Category; label: string }[] = [
    { key: "todos", label: "Todos" },
    ...Array.from(new Set(courseList.map((c) => c.category)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map((c) => ({ key: c, label: c })),
  ];

  const filtered =
    activeFilter === "todos"
      ? courseList
      : courseList.filter((c) => c.category === activeFilter);

  const scroll = useCallback((dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }, []);

  const levelColor = (level: string) => {
    switch (level) {
      case "Básico":
        return { bg: "#eef4fd", color: "#0059AB" };
      case "Intermediário":
        return { bg: "#fff7ee", color: "#d96a0a" };
      case "Avançado":
        return { bg: "#fce8e8", color: "#c0392b" };
      default:
        return { bg: "#f0f0f0", color: "#555555" };
    }
  };

  return (
    <section id="cursos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className="grid lg:grid-cols-3 gap-12 mb-12 items-end"
          style={fadeIn(headerInView)}
        >
          <div className="lg:col-span-2">
            <p className="section-label mb-5">{data?.badge ?? "Capacitação"}</p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
              style={{ color: "#111111" }}
            >
              {data?.title ?? (
                <>
                  Academia da{" "}
                  <span style={{ color: "#0059AB" }}>Construção</span>
                </>
              )}
            </h2>
            <div className="accent-bar mt-4" />
          </div>
          <div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "#888888" }}
            >
              {data?.subtitle ??
                "Mais de 40 cursos profissionalizantes por ano, formando toda a cadeia produtiva — do pedreiro ao gestor."}
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div
          ref={statsRef}
          className="grid grid-cols-3 gap-6 mb-12 p-7 rounded-2xl"
          style={{ backgroundColor: "#f7f7f7" }}
        >
          {stats.map((item, index) => (
            <div
              key={item.label}
              className="text-center"
              style={staggerStyle(statsInView, index, 0.1)}
            >
              <div
                className="text-2xl font-bold tabular-nums mb-1"
                style={{ color: "#0059AB" }}
              >
                {counts[index]}
                {item.suffix}
              </div>
              <div
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: "#888888" }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Filters + Navigation */}
        <div
          ref={carouselRef}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
          style={fadeIn(carouselInView, 0.05)}
        >
          {/* Filter pills */}
          <div className="flex flex-wrap gap-2">
            {(categories.length > 2 ? categories : []).map((cat) => {
              const isActive = activeFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveFilter(cat.key)}
                  className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? "#0059AB" : "#f0f0f0",
                    color: isActive ? "#ffffff" : "#666666",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#e5e5e5";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "#f0f0f0";
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Carousel arrows */}
          <div
            className="flex gap-2 shrink-0"
            style={{ display: courseList.length > 1 ? undefined : "none" }}
          >
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{
                border: "1px solid #e5e5e5",
                color: "#555555",
                backgroundColor: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0059AB";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#0059AB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#555555";
                e.currentTarget.style.borderColor = "#e5e5e5";
              }}
              aria-label="Anterior"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
              style={{
                border: "1px solid #e5e5e5",
                color: "#555555",
                backgroundColor: "#ffffff",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#0059AB";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.borderColor = "#0059AB";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#555555";
                e.currentTarget.style.borderColor = "#e5e5e5";
              }}
              aria-label="Próximo"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 -mx-6 px-6 snap-x snap-mandatory"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {filtered.map((course, index) => {
            const Icon = course.icon;
            const level = levelColor(course.level);
            const isOrange = index % 2 !== 0;
            const accent = isOrange ? "#F6811E" : "#0059AB";
            const accentBg = isOrange ? "#fff7ee" : "#eef4fd";
            const waNumber = course.ctaWhatsapp || globalWa;
            const waMessage =
              course.ctaMessage || autoCourseMessage(course.title);
            const waHref = waNumber
              ? whatsappLink(waNumber, waMessage)
              : "#contato";

            return (
              <a
                key={course.title}
                href={waHref}
                target={waHref.startsWith("http") ? "_blank" : undefined}
                rel={waHref.startsWith("http") ? "noopener noreferrer" : undefined}
                data-track="course_whatsapp_click"
                data-track-label={course.title}
                className="group snap-start shrink-0 w-[280px] md:w-[300px] rounded-2xl border overflow-hidden transition-all duration-400 block"
                style={{
                  borderColor: "#e5e5e5",
                  backgroundColor: "#ffffff",
                  opacity: carouselInView ? 1 : 0,
                  transform: carouselInView
                    ? "translateY(0)"
                    : "translateY(24px)",
                  transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.06}s, box-shadow 0.3s, border-color 0.3s`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(0,0,0,0.08)";
                  e.currentTarget.style.borderColor = "#cccccc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#e5e5e5";
                }}
              >
                {/* Card header with image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)`,
                    }}
                  />
                  {/* Icon badge */}
                  <div
                    className="absolute bottom-3 left-4 w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-sm"
                    style={{ backgroundColor: `${accent}dd` }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.7}
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  {/* Level badge */}
                  <div
                    className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm"
                    style={{
                      backgroundColor: `${level.bg}dd`,
                      color: level.color,
                    }}
                  >
                    {course.level}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h4
                    className="text-[15px] font-bold mb-2"
                    style={{ color: "#111111" }}
                  >
                    {course.title}
                  </h4>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "#777777" }}
                  >
                    {course.description}
                  </p>

                  {/* Meta row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: "#999999" }}
                      >
                        <Clock size={12} />
                        {course.duration}
                      </span>
                      <span
                        className="flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: "#999999" }}
                      >
                        <Award size={12} />
                        Certificado
                      </span>
                    </div>
                    <ChevronRight
                      size={16}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                      style={{ color: accent }}
                    />
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Sem cursos publicados: nada de card fictício, só um aviso honesto */}
        {!carregando && courseList.length === 0 && (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ backgroundColor: "#fafafa", border: "1px dashed #e0e0e0" }}
          >
            <p className="text-[15px] font-bold mb-1.5" style={{ color: "#333" }}>
              Nenhuma turma aberta no momento
            </p>
            <p className="text-sm" style={{ color: "#777" }}>
              O próximo calendário de cursos está sendo montado. Fale com a equipe
              para entrar na lista de espera.
            </p>
          </div>
        )}

        {carregando && (
          <div className="flex gap-5 overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="shrink-0 w-[280px] md:w-[300px] rounded-2xl overflow-hidden animate-pulse"
                style={{ border: "1px solid #e5e5e5" }}
              >
                <div className="h-44" style={{ backgroundColor: "#f0f0f0" }} />
                <div className="p-5 space-y-3">
                  <div className="h-4 rounded" style={{ backgroundColor: "#f0f0f0" }} />
                  <div className="h-3 rounded w-4/5" style={{ backgroundColor: "#f5f5f5" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hide scrollbar via CSS-in-JS */}
        <style>{`
          div::-webkit-scrollbar { display: none; }
        `}</style>

        {/* CTA */}
        <div
          ref={ctaRef}
          className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
          style={fadeIn(ctaInView, 0.1)}
        >
          <a
            href="#contato"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:-translate-y-0.5 group/cta"
            style={{
              backgroundColor: "#0059AB",
              boxShadow: "0 4px 16px rgba(0,89,171,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 8px 24px rgba(0,89,171,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(0,89,171,0.25)";
            }}
          >
            Consulte a agenda completa
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover/cta:translate-x-1"
            />
          </a>
          <span className="text-xs" style={{ color: "#aaaaaa" }}>
            Novos cursos adicionados mensalmente
          </span>
        </div>
      </div>
    </section>
  );
}

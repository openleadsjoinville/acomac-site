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

type Category = "todos" | "tecnico" | "gestao" | "seguranca" | "vendas";

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

const categories: { key: Category; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "tecnico", label: "Técnicos" },
  { key: "gestao", label: "Gestão" },
  { key: "vendas", label: "Vendas" },
  { key: "seguranca", label: "Segurança" },
];

const courses: Course[] = [
  {
    icon: Paintbrush,
    title: "Pintura Residencial",
    description: "Técnicas profissionais de pintura interna e externa com acabamento de qualidade.",
    duration: "40h",
    category: "tecnico",
    level: "Básico",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&h=400&fit=crop",
  },
  {
    icon: Wrench,
    title: "Hidráulica e Encanamento",
    description: "Instalações hidráulicas residenciais e comerciais conforme normas.",
    duration: "60h",
    category: "tecnico",
    level: "Intermediário",
    image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&h=400&fit=crop",
  },
  {
    icon: Zap,
    title: "Elétrica Predial",
    description: "Instalações elétricas prediais seguindo todas as normas técnicas de segurança.",
    duration: "80h",
    category: "tecnico",
    level: "Intermediário",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&h=400&fit=crop",
  },
  {
    icon: HardHat,
    title: "Assentamento de Pisos",
    description: "Colocação profissional de pisos cerâmicos, porcelanatos e revestimentos.",
    duration: "40h",
    category: "tecnico",
    level: "Básico",
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&h=400&fit=crop",
  },
  {
    icon: ShoppingCart,
    title: "Técnicas de Vendas",
    description: "Estratégias de vendas consultivas para o varejo da construção civil.",
    duration: "24h",
    category: "vendas",
    level: "Básico",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
  },
  {
    icon: UserCog,
    title: "Gestão de Loja",
    description: "Administração eficiente de lojas de materiais de construção.",
    duration: "32h",
    category: "gestao",
    level: "Avançado",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
  },
  {
    icon: Users,
    title: "Liderança e RH",
    description: "Gestão de equipes e desenvolvimento de líderes no setor de materiais.",
    duration: "24h",
    category: "gestao",
    level: "Intermediário",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  },
  {
    icon: Forklift,
    title: "Operador de Empilhadeira",
    description: "Certificação NR-11 para operação segura de empilhadeiras e transpaleteiras.",
    duration: "16h",
    category: "seguranca",
    level: "Básico",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop",
  },
  {
    icon: HardHat,
    title: "NR-35 Trabalho em Altura",
    description: "Capacitação obrigatória para trabalhos acima de 2 metros de altura.",
    duration: "8h",
    category: "seguranca",
    level: "Básico",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
  },
  {
    icon: ShoppingCart,
    title: "Negociação com Fornecedores",
    description: "Técnicas avançadas de negociação e gestão de compras para o varejo.",
    duration: "16h",
    category: "vendas",
    level: "Avançado",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop",
  },
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

  const courseList: Course[] =
    dbCourses && dbCourses.length > 0
      ? dbCourses.map((c, i) => ({
          icon: ([Paintbrush, Wrench, Zap, HardHat, ShoppingCart, UserCog, Users, Forklift] as Course["icon"][])[
            i % 8
          ],
          title: c.title,
          description: c.description,
          duration: c.duration || "—",
          category: "todos" as Category,
          level: c.level || "Básico",
          image: c.image,
          ctaMessage: c.ctaLabel || autoCourseMessage(c.title),
          ctaWhatsapp: c.ctaHref || globalWa,
        }))
      : courses.map((c) => ({
          ...c,
          ctaMessage: autoCourseMessage(c.title),
          ctaWhatsapp: globalWa,
        }));

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
            {categories.map((cat) => {
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
          <div className="flex gap-2 shrink-0">
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

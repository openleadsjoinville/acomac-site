"use client";

import Image from "next/image";
import { ArrowRight, Calendar, ArrowUpRight } from "lucide-react";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

const news = [
  {
    title: "Nova diretoria assume gestão 2026/2027 da ACOMAC Joinville",
    excerpt:
      "Marcos Arnaut e Robson Ceolin assumem a presidência com novas propostas para fortalecer o setor de materiais de construção na região.",
    date: "15 Mar 2026",
    category: "Institucional",
    readTime: "4 min",
    imageBg: "linear-gradient(145deg, #003d7a 0%, #0059AB 50%, #1a72c4 100%)",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&h=600&fit=crop",
  },
  {
    title: "FENAC 2025 reúne centenas de empresários em Joinville",
    excerpt:
      "A Feira de Negócios ACOMAC consolidou-se como o maior evento do varejo da construção civil de SC, com rodadas de negócios e palestras.",
    date: "28 Out 2025",
    category: "Eventos",
    readTime: "3 min",
    imageBg: "linear-gradient(145deg, #c4580a 0%, #F6811E 50%, #f9a055 100%)",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  },
  {
    title: "Academia da Construção supera 40 cursos no ano",
    excerpt:
      "O programa de capacitação forma profissionais desde pintores e encanadores até gestores do varejo, fortalecendo toda a cadeia produtiva.",
    date: "12 Set 2025",
    category: "Educação",
    readTime: "5 min",
    imageBg: "linear-gradient(145deg, #004080 0%, #0059AB 50%, #2980d4 100%)",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
  },
  {
    title: "Novos convênios ampliam benefícios para associados",
    excerpt:
      "Parcerias em energia solar, consultoria empresarial e saúde ampliam as vantagens exclusivas para as empresas associadas à ACOMAC.",
    date: "05 Ago 2025",
    category: "Benefícios",
    readTime: "3 min",
    imageBg: "linear-gradient(145deg, #d96a0a 0%, #F6811E 50%, #ffb366 100%)",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
  },
];

const categoryColor = (cat: string) => {
  switch (cat) {
    case "Institucional":
      return { bg: "#eef4fd", color: "#0059AB" };
    case "Eventos":
      return { bg: "#fff7ee", color: "#d96a0a" };
    case "Educação":
      return { bg: "#eef4fd", color: "#0059AB" };
    case "Benefícios":
      return { bg: "#fff7ee", color: "#d96a0a" };
    default:
      return { bg: "#f0f0f0", color: "#555555" };
  }
};

import type { HomeContent } from "@/lib/content/schema";
import { useCollection } from "@/hooks/useCollection";

type DBPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime: string;
  publishedAt: string | null;
};

export default function NewsSection({
  data,
}: {
  data?: HomeContent["news"];
} = {}) {
  const { ref: headerRef, inView: headerInView } = useInView(0.15);
  const { ref: featuredRef, inView: featuredInView } = useInView(0.1);
  const { ref: gridRef, inView: gridInView } = useInView(0.08);

  const posts = useCollection<DBPost>("/api/public/blog");

  const list =
    posts && posts.length > 0
      ? posts.map((p, i) => ({
          title: p.title,
          excerpt: p.excerpt,
          date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "",
          category: p.category || (i % 2 === 0 ? "Institucional" : "Mercado"),
          readTime: p.readTime || "3 min",
          imageBg: i % 2 === 0
            ? "linear-gradient(145deg, #003d7a 0%, #0059AB 50%, #1a72c4 100%)"
            : "linear-gradient(145deg, #c4580a 0%, #F6811E 50%, #f9a055 100%)",
          image: p.coverImage,
          href: `/blog/${p.slug}`,
        }))
      : news.map((n) => ({ ...n, href: "#" }));

  const featured = list[0];
  const rest = list.slice(1);
  const featCat = categoryColor(featured.category);

  return (
    <section
      id="noticias"
      className="py-24"
      style={{ backgroundColor: "#f7f7f7" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end gap-6 justify-between mb-14"
          style={fadeIn(headerInView)}
        >
          <div>
            <p className="section-label mb-5">{data?.badge ?? "Notícias"}</p>
            <h2
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
              style={{ color: "#111111" }}
            >
              {data?.title ?? (
                <>
                  Últimas{" "}
                  <span style={{ color: "#0059AB" }}>notícias</span>
                </>
              )}
            </h2>
            <div className="accent-bar mt-4" />
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold transition-colors group/all"
            style={{ color: "#0059AB" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "#F6811E")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "#0059AB")
            }
          >
            Ver todas as notícias
            <ArrowRight
              size={15}
              className="transition-transform group-hover/all:translate-x-1"
            />
          </a>
        </div>

        {/* Featured post — full width, horizontal layout */}
        <div
          ref={featuredRef}
          className="mb-6"
          style={fadeIn(featuredInView, 0.1)}
        >
          <a
            href="#"
            className="group block bg-white rounded-2xl overflow-hidden border transition-all duration-300"
            style={{ borderColor: "#e5e5e5" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 16px 40px rgba(0,0,0,0.08)";
              e.currentTarget.style.borderColor = "#cccccc";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "#e5e5e5";
            }}
          >
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="h-56 md:h-auto md:min-h-[280px] relative overflow-hidden">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)",
                  }}
                />
                {/* Category floating badge */}
                <div
                  className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-sm"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.92)",
                    color: featCat.color,
                  }}
                >
                  {featured.category}
                </div>
                {/* Arrow icon */}
                <div
                  className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110 backdrop-blur-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <ArrowUpRight size={18} style={{ color: "#111111" }} />
                </div>
              </div>

              {/* Content */}
              <div className="p-7 md:p-9 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span
                    className="flex items-center gap-1.5 text-xs"
                    style={{ color: "#aaaaaa" }}
                  >
                    <Calendar size={12} />
                    {featured.date}
                  </span>
                  <span className="text-xs" style={{ color: "#cccccc" }}>
                    &bull;
                  </span>
                  <span className="text-xs" style={{ color: "#aaaaaa" }}>
                    {featured.readTime} de leitura
                  </span>
                </div>
                <h3
                  className="text-xl md:text-2xl font-bold leading-snug mb-3 transition-colors duration-300 group-hover:text-[#0059AB]"
                  style={{ color: "#111111" }}
                >
                  {featured.title}
                </h3>
                <p
                  className="text-sm md:text-base leading-relaxed mb-5"
                  style={{ color: "#777777" }}
                >
                  {featured.excerpt}
                </p>
                <div
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  style={{ color: "#F6811E" }}
                >
                  Ler matéria completa
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Remaining posts — 3 equal cards */}
        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {rest.map((item, index) => {
            const cat = categoryColor(item.category);
            return (
              <a
                key={item.title}
                href="#"
                className="group bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-300"
                style={{
                  borderColor: "#e5e5e5",
                  ...staggerStyle(gridInView, index, 0.1),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 12px 32px rgba(0,0,0,0.07)";
                  e.currentTarget.style.borderColor = "#cccccc";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#e5e5e5";
                }}
              >
                {/* Image */}
                <div className="h-44 relative overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="400px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)",
                    }}
                  />
                  <div
                    className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.92)",
                      color: cat.color,
                    }}
                  >
                    {item.category}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="flex items-center gap-1.5 text-[11px]"
                      style={{ color: "#aaaaaa" }}
                    >
                      <Calendar size={11} />
                      {item.date}
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: "#cccccc" }}
                    >
                      &bull;
                    </span>
                    <span
                      className="text-[11px]"
                      style={{ color: "#aaaaaa" }}
                    >
                      {item.readTime}
                    </span>
                  </div>
                  <h3
                    className="text-[15px] font-bold leading-snug mb-2 transition-colors duration-300 group-hover:text-[#0059AB]"
                    style={{ color: "#111111" }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: "#888888" }}
                  >
                    {item.excerpt}
                  </p>
                  <div
                    className="flex items-center gap-1.5 text-xs font-semibold mt-4 transition-colors"
                    style={{ color: "#F6811E" }}
                  >
                    Ler mais
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

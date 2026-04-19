"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import SponsorAside from "@/components/public/SponsorAside";
import { useInView, fadeIn } from "@/hooks/useAnimations";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  readTime: string;
  featured: boolean;
  publishedAt: string | null;
};

type BlogBanner = {
  image: string;
  badge: string;
  title: string;
  subtitle: string;
};

export default function BlogIndex() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [q, setQ] = useState("");
  const [banner, setBanner] = useState<BlogBanner | null>(null);
  const { ref: heroRef, inView: heroInView } = useInView(0.12);

  useEffect(() => {
    fetch("/api/public/blog")
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => setPosts([]));
    fetch("/api/public/global")
      .then((r) => r.json())
      .then((g) => {
        if (g?.blogBanner) setBanner(g.blogBanner);
      })
      .catch(() => {});
  }, []);

  const filtered = (posts ?? []).filter((p) =>
    !q ||
    `${p.title} ${p.category}`.toLowerCase().includes(q.toLowerCase())
  );
  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = featured ? filtered.filter((p) => p.id !== featured.id) : filtered;

  return (
    <ClientSiteChrome pageKey="home">
      {/* HERO */}
      <section
        className="relative pt-28 pb-16 overflow-hidden"
        style={{
          background: banner?.image
            ? `url(${banner.image}) center/cover`
            : "linear-gradient(160deg, #002952 0%, #004a94 40%, #0059AB 75%, #0068c7 100%)",
          minHeight: 320,
        }}
      >
        {banner?.image && (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(160deg, rgba(0,41,82,0.88) 0%, rgba(0,89,171,0.72) 60%, rgba(0,104,199,0.55) 100%)",
            }}
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        <div
          ref={heroRef}
          className="relative z-10 max-w-7xl mx-auto px-6"
          style={fadeIn(heroInView)}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-[3px] rounded-full" style={{ backgroundColor: "#F6811E" }} />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.25em]"
              style={{ color: "rgba(255,255,255,0.78)" }}
            >
              {banner?.badge ?? "Blog ACOMAC"}
            </span>
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] text-white max-w-4xl mb-4"
            style={{ textShadow: banner?.image ? "0 2px 16px rgba(0,0,0,0.3)" : undefined }}
          >
            {banner?.title ?? "Notícias, mercado e conteúdos para o varejo"}
          </h1>
          <p
            className="text-base md:text-lg leading-relaxed max-w-2xl"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {banner?.subtitle ??
              "Acompanhe os bastidores da ACOMAC, pesquisas de mercado e artigos pensados para lojistas do setor de materiais de construção."}
          </p>
        </div>
      </section>

      {/* SEARCH */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 mb-10 relative z-10">
        <div
          className="flex items-center gap-3 px-5 py-4 rounded-2xl max-w-xl"
          style={{
            background: "#fff",
            border: "1px solid #eceef2",
            boxShadow: "0 12px 40px rgba(0,20,60,0.08)",
          }}
        >
          <Search size={18} style={{ color: "#8a94a6" }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por título ou categoria..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "#0e1a2b" }}
          />
        </div>
      </section>

      {posts === null ? (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="py-24 text-center text-sm" style={{ color: "#8a94a6" }}>Carregando...</div>
        </section>
      ) : filtered.length === 0 ? (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="py-20 text-center rounded-2xl" style={{ background: "#f7f7f7", color: "#8a94a6" }}>
            Nenhum post publicado ainda.
          </div>
        </section>
      ) : (
        <>
          {/* FEATURED — full width, sem competir com sidebar */}
          {featured && (
            <section className="max-w-7xl mx-auto px-6 mb-14">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-[2px] rounded-full" style={{ backgroundColor: "#F6811E" }} />
                <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: "#8a94a6" }}>
                  Em destaque
                </span>
              </div>
              <Link
                href={`/blog/${featured.slug}`}
                className="grid lg:grid-cols-[1.15fr_1fr] gap-0 rounded-3xl overflow-hidden group"
                style={{
                  background: "#fff",
                  border: "1px solid #eceef2",
                  boxShadow: "0 12px 40px rgba(0,20,60,0.07)",
                  transition: "transform 0.35s ease, box-shadow 0.35s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 24px 60px rgba(0,20,60,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,20,60,0.07)";
                }}
              >
                <div
                  className="aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden relative"
                  style={{
                    background: featured.coverImage
                      ? `url(${featured.coverImage}) center/cover`
                      : "linear-gradient(135deg, #003d7a 0%, #0059AB 50%, #1a72c4 100%)",
                  }}
                >
                  {featured.category && (
                    <span
                      className="absolute top-5 left-5 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full"
                      style={{ background: "#F6811E", color: "#fff", boxShadow: "0 4px 14px rgba(246,129,30,0.35)" }}
                    >
                      {featured.category}
                    </span>
                  )}
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2
                    className="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-[1.15] mb-4 group-hover:text-[#0059AB] transition-colors"
                    style={{ color: "#0e1a2b" }}
                  >
                    {featured.title}
                  </h2>
                  <p className="text-base leading-relaxed mb-6" style={{ color: "#5a6577" }}>
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-5 text-xs mb-6" style={{ color: "#8a94a6" }}>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={13} />
                      {featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString("pt-BR") : "—"}
                    </span>
                    {featured.readTime && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={13} />
                        {featured.readTime}
                      </span>
                    )}
                  </div>
                  <span
                    className="inline-flex items-center gap-2 text-sm font-bold group-hover:gap-3 transition-all"
                    style={{ color: "#0059AB" }}
                  >
                    Ler matéria completa
                    <ArrowRight size={16} />
                  </span>
                </div>
              </Link>
            </section>
          )}

          {/* LIST + SIDEBAR */}
          <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 xl:grid-cols-[1fr_200px] gap-12">
            <div className="min-w-0">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[2px] rounded-full" style={{ backgroundColor: "#0059AB" }} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color: "#8a94a6" }}>
                    Últimas publicações
                  </span>
                </div>
                <span className="text-xs" style={{ color: "#8a94a6" }}>
                  {rest.length} {rest.length === 1 ? "matéria" : "matérias"}
                </span>
              </div>

              {rest.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {rest.map((p) => (
                    <Link
                      key={p.id}
                      href={`/blog/${p.slug}`}
                      className="group rounded-2xl overflow-hidden flex flex-col"
                      style={{
                        background: "#fff",
                        border: "1px solid #eceef2",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,20,60,0.10)";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div
                        className="aspect-[16/10] relative overflow-hidden"
                        style={{
                          background: p.coverImage
                            ? `url(${p.coverImage}) center/cover`
                            : "linear-gradient(135deg, #003d7a 0%, #0059AB 50%, #1a72c4 100%)",
                        }}
                      >
                        {p.category && (
                          <span
                            className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
                            style={{ background: "rgba(255,255,255,0.95)", color: "#F6811E" }}
                          >
                            {p.category}
                          </span>
                        )}
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3
                          className="text-base font-extrabold leading-snug mb-2 group-hover:text-[#0059AB] transition-colors"
                          style={{ color: "#0e1a2b" }}
                        >
                          {p.title}
                        </h3>
                        <p className="text-[13px] leading-relaxed line-clamp-2 mb-4 flex-1" style={{ color: "#5a6577" }}>
                          {p.excerpt}
                        </p>
                        <div className="flex items-center gap-3 text-[11px] pt-3" style={{ color: "#8a94a6", borderTop: "1px solid #f0f2f5" }}>
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={11} />
                            {p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("pt-BR") : "—"}
                          </span>
                          {p.readTime && (
                            <span className="inline-flex items-center gap-1">
                              <Clock size={11} />
                              {p.readTime}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-sm rounded-2xl" style={{ background: "#f7f8fb", color: "#8a94a6", border: "1px solid #eceef2" }}>
                  Sem outras matérias por aqui ainda.
                </div>
              )}
            </div>
            <SponsorAside slot="blog-list" />
          </section>
        </>
      )}
    </ClientSiteChrome>
  );
}

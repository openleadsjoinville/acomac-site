"use client";

import Image from "next/image";
import {
  Calendar,
  MapPin,
  ArrowRight,
  Star,
  Users,
  Handshake,
  Trophy,
  Rocket,
  Clock,
} from "lucide-react";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

const events = [
  {
    icon: Star,
    title: "FENAC 2025",
    subtitle: "Feira de Negócios ACOMAC",
    description:
      "O maior evento do varejo da construção civil de SC. Três dias de negócios, networking, palestras e oportunidades reais.",
    date: "21–23 Out 2025",
    location: "Joinville, SC",
    tags: ["Rodadas de Negócios", "Palestras", "Networking"],
    accent: "#F6811E",
    featured: true,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop",
  },
  {
    icon: Handshake,
    title: "Rodadas de Negócios",
    subtitle: "Encontros diretos",
    description:
      "Encontros periódicos entre associados e fornecedores para geração de negócios diretos e condições exclusivas.",
    date: "Mensal",
    location: "Sede ACOMAC",
    tags: ["Fornecedores", "Negociação"],
    accent: "#0059AB",
    featured: false,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop",
  },
  {
    icon: Rocket,
    title: "Sucesso é Lançar Aqui",
    subtitle: "Lançamentos em primeira mão",
    description:
      "Programa que traz lançamentos de produtos em primeira mão para os associados ACOMAC antes do mercado.",
    date: "Periódico",
    location: "Sede ACOMAC",
    tags: ["Lançamentos", "Exclusivo"],
    accent: "#0059AB",
    featured: false,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&h=400&fit=crop",
  },
  {
    icon: Users,
    title: "Encontro com o Fornecedor",
    subtitle: "Indústria & Varejo",
    description:
      "Oportunidade de conhecer lançamentos e negociar condições especiais diretamente com a indústria.",
    date: "Bimestral",
    location: "Sede ACOMAC",
    tags: ["Indústria", "Condições especiais"],
    accent: "#F6811E",
    featured: false,
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
  },
  {
    icon: Trophy,
    title: "Prêmio João-de-Barro",
    subtitle: "Reconhecimento do setor",
    description:
      "Premiação anual que reconhece e homenageia os destaques do setor de materiais de construção da região.",
    date: "Anual",
    location: "Joinville, SC",
    tags: ["Premiação", "Homenagem"],
    accent: "#0059AB",
    featured: false,
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop",
  },
];

import type { HomeContent } from "@/lib/content/schema";
import { useCollection } from "@/hooks/useCollection";

type DBEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  ctaHref: string;
  featured: boolean;
};

const eventIconCycle = [Star, Handshake, Rocket, Users, Trophy, Clock];

const FALLBACK_EVENT_IMAGE =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop&q=80&auto=format";

export default function EventsSection({
  data,
}: {
  data?: HomeContent["events"];
} = {}) {
  const { ref: headerRef, inView: headerInView } = useInView(0.15);
  const { ref: featuredRef, inView: featuredInView } = useInView(0.1);
  const { ref: gridRef, inView: gridInView } = useInView(0.08);

  const dbEvents = useCollection<DBEvent>("/api/public/events");

  const list =
    dbEvents && dbEvents.length > 0
      ? dbEvents.map((item, i) => ({
          icon: eventIconCycle[i % eventIconCycle.length],
          title: item.title,
          subtitle: item.location,
          description: item.description,
          date: new Date(item.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }),
          location: item.location,
          tags: [] as string[],
          accent: item.featured ? "#F6811E" : i % 2 === 0 ? "#F6811E" : "#0059AB",
          featured: item.featured || i === 0,
          image: item.image,
          href: item.ctaHref || `/eventos`,
        }))
      : events.map((e) => ({ ...e, href: "" }));

  const featured = list[0];
  const FeaturedIcon = featured.icon;
  const rest = list.slice(1);

  return (
    <section id="eventos" className="py-24" style={{ backgroundColor: "#f7f7f7" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-14" style={fadeIn(headerInView)}>
          <p className="section-label mb-5">{data?.badge ?? "Eventos"}</p>
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
                style={{ color: "#111111" }}
              >
                {data?.title ?? (
                  <>
                    Eventos que{" "}
                    <span style={{ color: "#0059AB" }}>aproximam o setor</span>
                  </>
                )}
              </h2>
              <div className="accent-bar mt-4" />
            </div>
            <p
              className="text-sm max-w-xs md:text-right"
              style={{ color: "#888888" }}
            >
              {data?.subtitle ??
                "Oportunidades reais de networking, negócios e crescimento para sua empresa."}
            </p>
          </div>
        </div>

        {/* Featured event — FENAC */}
        <div
          ref={featuredRef}
          className="mb-6 rounded-2xl overflow-hidden"
          style={{
            ...fadeIn(featuredInView, 0.1),
            background:
              "linear-gradient(135deg, #0a1e3d 0%, #0059AB 50%, #1a72c4 100%)",
          }}
        >
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left — info */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-6 self-start text-xs font-bold uppercase tracking-widest"
                style={{
                  backgroundColor: "rgba(246,129,30,0.2)",
                  color: "#F6811E",
                }}
              >
                <Star size={12} />
                Evento Principal
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-1">
                {featured.title}
              </h3>
              <p
                className="text-sm font-medium mb-5"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {featured.subtitle}
              </p>
              <p
                className="text-sm md:text-base leading-relaxed mb-8 max-w-md"
                style={{ color: "rgba(255,255,255,0.7)" }}
              >
                {featured.description}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <span
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <Calendar size={15} style={{ color: "#F6811E" }} />
                  {featured.date}
                </span>
                <span
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  <MapPin size={15} style={{ color: "#F6811E" }} />
                  {featured.location}
                </span>
              </div>

              <a
                href={data?.ctaHref ?? (featured as { href?: string }).href ?? "/eventos"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white self-start transition-all duration-300 hover:-translate-y-0.5 group/btn"
                style={{
                  backgroundColor: "#F6811E",
                  boxShadow: "0 4px 20px rgba(246,129,30,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(246,129,30,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(246,129,30,0.3)";
                }}
              >
                {data?.ctaLabel ?? "Saiba mais"}
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover/btn:translate-x-1"
                />
              </a>
            </div>

            {/* Right — image */}
            <div className="relative hidden md:block overflow-hidden">
              <Image
                src={featured.image || FALLBACK_EVENT_IMAGE}
                alt={featured.title}
                fill
                sizes="50vw"
                className="object-cover"
                unoptimized
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, #0059AB 0%, rgba(0,89,171,0.3) 50%, transparent 100%)",
                }}
              />
              {/* Tags overlay */}
              <div className="absolute bottom-6 right-6 flex flex-wrap gap-2 justify-end max-w-xs z-10">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Event cards grid */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {rest.map((event, index) => {
            const Icon = event.icon;
            return (
              <div
                key={event.title}
                className="group bg-white rounded-2xl border overflow-hidden transition-all duration-300"
                style={{
                  borderColor: "#e5e5e5",
                  ...staggerStyle(gridInView, index, 0.08),
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
                {/* Card header with image */}
                <div className="h-36 relative overflow-hidden">
                  <Image
                    src={event.image || FALLBACK_EVENT_IMAGE}
                    alt={event.title}
                    fill
                    sizes="300px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 60%)`,
                    }}
                  />
                  {/* Icon badge */}
                  <div
                    className="absolute bottom-3 left-4 w-9 h-9 rounded-lg flex items-center justify-center backdrop-blur-sm"
                    style={{ backgroundColor: `${event.accent}dd` }}
                  >
                    <Icon
                      size={18}
                      strokeWidth={1.7}
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  {/* Frequency badge */}
                  <div
                    className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.85)",
                      color: event.accent,
                    }}
                  >
                    <Clock size={10} />
                    {event.date}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3
                    className="text-[15px] font-bold mb-1"
                    style={{ color: "#111111" }}
                  >
                    {event.title}
                  </h3>
                  <p
                    className="text-xs font-medium mb-3"
                    style={{ color: "#aaaaaa" }}
                  >
                    {event.subtitle}
                  </p>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "#777777" }}
                  >
                    {event.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: "#f0f0f0",
                          color: "#666666",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} style={{ color: "#cccccc" }} />
                    <span
                      className="text-xs"
                      style={{ color: "#aaaaaa" }}
                    >
                      {event.location}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

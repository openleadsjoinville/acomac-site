"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Theater,
  UtensilsCrossed,
  GraduationCap,
  Presentation,
  Users,
  Car,
  ArrowUpRight,
} from "lucide-react";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

const spaces = [
  {
    icon: Theater,
    title: "Auditório",
    capacity: "160 lugares",
    description:
      "Espaço amplo e climatizado para palestras, assembleias e eventos de grande porte.",
    features: ["Projeção profissional", "Sistema de som", "Climatizado"],
    gradient: "linear-gradient(145deg, #003d7a 0%, #0059AB 40%, #1a72c4 100%)",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop&q=80",
  },
  {
    icon: UtensilsCrossed,
    title: "Área de Eventos",
    capacity: "200 pessoas",
    description:
      "Salão versátil com cozinha gourmet completa para confraternizações e eventos sociais.",
    features: ["Cozinha gourmet", "Salão amplo", "Decoração flexível"],
    gradient: "linear-gradient(145deg, #c4580a 0%, #F6811E 40%, #f9a055 100%)",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&h=400&fit=crop&q=80",
  },
  {
    icon: GraduationCap,
    title: "Academia da Construção",
    capacity: "Escola profissional",
    description:
      "Infraestrutura dedicada para cursos técnicos e capacitação profissional.",
    features: ["Área prática", "Material didático", "Certificação"],
    gradient: "linear-gradient(145deg, #004080 0%, #0059AB 40%, #2980d4 100%)",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop&q=80",
  },
  {
    icon: Presentation,
    title: "Salas de Treinamento",
    capacity: "52 e 48 lugares",
    description:
      "Duas salas equipadas com recursos audiovisuais modernos para workshops.",
    features: ["Equipadas", "Wi-Fi", "Ar-condicionado"],
    gradient: "linear-gradient(145deg, #d96a0a 0%, #F6811E 40%, #ffb366 100%)",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&q=80",
  },
  {
    icon: Users,
    title: "Sala de Reuniões",
    capacity: "Diretoria",
    description:
      "Espaço reservado para reuniões da diretoria e encontros de gestão estratégica.",
    features: ["Mesa executiva", "Videoconferência", "Privativo"],
    gradient: "linear-gradient(145deg, #002d5c 0%, #0059AB 40%, #3388d6 100%)",
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&h=400&fit=crop&q=80",
  },
  {
    icon: Car,
    title: "Estacionamento",
    capacity: "Amplo",
    description:
      "Estacionamento próprio e seguro para visitantes, associados e participantes.",
    features: ["Vagas amplas", "Segurança", "Acesso fácil"],
    gradient: "linear-gradient(145deg, #b34e00 0%, #F6811E 40%, #ffc080 100%)",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=600&h=400&fit=crop&q=80",
  },
];

import type { HomeContent } from "@/lib/content/schema";

export default function InfrastructureSection({
  data,
}: {
  data?: HomeContent["infrastructure"];
} = {}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { ref: headerRef, inView: headerInView } = useInView(0.15);
  const { ref: gridRef, inView: gridInView } = useInView(0.08);

  const iconCycle = [Theater, UtensilsCrossed, GraduationCap, Presentation, Users, Car];
  const gradientCycle = [
    "linear-gradient(145deg, #003d7a 0%, #0059AB 40%, #1a72c4 100%)",
    "linear-gradient(145deg, #c4580a 0%, #F6811E 40%, #f9a055 100%)",
    "linear-gradient(145deg, #004080 0%, #0059AB 40%, #2980d4 100%)",
    "linear-gradient(145deg, #d96a0a 0%, #F6811E 40%, #ffb366 100%)",
    "linear-gradient(145deg, #002d5c 0%, #0059AB 40%, #3388d6 100%)",
    "linear-gradient(145deg, #b34e00 0%, #F6811E 40%, #ffc080 100%)",
  ];

  const list =
    data?.features && data.features.length > 0
      ? data.features.map((f, i) => ({
          icon: iconCycle[i % iconCycle.length],
          title: f.title,
          capacity: "",
          description: f.description,
          features: [] as string[],
          gradient: gradientCycle[i % gradientCycle.length],
          image: data.image || "",
        }))
      : spaces;

  return (
    <section className="py-24" style={{ backgroundColor: "#f7f7f7" }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-14" style={fadeIn(headerInView)}>
          <p className="section-label mb-5">{data?.badge ?? "Infraestrutura"}</p>
          <div className="flex flex-col md:flex-row md:items-end gap-6 justify-between">
            <div>
              <h2
                className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
                style={{ color: "#111111" }}
              >
                {data?.title ?? (
                  <>
                    Sede própria de{" "}
                    <span style={{ color: "#0059AB" }}>1.500m²</span>
                  </>
                )}
              </h2>
              <div className="accent-bar mt-4" />
            </div>
            <p
              className="text-sm max-w-sm md:text-right"
              style={{ color: "#888888" }}
            >
              {data?.subtitle ??
                "Espaços modernos disponíveis para associados e parceiros em Joinville."}
            </p>
          </div>
        </div>

        {/* Cards Grid — 3 columns */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {list.map((space, index) => {
            const Icon = space.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={space.title}
                className="group rounded-2xl overflow-hidden cursor-default"
                style={{
                  ...staggerStyle(gridInView, index, 0.06),
                  boxShadow: isHovered
                    ? "0 20px 48px rgba(0,0,0,0.12)"
                    : "0 2px 12px rgba(0,0,0,0.06)",
                  transform: isHovered
                    ? "translateY(-8px)"
                    : gridInView
                    ? "translateY(0)"
                    : "translateY(28px)",
                  transition:
                    "box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.7s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Visual header with image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={space.image}
                    alt={space.title}
                    fill
                    sizes="400px"
                    className="object-cover transition-transform duration-500"
                    style={{
                      transform: isHovered ? "scale(1.1)" : "scale(1)",
                    }}
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)",
                    }}
                  />
                  {/* Icon badge */}
                  <div
                    className="absolute bottom-4 left-4 w-11 h-11 rounded-xl flex items-center justify-center backdrop-blur-sm transition-transform duration-500"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      transform: isHovered ? "scale(1.1)" : "scale(1)",
                    }}
                  >
                    <Icon
                      size={24}
                      strokeWidth={1.5}
                      style={{ color: "#ffffff" }}
                    />
                  </div>
                  {/* Capacity badge */}
                  <div
                    className="absolute top-4 left-4 text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-sm"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.2)",
                      color: "#ffffff",
                    }}
                  >
                    {space.capacity}
                  </div>
                </div>

                {/* Content */}
                <div
                  className="bg-white p-6"
                  style={{ borderTop: "none" }}
                >
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: "#111111" }}
                  >
                    {space.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed mb-4"
                    style={{ color: "#666666" }}
                  >
                    {space.description}
                  </p>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {space.features.map((feat) => (
                      <span
                        key={feat}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                        style={{
                          backgroundColor: "#f0f0f0",
                          color: "#555555",
                        }}
                      >
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* CTA link */}
                  <a
                    href="#contato"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold transition-all"
                    style={{ color: "#0059AB" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#F6811E")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#0059AB")
                    }
                  >
                    Agendar visita
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

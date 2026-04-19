"use client";

import { useState, useCallback } from "react";
import {
  ArrowRight,
  Fuel,
  Landmark,
  GraduationCap,
  HeartPulse,
  Scale,
  Sun,
  Palette,
  BriefcaseBusiness,
  Check,
  Sparkles,
} from "lucide-react";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

const categories = [
  {
    icon: Fuel,
    category: "Combustível",
    partners: [
      "Descontos em gasolina, álcool e diesel",
      "Troca de óleo com condições especiais",
    ],
    accent: "#F6811E",
  },
  {
    icon: Landmark,
    category: "Financeiro e Crédito",
    partners: [
      "Cooperativas com taxas atrativas",
      "Maquininhas com isenção de aluguel",
      "Consultas Serasa com franquia especial",
    ],
    accent: "#0059AB",
  },
  {
    icon: GraduationCap,
    category: "Educação",
    partners: [
      "Até 55% off em graduação EAD",
      "Pós-graduação com desconto exclusivo",
    ],
    accent: "#F6811E",
  },
  {
    icon: HeartPulse,
    category: "Saúde e Segurança",
    partners: [
      "Med. e seg. do trabalho com 15% off",
      "Farmácias parceiras com descontos",
    ],
    accent: "#0059AB",
  },
  {
    icon: Scale,
    category: "Jurídico",
    partners: [
      "Recuperação de crédito reduzida",
      "Protesto eletrônico com desconto",
      "Registro de marcas com 30% off",
    ],
    accent: "#F6811E",
  },
  {
    icon: Sun,
    category: "Energia Solar",
    partners: [
      "Condições especiais em painéis",
      "Redução da conta de luz",
    ],
    accent: "#0059AB",
  },
  {
    icon: Palette,
    category: "Design e Projetos",
    partners: [
      "Projetos de loja com 7% off",
      "Identidade visual com 10% off",
    ],
    accent: "#F6811E",
  },
  {
    icon: BriefcaseBusiness,
    category: "Consultoria",
    partners: [
      "20% off em consultoria empresarial",
      "Gestão de RH com tabela diferenciada",
    ],
    accent: "#0059AB",
  },
];

import type { HomeContent } from "@/lib/content/schema";

export default function PartnersSection({
  data,
}: {
  data?: HomeContent["partners"];
} = {}) {
  const { ref: headerRef, inView: headerInView } = useInView(0.12);
  const { ref: gridRef, inView: gridInView } = useInView(0.06);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.12);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      id="convenios"
      className="relative py-28 overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #002952 0%, #004a94 35%, #0059AB 60%, #0068c7 100%)",
      }}
    >
      {/* ── Background effects ── */}

      {/* Grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glowing orbs */}
      <div
        className="absolute top-[10%] right-[5%] w-[350px] h-[350px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(246,129,30,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-[5%] left-[10%] w-[300px] h-[300px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Diagonal accent line */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden"
      >
        <div
          className="absolute -top-[200px] -left-[100px] w-[600px] h-[1px] rotate-[35deg]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(246,129,30,0.15), transparent)",
          }}
        />
        <div
          className="absolute -bottom-[100px] -right-[100px] w-[500px] h-[1px] rotate-[35deg]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ══════ Header ══════ */}
        <div
          ref={headerRef}
          className="mb-16"
          style={fadeIn(headerInView)}
        >
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              {/* Label */}
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-10 h-[3px] rounded-full"
                  style={{ backgroundColor: "#F6811E" }}
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {data?.badge ?? "Convênios"}
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] text-white">
                {data?.title ?? (
                  <>
                    Parcerias e{" "}
                    <span
                      className="relative inline-block"
                      style={{ color: "#F6811E" }}
                    >
                      convênios exclusivos
                      <svg
                        className="absolute -bottom-1 left-0 w-full"
                        viewBox="0 0 240 8"
                        fill="none"
                        preserveAspectRatio="none"
                        style={{ height: "8px" }}
                      >
                        <path
                          d="M2 6c40-4 80-4 118-2s80 2 118-2"
                          stroke="#F6811E"
                          strokeWidth="3"
                          strokeLinecap="round"
                          style={{
                            strokeDasharray: 400,
                            strokeDashoffset: headerInView ? 0 : 400,
                            transition: "stroke-dashoffset 1.2s ease 0.5s",
                          }}
                        />
                      </svg>
                    </span>
                  </>
                )}
              </h2>
            </div>

            <div className="lg:col-span-5">
              <p
                className="text-sm md:text-base leading-relaxed lg:text-right"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {data?.subtitle ??
                  "Benefícios negociados pela ACOMAC para reduzir os custos operacionais da sua empresa."}
              </p>
            </div>
          </div>
        </div>

        {/* ══════ Cards grid ══════ */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isHovered = hoveredIndex === i;

            return (
              <div
                key={cat.category}
                className="group rounded-2xl transition-all duration-500 cursor-default"
                style={{
                  ...staggerStyle(gridInView, i, 0.04),
                  backgroundColor: isHovered
                    ? "rgba(255,255,255,0.13)"
                    : "rgba(255,255,255,0.06)",
                  border: isHovered
                    ? "1px solid rgba(255,255,255,0.22)"
                    : "1px solid rgba(255,255,255,0.08)",
                  transform: isHovered
                    ? "translateY(-6px)"
                    : gridInView
                    ? "translateY(0)"
                    : "translateY(28px)",
                  boxShadow: isHovered
                    ? "0 20px 48px rgba(0,0,0,0.2)"
                    : "none",
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="p-6 relative overflow-hidden">
                  {/* Hover glow effect */}
                  <div
                    className="absolute -top-16 -right-16 w-32 h-32 rounded-full transition-all duration-700"
                    style={{
                      background: `radial-gradient(circle, ${cat.accent}20 0%, transparent 70%)`,
                      transform: isHovered ? "scale(2.5)" : "scale(1)",
                      opacity: isHovered ? 1 : 0,
                    }}
                  />

                  {/* Icon container */}
                  <div className="relative z-10 flex items-center gap-4 mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-400"
                      style={{
                        backgroundColor: isHovered
                          ? cat.accent
                          : "rgba(255,255,255,0.1)",
                        transform: isHovered ? "rotate(-5deg) scale(1.05)" : "rotate(0deg) scale(1)",
                      }}
                    >
                      <Icon
                        size={22}
                        strokeWidth={1.7}
                        style={{
                          color: isHovered
                            ? "#ffffff"
                            : "rgba(255,255,255,0.7)",
                          transition: "color 0.3s",
                        }}
                      />
                    </div>

                    {/* Category name */}
                    <h3
                      className="text-[14px] font-bold transition-colors duration-300"
                      style={{
                        color: isHovered ? "#F6811E" : "#ffffff",
                      }}
                    >
                      {cat.category}
                    </h3>
                  </div>

                  {/* Separator */}
                  <div className="relative z-10 mb-4">
                    <div
                      className="h-px transition-all duration-700"
                      style={{
                        background: isHovered
                          ? `linear-gradient(to right, ${cat.accent}60, transparent)`
                          : "rgba(255,255,255,0.08)",
                        width: isHovered ? "100%" : "40%",
                      }}
                    />
                  </div>

                  {/* Partner list */}
                  <ul className="relative z-10 space-y-3">
                    {cat.partners.map((p, j) => (
                      <li
                        key={p}
                        className="flex items-start gap-2.5"
                        style={{
                          opacity: gridInView ? 1 : 0,
                          transform: gridInView
                            ? "translateX(0)"
                            : "translateX(-12px)",
                          transition: `opacity 0.5s ease ${0.3 + i * 0.06 + j * 0.08}s, transform 0.5s ease ${0.3 + i * 0.06 + j * 0.08}s`,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300"
                          style={{
                            backgroundColor: isHovered
                              ? `${cat.accent}30`
                              : "rgba(255,255,255,0.08)",
                          }}
                        >
                          <Check
                            size={11}
                            strokeWidth={2.5}
                            style={{
                              color: isHovered
                                ? cat.accent
                                : "rgba(255,255,255,0.4)",
                              transition: "color 0.3s",
                            }}
                          />
                        </div>
                        <span
                          className="text-sm leading-snug transition-colors duration-300"
                          style={{
                            color: isHovered
                              ? "rgba(255,255,255,0.85)"
                              : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* ══════ CTA Block ══════ */}
        <div
          ref={ctaRef}
          className="mt-16"
          style={fadeIn(ctaInView, 0.1)}
        >
          <div
            className="rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {/* Background shimmer */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(246,129,30,0.06) 50%, transparent 60%)",
                backgroundSize: "200% 100%",
                animation: ctaInView
                  ? "shimmer 3s ease-in-out infinite"
                  : "none",
              }}
            />

            <div className="relative z-10 flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(246,129,30,0.15)" }}
              >
                <Sparkles
                  size={24}
                  strokeWidth={1.7}
                  style={{ color: "#F6811E" }}
                />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-1">
                  Quer conhecer todos os convênios?
                </h4>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.5)" }}
                >
                  São mais de 20 parcerias com condições exclusivas para associados.
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-3 shrink-0">
              <a
                href="#contato"
                className="group/cta inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#F6811E",
                  color: "#ffffff",
                  boxShadow: "0 4px 24px rgba(246,129,30,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 32px rgba(246,129,30,0.45)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 24px rgba(246,129,30,0.3)";
                }}
              >
                Solicitar informações
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover/cta:translate-x-1"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="mt-14 grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
          {[
            { value: "20+", label: "Convênios ativos" },
            { value: "8", label: "Categorias" },
            { value: "55%", label: "Até de desconto" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                opacity: ctaInView ? 1 : 0,
                transform: ctaInView ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 0.6s ease ${0.3 + i * 0.1}s, transform 0.6s ease ${0.3 + i * 0.1}s`,
              }}
            >
              <p
                className="text-2xl font-extrabold"
                style={{ color: "#F6811E" }}
              >
                {stat.value}
              </p>
              <p
                className="text-[11px] font-semibold uppercase tracking-wider mt-1"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
}

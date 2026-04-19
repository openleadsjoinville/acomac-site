"use client";

import { useState } from "react";
import {
  GraduationCap,
  Handshake,
  Scale,
  BadgePercent,
  BarChart3,
  Megaphone,
  HeartPulse,
  Network,
  ArrowRight,
  Check,
  Users,
  Tags,
  LucideIcon,
} from "lucide-react";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";
import type { HomeContent } from "@/lib/content/schema";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Handshake,
  Scale,
  BadgePercent,
  BarChart3,
  Megaphone,
  HeartPulse,
  Network,
  Users,
  Tags,
};

const defaultBenefits = [
  {
    icon: GraduationCap,
    title: "Capacitação e Cursos",
    description:
      "Mais de 40 cursos profissionalizantes por ano para toda a cadeia da construção.",
    highlights: [
      "Cursos presenciais e online",
      "Certificação reconhecida",
      "Instrutores especializados",
    ],
  },
  {
    icon: Handshake,
    title: "Rodadas de Negócios",
    description:
      "Oportunidades de networking e fechamento de negócios com fornecedores.",
    highlights: [
      "Contato direto com fornecedores",
      "Condições exclusivas",
      "Eventos periódicos",
    ],
  },
  {
    icon: Scale,
    title: "Representação Setorial",
    description:
      "Defesa dos interesses do setor junto a órgãos públicos e entidades privadas.",
    highlights: [
      "Atuação política ativa",
      "Negociações coletivas",
      "Voz no legislativo",
    ],
  },
  {
    icon: BadgePercent,
    title: "Convênios Exclusivos",
    description:
      "Descontos e condições especiais em combustível, saúde, educação e crédito.",
    highlights: [
      "Combustível com desconto",
      "Planos de saúde",
      "Linhas de crédito",
    ],
  },
  {
    icon: BarChart3,
    title: "Pesquisa de Mercado",
    description:
      "Acesso a dados e pesquisas sobre o mercado de materiais de construção.",
    highlights: [
      "Relatórios mensais",
      "Índices do setor",
      "Análise de tendências",
    ],
  },
  {
    icon: Megaphone,
    title: "Eventos e Feiras",
    description:
      "Participação na FENAC e outros eventos que fortalecem o setor.",
    highlights: [
      "FENAC anual",
      "Feiras regionais",
      "Encontros setoriais",
    ],
  },
  {
    icon: HeartPulse,
    title: "Assistência Jurídica",
    description:
      "Planos de assistência jurídica, médica e empresarial com valores acessíveis.",
    highlights: [
      "Consultoria jurídica",
      "Assessoria trabalhista",
      "Orientação tributária",
    ],
  },
  {
    icon: Network,
    title: "Networking Regional",
    description:
      "Conexão com empresários de 8 municípios do norte catarinense.",
    highlights: [
      "8 municípios conectados",
      "Comunidade ativa",
      "Troca de experiências",
    ],
  },
];

export default function BenefitsSection({
  data,
}: {
  data?: HomeContent["benefits"];
} = {}) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { ref: headerRef, inView: headerInView } = useInView(0.12);
  const { ref: gridRef, inView: gridInView } = useInView(0.06);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.15);

  const benefits = data?.items?.length
    ? data.items.map((b) => ({
        icon: iconMap[b.icon ?? ""] ?? GraduationCap,
        title: b.title,
        description: b.description,
        highlights: [] as string[],
      }))
    : defaultBenefits;

  return (
    <section
      id="beneficios"
      className="relative py-28 overflow-hidden"
      style={{
        background: "linear-gradient(165deg, #003566 0%, #0059AB 45%, #0067c5 100%)",
      }}
    >
      {/* ── Background texture ── */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Decorative shapes */}
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
        style={{ backgroundColor: "rgba(255,255,255,0.03)" }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full"
        style={{ backgroundColor: "rgba(246,129,30,0.04)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ══════ Header ══════ */}
        <div
          ref={headerRef}
          className="grid lg:grid-cols-12 gap-8 items-end mb-16"
          style={fadeIn(headerInView)}
        >
          <div className="lg:col-span-7">
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {data?.badge ?? "Vantagens"}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08] text-white">
              {data?.title ?? (
                <>
                  Por que se associar{" "}
                  <span style={{ color: "#F6811E" }}>à ACOMAC?</span>
                </>
              )}
            </h2>
          </div>

          <div className="lg:col-span-5">
            <p
              className="text-sm md:text-base leading-relaxed lg:text-right"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {data?.subtitle ??
                "Mais de 40 benefícios exclusivos para impulsionar sua empresa no mercado da construção civil."}
            </p>
          </div>
        </div>

        {/* ══════ Benefits grid ══════ */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            const isExpanded = expandedIndex === index;
            const isOrange = index % 2 !== 0;

            return (
              <div
                key={benefit.title}
                className="group cursor-pointer rounded-2xl transition-all duration-400"
                style={{
                  ...staggerStyle(gridInView, index, 0.04),
                  backgroundColor: isExpanded
                    ? "rgba(255,255,255,0.14)"
                    : "rgba(255,255,255,0.07)",
                  border: isExpanded
                    ? "1px solid rgba(255,255,255,0.2)"
                    : "1px solid rgba(255,255,255,0.08)",
                }}
                onClick={() =>
                  setExpandedIndex(isExpanded ? null : index)
                }
                onMouseEnter={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.1)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.15)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.07)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                  }
                }}
              >
                <div className="p-6">
                  {/* Icon + number */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                      style={{
                        backgroundColor: isExpanded
                          ? "#F6811E"
                          : "rgba(255,255,255,0.1)",
                      }}
                    >
                      <Icon
                        size={22}
                        strokeWidth={1.8}
                        style={{
                          color: isExpanded
                            ? "#ffffff"
                            : "rgba(255,255,255,0.75)",
                          transition: "color 0.3s",
                        }}
                      />
                    </div>
                    <span
                      className="text-[11px] font-bold tabular-nums mt-1"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      0{index + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-[15px] font-bold mb-2 transition-colors duration-300"
                    style={{
                      color: isExpanded ? "#F6811E" : "#ffffff",
                    }}
                  >
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {benefit.description}
                  </p>

                  {/* Expandable highlights */}
                  <div
                    className="overflow-hidden transition-all duration-400"
                    style={{
                      maxHeight: isExpanded ? "200px" : "0px",
                      opacity: isExpanded ? 1 : 0,
                      marginTop: isExpanded ? "16px" : "0px",
                      transitionTimingFunction:
                        "cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div
                      className="pt-4 flex flex-col gap-2.5"
                      style={{
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      {benefit.highlights.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2.5"
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: "rgba(246,129,30,0.2)",
                            }}
                          >
                            <Check
                              size={11}
                              strokeWidth={2.5}
                              style={{ color: "#F6811E" }}
                            />
                          </div>
                          <span
                            className="text-sm"
                            style={{ color: "rgba(255,255,255,0.7)" }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ══════ Bottom CTA ══════ */}
        <div
          ref={ctaRef}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-5"
          style={fadeIn(ctaInView, 0.1)}
        >
          <a
            href={data?.ctaHref ?? "/conecta-associados#cadastro"}
            className="group/cta inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
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
            {data?.ctaLabel ?? "Quero me associar"}
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover/cta:translate-x-1"
            />
          </a>
          <a
            href="#contato"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
            style={{
              border: "2px solid rgba(255,255,255,0.2)",
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            Fale com a equipe
          </a>
        </div>

        {/* Bottom decorative line */}
        <div className="mt-16 flex items-center justify-center gap-3">
          <div
            className="h-px flex-1 max-w-[120px]"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          />
          <span
            className="text-[11px] font-medium"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            350 empresas já confiam na ACOMAC
          </span>
          <div
            className="h-px flex-1 max-w-[120px]"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          />
        </div>
      </div>
    </section>
  );
}

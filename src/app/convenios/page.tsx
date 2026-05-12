"use client";

import {
  Fuel,
  Landmark,
  GraduationCap,
  HeartPulse,
  Scale,
  Sun,
  Palette,
  BriefcaseBusiness,
  Check,
  TrendingDown,
  ShieldCheck,
  BadgePercent,
} from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import SponsorAside from "@/components/public/SponsorAside";
import { usePageContent } from "@/hooks/usePageContent";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

type Categoria = {
  icon: typeof Fuel;
  category: string;
  description: string;
  partners: { titulo: string; detalhe: string }[];
  accent: "orange" | "blue";
};

const categorias: Categoria[] = [
  {
    icon: Fuel,
    category: "Combustível",
    description:
      "Abasteça a frota da sua empresa com preços negociados em escala para toda a rede ACOMAC.",
    partners: [
      {
        titulo: "Descontos em gasolina, álcool e diesel",
        detalhe: "Rede parceira com postos em Joinville e região, tabela atualizada mensalmente.",
      },
      {
        titulo: "Troca de óleo com condições especiais",
        detalhe: "Oficinas credenciadas com desconto em mão de obra e produtos.",
      },
    ],
    accent: "orange",
  },
  {
    icon: Landmark,
    category: "Financeiro e Crédito",
    description:
      "Acesso a instrumentos financeiros pensados para o varejo da construção.",
    partners: [
      {
        titulo: "Cooperativas com taxas atrativas",
        detalhe: "Linhas de crédito empresarial e capital de giro em condições exclusivas.",
      },
      {
        titulo: "Maquininhas com isenção de aluguel",
        detalhe: "Bandeiras principais sem taxa mensal e taxas de desconto reduzidas.",
      },
      {
        titulo: "Consultas Serasa com franquia especial",
        detalhe: "Pacote de consultas com valor fixo e relatórios completos de crédito.",
      },
    ],
    accent: "blue",
  },
  {
    icon: GraduationCap,
    category: "Educação",
    description:
      "Desenvolva sua equipe com cursos formais em condições diferenciadas.",
    partners: [
      {
        titulo: "Até 55% off em graduação EAD",
        detalhe: "Instituições parceiras com cursos de administração, logística e gestão.",
      },
      {
        titulo: "Pós-graduação com desconto exclusivo",
        detalhe: "MBAs e especializações em gestão empresarial para associados e colaboradores.",
      },
    ],
    accent: "orange",
  },
  {
    icon: HeartPulse,
    category: "Saúde e Segurança",
    description: "Cuide do seu time e cumpra a legislação com custo reduzido.",
    partners: [
      {
        titulo: "Medicina e segurança do trabalho com 15% off",
        detalhe: "ASOs, PCMSO, PGR e laudos técnicos com clínicas credenciadas.",
      },
      {
        titulo: "Farmácias parceiras com descontos",
        detalhe: "Rede com desconto em medicamentos de uso contínuo e genéricos.",
      },
    ],
    accent: "blue",
  },
  {
    icon: Scale,
    category: "Jurídico",
    description:
      "Orientação jurídica especializada em negócios e questões do varejo.",
    partners: [
      {
        titulo: "Recuperação de crédito reduzida",
        detalhe: "Escritórios parceiros com tabela diferenciada para cobrança extrajudicial.",
      },
      {
        titulo: "Protesto eletrônico com desconto",
        detalhe: "Tarifas menores para registro de títulos em cartórios conveniados.",
      },
      {
        titulo: "Registro de marcas com 30% off",
        detalhe: "Depósito e acompanhamento de marcas no INPI com escritório especializado.",
      },
    ],
    accent: "orange",
  },
  {
    icon: Sun,
    category: "Energia Solar",
    description:
      "Reduza a conta de luz e invista em eficiência energética na sua loja.",
    partners: [
      {
        titulo: "Condições especiais em painéis",
        detalhe: "Integradores credenciados com desconto em projetos fotovoltaicos comerciais.",
      },
      {
        titulo: "Redução da conta de luz",
        detalhe: "Consultoria gratuita de viabilidade e retorno para associados.",
      },
    ],
    accent: "blue",
  },
  {
    icon: Palette,
    category: "Design e Projetos",
    description:
      "Profissionalize a imagem da sua loja com descontos em projeto e identidade.",
    partners: [
      {
        titulo: "Projetos de loja com 7% off",
        detalhe: "Arquitetos parceiros com foco em varejo de materiais de construção.",
      },
      {
        titulo: "Identidade visual com 10% off",
        detalhe: "Criação de logo, manual de marca e comunicação visual completa.",
      },
    ],
    accent: "orange",
  },
  {
    icon: BriefcaseBusiness,
    category: "Consultoria",
    description:
      "Apoio em gestão, RH e organização para elevar a performance do negócio.",
    partners: [
      {
        titulo: "20% off em consultoria empresarial",
        detalhe: "Diagnóstico de processos, finanças e planejamento estratégico.",
      },
      {
        titulo: "Gestão de RH com tabela diferenciada",
        detalhe: "Recrutamento, folha e compliance trabalhista sob medida para o varejo.",
      },
    ],
    accent: "blue",
  },
];

const vantagens = [
  {
    icon: TrendingDown,
    title: "Redução de custos operacionais",
    description:
      "Escala coletiva gera preços impossíveis de obter individualmente.",
  },
  {
    icon: ShieldCheck,
    title: "Parceiros auditados",
    description:
      "Todos os convênios passam por análise da ACOMAC antes de serem oferecidos.",
  },
  {
    icon: BadgePercent,
    title: "Condições exclusivas",
    description:
      "Descontos e tabelas que não são ofertados ao público geral.",
  },
];

export default function ConveniosPage() {
  const page = usePageContent("convenios");
  const hero = page?.hero;
  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: gridRef, inView: gridInView } = useInView(0.04);
  const { ref: vantRef, inView: vantInView } = useInView(0.15);

  return (
    <>
      <ClientSiteChrome pageKey="convenios">
      <main>
        {/* HERO */}
        <section
          className="relative pt-24 pb-20 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #002952 0%, #004a94 35%, #0059AB 60%, #0068c7 100%)",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div
            className="absolute top-[10%] right-[5%] w-[350px] h-[350px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(246,129,30,0.10) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            ref={heroRef}
            className="relative z-10 max-w-7xl mx-auto px-6"
            style={fadeIn(heroInView)}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {hero?.badge ?? "Convênios"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white max-w-4xl mb-6">
              {hero?.title ?? (
                <>
                  Parcerias e{" "}
                  <span className="relative inline-block" style={{ color: "#F6811E" }}>
                    convênios exclusivos
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                      style={{ backgroundColor: "#F6811E", opacity: 0.5 }}
                    />
                  </span>
                </>
              )}
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {hero?.subtitle ??
                "Benefícios negociados pela ACOMAC para reduzir os custos operacionais da sua empresa. Mais de 20 parcerias ativas em 8 categorias, auditadas e exclusivas para associados."}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { v: "20+", l: "Convênios ativos" },
                { v: "8", l: "Categorias" },
                { v: "55%", l: "Desconto máximo" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-3xl font-extrabold" style={{ color: "#F6811E" }}>
                    {s.v}
                  </p>
                  <p
                    className="text-[11px] font-semibold uppercase tracking-wider mt-1"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIAS EXPANDIDAS */}
        <section className="py-20 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-12">
            <div className="min-w-0">
            <div
              ref={gridRef}
              className="grid md:grid-cols-2 gap-5"
            >
              {categorias.map((c, i) => {
                const Icon = c.icon;
                const accentColor =
                  c.accent === "orange" ? "#F6811E" : "#0059AB";
                const accentBg =
                  c.accent === "orange"
                    ? "rgba(246,129,30,0.08)"
                    : "rgba(0,89,171,0.08)";
                return (
                  <article
                    key={c.category}
                    className="card-hover rounded-2xl p-7"
                    style={{
                      ...staggerStyle(gridInView, i, 0.04),
                      backgroundColor: "#fafafa",
                      border: "1px solid #eee",
                    }}
                  >
                    <div className="flex items-center gap-4 mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: accentBg }}
                      >
                        <Icon size={22} style={{ color: accentColor }} />
                      </div>
                      <div>
                        <h3
                          className="text-lg font-extrabold leading-tight"
                          style={{ color: "#111" }}
                        >
                          {c.category}
                        </h3>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "#888" }}
                        >
                          {c.description}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {c.partners.map((p) => (
                        <li
                          key={p.titulo}
                          className="flex items-start gap-3 p-4 rounded-xl bg-white"
                          style={{ border: "1px solid #f0f0f0" }}
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: accentBg }}
                          >
                            <Check
                              size={13}
                              strokeWidth={2.5}
                              style={{ color: accentColor }}
                            />
                          </div>
                          <div>
                            <p
                              className="text-sm font-bold mb-0.5"
                              style={{ color: "#222" }}
                            >
                              {p.titulo}
                            </p>
                            <p
                              className="text-[13px] leading-relaxed"
                              style={{ color: "#666" }}
                            >
                              {p.detalhe}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
            </div>
            <SponsorAside slot="convenios-categorias" />
          </div>
        </section>

        {/* VANTAGENS */}
        <section className="py-24" style={{ backgroundColor: "#fafafa" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={vantRef}
              className="text-center mb-14"
              style={fadeIn(vantInView)}
            >
              <div className="inline-flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-[3px] rounded-full"
                  style={{ backgroundColor: "#F6811E" }}
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: "#888" }}
                >
                  Por que os convênios funcionam
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: "#111" }}
              >
                A força coletiva gera preços únicos
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {vantagens.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div
                    key={v.title}
                    className="p-8 rounded-2xl bg-white"
                    style={{
                      ...staggerStyle(vantInView, i, 0.08),
                      border: "1px solid #eee",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: "rgba(246,129,30,0.12)" }}
                    >
                      <Icon size={22} style={{ color: "#F6811E" }} />
                    </div>
                    <h3
                      className="text-base font-extrabold mb-2"
                      style={{ color: "#111" }}
                    >
                      {v.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#666" }}
                    >
                      {v.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
      </ClientSiteChrome>
    </>
  );
}

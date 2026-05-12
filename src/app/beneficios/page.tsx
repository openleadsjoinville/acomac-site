"use client";

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
  CheckCircle2,
  Sparkles,
  FileText,
  UserPlus,
} from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import SponsorAside from "@/components/public/SponsorAside";
import { usePageContent } from "@/hooks/usePageContent";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

const benefits = [
  {
    icon: GraduationCap,
    title: "Capacitação e Cursos",
    description:
      "Mais de 40 cursos profissionalizantes por ano para toda a cadeia da construção.",
    highlights: [
      "Cursos presenciais e online",
      "Certificação reconhecida pelo setor",
      "Instrutores especializados com vivência de mercado",
      "Trilhas específicas para vendas, gestão e segurança",
    ],
    accent: "#F6811E",
  },
  {
    icon: Handshake,
    title: "Rodadas de Negócios",
    description:
      "Oportunidades de networking e fechamento de negócios com fornecedores.",
    highlights: [
      "Contato direto com fornecedores nacionais e regionais",
      "Condições comerciais exclusivas para associados",
      "Eventos periódicos na sede da ACOMAC",
      "Agenda estruturada com horários dedicados",
    ],
    accent: "#0059AB",
  },
  {
    icon: Scale,
    title: "Representação Setorial",
    description:
      "Defesa dos interesses do setor junto a órgãos públicos e entidades privadas.",
    highlights: [
      "Atuação política ativa em temas do varejo",
      "Negociações coletivas com sindicatos",
      "Voz no legislativo municipal e estadual",
      "Articulação com a ANAMACO em nível nacional",
    ],
    accent: "#F6811E",
  },
  {
    icon: BadgePercent,
    title: "Convênios Exclusivos",
    description:
      "Descontos e condições especiais em combustível, saúde, educação e crédito.",
    highlights: [
      "20+ parceiros ativos em 8 categorias",
      "Até 55% de desconto em EAD",
      "Planos de saúde empresariais",
      "Linhas de crédito com taxas diferenciadas",
    ],
    accent: "#0059AB",
  },
  {
    icon: BarChart3,
    title: "Pesquisa de Mercado",
    description:
      "Acesso a dados e pesquisas sobre o mercado de materiais de construção.",
    highlights: [
      "Relatórios mensais de preços e volumes",
      "Índices setoriais regionais",
      "Análise de tendências e comportamento de consumo",
      "Painéis comparativos entre associados",
    ],
    accent: "#F6811E",
  },
  {
    icon: Megaphone,
    title: "Eventos e Feiras",
    description:
      "Participação na FENAC e outros eventos que fortalecem o setor.",
    highlights: [
      "FENAC — Feira de Negócios ACOMAC, anual",
      "Feiras regionais em SC e no sul",
      "Encontros setoriais e palestras temáticas",
      "Delegações para grandes feiras nacionais",
    ],
    accent: "#0059AB",
  },
  {
    icon: HeartPulse,
    title: "Assistência Jurídica e Empresarial",
    description:
      "Planos de assistência jurídica, médica e empresarial com valores acessíveis.",
    highlights: [
      "Consultoria jurídica preventiva",
      "Assessoria trabalhista especializada",
      "Orientação tributária para varejistas",
      "Planos de saúde em grupo",
    ],
    accent: "#F6811E",
  },
  {
    icon: Network,
    title: "Networking Regional",
    description:
      "Conexão com empresários de 8 municípios do norte catarinense.",
    highlights: [
      "Comunidade ativa com 350 empresas",
      "Grupos temáticos por área de interesse",
      "Troca de experiências entre gerações",
      "Visitas técnicas entre associados",
    ],
    accent: "#0059AB",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "1. Cadastre sua empresa",
    description:
      "Preencha o formulário de interesse ou entre em contato pelo WhatsApp. Nossa equipe avalia o perfil e envia as condições.",
  },
  {
    icon: FileText,
    title: "2. Assine a adesão",
    description:
      "Após aprovação, você recebe o contrato de associação e as credenciais para acessar todos os benefícios.",
  },
  {
    icon: Sparkles,
    title: "3. Aproveite os benefícios",
    description:
      "Sua empresa passa a contar com cursos, convênios, eventos, pesquisas e representação imediatamente.",
  },
];

const faq = [
  {
    q: "Quais empresas podem se associar?",
    a: "Lojas de materiais de construção, home centers, depósitos, madeireiras e demais varejistas do setor nos municípios atendidos pela ACOMAC Joinville.",
  },
  {
    q: "Qual é o valor da mensalidade?",
    a: "A contribuição é proporcional ao porte da empresa e definida em assembleia. Entre em contato para receber a tabela atualizada de adesão.",
  },
  {
    q: "Os colaboradores têm acesso aos cursos?",
    a: "Sim. A associação vale para a empresa — todos os funcionários podem participar dos cursos da Academia da Construção em condições exclusivas.",
  },
  {
    q: "Posso cancelar a qualquer momento?",
    a: "Sim. A saída pode ser formalizada respeitando o aviso prévio previsto em contrato, sem multas ou taxas de rescisão.",
  },
];

const iconMapBeneficios: Record<string, typeof GraduationCap> = {
  GraduationCap,
  Handshake,
  Scale,
  BadgePercent,
  BarChart3,
  Megaphone,
  HeartPulse,
  Network,
};

export default function BeneficiosPage() {
  const page = usePageContent("beneficios");
  const hero = page?.hero;
  const categories = page?.categories;
  const ctaSection = page?.ctaSection;
  const list = categories && categories.length > 0
    ? categories.map((c, i) => ({
        icon: iconMapBeneficios[c.icon ?? ""] ?? GraduationCap,
        title: c.title,
        description: c.description,
        highlights: c.items ?? [],
        accent: i % 2 === 0 ? "#F6811E" : "#0059AB",
      }))
    : benefits;
  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: gridRef, inView: gridInView } = useInView(0.05);
  const { ref: stepsRef, inView: stepsInView } = useInView(0.15);
  const { ref: faqRef, inView: faqInView } = useInView(0.1);

  return (
    <>
      <ClientSiteChrome pageKey="beneficios">
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
                {hero?.badge ?? "Benefícios"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white max-w-4xl mb-6">
              {hero?.title ?? (
                <>
                  Por que se associar à{" "}
                  <span className="relative inline-block" style={{ color: "#F6811E" }}>
                    ACOMAC
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                      style={{ backgroundColor: "#F6811E", opacity: 0.5 }}
                    />
                  </span>
                  ?
                </>
              )}
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {hero?.subtitle ??
                "Mais de 40 benefícios exclusivos para impulsionar sua empresa no mercado da construção civil — capacitação, representação, convênios, eventos e networking regional."}
            </p>
          </div>
        </section>

        {/* BENEFITS GRID */}
        <section className="py-20 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-12">
            <div className="min-w-0">
            <div
              ref={gridRef}
              className="grid md:grid-cols-2 gap-5"
            >
              {list.map((b, i) => {
                const Icon = b.icon;
                return (
                  <article
                    key={b.title}
                    className="card-hover p-7 rounded-2xl"
                    style={{
                      ...staggerStyle(gridInView, i, 0.04),
                      backgroundColor: "#fafafa",
                      border: "1px solid #eee",
                    }}
                  >
                    <div className="flex items-start gap-4 mb-5">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${b.accent}18` }}
                      >
                        <Icon size={22} style={{ color: b.accent }} />
                      </div>
                      <div>
                        <h3
                          className="text-lg font-extrabold leading-tight mb-1.5"
                          style={{ color: "#111" }}
                        >
                          {b.title}
                        </h3>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "#666" }}
                        >
                          {b.description}
                        </p>
                      </div>
                    </div>
                    <ul className="space-y-2 pl-[62px]">
                      {b.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: "#444" }}
                        >
                          <CheckCircle2
                            size={15}
                            className="shrink-0 mt-0.5"
                            style={{ color: b.accent }}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </article>
                );
              })}
            </div>
            </div>
            <SponsorAside slot="beneficios-grid" />
          </div>
        </section>

        {/* HOW TO JOIN */}
        <section
          className="relative py-24 overflow-hidden"
          style={{ backgroundColor: "#fafafa" }}
        >
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={stepsRef}
              className="text-center mb-14"
              style={fadeIn(stepsInView)}
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
                  Como começar
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: "#111" }}
              >
                Três passos para sua empresa fazer parte
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {steps.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.title}
                    className="p-8 rounded-2xl bg-white relative"
                    style={{
                      ...staggerStyle(stepsInView, i, 0.08),
                      border: "1px solid #eee",
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: "rgba(0,89,171,0.1)" }}
                    >
                      <Icon size={22} style={{ color: "#0059AB" }} />
                    </div>
                    <h3
                      className="text-lg font-extrabold mb-2"
                      style={{ color: "#111" }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#666" }}
                    >
                      {s.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div
              ref={faqRef}
              className="mb-12"
              style={fadeIn(faqInView)}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-[3px] rounded-full"
                  style={{ backgroundColor: "#F6811E" }}
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: "#888" }}
                >
                  Perguntas frequentes
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: "#111" }}
              >
                Tire suas dúvidas antes de se associar
              </h2>
            </div>

            <div className="space-y-3">
              {faq.map((item, i) => (
                <details
                  key={item.q}
                  className="group rounded-xl p-5 cursor-pointer"
                  style={{
                    ...staggerStyle(faqInView, i, 0.04),
                    backgroundColor: "#fafafa",
                    border: "1px solid #eee",
                  }}
                >
                  <summary
                    className="flex items-center justify-between list-none text-base font-bold"
                    style={{ color: "#111" }}
                  >
                    {item.q}
                    <ArrowRight
                      size={16}
                      className="transition-transform group-open:rotate-90"
                      style={{ color: "#F6811E" }}
                    />
                  </summary>
                  <p
                    className="text-sm leading-relaxed mt-3"
                    style={{ color: "#555" }}
                  >
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

      </main>
      </ClientSiteChrome>
    </>
  );
}

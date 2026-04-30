"use client";

import {
  Target,
  Eye,
  Heart,
  MapPinned,
  ArrowRight,
  CheckCircle2,
  Users2,
  Crown,
  ShieldCheck,
} from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import SponsorAside from "@/components/public/SponsorAside";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

const pillars = [
  {
    icon: Target,
    title: "Missão",
    description:
      "Representar e fortalecer o setor varejista de materiais de construção, promovendo ações que proporcionem benefícios diretos e indiretos aos associados.",
    color: "#0059AB",
  },
  {
    icon: Eye,
    title: "Visão",
    description:
      "Ser referência nacional como associação do varejo de materiais de construção, reconhecida pela excelência em representatividade e geração de valor.",
    color: "#F6811E",
  },
  {
    icon: Heart,
    title: "Valores",
    description:
      "Ética, transparência, cooperação, inovação e compromisso com o desenvolvimento sustentável do setor da construção civil.",
    color: "#0059AB",
  },
];

const timeline = [
  {
    year: "1983",
    title: "Fundação",
    description:
      "Nasce a ACOMAC Joinville, reunindo lojistas do setor da construção civil em busca de representatividade coletiva.",
    accent: "#0059AB",
  },
  {
    year: "1990",
    title: "Sede própria",
    description:
      "Conquista da sede no bairro Costa e Silva — marco de solidez institucional e ponto de referência do setor na região.",
    accent: "#F6811E",
  },
  {
    year: "2000",
    title: "Academia da Construção",
    description:
      "Criação do programa de capacitação técnica e gerencial, formando profissionais para toda a cadeia produtiva.",
    accent: "#0059AB",
  },
  {
    year: "2010",
    title: "Expansão regional",
    description:
      "Ampliação da cobertura para 8 municípios do norte de Santa Catarina, consolidando atuação regional.",
    accent: "#F6811E",
  },
  {
    year: "Hoje",
    title: "Referência em SC",
    description:
      "Maior associação do varejo de materiais de construção do estado, com 350 empresas associadas.",
    accent: "#0059AB",
  },
];

const stats = [
  { value: "350", label: "Empresas associadas" },
  { value: "40+", label: "Anos de história" },
  { value: "8", label: "Municípios atendidos" },
  { value: "1.500m²", label: "De infraestrutura" },
];

const municipios = [
  "Joinville",
  "Jaraguá do Sul",
  "Araquari",
  "São Francisco do Sul",
  "São Bento do Sul",
  "Guaramirim",
  "Barra Velha",
  "Rio Negrinho",
];

type Membro = { role: string; name: string; highlight?: boolean };
type GrupoGestao = {
  id: string;
  title: string;
  subgroups?: { label: string; members: Membro[] }[];
  members?: Membro[];
};

const gestao: GrupoGestao[] = [
  {
    id: "conselho-diretor",
    title: "Conselho Diretor",
    members: [
      { role: "Presidente", name: "Marcos Arnaut", highlight: true },
      { role: "Vice-Presidente", name: "Robson Batista Ceolin", highlight: true },
      { role: "Vice-Presidente Administrativo", name: "Luciano Miquelute" },
      { role: "Vice-Presidente Financeiro", name: "Leo Alysson B. Domingos" },
      { role: "Vice-Presidente de Relações Públicas", name: "Bruno Bogo" },
      { role: "Vice-Presidente de Eventos", name: "Ivonei Arnaut" },
      { role: "Vice-Presidente de Patrimônio", name: "Thiago Fernando Campos" },
      { role: "Diretor Administrativo", name: "Fernando Henrique Besen" },
      { role: "Diretor de Eventos", name: "Jose Haveroth" },
      { role: "Diretor de Eventos", name: "Francine Clock" },
      { role: "Diretor de Eventos", name: "Rosinete Andre Campos Haveroth" },
      { role: "Diretor de Eventos", name: "Elizete Marta da Silva" },
      { role: "Diretor de Relações Públicas", name: "Isaldo Pimentel Pereira" },
      { role: "Diretor de Relações Públicas e Marketing", name: "Lucas Caetano" },
    ],
  },
  {
    id: "nucleo-representantes",
    title: "Núcleos Setoriais",
    members: [
      { role: "Presidente", name: "José Carlos Garcia Filho", highlight: true },
      { role: "Vice-Presidente", name: "Ingo Klug" },
      { role: "Conselheiro", name: "Denilson Rubira Peres" },
      { role: "Conselheiro", name: "Roberto Natale Abdalla Ferraz" },
      { role: "Conselheiro", name: "Jair Lemos" },
    ],
  },
  {
    id: "nucleo-jovem",
    title: "Núcleo Jovem",
    members: [
      { role: "Presidente", name: "Emmanuel Silva de Farias", highlight: true },
      { role: "Vice-Presidente", name: "Ivo Luan Randig" },
      { role: "Conselheiro", name: "Fernando Henrique Besen" },
      { role: "Conselheiro", name: "Alessandra Fettbach Syperreck" },
      { role: "Conselheiro", name: "José Augusto Machado Vaselevski" },
    ],
  },
  {
    id: "conselho-deliberativo",
    title: "Conselho Deliberativo",
    members: [
      { role: "Presidente", name: "Erico Miquelute", highlight: true },
      { role: "Vice-Presidente", name: "Vanderlei Reinert", highlight: true },
      { role: "Presidente Núcleo Representantes", name: "José Carlos Garcia Filho" },
      { role: "Presidente Núcleo Jovem", name: "Emmanuel Silva de Farias" },
      { role: "Presidente Núcleo Decormac", name: "Paulo César Suppi" },
      { role: "Membro Nato", name: "Angelo José Cani" },
      { role: "Membro Nato", name: "Romeu Retzlaff" },
      { role: "Membro Nato", name: "José Nivaldo Barbieri" },
      { role: "Membro Nato", name: "Valdemar Besen" },
      { role: "Membro Nato", name: "Afonso João Ramos" },
      { role: "Membro Nato", name: "Rudi Soares" },
      { role: "Membro Nato", name: "Ovídio Vaselevski" },
      { role: "Membro Nato", name: "Jose Haveroth" },
    ],
  },
  {
    id: "conselho-fiscal",
    title: "Conselho Fiscal",
    subgroups: [
      {
        label: "Titulares",
        members: [
          { role: "Conselheiro Fiscal", name: "Lindomar José Tezza" },
          { role: "Conselheiro Fiscal", name: "Valmir Deretti" },
          { role: "Conselheiro Fiscal", name: "Célio Amarildo Fernandes" },
        ],
      },
      {
        label: "Suplentes",
        members: [
          { role: "Conselheiro Fiscal — Suplente", name: "Vilmar Roque Strapazzon" },
          { role: "Conselheiro Fiscal — Suplente", name: "Orlando Uber" },
          { role: "Conselheiro Fiscal — Suplente", name: "Joanir Afonso Nardelli" },
        ],
      },
    ],
  },
  {
    id: "nucleo-decormac",
    title: "Núcleo Decormac",
    members: [
      { role: "Presidente", name: "Paulo Cesar Suppis", highlight: true },
      { role: "Vice-Presidente", name: "Thiago Rosendo Laufer" },
      { role: "Conselheiro", name: "Mirna Rubia da Silva Commandulli" },
      { role: "Conselheiro", name: "Caio Marcel Medeiros" },
      { role: "Conselheiro", name: "Reginaldo Diego Carniel" },
    ],
  },
];

function getInitials(name: string) {
  const parts = name.split(" ").filter((w) => w.length > 2);
  return parts
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function MemberCard({ m, i }: { m: Membro; i: number }) {
  const accent = i % 2 === 0 ? "#F6811E" : "#0059AB";
  const bgTint = i % 2 === 0 ? "rgba(246,129,30,0.10)" : "rgba(0,89,171,0.10)";
  return (
    <div
      className="p-4 rounded-xl bg-white flex items-center gap-3 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        border: m.highlight ? `1px solid ${accent}` : "1px solid #eee",
        boxShadow: m.highlight ? `0 6px 20px ${accent}18` : "none",
      }}
    >
      <div
        className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 text-sm font-extrabold"
        style={{
          backgroundColor: bgTint,
          color: accent,
        }}
      >
        {m.highlight ? (
          <Crown size={16} strokeWidth={2.2} />
        ) : (
          getInitials(m.name)
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-[10px] font-bold uppercase tracking-wider truncate"
          style={{ color: accent }}
        >
          {m.role}
        </p>
        <p
          className="text-sm font-bold truncate"
          style={{ color: "#111" }}
          title={m.name}
        >
          {m.name}
        </p>
      </div>
    </div>
  );
}

const estrutura = [
  {
    title: "Auditório para 120 pessoas",
    description: "Espaço para palestras, assembleias e eventos de grande porte.",
  },
  {
    title: "2 salas de treinamento equipadas",
    description: "Ambientes completos para cursos presenciais da Academia da Construção.",
  },
  {
    title: "Sala de reuniões executiva",
    description: "Estrutura para encontros diretivos, rodadas de negócios e acordos setoriais.",
  },
  {
    title: "Área de convivência e coffee",
    description: "Espaço para networking antes e após eventos, integrando associados.",
  },
];

import { usePageContent } from "@/hooks/usePageContent";

export default function SobrePage() {
  const page = usePageContent("sobre");
  const hero = page?.hero;
  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: statsRef, inView: statsInView } = useInView(0.2);
  const { ref: pillarsRef, inView: pillarsInView } = useInView(0.15);
  const { ref: timelineRef, inView: timelineInView } = useInView(0.08);
  const { ref: mapRef, inView: mapInView } = useInView(0.15);
  const { ref: estRef, inView: estInView } = useInView(0.15);
  const { ref: gestRef, inView: gestInView } = useInView(0.05);

  return (
    <>
      <ClientSiteChrome pageKey="sobre">
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
                {hero?.badge ?? "A ACOMAC"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white max-w-4xl mb-6">
              {hero?.title ?? (
                <>
                  Construindo o futuro do{" "}
                  <span className="relative inline-block" style={{ color: "#F6811E" }}>
                    varejo da construção
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                      style={{ backgroundColor: "#F6811E", opacity: 0.5 }}
                    />
                  </span>
                </>
              )}
            </h1>
            <p
              className="text-base md:text-lg leading-relaxed max-w-3xl"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {hero?.subtitle ??
                "A ACOMAC Joinville é a maior associação do varejo de materiais de construção de Santa Catarina. Fundada em 1983, nascemos da união de empresários que acreditavam na força coletiva para transformar o mercado."}
            </p>
          </div>
        </section>

        {/* STATS */}
        <section className="relative -mt-12 z-10 px-6">
          <div
            ref={statsRef}
            className="max-w-6xl mx-auto rounded-2xl p-8 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 24px 60px rgba(0,0,0,0.08)",
              border: "1px solid #eee",
            }}
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="text-center"
                style={staggerStyle(statsInView, i, 0.05)}
              >
                <p
                  className="text-3xl md:text-4xl font-extrabold"
                  style={{ color: "#0059AB" }}
                >
                  {s.value}
                </p>
                <p
                  className="text-[11px] font-semibold uppercase tracking-wider mt-2"
                  style={{ color: "#888" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* NOSSA HISTÓRIA */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "#888" }}
              >
                Nossa história
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-6"
              style={{ color: "#111" }}
            >
              Quatro décadas de compromisso com o varejo da construção
            </h2>
            <div
              className="text-base md:text-lg leading-relaxed space-y-5"
              style={{ color: "#555" }}
            >
              <p>
                A ACOMAC Joinville nasceu em 1983 pela mão de um grupo de
                empresários do varejo que perceberam que, juntos, teriam mais
                força para negociar com a indústria, formar profissionais e
                representar o setor diante do poder público.
              </p>
              <p>
                Ao longo de mais de quatro décadas, construímos uma trajetória
                de conquistas: capacitação profissional, representatividade,
                rodadas de negócios com a indústria e pesquisa de mercado que
                orienta decisões estratégicas.
              </p>
              <p>
                Hoje somos a maior associação do varejo de materiais de
                construção de Santa Catarina. Mais do que uma entidade, somos
                uma comunidade de empresários que acredita no crescimento
                coletivo e na valorização contínua do profissional do setor.
              </p>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section
          className="relative py-24 overflow-hidden"
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
            ref={timelineRef}
            className="relative z-10 max-w-5xl mx-auto px-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                Linha do tempo
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight text-white mb-14">
              Marcos que construíram nossa trajetória
            </h2>

            <ol className="relative border-l-2 border-white/15 ml-3">
              {timeline.map((m, i) => (
                <li
                  key={m.year}
                  className="relative pl-8 pb-10 last:pb-0"
                  style={staggerStyle(timelineInView, i, 0.05)}
                >
                  <span
                    className="absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4"
                    style={{
                      backgroundColor: m.accent,
                      boxShadow: `0 0 0 8px rgba(255,255,255,0.04)`,
                    }}
                  />
                  <div
                    className="text-xs font-bold uppercase tracking-[0.2em] mb-2"
                    style={{ color: m.accent }}
                  >
                    {m.year}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {m.title}
                  </h3>
                  <p
                    className="text-sm md:text-base leading-relaxed max-w-2xl"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {m.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PILARES */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={pillarsRef}
              className="text-center mb-14"
              style={fadeIn(pillarsInView)}
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
                  Pilares
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: "#111" }}
              >
                O que nos move todos os dias
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {pillars.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.title}
                    className="card-hover p-8 rounded-2xl"
                    style={{
                      ...staggerStyle(pillarsInView, i, 0.08),
                      backgroundColor: "#fafafa",
                      border: "1px solid #eee",
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                      style={{ backgroundColor: `${p.color}15` }}
                    >
                      <Icon size={24} style={{ color: p.color }} />
                    </div>
                    <h3
                      className="text-xl font-extrabold mb-3"
                      style={{ color: "#111" }}
                    >
                      {p.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#555" }}
                    >
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* GESTÃO */}
        <section
          className="py-24"
          style={{ backgroundColor: "#fafafa" }}
          id="gestao"
        >
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-12">
            <div className="min-w-0">
            <div
              ref={gestRef}
              className="text-center mb-14"
              style={fadeIn(gestInView)}
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
                  Gestão
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3"
                style={{ color: "#111" }}
              >
                Quem conduz a ACOMAC
              </h2>
              <p
                className="text-base leading-relaxed max-w-2xl mx-auto"
                style={{ color: "#666" }}
              >
                Empresários e profissionais eleitos pelos associados para
                representar o setor em diferentes frentes — institucional,
                fiscal, eventos e núcleos setoriais.
              </p>
            </div>

            <div className="space-y-12">
              {gestao.map((g, gi) => (
                <div key={g.id}>
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor:
                          gi % 2 === 0
                            ? "rgba(246,129,30,0.12)"
                            : "rgba(0,89,171,0.10)",
                      }}
                    >
                      <ShieldCheck
                        size={17}
                        style={{
                          color: gi % 2 === 0 ? "#F6811E" : "#0059AB",
                        }}
                      />
                    </div>
                    <h3
                      className="text-lg md:text-xl font-extrabold"
                      style={{ color: "#111" }}
                    >
                      {g.title}
                    </h3>
                  </div>

                  {g.subgroups ? (
                    <div className="space-y-8">
                      {g.subgroups.map((sg) => (
                        <div key={sg.label}>
                          <p
                            className="text-[11px] font-bold uppercase tracking-[0.2em] mb-3"
                            style={{ color: "#888" }}
                          >
                            {sg.label}
                          </p>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {sg.members.map((m, i) => (
                              <MemberCard
                                key={`${g.id}-${sg.label}-${i}`}
                                m={m}
                                i={i}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {g.members?.map((m, i) => (
                        <MemberCard key={`${g.id}-${i}`} m={m} i={i} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            </div>
            <SponsorAside slot="sobre-gestao" />
          </div>
        </section>

        {/* ATUAÇÃO REGIONAL */}
        <section className="py-24" style={{ backgroundColor: "#fafafa" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={mapRef}
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div style={fadeIn(mapInView)}>
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-[3px] rounded-full"
                    style={{ backgroundColor: "#F6811E" }}
                  />
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.25em]"
                    style={{ color: "#888" }}
                  >
                    Área de atuação
                  </span>
                </div>
                <h2
                  className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-5"
                  style={{ color: "#111" }}
                >
                  Presentes em <span style={{ color: "#0059AB" }}>8 municípios</span> do norte catarinense
                </h2>
                <p
                  className="text-base leading-relaxed mb-6"
                  style={{ color: "#555" }}
                >
                  Nossa atuação conecta empresários, fornecedores e profissionais
                  de uma das regiões mais dinâmicas da construção civil em Santa
                  Catarina. Essa presença regional fortalece negociações
                  coletivas, eventos e a representatividade do setor.
                </p>
                <a
                  href="/conecta-associados"
                  className="inline-flex items-center gap-2 text-sm font-bold transition-colors"
                  style={{ color: "#0059AB" }}
                >
                  Conheça os associados
                  <ArrowRight size={15} />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {municipios.map((m, i) => (
                  <div
                    key={m}
                    className="flex items-center gap-3 px-5 py-4 rounded-xl bg-white"
                    style={{
                      ...staggerStyle(mapInView, i, 0.04),
                      border: "1px solid #eee",
                    }}
                  >
                    <MapPinned size={16} style={{ color: "#F6811E" }} />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "#222" }}
                    >
                      {m}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ESTRUTURA */}
        <section className="py-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={estRef}
              className="text-center mb-14"
              style={fadeIn(estInView)}
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
                  Estrutura
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: "#111" }}
              >
                1.500m² de sede própria à disposição dos associados
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {estrutura.map((e, i) => (
                <div
                  key={e.title}
                  className="flex items-start gap-4 p-6 rounded-2xl"
                  style={{
                    ...staggerStyle(estInView, i, 0.05),
                    backgroundColor: "#fafafa",
                    border: "1px solid #eee",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(246,129,30,0.12)" }}
                  >
                    <CheckCircle2 size={20} style={{ color: "#F6811E" }} />
                  </div>
                  <div>
                    <h3
                      className="text-base font-extrabold mb-1"
                      style={{ color: "#111" }}
                    >
                      {e.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#666" }}
                    >
                      {e.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      </ClientSiteChrome>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Paintbrush,
  Wrench,
  Zap,
  HardHat,
  ShoppingCart,
  UserCog,
  Users,
  Forklift,
  Award,
  CalendarDays,
  Clock,
  MapPin,
  ArrowRight,
  Filter,
  Search,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import SponsorAside from "@/components/public/SponsorAside";
import { usePageContent } from "@/hooks/usePageContent";
import { useCollection } from "@/hooks/useCollection";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";
import { whatsappLink } from "@/lib/utils";

type DBCourse = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  price: string;
  image: string;
  ctaLabel?: string;
  ctaHref?: string;
};

const COURSE_ICONS = [Paintbrush, Wrench, Zap, HardHat, ShoppingCart, UserCog, Forklift, GraduationCap];

function autoCourseMessage(title: string): string {
  return `Olá! Tenho interesse no curso "${title}" da ACOMAC. Gostaria de receber mais informações sobre datas, valores e como me inscrever.`;
}

type Categoria = string;

type Curso = {
  icon: typeof Paintbrush;
  title: string;
  description: string;
  duration: string;
  category: string;
  level: "Básico" | "Intermediário" | "Avançado";
  image: string;
  turma?: string;
};

const IMG = "?w=800&h=600&fit=crop&q=80&auto=format";

const cursos: Curso[] = [
  {
    icon: Paintbrush,
    title: "Pintura Residencial",
    description:
      "Técnicas profissionais de pintura interna e externa com acabamento de qualidade, preparo de superfícies e escolha de produtos.",
    duration: "40h",
    category: "tecnico",
    level: "Básico",
    image: `https://images.unsplash.com/photo-1589939705384-5185137a7f0f${IMG}`,
    turma: "Próxima turma: Março/2026",
  },
  {
    icon: Wrench,
    title: "Hidráulica e Encanamento",
    description:
      "Instalações hidráulicas residenciais e comerciais conforme normas ABNT, soldas e testes de estanqueidade.",
    duration: "60h",
    category: "tecnico",
    level: "Intermediário",
    image: `https://images.unsplash.com/photo-1585704032915-c3400ca199e7${IMG}`,
    turma: "Próxima turma: Abril/2026",
  },
  {
    icon: Zap,
    title: "Elétrica Predial",
    description:
      "Instalações elétricas prediais seguindo todas as normas técnicas de segurança, quadros, circuitos e aterramento.",
    duration: "80h",
    category: "tecnico",
    level: "Intermediário",
    image: `https://images.unsplash.com/photo-1621905251189-08b45d6a269e${IMG}`,
    turma: "Próxima turma: Maio/2026",
  },
  {
    icon: HardHat,
    title: "Assentamento de Pisos",
    description:
      "Colocação profissional de pisos cerâmicos, porcelanatos e revestimentos com preparo de contrapiso e rejuntamento.",
    duration: "40h",
    category: "tecnico",
    level: "Básico",
    image: `https://images.unsplash.com/photo-1615971677499-5467cbab01c0${IMG}`,
    turma: "Próxima turma: Março/2026",
  },
  {
    icon: ShoppingCart,
    title: "Técnicas de Vendas",
    description:
      "Estratégias de vendas consultivas para o varejo da construção civil, atendimento e fechamento de negócios.",
    duration: "24h",
    category: "vendas",
    level: "Básico",
    image: `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d${IMG}`,
    turma: "Próxima turma: Abril/2026",
  },
  {
    icon: UserCog,
    title: "Gestão de Loja",
    description:
      "Administração eficiente de lojas de materiais de construção: estoque, compras, indicadores e rentabilidade.",
    duration: "32h",
    category: "gestao",
    level: "Avançado",
    image: `https://images.unsplash.com/photo-1542744173-8e7e53415bb0${IMG}`,
    turma: "Próxima turma: Maio/2026",
  },
  {
    icon: Users,
    title: "Liderança e RH",
    description:
      "Gestão de equipes e desenvolvimento de líderes no setor de materiais, clima organizacional e feedback.",
    duration: "24h",
    category: "gestao",
    level: "Intermediário",
    image: `https://images.unsplash.com/photo-1552664730-d307ca884978${IMG}`,
    turma: "Próxima turma: Junho/2026",
  },
  {
    icon: Forklift,
    title: "Operador de Empilhadeira",
    description:
      "Certificação NR-11 para operação segura de empilhadeiras e transpaleteiras, regras de circulação e manutenção.",
    duration: "16h",
    category: "seguranca",
    level: "Básico",
    image: `https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d${IMG}`,
    turma: "Próxima turma: Março/2026",
  },
  {
    icon: HardHat,
    title: "NR-35 Trabalho em Altura",
    description:
      "Capacitação obrigatória para trabalhos acima de 2 metros de altura, EPIs e análise preliminar de riscos.",
    duration: "8h",
    category: "seguranca",
    level: "Básico",
    image: `https://images.unsplash.com/photo-1504307651254-35680f356dfd${IMG}`,
    turma: "Turmas mensais",
  },
  {
    icon: ShoppingCart,
    title: "Negociação com Fornecedores",
    description:
      "Técnicas avançadas de negociação e gestão de compras para o varejo, condições comerciais e prazos.",
    duration: "16h",
    category: "vendas",
    level: "Avançado",
    image: `https://images.unsplash.com/photo-1450101499163-c8848c66ca85${IMG}`,
    turma: "Próxima turma: Abril/2026",
  },
];

const filtros: { key: Categoria; label: string }[] = [
  { key: "todos", label: "Todos" },
  { key: "tecnico", label: "Técnicos" },
  { key: "gestao", label: "Gestão" },
  { key: "vendas", label: "Vendas" },
  { key: "seguranca", label: "Segurança" },
];

const info = [
  {
    icon: Award,
    title: "Certificação reconhecida",
    description:
      "Todos os cursos emitem certificado válido em todo o território nacional.",
  },
  {
    icon: Users,
    title: "Instrutores especializados",
    description:
      "Profissionais com vivência de mercado e didática adaptada ao setor.",
  },
  {
    icon: GraduationCap,
    title: "Infraestrutura dedicada",
    description: "Duas salas equipadas na sede da ACOMAC em Joinville.",
  },
  {
    icon: CheckCircle2,
    title: "Preço especial para associados",
    description:
      "Valores diferenciados para empresas associadas e seus colaboradores.",
  },
];

export default function CursosPage() {
  const page = usePageContent("cursos");
  const hero = page?.hero;
  const dbCourses = useCollection<DBCourse>("/api/public/courses");
  const [categoria, setCategoria] = useState<Categoria>("todos");
  const [busca, setBusca] = useState("");

  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: gridRef, inView: gridInView } = useInView(0.05);
  const { ref: infoRef, inView: infoInView } = useInView(0.15);

  // Fonte: DB quando há cursos publicados, fallback pros hardcoded (para dev sem seed)
  const cursosSrc: (Curso & { ctaMessage?: string; ctaWhatsapp?: string })[] =
    dbCourses && dbCourses.length > 0
      ? dbCourses.map((c, i) => ({
          icon: COURSE_ICONS[i % COURSE_ICONS.length] as typeof Paintbrush,
          title: c.title,
          description: c.description,
          duration: c.duration || "—",
          category: c.category || "Geral",
          level:
            c.level === "Intermediário" || c.level === "Avançado"
              ? (c.level as Curso["level"])
              : "Básico",
          image: c.image,
          turma: c.price || undefined,
          ctaMessage: c.ctaLabel || autoCourseMessage(c.title),
          ctaWhatsapp: c.ctaHref || "",
        }))
      : cursos;

  // Categorias dinâmicas: geradas das categorias reais dos cursos + "Todos"
  const filtrosDinamicos: { key: Categoria; label: string }[] = [
    { key: "todos", label: "Todos" },
    ...Array.from(new Set(cursosSrc.map((c) => c.category)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map((c) => ({ key: c, label: c })),
  ];

  const lista = useMemo(() => {
    return cursosSrc.filter((c) => {
      const matchCat = categoria === "todos" || c.category === categoria;
      const termo = busca.trim().toLowerCase();
      const matchBusca =
        termo === "" ||
        c.title.toLowerCase().includes(termo) ||
        c.description.toLowerCase().includes(termo);
      return matchCat && matchBusca;
    });
  }, [categoria, busca, cursosSrc]);

  return (
    <>
      <ClientSiteChrome pageKey="cursos">
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
                {hero?.badge ?? "Academia da Construção"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white max-w-4xl mb-6">
              {hero?.title ?? (
                <>
                  Cursos profissionalizantes do{" "}
                  <span className="relative inline-block" style={{ color: "#F6811E" }}>
                    pedreiro ao gestor
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
                "Mais de 40 cursos por ano em quatro trilhas — técnico, gestão, vendas e segurança — formando profissionais para toda a cadeia produtiva do varejo da construção."}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
              {[
                { v: "40+", l: "Cursos por ano" },
                { v: "2", l: "Salas equipadas" },
                { v: "100%", l: "Foco no setor" },
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

        {/* FILTROS + LISTA */}
        <section className="py-20 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-12">
            <div className="min-w-0">
            <div className="relative max-w-xl mb-8">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#888" }}
              />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar curso..."
                className="form-input w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none"
                style={{
                  border: "1px solid #e5e5e5",
                  color: "#222",
                  backgroundColor: "#fafafa",
                }}
              />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Filter size={14} style={{ color: "#888" }} />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "#888" }}
              >
                Trilhas
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-10">
              {filtrosDinamicos.map((f) => {
                const ativa = f.key === categoria;
                return (
                  <button
                    key={f.key}
                    onClick={() => setCategoria(f.key)}
                    className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200"
                    style={{
                      backgroundColor: ativa ? "#0059AB" : "#f0f0f0",
                      color: ativa ? "#ffffff" : "#444",
                      boxShadow: ativa
                        ? "0 4px 16px rgba(0,89,171,0.25)"
                        : "none",
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <div
              ref={gridRef}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {lista.map((c, i) => {
                const Icon = c.icon;
                return (
                  <article
                    key={c.title}
                    className="card-hover group rounded-2xl overflow-hidden flex flex-col"
                    style={{
                      ...staggerStyle(gridInView, i, 0.04),
                      backgroundColor: "#ffffff",
                      border: "1px solid #eee",
                    }}
                  >
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                      <Image
                        src={c.image}
                        alt={c.title}
                        fill
                        sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        unoptimized
                      />
                      <span
                        className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full text-white"
                        style={{ backgroundColor: "#F6811E" }}
                      >
                        {c.level}
                      </span>
                      <span
                        className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.92)",
                          color: "#0059AB",
                        }}
                      >
                        <Clock size={11} />
                        {c.duration}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: "rgba(0,89,171,0.08)" }}
                        >
                          <Icon size={18} style={{ color: "#0059AB" }} />
                        </div>
                        <h3
                          className="text-base font-extrabold leading-tight"
                          style={{ color: "#111" }}
                        >
                          {c.title}
                        </h3>
                      </div>
                      <p
                        className="text-sm leading-relaxed mb-5 flex-1"
                        style={{ color: "#555" }}
                      >
                        {c.description}
                      </p>

                      {c.turma && (
                        <div
                          className="flex items-center gap-1.5 text-[12px] mb-4"
                          style={{ color: "#F6811E" }}
                        >
                          <CalendarDays size={12} />
                          {c.turma}
                        </div>
                      )}

                      <a
                        href={(() => {
                          const withCta = c as typeof c & { ctaWhatsapp?: string; ctaMessage?: string };
                          if (withCta.ctaMessage) {
                            const num = withCta.ctaWhatsapp?.replace(/\D/g, "");
                            if (num) return whatsappLink(num, withCta.ctaMessage);
                            return whatsappLink("5547991103681", withCta.ctaMessage);
                          }
                          return "/#contato";
                        })()}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-track="cursos_whatsapp_click"
                        data-track-label={c.title}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300"
                        style={{
                          backgroundColor: "#0059AB",
                          color: "#fff",
                        }}
                      >
                        Quero me inscrever
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>

            {lista.length === 0 && (
              <div
                className="mt-10 rounded-2xl p-12 text-center"
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px dashed #e0e0e0",
                }}
              >
                <p className="text-sm" style={{ color: "#777" }}>
                  Nenhum curso encontrado com esse filtro.
                </p>
              </div>
            )}
            </div>
            <SponsorAside slot="cursos-lista" />
          </div>
        </section>

        {/* INFO BLOCO */}
        <section className="py-24" style={{ backgroundColor: "#fafafa" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={infoRef}
              className="text-center mb-14"
              style={fadeIn(infoInView)}
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
                  Por que estudar na ACOMAC
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: "#111" }}
              >
                Uma academia construída com e para o varejo
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {info.map((it, i) => {
                const Icon = it.icon;
                return (
                  <div
                    key={it.title}
                    className="p-6 rounded-2xl bg-white"
                    style={{
                      ...staggerStyle(infoInView, i, 0.05),
                      border: "1px solid #eee",
                    }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: "rgba(246,129,30,0.12)" }}
                    >
                      <Icon size={20} style={{ color: "#F6811E" }} />
                    </div>
                    <h3
                      className="text-base font-extrabold mb-1.5"
                      style={{ color: "#111" }}
                    >
                      {it.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "#666" }}
                    >
                      {it.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div
              className="relative overflow-hidden rounded-2xl p-10 flex flex-col md:flex-row items-center justify-between gap-6"
              style={{
                background:
                  "linear-gradient(135deg, #0059AB 0%, #0068c7 100%)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />
              <div className="relative z-10 flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(246,129,30,0.2)" }}
                >
                  <CalendarDays size={24} style={{ color: "#F6811E" }} />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    Consulte a agenda completa
                  </h3>
                  <p
                    className="text-sm inline-flex items-center gap-1.5"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    <MapPin size={13} />
                    Sede ACOMAC — Joinville, SC
                  </p>
                </div>
              </div>
              <a
                href="/#contato"
                className="relative z-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold shrink-0"
                style={{
                  backgroundColor: "#F6811E",
                  color: "#fff",
                  boxShadow: "0 4px 24px rgba(246,129,30,0.3)",
                }}
              >
                Falar com a equipe
                <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

      </main>
      </ClientSiteChrome>
    </>
  );
}

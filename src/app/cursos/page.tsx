"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
  History,
} from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import SponsorAside from "@/components/public/SponsorAside";
import { usePageContent } from "@/hooks/usePageContent";
import { useCollection } from "@/hooks/useCollection";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";
import { whatsappLink } from "@/lib/utils";
import { resumo as resumir } from "@/lib/rich-text";

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
  startDate?: string | null;
  endDate?: string | null;
};

const COURSE_ICONS = [Paintbrush, Wrench, Zap, HardHat, ShoppingCart, UserCog, Forklift, GraduationCap];

/** "julho de 2026" — usado nas turmas já encerradas */
function mesAno(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(d);
}

type Categoria = string;

type Curso = {
  icon: typeof Paintbrush;
  slug: string;
  title: string;
  /** Texto cadastrado, usado na busca */
  description: string;
  /** Versão curta exibida no card */
  resumo: string;
  duration: string;
  category: string;
  level: "Básico" | "Intermediário" | "Avançado";
  image: string;
  turma?: string;
  /** Turma já encerrada: data em que aconteceu, em ms (para ordenar) */
  encerradoEm?: number;
  /** "julho de 2026" */
  encerradoLabel?: string;
};

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
  // ?all=1 traz também as turmas encerradas, separadas mais abaixo no histórico
  const dbCourses = useCollection<DBCourse>("/api/public/courses?all=1");
  const [categoria, setCategoria] = useState<Categoria>("todos");
  const [busca, setBusca] = useState("");

  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: gridRef, inView: gridInView } = useInView(0.05);
  const { ref: infoRef, inView: infoInView } = useInView(0.15);
  const { ref: histRef, inView: histInView } = useInView(0.05);

  // Fonte única: cursos publicados no painel admin. Nada de conteúdo fictício —
  // se não houver curso publicado, a página mostra o estado vazio.
  const carregando = dbCourses === null;

  const { cursosSrc, encerrados } = useMemo(() => {
    const agora = Date.now();
    const abertos: Curso[] = [];
    const passados: Curso[] = [];

    (dbCourses ?? []).forEach((c, i) => {
      const fim = c.endDate ? new Date(c.endDate).getTime() : null;
      const jaEncerrou = fim !== null && !Number.isNaN(fim) && fim < agora;
      // Data mostrada no histórico: preferimos o início da turma; sem ele, o fim
      const refData = c.startDate ?? c.endDate ?? null;

      const base: Curso = {
        icon: COURSE_ICONS[i % COURSE_ICONS.length] as typeof Paintbrush,
        slug: c.slug,
        title: c.title,
        description: c.description,
        // Card mostra a chamada curta; o texto completo fica em /cursos/[slug]
        resumo: resumir(c.description, 150),
        duration: c.duration || "—",
        category: c.category || "Geral",
        level:
          c.level === "Intermediário" || c.level === "Avançado"
            ? (c.level as Curso["level"])
            : "Básico",
        image: c.image,
        turma: c.price || undefined,
      };

      if (jaEncerrou) {
        passados.push({
          ...base,
          encerradoEm: fim ?? 0,
          encerradoLabel: refData ? mesAno(refData) : undefined,
        });
      } else {
        abertos.push(base);
      }
    });

    // Histórico do mais recente para o mais antigo
    passados.sort((a, b) => (b.encerradoEm ?? 0) - (a.encerradoEm ?? 0));

    return { cursosSrc: abertos, encerrados: passados };
  }, [dbCourses]);

  // Categorias dinâmicas: geradas das categorias reais dos cursos + "Todos"
  const filtrosDinamicos: { key: Categoria; label: string }[] = [
    { key: "todos", label: "Todos" },
    ...Array.from(new Set([...cursosSrc, ...encerrados].map((c) => c.category)))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))
      .map((c) => ({ key: c, label: c })),
  ];

  const filtrar = (arr: Curso[]) =>
    arr.filter((c) => {
      const matchCat = categoria === "todos" || c.category === categoria;
      const termo = busca.trim().toLowerCase();
      const matchBusca =
        termo === "" ||
        c.title.toLowerCase().includes(termo) ||
        c.description.toLowerCase().includes(termo);
      return matchCat && matchBusca;
    });

  const lista = useMemo(
    () => filtrar(cursosSrc),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoria, busca, cursosSrc]
  );
  const listaEncerrados = useMemo(
    () => filtrar(encerrados),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categoria, busca, encerrados]
  );

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
            {cursosSrc.length + encerrados.length > 0 && (
              <>
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
              </>
            )}

            <div
              ref={gridRef}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {lista.map((c, i) => {
                const Icon = c.icon;
                return (
                  <Link
                    key={c.slug || c.title}
                    href={`/cursos/${c.slug}`}
                    data-track="curso_card_click"
                    data-track-label={c.title}
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
                      {c.turma && (
                        <div
                          className="flex items-center gap-1.5 text-[12px] mb-3"
                          style={{ color: "#F6811E" }}
                        >
                          <CalendarDays size={12} />
                          {c.turma}
                        </div>
                      )}

                      {c.resumo && (
                        <p
                          className="text-[13px] leading-relaxed mb-4"
                          style={{
                            color: "#777",
                            display: "-webkit-box",
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {c.resumo}
                        </p>
                      )}

                      <span
                        className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300"
                        style={{
                          backgroundColor: "#0059AB",
                          color: "#fff",
                        }}
                      >
                        Saiba mais
                        <ArrowRight
                          size={14}
                          className="transition-transform duration-200 group-hover:translate-x-0.5"
                        />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {carregando && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden animate-pulse"
                    style={{ border: "1px solid #eee" }}
                  >
                    <div className="w-full aspect-[4/3]" style={{ backgroundColor: "#f0f0f0" }} />
                    <div className="p-6 space-y-4">
                      <div className="h-4 rounded w-4/5" style={{ backgroundColor: "#f0f0f0" }} />
                      <div className="h-10 rounded-xl" style={{ backgroundColor: "#f5f5f5" }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!carregando && lista.length === 0 && (
              <div
                className="rounded-2xl p-12 text-center"
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px dashed #e0e0e0",
                }}
              >
                {cursosSrc.length === 0 ? (
                  <>
                    <GraduationCap
                      size={28}
                      className="mx-auto mb-4"
                      style={{ color: "#bbb" }}
                    />
                    <p className="text-base font-bold mb-1.5" style={{ color: "#333" }}>
                      Nenhuma turma aberta no momento
                    </p>
                    <p className="text-sm mb-6" style={{ color: "#777" }}>
                      {encerrados.length > 0
                        ? "As turmas já realizadas estão logo abaixo. Estamos montando o próximo calendário — fale com a equipe para entrar na lista de espera."
                        : "Estamos preparando o próximo calendário de cursos. Fale com a equipe para saber das próximas turmas e entrar na lista de espera."}
                    </p>
                    <a
                      href={whatsappLink(
                        "5547991103681",
                        "Olá! Gostaria de saber quais cursos a ACOMAC vai oferecer nas próximas turmas."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-track="cursos_whatsapp_click"
                      data-track-label="lista-vazia"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[13px] font-bold"
                      style={{ backgroundColor: "#0059AB", color: "#fff" }}
                    >
                      Falar com a equipe
                      <ArrowRight size={14} />
                    </a>
                  </>
                ) : (
                  <p className="text-sm" style={{ color: "#777" }}>
                    {listaEncerrados.length > 0
                      ? "Nenhuma turma aberta com esse filtro — veja abaixo as que já foram realizadas."
                      : "Nenhum curso encontrado com esse filtro."}
                  </p>
                )}
              </div>
            )}

            {/* HISTÓRICO — turmas que já aconteceram */}
            {!carregando && listaEncerrados.length > 0 && (
              <div
                ref={histRef}
                className={cursosSrc.length > 0 ? "mt-20" : "mt-16"}
              >
                <div
                  className="pt-10"
                  style={{ borderTop: "1px solid #eee" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <History size={15} style={{ color: "#888" }} />
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.2em]"
                      style={{ color: "#888" }}
                    >
                      Já realizados
                    </span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2"
                    style={{ color: "#111" }}
                  >
                    Turmas que já aconteceram
                  </h2>
                  <p className="text-sm max-w-2xl mb-8" style={{ color: "#666" }}>
                    Estes cursos <strong>já foram encerrados</strong> e não estão com
                    inscrições abertas. Ficam aqui como registro do que a Academia da
                    Construção realizou — se algum te interessa, avise a equipe e você
                    entra na lista da próxima turma.
                  </p>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {listaEncerrados.map((c, i) => {
                      const Icon = c.icon;
                      return (
                        <Link
                          key={`${c.slug || c.title}-${i}`}
                          href={`/cursos/${c.slug}`}
                          data-track="curso_card_click"
                          data-track-label={`encerrado:${c.title}`}
                          className="group rounded-2xl overflow-hidden flex flex-col"
                          style={{
                            ...staggerStyle(histInView, i, 0.04),
                            backgroundColor: "#fafafa",
                            border: "1px solid #ececec",
                          }}
                        >
                          <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                            <Image
                              src={c.image}
                              alt={c.title}
                              fill
                              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                              className="object-cover transition-all duration-500"
                              style={{ filter: "grayscale(1)", opacity: 0.55 }}
                              unoptimized
                            />
                            <span
                              className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor: "rgba(17,17,17,0.82)",
                                color: "#fff",
                              }}
                            >
                              <CheckCircle2 size={11} />
                              Turma encerrada
                            </span>
                          </div>

                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-center gap-2.5 mb-2">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                              >
                                <Icon size={15} style={{ color: "#777" }} />
                              </div>
                              <h3
                                className="text-[15px] font-extrabold leading-tight"
                                style={{ color: "#333" }}
                              >
                                {c.title}
                              </h3>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                              {c.encerradoLabel && (
                                <span
                                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold"
                                  style={{ color: "#777" }}
                                >
                                  <CalendarDays size={12} />
                                  Realizado em {c.encerradoLabel}
                                </span>
                              )}
                              <span
                                className="inline-flex items-center gap-1.5 text-[12px]"
                                style={{ color: "#999" }}
                              >
                                <Clock size={12} />
                                {c.duration}
                              </span>
                            </div>

                            <span
                              className="mt-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-300"
                              style={{
                                backgroundColor: "#fff",
                                color: "#0059AB",
                                border: "1px solid #d8e3f0",
                              }}
                            >
                              Ver detalhes da turma
                              <ArrowRight
                                size={14}
                                className="transition-transform duration-200 group-hover:translate-x-0.5"
                              />
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
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
              <Link
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
              </Link>
            </div>
          </div>
        </section>

      </main>
      </ClientSiteChrome>
    </>
  );
}

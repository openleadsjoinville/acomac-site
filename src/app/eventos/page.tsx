"use client";

import Image from "next/image";
import {
  Star,
  Handshake,
  Rocket,
  Users,
  Trophy,
  CalendarDays,
  MapPin,
  ArrowRight,
  Clock,
  Ticket,
  MessageCircle,
} from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import SponsorAside from "@/components/public/SponsorAside";
import { usePageContent } from "@/hooks/usePageContent";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

const IMG = "?w=1200&h=800&fit=crop&q=80&auto=format";

const featured = {
  icon: Star,
  title: "FENAC 2025",
  subtitle: "Feira de Negócios ACOMAC",
  description:
    "O maior evento do varejo da construção civil de Santa Catarina. Três dias de negócios, networking, palestras e oportunidades reais com as principais marcas do setor.",
  date: "21–23 Out 2025",
  location: "Joinville, SC",
  tags: ["Rodadas de Negócios", "Palestras", "Networking"],
  image: `https://images.unsplash.com/photo-1540575467063-178a50c2df87${IMG}`,
  programa: [
    {
      dia: "Dia 1 — 21/10",
      titulo: "Abertura e rodadas",
      itens: [
        "Cerimônia de abertura com autoridades do setor",
        "Primeiras rodadas de negócios com a indústria",
        "Coquetel de boas-vindas aos associados",
      ],
    },
    {
      dia: "Dia 2 — 22/10",
      titulo: "Palestras e lançamentos",
      itens: [
        "Painel sobre tendências do varejo da construção",
        "Apresentação de lançamentos exclusivos",
        "Espaço de networking entre associados e fornecedores",
      ],
    },
    {
      dia: "Dia 3 — 23/10",
      titulo: "Premiação e encerramento",
      itens: [
        "Entrega do Prêmio João-de-Barro",
        "Rodadas finais de negociação",
        "Jantar de encerramento",
      ],
    },
  ],
};

const eventos = [
  {
    icon: Handshake,
    title: "Rodadas de Negócios",
    subtitle: "Encontros diretos",
    description:
      "Encontros periódicos entre associados e fornecedores para geração de negócios diretos e condições exclusivas. Agenda estruturada com horários dedicados.",
    date: "Mensal",
    location: "Sede ACOMAC",
    tags: ["Fornecedores", "Negociação"],
    accent: "#0059AB",
    image: `https://images.unsplash.com/photo-1556761175-5973dc0f32e7${IMG}`,
  },
  {
    icon: Rocket,
    title: "Sucesso é Lançar Aqui",
    subtitle: "Lançamentos em primeira mão",
    description:
      "Programa que traz lançamentos de produtos em primeira mão para os associados ACOMAC antes do mercado. Avaliação coletiva e feedback direto à indústria.",
    date: "Periódico",
    location: "Sede ACOMAC",
    tags: ["Lançamentos", "Exclusivo"],
    accent: "#0059AB",
    image: `https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1${IMG}`,
  },
  {
    icon: Users,
    title: "Encontro com o Fornecedor",
    subtitle: "Indústria & Varejo",
    description:
      "Oportunidade de conhecer lançamentos e negociar condições especiais diretamente com a indústria. Foco em parcerias estratégicas de longo prazo.",
    date: "Bimestral",
    location: "Sede ACOMAC",
    tags: ["Indústria", "Condições especiais"],
    accent: "#F6811E",
    image: `https://images.unsplash.com/photo-1559136555-9303baea8ebd${IMG}`,
  },
  {
    icon: Trophy,
    title: "Prêmio João-de-Barro",
    subtitle: "Reconhecimento do setor",
    description:
      "Premiação anual que reconhece e homenageia os destaques do setor de materiais de construção da região em categorias como inovação, gestão e responsabilidade social.",
    date: "Anual",
    location: "Joinville, SC",
    tags: ["Premiação", "Homenagem"],
    accent: "#0059AB",
    image: `https://images.unsplash.com/photo-1567521464027-f127ff144326${IMG}`,
  },
];

const calendario = [
  { mes: "Março", evento: "Rodada de Negócios — Indústria de Tintas", data: "14/03" },
  { mes: "Abril", evento: "Encontro com o Fornecedor — Elétrica", data: "09/04" },
  { mes: "Maio", evento: "Sucesso é Lançar Aqui — Pisos", data: "15/05" },
  { mes: "Junho", evento: "Rodada de Negócios — Hidráulica", data: "12/06" },
  { mes: "Agosto", evento: "Encontro com o Fornecedor — Ferragens", data: "14/08" },
  { mes: "Outubro", evento: "FENAC 2025 — 3 dias", data: "21–23/10" },
];

export default function EventosPage() {
  const page = usePageContent("eventos");
  const hero = page?.hero;
  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: featRef, inView: featInView } = useInView(0.1);
  const { ref: gridRef, inView: gridInView } = useInView(0.05);
  const { ref: calRef, inView: calInView } = useInView(0.1);

  return (
    <>
      <ClientSiteChrome pageKey="eventos">
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
                {hero?.badge ?? "Eventos"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white max-w-4xl mb-6">
              {hero?.title ?? (
                <>
                  Eventos que{" "}
                  <span className="relative inline-block" style={{ color: "#F6811E" }}>
                    aproximam o setor
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
                "Oportunidades reais de networking, negócios e crescimento para sua empresa. Da FENAC às rodadas mensais, cada encontro fortalece a rede do varejo da construção em Santa Catarina."}
            </p>
          </div>
        </section>

        {/* FEATURED — FENAC */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div
              ref={featRef}
              className="rounded-3xl overflow-hidden grid lg:grid-cols-2"
              style={{
                ...fadeIn(featInView),
                background:
                  "linear-gradient(135deg, #002952 0%, #0059AB 100%)",
              }}
            >
              <div className="relative aspect-video lg:aspect-auto lg:min-h-[520px]">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(0,41,82,0.55) 0%, rgba(0,41,82,0.15) 100%)",
                  }}
                />
              </div>

              <div className="p-10 md:p-14 flex flex-col justify-center">
                <span
                  className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full self-start mb-5"
                  style={{
                    backgroundColor: "rgba(246,129,30,0.2)",
                    color: "#F6811E",
                  }}
                >
                  <Star size={11} />
                  Evento principal
                </span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-2">
                  {featured.title}
                </h2>
                <p
                  className="text-base md:text-lg mb-5"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  {featured.subtitle}
                </p>
                <p
                  className="text-sm md:text-base leading-relaxed mb-6"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {featured.description}
                </p>

                <div className="flex flex-wrap gap-4 mb-6 text-sm text-white/80">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={15} />
                    {featured.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={15} />
                    {featured.location}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  {featured.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href="/#contato"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300"
                    style={{
                      backgroundColor: "#F6811E",
                      color: "#fff",
                      boxShadow: "0 4px 24px rgba(246,129,30,0.3)",
                    }}
                  >
                    <Ticket size={15} />
                    Garantir participação
                    <ArrowRight size={15} />
                  </a>
                </div>
              </div>
            </div>

            {/* PROGRAMA */}
            <div className="mt-12 grid md:grid-cols-3 gap-5">
              {featured.programa.map((p, i) => (
                <div
                  key={p.dia}
                  className="p-6 rounded-2xl"
                  style={{
                    ...staggerStyle(featInView, i, 0.08),
                    backgroundColor: "#fafafa",
                    border: "1px solid #eee",
                  }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: "#F6811E" }}
                  >
                    {p.dia}
                  </span>
                  <h3
                    className="text-base font-extrabold mt-2 mb-4"
                    style={{ color: "#111" }}
                  >
                    {p.titulo}
                  </h3>
                  <ul className="space-y-2.5">
                    {p.itens.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-2 text-sm"
                        style={{ color: "#555" }}
                      >
                        <Clock
                          size={13}
                          className="shrink-0 mt-0.5"
                          style={{ color: "#0059AB" }}
                        />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUTROS EVENTOS */}
        <section className="py-20" style={{ backgroundColor: "#fafafa" }}>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-[1fr_200px] gap-12">
            <div className="min-w-0">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-[3px] rounded-full"
                  style={{ backgroundColor: "#F6811E" }}
                />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.25em]"
                  style={{ color: "#888" }}
                >
                  Agenda permanente
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: "#111" }}
              >
                Programas que acontecem o ano inteiro
              </h2>
            </div>

            <div
              ref={gridRef}
              className="grid md:grid-cols-2 gap-5"
            >
              {eventos.map((e, i) => {
                const Icon = e.icon;
                return (
                  <article
                    key={e.title}
                    className="card-hover group rounded-2xl overflow-hidden bg-white flex flex-col"
                    style={{
                      ...staggerStyle(gridInView, i, 0.05),
                      border: "1px solid #eee",
                    }}
                  >
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                      <Image
                        src={e.image}
                        alt={e.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        unoptimized
                      />
                      <span
                        className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full text-white"
                        style={{ backgroundColor: e.accent }}
                      >
                        {e.date}
                      </span>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${e.accent}15` }}
                        >
                          <Icon size={20} style={{ color: e.accent }} />
                        </div>
                        <div>
                          <h3
                            className="text-lg font-extrabold leading-tight"
                            style={{ color: "#111" }}
                          >
                            {e.title}
                          </h3>
                          <p className="text-xs" style={{ color: "#888" }}>
                            {e.subtitle}
                          </p>
                        </div>
                      </div>
                      <p
                        className="text-sm leading-relaxed mb-5 flex-1"
                        style={{ color: "#555" }}
                      >
                        {e.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {e.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-semibold px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: "#f0f0f0",
                              color: "#555",
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div
                        className="flex items-center gap-1.5 text-[12px]"
                        style={{ color: "#888" }}
                      >
                        <MapPin size={12} />
                        {e.location}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            </div>
            <SponsorAside slot="eventos-outros" />
          </div>
        </section>

        {/* CALENDÁRIO */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-6">
            <div
              ref={calRef}
              className="mb-10"
              style={fadeIn(calInView)}
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
                  Próximos eventos
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: "#111" }}
              >
                Agenda 2025
              </h2>
            </div>

            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid #eee" }}
            >
              {calendario.map((it, i) => (
                <div
                  key={it.evento}
                  className="flex items-center justify-between px-6 py-5"
                  style={{
                    ...staggerStyle(calInView, i, 0.03),
                    backgroundColor: i % 2 === 0 ? "#fafafa" : "#fff",
                    borderBottom:
                      i === calendario.length - 1 ? "none" : "1px solid #eee",
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className="w-16 text-center rounded-lg py-2"
                      style={{
                        backgroundColor: "rgba(0,89,171,0.08)",
                      }}
                    >
                      <p
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: "#0059AB" }}
                      >
                        {it.mes}
                      </p>
                      <p
                        className="text-lg font-extrabold leading-none mt-0.5"
                        style={{ color: "#0059AB" }}
                      >
                        {it.data.split("/")[0].replace("–", "/")}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-sm font-bold"
                        style={{ color: "#111" }}
                      >
                        {it.evento}
                      </p>
                      <p
                        className="text-[12px] mt-0.5"
                        style={{ color: "#888" }}
                      >
                        {it.data}
                      </p>
                    </div>
                  </div>
                  <a
                    href="/#contato"
                    className="text-[13px] font-bold inline-flex items-center gap-1.5"
                    style={{ color: "#F6811E" }}
                  >
                    Inscrever
                    <ArrowRight size={13} />
                  </a>
                </div>
              ))}
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
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                  Quer expor ou participar dos eventos?
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  Condições especiais para associados e fornecedores parceiros.
                </p>
              </div>
              <a
                href="https://wa.me/554734350660"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold shrink-0"
                style={{
                  backgroundColor: "#F6811E",
                  color: "#fff",
                  boxShadow: "0 4px 24px rgba(246,129,30,0.3)",
                }}
              >
                <MessageCircle size={15} />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </section>

      </main>
      </ClientSiteChrome>
    </>
  );
}

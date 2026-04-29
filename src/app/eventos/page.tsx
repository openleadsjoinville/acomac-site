"use client";

import Image from "next/image";
import {
  Star,
  CalendarDays,
  MapPin,
  ArrowRight,
  Ticket,
  MessageCircle,
  CalendarRange,
  History,
} from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import SponsorAside from "@/components/public/SponsorAside";
import { usePageContent } from "@/hooks/usePageContent";
import { useCollection } from "@/hooks/useCollection";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";
import { whatsappLink } from "@/lib/utils";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=800&fit=crop&q=80&auto=format";

type DBEvent = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  endDate: string | null;
  location: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
};

const MONTHS_PT = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatRange(date: string, endDate: string | null): string {
  const d1 = new Date(date);
  if (Number.isNaN(d1.getTime())) return "";
  const dd1 = d1.getDate().toString().padStart(2, "0");
  const m1 = MONTHS_PT[d1.getMonth()].slice(0, 3);
  const y1 = d1.getFullYear();

  if (!endDate) return `${dd1} ${m1} ${y1}`;
  const d2 = new Date(endDate);
  if (Number.isNaN(d2.getTime())) return `${dd1} ${m1} ${y1}`;
  const dd2 = d2.getDate().toString().padStart(2, "0");
  const m2 = MONTHS_PT[d2.getMonth()].slice(0, 3);
  const y2 = d2.getFullYear();

  if (y1 === y2 && m1 === m2) return `${dd1}–${dd2} ${m1} ${y1}`;
  if (y1 === y2) return `${dd1} ${m1} – ${dd2} ${m2} ${y1}`;
  return `${dd1} ${m1} ${y1} – ${dd2} ${m2} ${y2}`;
}

function formatShortMonthDay(date: string): { mes: string; dia: string } {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return { mes: "—", dia: "—" };
  return {
    mes: MONTHS_PT[d.getMonth()],
    dia: d.getDate().toString().padStart(2, "0"),
  };
}

function eventIsPast(ev: DBEvent, now: Date): boolean {
  const ref = ev.endDate ? new Date(ev.endDate) : new Date(ev.date);
  return ref.getTime() < now.getTime();
}

export default function EventosPage() {
  const page = usePageContent("eventos");
  const hero = page?.hero;
  const dbEvents = useCollection<DBEvent>("/api/public/events?all=1");

  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: featRef, inView: featInView } = useInView(0.1);
  const { ref: gridRef, inView: gridInView } = useInView(0.05);
  const { ref: calRef, inView: calInView } = useInView(0.1);
  const { ref: pastRef, inView: pastInView } = useInView(0.05);

  const now = new Date();
  const events = dbEvents ?? [];

  const featuredEvent =
    events.find((e) => e.featured && !eventIsPast(e, now)) ??
    events.find((e) => e.featured) ??
    null;

  const upcoming = events
    .filter((e) => !eventIsPast(e, now) && e.id !== featuredEvent?.id)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = events
    .filter((e) => eventIsPast(e, now) && e.id !== featuredEvent?.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const ctaWhatsapp = "5547991103681";
  const ctaMessage = "Olá! Tenho interesse em participar dos eventos da ACOMAC.";

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
                    <span
                      className="relative inline-block"
                      style={{ color: "#F6811E" }}
                    >
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

          {/* FEATURED */}
          {featuredEvent && (
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
                      src={featuredEvent.image || FALLBACK_IMG}
                      alt={featuredEvent.title}
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
                    <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5">
                      {featuredEvent.title}
                    </h2>
                    <p
                      className="text-sm md:text-base leading-relaxed mb-6"
                      style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                      {featuredEvent.description}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-8 text-sm text-white/80">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={15} />
                        {formatRange(featuredEvent.date, featuredEvent.endDate)}
                      </span>
                      {featuredEvent.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin size={15} />
                          {featuredEvent.location}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={
                          featuredEvent.ctaHref ||
                          whatsappLink(
                            ctaWhatsapp,
                            `Olá! Tenho interesse no evento "${featuredEvent.title}".`
                          )
                        }
                        target={featuredEvent.ctaHref ? "_self" : "_blank"}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300"
                        style={{
                          backgroundColor: "#F6811E",
                          color: "#fff",
                          boxShadow: "0 4px 24px rgba(246,129,30,0.3)",
                        }}
                      >
                        <Ticket size={15} />
                        {featuredEvent.ctaLabel || "Garantir participação"}
                        <ArrowRight size={15} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* PRÓXIMOS EVENTOS */}
          <section
            className="py-20"
            style={{ backgroundColor: "#fafafa" }}
          >
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
                      Próximos eventos
                    </span>
                  </div>
                  <h2
                    className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                    style={{ color: "#111" }}
                  >
                    Agenda da ACOMAC
                  </h2>
                </div>

                {upcoming.length === 0 ? (
                  <div
                    className="rounded-2xl p-10 text-center"
                    style={{
                      backgroundColor: "#fff",
                      border: "1px dashed #ddd",
                      color: "#666",
                    }}
                  >
                    <CalendarRange
                      size={28}
                      className="mx-auto mb-3"
                      style={{ color: "#0059AB" }}
                    />
                    <p className="text-sm">
                      Nenhum evento agendado no momento. Volte em breve.
                    </p>
                  </div>
                ) : (
                  <div ref={gridRef} className="grid md:grid-cols-2 gap-5">
                    {upcoming.map((e, i) => {
                      const { mes, dia } = formatShortMonthDay(e.date);
                      return (
                        <article
                          key={e.id}
                          className="card-hover group rounded-2xl overflow-hidden bg-white flex flex-col"
                          style={{
                            ...staggerStyle(gridInView, i, 0.05),
                            border: "1px solid #eee",
                          }}
                        >
                          <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                            <Image
                              src={e.image || FALLBACK_IMG}
                              alt={e.title}
                              fill
                              sizes="(min-width: 768px) 50vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                              unoptimized
                            />
                            <span
                              className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full text-white"
                              style={{ backgroundColor: "#0059AB" }}
                            >
                              {mes.slice(0, 3)} {dia}
                            </span>
                          </div>

                          <div className="p-6 flex flex-col flex-1">
                            <h3
                              className="text-lg font-extrabold leading-tight mb-2"
                              style={{ color: "#111" }}
                            >
                              {e.title}
                            </h3>
                            <p
                              className="text-sm leading-relaxed mb-5 flex-1"
                              style={{ color: "#555" }}
                            >
                              {e.description}
                            </p>

                            <div className="flex flex-wrap gap-3 text-[12px] mb-4" style={{ color: "#666" }}>
                              <span className="inline-flex items-center gap-1.5">
                                <CalendarDays size={12} />
                                {formatRange(e.date, e.endDate)}
                              </span>
                              {e.location && (
                                <span className="inline-flex items-center gap-1.5">
                                  <MapPin size={12} />
                                  {e.location}
                                </span>
                              )}
                            </div>

                            <a
                              href={
                                e.ctaHref ||
                                whatsappLink(
                                  ctaWhatsapp,
                                  `Olá! Tenho interesse no evento "${e.title}".`
                                )
                              }
                              target={e.ctaHref ? "_self" : "_blank"}
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[13px] font-bold self-start"
                              style={{ color: "#F6811E" }}
                            >
                              {e.ctaLabel || "Quero participar"}
                              <ArrowRight size={13} />
                            </a>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
              <SponsorAside slot="eventos-outros" />
            </div>
          </section>

          {/* CALENDÁRIO LISTAGEM */}
          {upcoming.length > 0 && (
            <section className="py-24 bg-white">
              <div className="max-w-5xl mx-auto px-6">
                <div ref={calRef} className="mb-10" style={fadeIn(calInView)}>
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-[3px] rounded-full"
                      style={{ backgroundColor: "#F6811E" }}
                    />
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.25em]"
                      style={{ color: "#888" }}
                    >
                      Calendário
                    </span>
                  </div>
                  <h2
                    className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                    style={{ color: "#111" }}
                  >
                    Próximas datas
                  </h2>
                </div>

                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: "1px solid #eee" }}
                >
                  {upcoming.map((it, i) => {
                    const { mes, dia } = formatShortMonthDay(it.date);
                    return (
                      <div
                        key={it.id}
                        className="flex items-center justify-between px-6 py-5"
                        style={{
                          ...staggerStyle(calInView, i, 0.03),
                          backgroundColor: i % 2 === 0 ? "#fafafa" : "#fff",
                          borderBottom:
                            i === upcoming.length - 1
                              ? "none"
                              : "1px solid #eee",
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
                              {mes.slice(0, 3)}
                            </p>
                            <p
                              className="text-lg font-extrabold leading-none mt-0.5"
                              style={{ color: "#0059AB" }}
                            >
                              {dia}
                            </p>
                          </div>
                          <div>
                            <p
                              className="text-sm font-bold"
                              style={{ color: "#111" }}
                            >
                              {it.title}
                            </p>
                            <p
                              className="text-[12px] mt-0.5"
                              style={{ color: "#888" }}
                            >
                              {formatRange(it.date, it.endDate)}
                              {it.location ? ` · ${it.location}` : ""}
                            </p>
                          </div>
                        </div>
                        <a
                          href={
                            it.ctaHref ||
                            whatsappLink(
                              ctaWhatsapp,
                              `Olá! Tenho interesse no evento "${it.title}".`
                            )
                          }
                          target={it.ctaHref ? "_self" : "_blank"}
                          rel="noopener noreferrer"
                          className="text-[13px] font-bold inline-flex items-center gap-1.5"
                          style={{ color: "#F6811E" }}
                        >
                          Inscrever
                          <ArrowRight size={13} />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* EVENTOS ANTERIORES */}
          {past.length > 0 && (
            <section
              className="py-20"
              style={{ backgroundColor: "#fafafa" }}
            >
              <div className="max-w-7xl mx-auto px-6">
                <div
                  ref={pastRef}
                  className="mb-10"
                  style={fadeIn(pastInView)}
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
                      <History size={11} className="inline mr-1.5 align-[-1px]" />
                      Eventos anteriores
                    </span>
                  </div>
                  <h2
                    className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                    style={{ color: "#111" }}
                  >
                    Já realizados
                  </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  {past.map((e, i) => (
                    <article
                      key={e.id}
                      className="rounded-2xl overflow-hidden bg-white"
                      style={{
                        ...staggerStyle(pastInView, i, 0.04),
                        border: "1px solid #eee",
                        opacity: 0.92,
                      }}
                    >
                      <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
                        <Image
                          src={e.image || FALLBACK_IMG}
                          alt={e.title}
                          fill
                          sizes="(min-width: 768px) 33vw, 100vw"
                          className="object-cover"
                          unoptimized
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(0deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 60%)",
                          }}
                        />
                      </div>
                      <div className="p-5">
                        <h3
                          className="text-base font-extrabold leading-tight mb-1.5"
                          style={{ color: "#111" }}
                        >
                          {e.title}
                        </h3>
                        <p className="text-[12px]" style={{ color: "#888" }}>
                          {formatRange(e.date, e.endDate)}
                          {e.location ? ` · ${e.location}` : ""}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CTA */}
          <section className="pb-24 bg-white pt-12">
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
                  href={whatsappLink(ctaWhatsapp, ctaMessage)}
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

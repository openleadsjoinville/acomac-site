"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Instagram,
  Facebook,
  MessageCircle,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

const contactCards = [
  {
    icon: Phone,
    title: "Ligue para nós",
    value: "(47) 3435-0660",
    extra: null,
    href: "tel:+554734350660",
    accent: "#0059AB",
  },
  {
    icon: Mail,
    title: "Envie um e-mail",
    value: "acomac@acomacjoinville.com.br",
    extra: null,
    href: "mailto:acomac@acomacjoinville.com.br",
    accent: "#F6811E",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "(47) 3435-0660",
    extra: "Atendimento rápido",
    href: "https://wa.me/554734350660",
    accent: "#0059AB",
  },
  {
    icon: Clock,
    title: "Horário",
    value: "Segunda a Sexta",
    extra: "8h às 18h",
    href: null,
    accent: "#F6811E",
  },
];

const socials = [
  {
    href: "https://instagram.com/acomacjoinville",
    icon: Instagram,
    label: "Instagram",
  },
  {
    href: "https://facebook.com/acomacjoinville",
    icon: Facebook,
    label: "Facebook",
  },
  {
    href: "https://wa.me/554734350660",
    icon: MessageCircle,
    label: "WhatsApp",
  },
];

import type { GlobalContent } from "@/lib/content/schema";

export default function ContactSection({
  contactForm,
}: {
  contactForm?: GlobalContent["contactForm"];
} = {}) {
  const { ref: headerRef, inView: headerInView } = useInView(0.12);
  const { ref: cardsRef, inView: cardsInView } = useInView(0.08);
  const { ref: contentRef, inView: contentInView } = useInView(0.08);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const inputStyle = (field: string) => ({
    borderColor: focusedField === field ? "#0059AB" : "#e8eaef",
    color: "#1a1a2e",
    backgroundColor: focusedField === field ? "#fafbff" : "#ffffff",
    transition: "border-color 0.3s, background-color 0.3s, box-shadow 0.3s",
    boxShadow:
      focusedField === field ? "0 0 0 3px rgba(0,89,171,0.08)" : "none",
  });

  return (
    <section id="contato" className="relative py-28 bg-white overflow-hidden">
      {/* Background decorations */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 10%, rgba(0,89,171,0.03) 0%, transparent 50%), radial-gradient(circle at 10% 90%, rgba(246,129,30,0.02) 0%, transparent 50%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* ══════ Header ══════ */}
        <div
          ref={headerRef}
          className="grid lg:grid-cols-12 gap-8 items-end mb-16"
          style={fadeIn(headerInView)}
        >
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "#0059AB" }}
              >
                Contato
              </span>
            </div>
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.08]"
              style={{ color: "#0e1a2b" }}
            >
              {contactForm?.title ?? (
                <>
                  Fale com a <span style={{ color: "#0059AB" }}>ACOMAC</span>
                </>
              )}
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p
              className="text-sm md:text-base leading-relaxed lg:text-right"
              style={{ color: "#8a94a6" }}
            >
              {contactForm?.subtitle ??
                "Estamos prontos para atender sua empresa. Entre em contato por qualquer um dos canais abaixo."}
            </p>
          </div>
        </div>

        {/* ══════ Contact cards — horizontal strip ══════ */}
        <div
          ref={cardsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14"
        >
          {contactCards.map((card, index) => {
            const Icon = card.icon;
            const isLink = !!card.href;
            const Tag = isLink ? "a" : "div";
            const linkProps = isLink
              ? {
                  href: card.href,
                  target: card.href?.startsWith("http")
                    ? "_blank" as const
                    : undefined,
                  rel: card.href?.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined,
                }
              : {};

            return (
              <Tag
                key={card.title}
                {...linkProps}
                className="group relative rounded-2xl p-5 transition-all duration-400 overflow-hidden"
                style={{
                  backgroundColor: "#f8f9fc",
                  border: "1px solid #eceef2",
                  cursor: isLink ? "pointer" : "default",
                  ...staggerStyle(cardsInView, index, 0.06),
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.borderColor = card.accent;
                  e.currentTarget.style.boxShadow = `0 12px 32px ${card.accent}15`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
                  e.currentTarget.style.borderColor = "#eceef2";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle, ${card.accent}10, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundColor:
                        card.accent === "#F6811E" ? "#fff7ee" : "#eef4fd",
                    }}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.7}
                      style={{ color: card.accent }}
                    />
                  </div>
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: "#b0b8c8" }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="text-sm font-bold break-all"
                    style={{ color: "#0e1a2b" }}
                  >
                    {card.value}
                  </p>
                  {card.extra && (
                    <p
                      className="text-xs mt-1"
                      style={{ color: "#8a94a6" }}
                    >
                      {card.extra}
                    </p>
                  )}
                </div>

                {isLink && (
                  <ArrowUpRight
                    size={14}
                    className="absolute top-4 right-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    style={{ color: card.accent }}
                  />
                )}
              </Tag>
            );
          })}
        </div>

        {/* ══════ Main content: Form + Map/Info ══════ */}
        <div
          ref={contentRef}
          className="grid lg:grid-cols-12 gap-6"
          style={fadeIn(contentInView, 0.1)}
        >
          {/* ── Left — Form ── */}
          <div
            className="lg:col-span-7 rounded-3xl p-8 md:p-10"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #eceef2",
              boxShadow: "0 4px 32px rgba(0,20,60,0.06)",
            }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "#eef4fd" }}
              >
                <Send size={20} style={{ color: "#0059AB" }} />
              </div>
              <div>
                <h3
                  className="text-lg font-extrabold"
                  style={{ color: "#0e1a2b" }}
                >
                  Envie sua mensagem
                </h3>
                <p className="text-sm" style={{ color: "#8a94a6" }}>
                  Retornaremos em até 24 horas úteis.
                </p>
              </div>
            </div>

            <form className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: "#8a94a6" }}
                  >
                    Nome completo
                  </label>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none"
                    style={inputStyle("nome")}
                    onFocus={() => setFocusedField("nome")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div>
                  <label
                    className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: "#8a94a6" }}
                  >
                    Empresa
                  </label>
                  <input
                    type="text"
                    placeholder="Nome da empresa"
                    className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none"
                    style={inputStyle("empresa")}
                    onFocus={() => setFocusedField("empresa")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label
                    className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: "#8a94a6" }}
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none"
                    style={inputStyle("email")}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
                <div>
                  <label
                    className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: "#8a94a6" }}
                  >
                    Telefone
                  </label>
                  <input
                    type="tel"
                    placeholder="(47) 99999-9999"
                    className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none"
                    style={inputStyle("telefone")}
                    onFocus={() => setFocusedField("telefone")}
                    onBlur={() => setFocusedField(null)}
                  />
                </div>
              </div>
              <div>
                <label
                  className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: "#8a94a6" }}
                >
                  Assunto
                </label>
                <select
                  className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none appearance-none"
                  style={inputStyle("assunto")}
                  onFocus={() => setFocusedField("assunto")}
                  onBlur={() => setFocusedField(null)}
                >
                  <option value="">Selecione o assunto</option>
                  <option value="associacao">Quero me associar</option>
                  <option value="cursos">Informações sobre cursos</option>
                  <option value="eventos">Eventos e feiras</option>
                  <option value="convenios">Convênios e parcerias</option>
                  <option value="espaco">Locação de espaço</option>
                  <option value="outros">Outros</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-[11px] font-bold uppercase tracking-wider mb-2"
                  style={{ color: "#8a94a6" }}
                >
                  Mensagem
                </label>
                <textarea
                  rows={4}
                  placeholder="Escreva sua mensagem..."
                  className="w-full px-4 py-3.5 rounded-xl border text-sm focus:outline-none resize-none"
                  style={inputStyle("mensagem")}
                  onFocus={() => setFocusedField("mensagem")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <button
                type="submit"
                className="group/btn w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#0059AB",
                  boxShadow: "0 4px 20px rgba(0,89,171,0.25)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 8px 28px rgba(0,89,171,0.35)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 4px 20px rgba(0,89,171,0.25)";
                }}
              >
                Enviar mensagem
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover/btn:translate-x-1"
                />
              </button>
            </form>
          </div>

          {/* ── Right — Map + Info stack ── */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Map */}
            <div
              className="rounded-3xl overflow-hidden flex-1 min-h-[300px] relative"
              style={{
                border: "1px solid #eceef2",
                boxShadow: "0 4px 32px rgba(0,20,60,0.06)",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.123!2d-48.86748!3d-26.26748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE2JzAyLjkiUyA0OMKwNTInMDIuOSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                width="100%"
                height="100%"
                className="absolute inset-0"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização ACOMAC Joinville"
              />
            </div>

            {/* Address card */}
            <div
              className="rounded-3xl p-6"
              style={{
                backgroundColor: "#0e1a2b",
              }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(246,129,30,0.15)" }}
                >
                  <MapPin size={20} style={{ color: "#F6811E" }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    R. Lauro Zimermann Júnior, 60
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    Costa e Silva — Joinville/SC — CEP 89219-168
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div
                className="h-px mb-5"
                style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              />

              {/* Socials + CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {socials.map((s) => {
                    const SIcon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.08)",
                          color: "rgba(255,255,255,0.5)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#0059AB";
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "rgba(255,255,255,0.08)";
                          e.currentTarget.style.color =
                            "rgba(255,255,255,0.5)";
                        }}
                      >
                        <SIcon size={16} />
                      </a>
                    );
                  })}
                </div>
                <a
                  href="https://wa.me/554734350660"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/wa inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "rgba(246,129,30,0.15)",
                    color: "#F6811E",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#F6811E";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(246,129,30,0.15)";
                    e.currentTarget.style.color = "#F6811E";
                  }}
                >
                  Chamar no WhatsApp
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover/wa:translate-x-0.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

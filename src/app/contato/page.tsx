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
  Users,
  GraduationCap,
  Handshake,
  Building2,
  Smartphone,
} from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import SponsorAside from "@/components/public/SponsorAside";
import { usePageContent } from "@/hooks/usePageContent";
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
    title: "E-mail",
    value: "acomac@acomacjoinville.com.br",
    extra: null,
    href: "mailto:acomac@acomacjoinville.com.br",
    accent: "#F6811E",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    value: "(47) 99110-3681",
    extra: "Atendimento rápido",
    href: "https://wa.me/5547991103681",
    accent: "#0059AB",
  },
  {
    icon: Clock,
    title: "Horário",
    value: "Segunda a sexta",
    extra: "8h às 18h",
    href: null,
    accent: "#F6811E",
  },
] as const;

const departamentos = [
  {
    icon: Users,
    nome: "Associação",
    descricao:
      "Adesão de novas empresas, emissão de contratos e suporte aos associados.",
    email: "acomac@acomacjoinville.com.br",
    accent: "#F6811E",
  },
  {
    icon: Handshake,
    nome: "Eventos e Convênios",
    descricao:
      "FENAC, rodadas de negócios, parcerias comerciais e patrocínios.",
    email: "executivo@acomacjoinville.com.br",
    accent: "#0059AB",
  },
  {
    icon: GraduationCap,
    nome: "Academia da Construção",
    descricao:
      "Inscrições em cursos, turmas corporativas e emissão de certificados.",
    email: "informe@acomacjoinville.com.br",
    accent: "#F6811E",
  },
  {
    icon: Building2,
    nome: "Locação de Espaço",
    descricao:
      "Auditório e salas de treinamento disponíveis para associados e parceiros.",
    email: "informe@acomacjoinville.com.br",
    accent: "#0059AB",
  },
  {
    icon: Smartphone,
    nome: "Telefonia e Certificado Digital",
    descricao:
      "Planos corporativos com operadoras parceiras e emissão de certificado digital.",
    email: "telefone@acomacjoinville.com.br",
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
    href: "https://wa.me/5547991103681",
    icon: MessageCircle,
    label: "WhatsApp",
  },
];

export default function ContatoPage() {
  const page = usePageContent("contato");
  const hero = page?.hero;
  const dynamicCards = [
    {
      icon: Phone,
      title: "Ligue para nós",
      value: page?.phones?.[0]?.value ?? "(47) 3435-0660",
      extra: page?.phones?.[1]?.value ?? null,
      href: `tel:${(page?.phones?.[0]?.value ?? "(47) 3435-0660").replace(/\D/g, "")}`,
      accent: "#0059AB",
    },
    {
      icon: Mail,
      title: "E-mail",
      value: page?.emails?.[0]?.value ?? "acomac@acomacjoinville.com.br",
      extra: page?.emails?.[1]?.value ?? null,
      href: `mailto:${page?.emails?.[0]?.value ?? "acomac@acomacjoinville.com.br"}`,
      accent: "#F6811E",
    },
    contactCards[2],
    {
      icon: Clock,
      title: "Horário",
      value: page?.hours?.[0]?.days ?? "Segunda a sexta",
      extra: page?.hours?.[0]?.time ?? "8h às 18h",
      href: null,
      accent: "#F6811E",
    },
  ];
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: cardsRef, inView: cardsInView } = useInView(0.1);
  const { ref: formRef, inView: formInView } = useInView(0.05);
  const { ref: depRef, inView: depInView } = useInView(0.1);

  const inputStyle = (field: string) => ({
    borderColor: focusedField === field ? "#0059AB" : "#e8eaef",
    color: "#1a1a2e",
    backgroundColor: focusedField === field ? "#fafbff" : "#ffffff",
    transition: "border-color 0.3s, background-color 0.3s, box-shadow 0.3s",
    boxShadow:
      focusedField === field ? "0 0 0 3px rgba(0,89,171,0.08)" : "none",
  });

  return (
    <>
      <ClientSiteChrome pageKey="contato">
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
                {hero?.badge ?? "Contato"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white max-w-4xl mb-6">
              {hero?.title ?? (
                <>
                  Fale com a{" "}
                  <span className="relative inline-block" style={{ color: "#F6811E" }}>
                    ACOMAC
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
                "Estamos prontos para atender sua empresa. Escolha o canal que preferir — telefone, e-mail, WhatsApp ou uma visita à sede em Joinville."}
            </p>
          </div>
        </section>

        {/* CARDS STRIP */}
        <section className="relative -mt-12 z-10 px-6">
          <div
            ref={cardsRef}
            className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {dynamicCards.map((card, index) => {
              const Icon = card.icon;
              const isLink = !!card.href;
              const content = (
                <>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
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
                    <p className="text-xs mt-1" style={{ color: "#8a94a6" }}>
                      {card.extra}
                    </p>
                  )}
                  {isLink && (
                    <ArrowUpRight
                      size={14}
                      className="absolute top-4 right-4"
                      style={{ color: card.accent }}
                    />
                  )}
                </>
              );

              const commonStyle = {
                backgroundColor: "#ffffff",
                border: "1px solid #eceef2",
                boxShadow: "0 12px 32px rgba(0,0,0,0.04)",
                ...staggerStyle(cardsInView, index, 0.05),
              };

              return isLink ? (
                <a
                  key={card.title}
                  href={card.href}
                  target={card.href?.startsWith("http") ? "_blank" : undefined}
                  rel={
                    card.href?.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="card-hover group relative rounded-2xl p-5 block"
                  style={commonStyle}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={card.title}
                  className="relative rounded-2xl p-5"
                  style={commonStyle}
                >
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        {/* FORM + MAP */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-[1fr_200px] gap-12">
            <div
              ref={formRef}
              className="min-w-0 grid lg:grid-cols-12 gap-6"
              style={fadeIn(formInView)}
            >
            {/* Form */}
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
                  <h2
                    className="text-lg font-extrabold"
                    style={{ color: "#0e1a2b" }}
                  >
                    Envie sua mensagem
                  </h2>
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
                    rows={5}
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
                >
                  Enviar mensagem
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover/btn:translate-x-1"
                  />
                </button>
              </form>
            </div>

            {/* Map + Address */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div
                className="rounded-3xl overflow-hidden flex-1 min-h-[320px] relative"
                style={{
                  border: "1px solid #eceef2",
                  boxShadow: "0 4px 32px rgba(0,20,60,0.06)",
                }}
              >
                <iframe
                  src={
                    page?.mapEmbedUrl ||
                    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.123!2d-48.86748!3d-26.26748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDE2JzAyLjkiUyA0OMKwNTInMDIuOSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                  }
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

              <div
                className="rounded-3xl p-6"
                style={{ backgroundColor: "#0e1a2b" }}
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
                      {page?.address?.addressLines?.[0] ?? "R. Lauro Zimermann Júnior, 60"}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                      {page?.address?.addressLines?.slice(1).join(" — ") ??
                        "Costa e Silva — Joinville/SC — CEP 89219-168"}
                    </p>
                  </div>
                </div>

                <div
                  className="h-px mb-5"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                />

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
                            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                          }}
                        >
                          <SIcon size={16} />
                        </a>
                      );
                    })}
                  </div>
                  <a
                    href="https://wa.me/5547991103681"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300"
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
                    <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            </div>
            </div>
            <SponsorAside slot="contato-form" />
          </div>
        </section>

        {/* DEPARTAMENTOS */}
        <section className="py-24" style={{ backgroundColor: "#fafafa" }}>
          <div className="max-w-6xl mx-auto px-6">
            <div
              ref={depRef}
              className="text-center mb-14"
              style={fadeIn(depInView)}
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
                  Fale direto com a área certa
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: "#111" }}
              >
                Departamentos da ACOMAC
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {(() => {
                const list =
                  page?.departments && page.departments.length > 0
                    ? page.departments.map((d, i) => ({
                        nome: d.name,
                        descricao: d.description,
                        email: d.email,
                        icon: departamentos[i % departamentos.length].icon,
                        accent: i % 2 === 0 ? "#F6811E" : "#0059AB",
                      }))
                    : departamentos;
                return list.map((d, i) => {
                  const Icon = d.icon;
                  return (
                    <a
                      key={`${d.nome}-${i}`}
                      href={`mailto:${d.email}`}
                      className="card-hover group p-7 rounded-2xl bg-white flex items-start gap-5"
                      style={{
                        ...staggerStyle(depInView, i, 0.05),
                        border: "1px solid #eee",
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${d.accent}18` }}
                      >
                        <Icon size={22} style={{ color: d.accent }} />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-base font-extrabold mb-1"
                          style={{ color: "#111" }}
                        >
                          {d.nome}
                        </h3>
                        <p
                          className="text-sm leading-relaxed mb-3"
                          style={{ color: "#666" }}
                        >
                          {d.descricao}
                        </p>
                        <span
                          className="inline-flex items-center gap-1.5 text-[13px] font-bold"
                          style={{ color: d.accent }}
                        >
                          <Mail size={13} />
                          {d.email}
                        </span>
                      </div>
                    </a>
                  );
                });
              })()}
            </div>
          </div>
        </section>

      </main>
      </ClientSiteChrome>
    </>
  );
}

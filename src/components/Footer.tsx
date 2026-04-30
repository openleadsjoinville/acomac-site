"use client";

import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  ArrowUp,
  ArrowRight,
  Heart,
} from "lucide-react";
import Image from "next/image";
import { useInView, staggerStyle, fadeIn } from "@/hooks/useAnimations";
import type { GlobalContent } from "@/lib/content/schema";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";

export default function Footer({
  hideCta = false,
  globalContent,
}: {
  hideCta?: boolean;
  globalContent?: GlobalContent;
}) {
  const footerData = globalContent?.footer ?? {
    about:
      "Associação dos Comerciantes de Material de Construção de Joinville. Desde 1983 unindo e fortalecendo o setor varejista da construção civil.",
    columns: [
      {
        title: "Navegação",
        links: [
          { label: "Início", href: "/#inicio" },
          { label: "A ACOMAC", href: "/sobre" },
          { label: "Benefícios", href: "/beneficios" },
          { label: "Cursos", href: "/cursos" },
          { label: "Eventos", href: "/eventos" },
          { label: "Convênios", href: "/convenios" },
          { label: "Contato", href: "/contato" },
        ],
      },
      {
        title: "Programas",
        links: [
          { label: "Academia da Construção", href: "/cursos" },
          { label: "FENAC — Feira de Negócios", href: "/eventos" },
          { label: "Rodadas de Negócios", href: "/eventos" },
          { label: "Prêmio João-de-Barro", href: "/eventos" },
        ],
      },
    ],
    bottom: "© ACOMAC Joinville. Todos os direitos reservados.",
  };
  const ctaData = globalContent?.cta ?? {
    badge: "",
    title: "Pronto para fortalecer seu negócio?",
    subtitle: "Junte-se a mais de 180 empresas que já confiam na ACOMAC.",
    primaryLabel: "Quero me associar",
    primaryHref: "/participe-do-conecta-associados",
    secondaryLabel: "WhatsApp",
    secondaryHref: "https://wa.me/554734350660",
  };
  const contactInfo =
    globalContent?.contactInfo ?? {
      address: "Rua Princesa Isabel, 438",
      addressLine2: "Costa e Silva",
      city: "Joinville - SC",
      phone: "(47) 3435-0660",
      whatsappLabel: "",
      email: "acomac@acomacjoinville.com.br",
      hours: "",
    };
  const brandLogo = globalContent?.brand.logo ?? "/LOGO ACOMAC Joinville - 2020 - FINAL-01.avif";
  const brandAlt = globalContent?.brand.logoAlt ?? "ACOMAC Joinville";
  const whatsappHref = globalContent
    ? whatsappLink(globalContent.whatsapp.number)
    : "https://wa.me/554734350660";
  const socials = [
    {
      href: globalContent?.socials.instagram || "https://instagram.com/acomacjoinville",
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: globalContent?.socials.facebook || "https://facebook.com/acomacjoinville",
      icon: Facebook,
      label: "Facebook",
    },
    {
      href: whatsappHref,
      icon: WhatsAppIcon,
      label: "WhatsApp",
    },
  ].filter((s) => s.href);
  const { ref: ctaRef, inView: ctaInView } = useInView(0.15);
  const { ref: footerRef, inView } = useInView(0.08);
  const { ref: bottomRef, inView: bottomInView } = useInView(0.3);

  return (
    <footer className="relative">
      {/* ══════ Pre-footer CTA banner ══════ */}
      {!hideCta && (
      <div
        ref={ctaRef}
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #003566 0%, #0059AB 50%, #0068c7 100%)",
        }}
      >
        {/* Dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(246,129,30,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div
          className="relative z-10 max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8"
          style={fadeIn(ctaInView)}
        >
          <div className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
              {ctaData.title}
            </h3>
            <p
              className="text-sm md:text-base"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {ctaData.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={ctaData.primaryHref}
              className="group/cta inline-flex items-center gap-2.5 px-7 py-4 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
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
              {ctaData.primaryLabel}
              <ArrowRight
                size={15}
                className="transition-transform group-hover/cta:translate-x-1"
              />
            </a>
            <a
              href={ctaData.secondaryHref || whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl text-sm font-bold transition-all duration-300 hover:-translate-y-0.5"
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
              <WhatsAppIcon size={16} />
              {ctaData.secondaryLabel}
            </a>
          </div>
        </div>
      </div>
      )}

      {/* ══════ Main footer ══════ */}
      <div
        ref={footerRef}
        style={{ backgroundColor: "#0a0f1a" }}
      >
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Column 1 — Brand (wider) */}
            <div
              className="lg:col-span-4"
              style={staggerStyle(inView, 0, 0.15)}
            >
              <div className="mb-6">
                <Image
                  src={brandLogo}
                  alt={brandAlt}
                  width={150}
                  height={52}
                  className="h-12 w-auto object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <p
                className="text-sm leading-[1.8] mb-7 max-w-xs"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {footerData.about}
              </p>

              {/* Socials */}
              <div className="flex gap-2.5">
                {socials.map((s) => {
                  const SIcon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        color: "rgba(255,255,255,0.4)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#0059AB";
                        e.currentTarget.style.borderColor = "#0059AB";
                        e.currentTarget.style.color = "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.06)";
                        e.currentTarget.style.borderColor =
                          "rgba(255,255,255,0.06)";
                        e.currentTarget.style.color =
                          "rgba(255,255,255,0.4)";
                      }}
                    >
                      <SIcon size={17} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Dynamic footer columns */}
            {footerData.columns.slice(0, 2).map((col, colIdx) => (
              <div
                key={col.title}
                className={colIdx === 0 ? "lg:col-span-2" : "lg:col-span-3"}
                style={staggerStyle(inView, colIdx + 1, 0.15)}
              >
                <h3
                  className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6"
                  style={{ color: "rgba(255,255,255,0.25)" }}
                >
                  {col.title}
                </h3>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link.label}-${link.href}`}>
                      <a
                        href={link.href}
                        className="text-sm transition-colors duration-300 hover:text-white"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            "rgba(255,255,255,0.45)";
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Column 4 — Contact */}
            <div
              className="lg:col-span-3"
              style={staggerStyle(inView, 3, 0.15)}
            >
              <h3
                className="text-[11px] font-bold uppercase tracking-[0.2em] mb-6"
                style={{ color: "rgba(255,255,255,0.25)" }}
              >
                Contato
              </h3>
              <ul className="space-y-3.5">
                <li className="flex gap-2.5">
                  <MapPin
                    size={15}
                    className="mt-0.5 shrink-0"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  />
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {contactInfo.address}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      {[contactInfo.addressLine2, contactInfo.city].filter(Boolean).join(" — ")}
                    </p>
                  </div>
                </li>
                <li className="flex gap-2.5">
                  <Phone
                    size={15}
                    className="mt-0.5 shrink-0"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  />
                  <div>
                    <p
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.6)" }}
                    >
                      {contactInfo.phone}
                    </p>
                    {contactInfo.whatsappLabel && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {contactInfo.whatsappLabel}
                      </p>
                    )}
                  </div>
                </li>
                <li className="flex gap-2.5">
                  <Mail
                    size={15}
                    className="mt-0.5 shrink-0"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {contactInfo.email}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* ══════ Bottom bar ══════ */}
        <div
          ref={bottomRef}
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4"
            style={fadeIn(bottomInView, 0.1)}
          >
            <p
              className="text-xs flex items-center gap-1"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              {footerData.bottom}
            </p>

            <div className="flex items-center gap-6">
              <span
                className="text-xs hidden md:flex items-center gap-1.5"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Feito com{" "}
                <Heart
                  size={11}
                  fill="rgba(246,129,30,0.6)"
                  style={{ color: "rgba(246,129,30,0.6)" }}
                />{" "}
                para o setor da construção
              </span>

              <button
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
                className="group flex items-center gap-2 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.35)";
                }}
              >
                Voltar ao topo
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#0059AB";
                    e.currentTarget.style.borderColor = "#0059AB";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.06)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                  }}
                >
                  <ArrowUp size={14} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* ══════ Open Leads attribution ══════ */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            backgroundColor: "rgba(0,0,0,0.25)",
          }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-center gap-2 flex-wrap">
            <span
              className="text-[11px]"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Feito orgulosamente por
            </span>
            <a
              href="https://openleads.com.br"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Leads"
              className="inline-flex items-center transition-opacity duration-200 hover:opacity-80"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-fundo-transparente-1766854878509.png"
                alt="Open Leads"
                className="h-4 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

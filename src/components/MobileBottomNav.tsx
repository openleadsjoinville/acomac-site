"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Home,
  Users,
  Sparkles,
  MessageCircle,
  X,
  Phone,
  Mail,
  Instagram,
  Facebook,
  ChevronRight,
  GraduationCap,
  CalendarDays,
  Handshake,
  BookOpen,
  Building2,
  LayoutGrid,
} from "lucide-react";
import type { GlobalContent } from "@/lib/content/schema";
import { resolveWhatsappCtaHref } from "@/lib/whatsapp";

const defaultNavLinks = [
  { label: "Início", href: "/#inicio" },
  { label: "A ACOMAC", href: "/sobre" },
  { label: "Benefícios", href: "/beneficios" },
  { label: "Cursos", href: "/cursos" },
  { label: "Eventos", href: "/eventos" },
  { label: "Convênios", href: "/convenios" },
  { label: "Conecta Associados", href: "/conecta-associados" },
  { label: "Contato", href: "/contato" },
];

const ICON_FOR_LABEL: Record<string, React.ComponentType<{ size?: number }>> = {
  Início: Home,
  "A ACOMAC": Building2,
  "Sobre nós": Building2,
  Sobre: Building2,
  Benefícios: Sparkles,
  Cursos: GraduationCap,
  Eventos: CalendarDays,
  Convênios: Handshake,
  "Conecta Associados": Users,
  Conecta: Users,
  Blog: BookOpen,
  Contato: MessageCircle,
};

type NavLink = { label: string; href: string };

function getIcon(label: string) {
  return ICON_FOR_LABEL[label] ?? LayoutGrid;
}

const PRIMARY_LABELS = [
  "Início",
  "Cursos",
  "Eventos",
  "Conecta Associados",
];

export default function MobileBottomNav({
  globalContent,
}: {
  globalContent?: GlobalContent;
}) {
  const navLinks: NavLink[] = globalContent?.header.nav ?? defaultNavLinks;
  const associateCta = globalContent?.whatsappCtas?.associateNow;
  const ctaLabel =
    associateCta?.label || globalContent?.header.ctaLabel || "Associe-se";
  const ctaHref = associateCta
    ? resolveWhatsappCtaHref(associateCta, globalContent?.whatsapp?.number)
    : globalContent?.header.ctaHref ?? "/participe-do-conecta-associados";
  const ctaIsWa = ctaHref.startsWith("https://wa.me");
  const topbar = globalContent?.header.topbar ?? {
    phone: "(47) 3435-0660",
    email: "acomac@acomacjoinville.com.br",
    city: "Joinville, SC",
  };
  const logo =
    globalContent?.brand.logo ||
    "/LOGO ACOMAC Joinville - 2020 - FINAL-01.avif";
  const logoAlt = globalContent?.brand.logoAlt || "ACOMAC Joinville";
  const instagram =
    globalContent?.socials.instagram || "https://instagram.com/acomacjoinville";
  const facebook =
    globalContent?.socials.facebook || "https://facebook.com/acomacjoinville";

  const [activeSection, setActiveSection] = useState<string>("/#inicio");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      const match = navLinks.find(
        (l) => !l.href.includes("#") && l.href === window.location.pathname
      );
      if (match) {
        setActiveSection(match.href);
        return;
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(`/#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    navLinks.forEach((link) => {
      const i = link.href.indexOf("#");
      if (i === -1) return;
      const id = link.href.slice(i + 1);
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [navLinks]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const primary = PRIMARY_LABELS.map((label) =>
    navLinks.find((l) => l.label === label)
  ).filter(Boolean) as NavLink[];

  return (
    <>
      {/* Dock flutuante */}
      <nav
        className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100vw-24px)] max-w-md"
        aria-label="Menu"
      >
        <div
          className="flex items-stretch gap-0.5 px-1.5 py-1.5 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(15,23,42,0.06)",
            boxShadow:
              "0 18px 40px rgba(15,23,42,0.18), 0 4px 14px rgba(15,23,42,0.08)",
          }}
        >
          {primary.map((link) => {
            const Icon = getIcon(link.label);
            const isActive = activeSection === link.href;
            const shortLabel =
              link.label === "Conecta Associados"
                ? "Conecta"
                : link.label;
            return (
              <a
                key={link.href}
                href={link.href}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-all duration-200 relative"
                style={{
                  color: isActive ? "#0059AB" : "#5a6577",
                  background: isActive
                    ? "linear-gradient(180deg, rgba(0,89,171,0.08) 0%, rgba(0,89,171,0.02) 100%)"
                    : "transparent",
                }}
              >
                <span
                  className="inline-flex items-center justify-center transition-transform"
                  style={{
                    transform: isActive ? "translateY(-1px) scale(1.05)" : "none",
                  }}
                >
                  <Icon size={20} />
                </span>
                <span
                  className="text-[10px] font-bold leading-none tracking-tight"
                  style={{ color: isActive ? "#0059AB" : "#5a6577" }}
                >
                  {shortLabel}
                </span>
                {isActive && (
                  <span
                    className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "#F6811E",
                      boxShadow: "0 0 0 3px rgba(246,129,30,0.18)",
                    }}
                  />
                )}
              </a>
            );
          })}

          {/* Botão Mais (abre o sheet) */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors cursor-pointer"
            style={{
              color: open ? "#fff" : "#fff",
              background:
                "linear-gradient(135deg, #F6811E 0%, #ff9a3f 100%)",
              boxShadow: "0 6px 16px rgba(246,129,30,0.35)",
            }}
            aria-label="Abrir menu completo"
            aria-expanded={open}
          >
            <span className="inline-flex items-center justify-center">
              <LayoutGrid size={19} />
            </span>
            <span className="text-[10px] font-bold leading-none tracking-tight">
              Mais
            </span>
          </button>
        </div>
      </nav>

      {/* Sheet expandido */}
      <div
        className="lg:hidden fixed inset-0 z-[70]"
        style={{
          pointerEvents: open ? "auto" : "none",
        }}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background: "rgba(5,7,12,0.55)",
            backdropFilter: "blur(4px)",
            opacity: open ? 1 : 0,
          }}
        />

        {/* Sheet */}
        <div
          className="absolute left-0 right-0 bottom-0 rounded-t-3xl flex flex-col"
          style={{
            background: "#fff",
            transform: open ? "translateY(0)" : "translateY(100%)",
            transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            maxHeight: "85vh",
            boxShadow: "0 -16px 40px rgba(15,23,42,0.18)",
          }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
            <span
              className="block w-10 h-1 rounded-full"
              style={{ background: "#cbd1da" }}
            />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pb-3 pt-2 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Image
                src={logo}
                alt={logoAlt}
                width={120}
                height={40}
                className="h-9 w-auto object-contain"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ background: "#f7f8fb", color: "#5a6577" }}
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav grid */}
          <div className="px-4 overflow-y-auto flex-1">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 mb-2"
              style={{ color: "#8a94a6" }}
            >
              Navegação
            </p>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const Icon = getIcon(link.label);
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(0,89,171,0.08) 0%, rgba(0,89,171,0.02) 100%)"
                        : "#f7f8fb",
                      border: isActive
                        ? "1px solid rgba(0,89,171,0.2)"
                        : "1px solid #eceef2",
                      color: isActive ? "#0059AB" : "#0e1a2b",
                    }}
                  >
                    <span
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0"
                      style={{
                        background: isActive
                          ? "rgba(0,89,171,0.12)"
                          : "#fff",
                        color: isActive ? "#0059AB" : "#5a6577",
                      }}
                    >
                      <Icon size={17} />
                    </span>
                    <span className="text-[13px] font-bold leading-tight">
                      {link.label}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* CTA */}
            <a
              href={ctaHref}
              target={ctaIsWa ? "_blank" : undefined}
              rel={ctaIsWa ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              data-track="mobile_sheet_cta"
              data-track-label={ctaLabel}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white transition-transform active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, #F6811E 0%, #ff9a3f 100%)",
                boxShadow: "0 8px 24px rgba(246,129,30,0.32)",
              }}
            >
              {ctaLabel}
              <ChevronRight size={16} />
            </a>

            {/* Contatos */}
            <div className="mt-5 pt-5" style={{ borderTop: "1px solid #eceef2" }}>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em] mb-3"
                style={{ color: "#8a94a6" }}
              >
                Fale com a ACOMAC
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${topbar.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl"
                  style={{
                    background: "#f7f8fb",
                    border: "1px solid #eceef2",
                    color: "#0e1a2b",
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      background: "rgba(0,89,171,0.1)",
                      color: "#0059AB",
                    }}
                  >
                    <Phone size={14} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: "#8a94a6" }}
                    >
                      Telefone
                    </p>
                    <p className="text-[12px] font-semibold truncate">
                      {topbar.phone}
                    </p>
                  </div>
                </a>
                <a
                  href={`mailto:${topbar.email}`}
                  className="flex items-center gap-2.5 p-3 rounded-xl"
                  style={{
                    background: "#f7f8fb",
                    border: "1px solid #eceef2",
                    color: "#0e1a2b",
                  }}
                >
                  <span
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
                    style={{
                      background: "rgba(246,129,30,0.1)",
                      color: "#F6811E",
                    }}
                  >
                    <Mail size={14} />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: "#8a94a6" }}
                    >
                      E-mail
                    </p>
                    <p className="text-[12px] font-semibold truncate">
                      {topbar.email}
                    </p>
                  </div>
                </a>
              </div>

              <div className="flex items-center justify-center gap-3 mt-4 mb-5">
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "#f7f8fb",
                    color: "#5a6577",
                    border: "1px solid #eceef2",
                  }}
                  aria-label="Instagram"
                >
                  <Instagram size={16} />
                </a>
                <a
                  href={facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "#f7f8fb",
                    color: "#5a6577",
                    border: "1px solid #eceef2",
                  }}
                  aria-label="Facebook"
                >
                  <Facebook size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

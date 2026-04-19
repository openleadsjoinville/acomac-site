"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Phone,
  Mail,
  Instagram,
  Facebook,
  MapPin,
  ChevronRight,
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

export default function Header({ globalContent }: { globalContent?: GlobalContent } = {}) {
  const navLinks = globalContent?.header.nav ?? defaultNavLinks;
  const associateCta = globalContent?.whatsappCtas?.associateNow;
  const ctaLabel = associateCta?.label || globalContent?.header.ctaLabel || "Associe-se";
  const ctaHref = associateCta
    ? resolveWhatsappCtaHref(associateCta, globalContent?.whatsapp?.number)
    : globalContent?.header.ctaHref ?? "/conecta-associados#cadastro";
  const ctaIsWa = ctaHref.startsWith("https://wa.me");
  const topbar = globalContent?.header.topbar ?? {
    phone: "(47) 3435-0660",
    email: "acomac@acomacjoinville.com.br",
    city: "Joinville, SC",
  };
  const logo = globalContent?.brand.logo ?? "/LOGO ACOMAC Joinville - 2020 - FINAL-01.avif";
  const logoAlt = globalContent?.brand.logoAlt ?? "ACOMAC Joinville";
  const instagram = globalContent?.socials.instagram || "https://instagram.com/acomacjoinville";
  const facebook = globalContent?.socials.facebook || "https://facebook.com/acomacjoinville";
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("/#inicio");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track active section/route
  useEffect(() => {
    // If we're on a non-home route, highlight that route directly.
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
          if (entry.isIntersecting) {
            setActiveSection(`/#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    navLinks.forEach((link) => {
      const hashIndex = link.href.indexOf("#");
      if (hashIndex === -1) return;
      const id = link.href.slice(hashIndex + 1);
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Top utility bar */}
      <div
        className="hidden md:block relative z-50"
        style={{ backgroundColor: "#0a0a0a" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-9">
            <div className="flex items-center gap-5">
              <a
                href={`tel:${topbar.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-1.5 text-[11px] transition-colors"
                style={{ color: "rgba(255,255,255,0.55)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.95)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                }
              >
                <Phone size={11} />
                {topbar.phone}
              </a>
              <div
                className="w-px h-3"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              />
              <a
                href={`mailto:${topbar.email}`}
                className="flex items-center gap-1.5 text-[11px] transition-colors"
                style={{ color: "rgba(255,255,255,0.55)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.95)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "rgba(255,255,255,0.55)")
                }
              >
                <Mail size={11} />
                {topbar.email}
              </a>
              <div
                className="w-px h-3"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              />
              <span
                className="flex items-center gap-1.5 text-[11px]"
                style={{ color: "rgba(255,255,255,0.45)" }}
              >
                <MapPin size={11} />
                {topbar.city}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                style={{
                  color: "rgba(255,255,255,0.45)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Instagram size={13} />
              </a>
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-6 h-6 rounded flex items-center justify-center transition-colors"
                style={{
                  color: "rgba(255,255,255,0.45)",
                  backgroundColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#ffffff";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Facebook size={13} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar — desktop/tablet only; mobile usa MobileTopHeader */}
      <header
        className="hidden md:block sticky top-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: isScrolled
            ? "rgba(255,255,255,0.97)"
            : "rgba(255,255,255,1)",
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          boxShadow: isScrolled
            ? "0 1px 0 rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.04)"
            : "0 1px 0 rgba(0,0,0,0.04)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-[68px]">
            {/* Logo */}
            <a href="#inicio" className="flex items-center shrink-0 group">
              <Image
                src={logo}
                alt={logoAlt}
                width={140}
                height={48}
                className="h-10 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80"
                priority
              />
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="relative px-3.5 py-2 text-[13px] font-medium rounded-md transition-all duration-200"
                    style={{
                      color: isActive ? "#0059AB" : "#555555",
                      backgroundColor: isActive
                        ? "rgba(0,89,171,0.06)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#111111";
                        e.currentTarget.style.backgroundColor =
                          "rgba(0,0,0,0.03)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.color = "#555555";
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {link.label}
                    {/* Active underline indicator */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-3 right-3 h-[2px] rounded-full"
                        style={{ backgroundColor: "#0059AB" }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* CTA button */}
            <div className="hidden lg:flex items-center gap-3">
              <a
                href={ctaHref}
                target={ctaIsWa ? "_blank" : undefined}
                rel={ctaIsWa ? "noopener noreferrer" : undefined}
                data-track="header_cta"
                data-track-label={ctaLabel}
                className="relative px-5 py-2.5 text-[13px] font-bold rounded-lg text-white transition-all duration-300 overflow-hidden group/btn"
                style={{ backgroundColor: "#F6811E" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#d96a0a")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F6811E")
                }
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {ctaLabel}
                  <ChevronRight
                    size={14}
                    className="transition-transform duration-200 group-hover/btn:translate-x-0.5"
                  />
                </span>
              </a>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}

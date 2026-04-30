"use client";

import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useInView, scaleIn, staggerStyle, slideInRight } from "@/hooks/useAnimations";
import type { GlobalContent } from "@/lib/content/schema";
import { resolveWhatsappCtaHref } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";

const defaultReasons = [
  "Representação perante órgãos públicos e entidades privadas",
  "Acesso a mais de 40 benefícios e convênios exclusivos",
  "Participação em feiras, eventos e rodadas de negócios",
  "Cursos e capacitação na Academia da Construção",
  "Pesquisas de mercado e indicadores do setor",
  "Networking com empresários de 8 municípios",
];

export default function CTASection({
  cta,
  phone,
  globalContent,
}: {
  cta?: GlobalContent["cta"];
  phone?: string;
  globalContent?: GlobalContent;
} = {}) {
  const reasons = defaultReasons;
  const associateCta = globalContent?.whatsappCtas?.associateNow;
  const contactCta = globalContent?.whatsappCtas?.contactUs;
  const globalWa = globalContent?.whatsapp?.number;
  const primaryHref = associateCta
    ? resolveWhatsappCtaHref(associateCta, globalWa)
    : cta?.primaryHref ?? "/participe-do-conecta-associados";
  const primaryLabel = associateCta?.label || cta?.primaryLabel || "Quero me associar";
  const primaryIsWa = primaryHref.startsWith("https://wa.me");
  const secondaryHref = contactCta
    ? resolveWhatsappCtaHref(contactCta, globalWa)
    : cta?.secondaryHref ?? `tel:${(phone ?? "(47) 3435-0660").replace(/\D/g, "")}`;
  const secondaryLabel =
    contactCta?.label ||
    cta?.secondaryLabel ||
    "Fale com a gente";
  const secondaryIsWa = secondaryHref.startsWith("https://wa.me");
  const { ref: cardRef, inView: cardInView } = useInView();
  const { ref: leftRef, inView: leftInView } = useInView();
  const { ref: rightRef, inView: rightInView } = useInView();
  
  return (
    <section id="associe-se" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div
          ref={cardRef}
          className="rounded-3xl overflow-hidden grid lg:grid-cols-2 relative shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #0059AB 0%, #003E78 100%)",
            ...scaleIn(cardInView),
            boxShadow: "0 30px 60px -15px rgba(0, 89, 171, 0.3)"
          }}
        >
          {/* Pattern overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
              backgroundSize: "28px 28px",
            }}
          />

          {/* Left */}
          <div ref={leftRef} className="p-10 lg:p-16 relative z-10">
            <p
              className="text-xs font-bold uppercase tracking-[0.2em] mb-6"
              style={{
                color: "#F6811E",
                ...staggerStyle(leftInView, 0),
              }}
            >
              {cta?.badge || "Faça parte"}
            </p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight mb-4"
              style={staggerStyle(leftInView, 1)}
            >
              {cta?.title ?? (
                <>
                  Fortaleça seu negócio.
                  <br />
                  <span style={{ color: "#F6811E" }}>Associe-se à ACOMAC.</span>
                </>
              )}
            </h2>
            <p
              className="text-base leading-relaxed mb-10 max-w-md"
              style={{
                color: "rgba(255,255,255,0.8)",
                ...staggerStyle(leftInView, 2),
              }}
            >
              {cta?.subtitle ??
                "Junte-se à maior associação do varejo de material de construção de Santa Catarina e tenha acesso a um ecossistema completo de benefícios e oportunidades."}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3"
              style={staggerStyle(leftInView, 3)}
            >
              <a
                href={primaryHref}
                target={primaryIsWa ? "_blank" : undefined}
                rel={primaryIsWa ? "noopener noreferrer" : undefined}
                data-track="cta_primary"
                data-track-label={primaryLabel}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(246,129,30,0.6)] hover:-translate-y-1 hover:bg-[#ff8f2a]"
                style={{ backgroundColor: "#F6811E" }}
              >
                {primaryLabel}
                <ArrowRight size={18} />
              </a>
              <a
                href={secondaryHref}
                target={secondaryIsWa ? "_blank" : undefined}
                rel={secondaryIsWa ? "noopener noreferrer" : undefined}
                data-track="cta_secondary"
                data-track-label={secondaryLabel}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40"
                style={{
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.85)",
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
              >
                {secondaryIsWa && <WhatsAppIcon size={16} />}
                {secondaryLabel}
              </a>
            </div>
          </div>

          {/* Right */}
          <div
            ref={rightRef}
            className="p-10 lg:p-16 border-t lg:border-t-0 lg:border-l relative z-10 flex flex-col justify-center"
            style={{ borderColor: "rgba(255,255,255,0.1)", backgroundColor: "rgba(0,0,0,0.1)" }}
          >
            <h3
              className="text-sm font-bold text-white mb-8"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              O que você ganha ao se associar
            </h3>
            <ul className="space-y-5">
              {reasons.map((reason, i) => (
                <li
                  key={reason}
                  className="flex items-start gap-3"
                  style={slideInRight(rightInView, 0.1 + i * 0.08)}
                >
                  <div className="shrink-0 mt-0.5 rounded-full bg-[#F6811E] p-1 shadow-lg shadow-orange-900/20">
                    <CheckCircle2
                      size={14}
                      style={{
                        color: "white",
                        transition: `transform 0.4s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.08}s`,
                        transform: rightInView ? "scale(1)" : "scale(0)",
                      }}
                    />
                  </div>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.8)" }}>
                    {reason}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

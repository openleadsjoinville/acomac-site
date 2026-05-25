"use client";

import { Megaphone, Check } from "lucide-react";

export type MarketingConsentVariant = "light" | "dark";

type Props = {
  checked: boolean;
  onChange: (value: boolean) => void;
  variant?: MarketingConsentVariant;
  id?: string;
};

export default function MarketingConsent({
  checked,
  onChange,
  variant = "light",
  id = "marketing-consent",
}: Props) {
  const isDark = variant === "dark";

  const palette = isDark
    ? {
        bgIdle: "rgba(255,255,255,0.04)",
        bgActive: "rgba(246,129,30,0.10)",
        borderIdle: "rgba(255,255,255,0.12)",
        borderActive: "rgba(246,129,30,0.55)",
        text: "rgba(255,255,255,0.85)",
        textMuted: "rgba(255,255,255,0.55)",
        link: "#F6811E",
        iconBg: "rgba(246,129,30,0.18)",
        iconColor: "#F6811E",
      }
    : {
        bgIdle: "#fafbff",
        bgActive: "rgba(246,129,30,0.06)",
        borderIdle: "#e8eaef",
        borderActive: "rgba(246,129,30,0.5)",
        text: "#333",
        textMuted: "#777",
        link: "#F6811E",
        iconBg: "rgba(246,129,30,0.12)",
        iconColor: "#F6811E",
      };

  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 select-none"
      style={{
        backgroundColor: checked ? palette.bgActive : palette.bgIdle,
        border: `1.5px solid ${checked ? palette.borderActive : palette.borderIdle}`,
      }}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200"
        style={{
          backgroundColor: checked ? "#F6811E" : "transparent",
          border: checked
            ? "1.5px solid #F6811E"
            : `1.5px solid ${isDark ? "rgba(255,255,255,0.35)" : "#c8ccd4"}`,
        }}
      >
        {checked && <Check size={13} strokeWidth={3} color="#fff" />}
      </span>

      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-1.5 mb-0.5">
          <Megaphone size={13} style={{ color: palette.iconColor }} />
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: palette.iconColor }}
          >
            Conteúdo promocional
          </span>
        </span>
        <span
          className="block text-xs leading-relaxed"
          style={{ color: palette.text }}
        >
          Concordo em receber conteúdos de marketing promocional da ACOMAC
          Joinville por <strong>e-mail</strong>, <strong>SMS</strong> e{" "}
          <strong>WhatsApp</strong>, incluindo ofertas, eventos, cursos e
          novidades do setor.
        </span>
        <span
          className="block text-[11px] mt-1.5 leading-relaxed"
          style={{ color: palette.textMuted }}
        >
          Você pode revogar este consentimento a qualquer momento. Saiba mais
          em nossa{" "}
          <a
            href="/privacidade"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
            style={{ color: palette.link }}
            onClick={(e) => e.stopPropagation()}
          >
            Política de Privacidade
          </a>
          .
        </span>
      </span>
    </label>
  );
}

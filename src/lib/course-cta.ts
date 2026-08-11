import { whatsappLink } from "@/lib/utils";

/** Campos de CTA que o admin preenche em cada curso. */
export type CourseCtaFields = {
  title: string;
  ctaType?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  ctaWhatsappNumber?: string | null;
  ctaWhatsappMessage?: string | null;
};

export type ResolvedCta = {
  href: string;
  label: string;
  /** true quando abre em outra aba (WhatsApp ou link externo) */
  external: boolean;
  kind: "whatsapp" | "link" | "contato";
};

/** Mensagem padrão de interesse, usada quando o admin não escreveu a dela. */
export function autoCourseMessage(title: string): string {
  const clean = title.trim();
  if (!clean)
    return "Olá! Tenho interesse em um curso da ACOMAC e gostaria de mais informações.";
  return `Olá! Tenho interesse no curso "${clean}" da ACOMAC. Gostaria de receber mais informações sobre datas, valores e como me inscrever.`;
}

/** Turma cuja data de encerramento já passou (sem data = sempre aberta). */
export function turmaEncerrada(endDate: string | Date | null | undefined): boolean {
  if (!endDate) return false;
  const fim = new Date(endDate).getTime();
  return !Number.isNaN(fim) && fim < Date.now();
}

/** Mensagem usada nas turmas que já aconteceram. */
export function proximaTurmaMessage(title: string): string {
  return `Olá! Vi que o curso "${title}" da ACOMAC já foi realizado. Gostaria de ser avisado quando abrir uma nova turma.`;
}

/**
 * Monta o destino do botão de inscrição a partir do que foi configurado no
 * painel. `fallbackWhatsapp` é o número geral do site, usado quando o curso não
 * tem número próprio.
 */
export function resolveCourseCta(
  course: CourseCtaFields,
  fallbackWhatsapp = "",
  overrides: { message?: string; label?: string } = {}
): ResolvedCta {
  const tipo = course.ctaType === "link" ? "link" : "whatsapp";
  const url = (course.ctaHref ?? "").trim();

  if (tipo === "link" && url) {
    return {
      href: url,
      label: overrides.label || (course.ctaLabel ?? "").trim() || "Fazer inscrição",
      external: true,
      kind: "link",
    };
  }

  const numero = ((course.ctaWhatsappNumber ?? "").trim() || fallbackWhatsapp).replace(
    /\D/g,
    ""
  );
  const mensagem =
    overrides.message ||
    (course.ctaWhatsappMessage ?? "").trim() ||
    autoCourseMessage(course.title);

  if (!numero) {
    return {
      href: "/#contato",
      label: overrides.label || (course.ctaLabel ?? "").trim() || "Falar com a equipe",
      external: false,
      kind: "contato",
    };
  }

  return {
    href: whatsappLink(numero, mensagem),
    label: overrides.label || (course.ctaLabel ?? "").trim() || "Quero me inscrever",
    external: true,
    kind: "whatsapp",
  };
}

import { whatsappLink } from "@/lib/utils";
import type { WhatsAppCta, GlobalContent } from "@/lib/content/schema";

/**
 * Resolve o link wa.me para um CTA configurado:
 * - Usa whatsappNumber do CTA se preenchido
 * - Caso contrário, cai pro número global do site
 * - Retorna o href com a mensagem encodada na URL
 */
export function resolveWhatsappCtaHref(
  cta: WhatsAppCta | undefined | null,
  globalNumber: string | undefined
): string {
  if (!cta) return "#";
  const number =
    (cta.whatsappNumber && cta.whatsappNumber.replace(/\D/g, "")) ||
    (globalNumber ?? "").replace(/\D/g, "");
  if (!number) return "#";
  return whatsappLink(number, cta.message);
}

/**
 * Lê o número global do WhatsApp do GlobalContent (pode ser null se não carregado ainda).
 */
export function getGlobalWhatsappNumber(
  global: GlobalContent | null | undefined
): string {
  return global?.whatsapp?.number ?? "";
}

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Contato — Fale com a ACOMAC Joinville",
  description:
    "Endereço, telefone, e-mail e WhatsApp da ACOMAC Joinville. Tire dúvidas, receba propostas e fale com nossa equipe sobre associação, eventos e parcerias.",
  path: "/contato",
});

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

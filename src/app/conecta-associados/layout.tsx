import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Conecta Associados — Lojas de Material de Construção em Joinville e Região",
  description:
    "Encontre lojas associadas ACOMAC por segmento, cidade ou produto. Vitrine pública dos lojistas de material de construção de Santa Catarina, com endereço, contato e WhatsApp.",
  path: "/conecta-associados",
});

export default function ConectaAssociadosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

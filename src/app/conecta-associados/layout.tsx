import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Conecta Associados — Empresas Associadas à ACOMAC",
  description:
    "Encontre as empresas associadas à ACOMAC por segmento, cidade ou produto. Vitrine pública dos associados em Joinville e região, com endereço, contato e WhatsApp.",
  path: "/conecta-associados",
});

export default function ConectaAssociadosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Política de Privacidade e Cookies — ACOMAC Joinville",
  description:
    "Política de Privacidade e Cookies da ACOMAC Joinville. Saiba como tratamos seus dados, incluindo o uso de e-mail e telefone para envio de conteúdo promocional e informativo.",
  path: "/privacidade",
});

export default function PrivacidadeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

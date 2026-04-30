import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Convênios e Parcerias para Lojistas Associados",
  description:
    "Convênios exclusivos da ACOMAC com a indústria de materiais de construção, prestadores de serviço e empresas parceiras: condições especiais, descontos e oportunidades para o varejo.",
  path: "/convenios",
});

export default function ConveniosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

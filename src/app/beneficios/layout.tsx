import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Benefícios para Associados — Cursos, Convênios e Representatividade",
  description:
    "Mais de 40 benefícios exclusivos para associados ACOMAC: capacitação profissional, convênios com a indústria, rodadas de negócios, pesquisa de mercado e representatividade do setor.",
  path: "/beneficios",
});

export default function BeneficiosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

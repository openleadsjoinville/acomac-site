import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Cursos da Academia da Construção — Capacitação para o Varejo",
  description:
    "Cursos presenciais e EAD da Academia da Construção da ACOMAC Joinville: vendas consultivas, gestão de loja, atendimento, técnicas de produto e formação para equipes do varejo de materiais de construção.",
  path: "/cursos",
});

export default function CursosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

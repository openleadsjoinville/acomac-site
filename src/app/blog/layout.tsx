import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog ACOMAC — Notícias e Conteúdos do Varejo de Construção",
  description:
    "Acompanhe artigos, pesquisas e bastidores do varejo de material de construção de Santa Catarina. Conteúdo prático para lojistas, gestores e equipes do setor.",
  path: "/blog",
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

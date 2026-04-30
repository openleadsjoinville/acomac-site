import "../globals.css";
import "./associar.css";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "Associe sua loja à ACOMAC Joinville",
  description:
    "Cadastre sua loja de material de construção e participe da maior associação do varejo de SC. Descontos em convênios, capacitação, eventos e visibilidade no Conecta Associados.",
  path: "/participe-do-conecta-associados",
});

export default function AssociarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="associar-root">{children}</div>;
}

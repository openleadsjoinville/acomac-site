import "../globals.css";
import "./associar.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro — ACOMAC Joinville",
  description: "Cadastre sua empresa no Conecta Associados ACOMAC.",
};

export default function AssociarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="associar-root">{children}</div>;
}

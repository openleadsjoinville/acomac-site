import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "A ACOMAC — 40 anos fortalecendo o varejo da construção em SC",
  description:
    "Conheça a ACOMAC Joinville: missão, valores, diretoria e a trajetória da maior associação do varejo de material de construção de Santa Catarina, fundada em 1983.",
  path: "/sobre",
});

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

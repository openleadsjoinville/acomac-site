import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ACOMAC Joinville | Associação dos Comerciantes de Material de Construção",
  description:
    "A maior associação do varejo de material de construção de Santa Catarina. Desde 1983 unindo e fortalecendo o comércio de materiais de construção em Joinville e região. Cursos, eventos, convênios e benefícios exclusivos para associados.",
  keywords:
    "ACOMAC, Joinville, material de construção, associação, varejo, construção civil, Santa Catarina, cursos, eventos, FENAC",
  openGraph: {
    title: "ACOMAC Joinville | Associação dos Comerciantes de Material de Construção",
    description:
      "A maior associação do varejo de material de construção de SC. Cursos, eventos, convênios e benefícios exclusivos.",
    type: "website",
    locale: "pt_BR",
    siteName: "ACOMAC Joinville",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}

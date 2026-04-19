import "../globals.css";
import "./admin.css";
import type { Metadata } from "next";
import { AdminShell } from "./_components/admin-shell";
import { ThemeProvider } from "./_components/theme-provider";

export const metadata: Metadata = {
  title: "Painel ACOMAC",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen" suppressHydrationWarning>
      <ThemeProvider>
        <AdminShell>{children}</AdminShell>
      </ThemeProvider>
    </div>
  );
}

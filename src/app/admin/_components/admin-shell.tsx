"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  GraduationCap,
  Newspaper,
  FileText,
  UserCheck,
  Inbox,
  Image as ImageIcon,
  Settings,
  Globe2,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Search,
  ChevronRight,
  Sun,
  Moon,
  Megaphone,
} from "lucide-react";
import { useAdminTheme } from "./theme-provider";
import { NotificationBell } from "./notification-bell";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  section: string;
};

const sections: string[] = ["Visão", "Conteúdo", "Coleções", "Pessoas", "Biblioteca", "Sistema"];

const baseTabs: Omit<NavItem, "badge">[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, section: "Visão" },
  { href: "/admin/pages", label: "Páginas do site", icon: FileText, section: "Conteúdo" },
  { href: "/admin/global", label: "Global & WhatsApp", icon: Globe2, section: "Conteúdo" },
  { href: "/admin/events", label: "Eventos", icon: Calendar, section: "Coleções" },
  { href: "/admin/courses", label: "Cursos", icon: GraduationCap, section: "Coleções" },
  { href: "/admin/blog", label: "Blog", icon: Newspaper, section: "Coleções" },
  { href: "/admin/sponsors", label: "Patrocinadores", icon: Megaphone, section: "Coleções" },
  { href: "/admin/associates", label: "Associados", icon: UserCheck, section: "Pessoas" },
  { href: "/admin/messages", label: "Formulários", icon: Inbox, section: "Pessoas" },
  { href: "/admin/media", label: "Mídia", icon: ImageIcon, section: "Biblioteca" },
  { href: "/admin/settings", label: "Configurações", icon: Settings, section: "Sistema" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggle: toggleTheme } = useAdminTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [brand, setBrand] = useState<{ logo: string; logoAlt: string } | null>(
    null
  );
  const [badges, setBadges] = useState<{ messages: number; associates: number }>({
    messages: 0,
    associates: 0,
  });

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/admin/analytics?range=1")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.kpis) {
          setBadges({
            messages: data.kpis.unreadMessages ?? 0,
            associates: data.kpis.associatesPending ?? 0,
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/public/global")
      .then((r) => (r.ok ? r.json() : null))
      .then((g) => {
        if (g?.brand) {
          setBrand({
            logo:
              g.brand.logo ||
              "/LOGO ACOMAC Joinville - 2020 - FINAL-01.avif",
            logoAlt: g.brand.logoAlt || "ACOMAC Joinville",
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const tabs: NavItem[] = baseTabs.map((t) => ({
    ...t,
    badge:
      t.href === "/admin/messages"
        ? badges.messages
        : t.href === "/admin/associates"
        ? badges.associates
        : undefined,
  }));

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sectioned = sections.map((s) => ({
    name: s,
    items: tabs.filter((t) => t.section === s),
  }));

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "var(--admin-sidebar)",
          borderRight: "1px solid var(--admin-border)",
        }}
      >
        {/* Brand */}
        <div
          className="px-5 py-4 flex items-center gap-3"
          style={{ borderBottom: "1px solid var(--admin-border)" }}
        >
          <Link
            href="/admin"
            className="flex items-center flex-1 min-w-0"
            aria-label={brand?.logoAlt || "ACOMAC Joinville"}
          >
            {brand ? (
              <Image
                src={brand.logo}
                alt={brand.logoAlt}
                width={180}
                height={48}
                priority
                unoptimized
                className="h-10 w-auto object-contain"
              />
            ) : (
              <div className="h-10 flex items-center">
                <span
                  className="text-sm font-bold tracking-tight"
                  style={{ color: "var(--admin-text-strong)" }}
                >
                  ACOMAC
                </span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md flex-shrink-0"
            style={{ color: "var(--admin-text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {sectioned.map(
            (sec) =>
              sec.items.length > 0 && (
                <div key={sec.name}>
                  <p
                    className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: "var(--admin-text-subtle)" }}
                  >
                    {sec.name}
                  </p>
                  <div className="space-y-0.5">
                    {sec.items.map((t) => {
                      const active =
                        t.href === "/admin"
                          ? pathname === t.href
                          : pathname === t.href || pathname.startsWith(t.href + "/");
                      const Icon = t.icon;
                      return (
                        <Link
                          key={t.href}
                          href={t.href}
                          onClick={() => setSidebarOpen(false)}
                          className="group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                          style={{
                            color: active ? "var(--admin-text-strong)" : "var(--admin-text-muted)",
                            background: active ? "var(--admin-accent-soft)" : "transparent",
                          }}
                          onMouseEnter={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = "var(--admin-surface)";
                              e.currentTarget.style.color = "var(--admin-text)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!active) {
                              e.currentTarget.style.background = "transparent";
                              e.currentTarget.style.color = "var(--admin-text-muted)";
                            }
                          }}
                        >
                          <Icon
                            size={15}
                            style={{ color: active ? "var(--admin-accent)" : undefined }}
                          />
                          <span className="flex-1">{t.label}</span>
                          {t.badge && t.badge > 0 ? (
                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                              style={{
                                background: "var(--admin-accent)",
                                color: "#fff",
                              }}
                            >
                              {t.badge}
                            </span>
                          ) : null}
                          {active && <ChevronRight size={13} style={{ color: "var(--admin-accent)" }} />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )
          )}
        </nav>

        {/* Footer nav */}
        <div
          className="p-3 space-y-1"
          style={{ borderTop: "1px solid var(--admin-border)" }}
        >
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
            style={{ color: "var(--admin-text-muted)" }}
          >
            <ExternalLink size={14} />
            Ver site público
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
            style={{ color: "var(--admin-text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.12)";
              e.currentTarget.style.color = "#ff8e8e";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--admin-text-muted)";
            }}
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 px-6 lg:px-8 py-3 flex items-center gap-3"
          style={{
            background: "var(--admin-topbar-bg)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--admin-border)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md"
            style={{ color: "var(--admin-text-muted)" }}
          >
            <Menu size={18} />
          </button>
          <div
            className="flex items-center gap-2 flex-1 max-w-md px-3 py-2 rounded-lg"
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
            }}
          >
            <Search size={14} style={{ color: "var(--admin-text-subtle)" }} />
            <input
              placeholder="Buscar páginas, eventos, associados..."
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--admin-text)" }}
            />
            <kbd
              className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded"
              style={{
                background: "var(--admin-surface-2)",
                color: "var(--admin-text-subtle)",
                border: "1px solid var(--admin-border)",
              }}
            >
              ⌘K
            </kbd>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="hidden md:inline text-xs"
              style={{ color: "var(--admin-text-subtle)" }}
            >
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </span>
            <NotificationBell />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors"
              style={{
                background: "var(--admin-surface)",
                border: "1px solid var(--admin-border)",
                color: "var(--admin-text-muted)",
              }}
              title={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
              aria-label="Alternar tema"
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden admin-fade-in">{children}</main>
      </div>
    </div>
  );
}

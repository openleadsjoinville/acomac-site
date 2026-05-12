"use client";

import { useEffect, useState } from "react";
import {
  Users as UsersIcon,
  Eye,
  MessageCircle,
  Inbox,
  Calendar,
  GraduationCap,
  Newspaper,
  Image as ImageIcon,
  UserCheck,
  TrendingUp,
  MousePointerClick,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
import Link from "next/link";
import { KPICard, Panel, PageHeader, SectionTitle, EmptyState, LinkCard } from "./_components/ui";

type Analytics = {
  kpis: {
    visitorsToday: number;
    visitors7d: number;
    visitors30d: number;
    pageviews30d: number;
    whatsappClicks: number;
    formSubmits: number;
    contactSubmits: number;
    associateSubmits: number;
    messagesCount: number;
    unreadMessages: number;
    associatesPending: number;
    associatesApproved: number;
    eventsCount: number;
    coursesCount: number;
    blogCount: number;
    mediaCount: number;
  };
  timeseries: { date: string; visitors: number; pageviews: number }[];
  topPages: { path: string; count: number }[];
  topClicks: { target: string; count: number }[];
};

const TARGET_LABELS: Record<string, string> = {
  whatsapp_floating: "WhatsApp flutuante",
  cta_hero: "CTA Hero",
  cta_associar: "Associe-se",
};

export function Dashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [range, setRange] = useState<7 | 30 | 90>(30);
  const [recent, setRecent] = useState<{
    associates: { id: string; companyName: string; city: string | null; status: string; createdAt: string }[];
    messages: { id: string; name: string; email: string; subject: string | null; createdAt: string; read: boolean }[];
  }>({ associates: [], messages: [] });

  useEffect(() => {
    fetch(`/api/admin/analytics?range=${range}`)
      .then((r) => r.json())
      .then(setData);
  }, [range]);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/associates").then((r) => r.json()),
      fetch("/api/admin/messages").then((r) => r.json()),
    ]).then(([assoc, msgs]) => {
      setRecent({
        associates: (assoc as typeof recent.associates).slice(0, 5),
        messages: (msgs as typeof recent.messages).slice(0, 5),
      });
    });
  }, []);

  const kpis = data?.kpis;

  return (
    <>
      <PageHeader
        eyebrow="Visão geral"
        title="Dashboard"
        subtitle="Acompanhe o desempenho do seu site: visitantes, cliques, formulários e o que precisa da sua atenção."
        actions={
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
            {([7, 30, 90] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md transition-colors"
                style={{
                  background: range === r ? "var(--admin-accent)" : "transparent",
                  color: range === r ? "#fff" : "var(--admin-text-muted)",
                }}
              >
                {r === 7 ? "7 dias" : r === 30 ? "30 dias" : "90 dias"}
              </button>
            ))}
          </div>
        }
      />

      <div className="px-6 lg:px-8 pb-10 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <KPICard
            label="Visitantes hoje"
            value={kpis?.visitorsToday ?? "—"}
            hint="Sessões únicas hoje"
            accent="blue"
            icon={<UsersIcon size={15} />}
          />
          <KPICard
            label={`Visitantes ${range}d`}
            value={kpis?.visitors30d ?? "—"}
            hint={`Últimos ${range} dias`}
            accent="accent"
            icon={<TrendingUp size={15} />}
          />
          <KPICard
            label="Cliques WhatsApp"
            value={kpis?.whatsappClicks ?? "—"}
            hint="Período selecionado"
            accent="success"
            icon={<MessageCircle size={15} />}
          />
          <KPICard
            label="Contatos recebidos"
            value={kpis?.contactSubmits ?? "—"}
            hint="Form. da página de contato"
            accent="warning"
            icon={<Inbox size={15} />}
          />
          <KPICard
            label="Cadastros Conecta"
            value={kpis?.associateSubmits ?? "—"}
            hint="Empresas que se inscreveram"
            accent="warning"
            icon={<UserCheck size={15} />}
          />
        </div>

        {/* Main chart + top pages */}
        <div className="grid lg:grid-cols-3 gap-4">
          <Panel className="lg:col-span-2">
            <SectionTitle
              title="Visitantes nos últimos dias"
              subtitle="Tráfego único por dia — baseado em sessões"
            />
            <div style={{ height: 280 }}>
              {data && data.timeseries.length > 0 ? (
                <ResponsiveContainer>
                  <AreaChart data={data.timeseries}>
                    <defs>
                      <linearGradient id="visitors" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F6811E" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#F6811E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--admin-border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="var(--admin-text-subtle)"
                      fontSize={10}
                      tickFormatter={(v) => {
                        const d = new Date(v);
                        return d.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                        });
                      }}
                    />
                    <YAxis
                      stroke="var(--admin-text-subtle)"
                      fontSize={10}
                      width={30}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--admin-surface-raised, #fff)",
                        border: "1px solid var(--admin-border)",
                        borderRadius: 8,
                        fontSize: 12,
                        color: "var(--admin-text)",
                      }}
                      labelStyle={{ color: "var(--admin-text-strong)", fontWeight: 600 }}
                      labelFormatter={(v) => new Date(v).toLocaleDateString("pt-BR")}
                    />
                    <Area
                      type="monotone"
                      dataKey="visitors"
                      stroke="#F6811E"
                      strokeWidth={2}
                      fill="url(#visitors)"
                      name="Visitantes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center" style={{ color: "var(--admin-text-subtle)" }}>
                  Carregando...
                </div>
              )}
            </div>
          </Panel>

          <Panel>
            <SectionTitle title="Páginas mais acessadas" />
            {data && data.topPages.length > 0 ? (
              <div style={{ height: 280 }}>
                <ResponsiveContainer>
                  <BarChart data={data.topPages} layout="vertical" margin={{ left: 8, right: 8 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--admin-border)"
                      horizontal={false}
                    />
                    <XAxis type="number" stroke="var(--admin-text-subtle)" fontSize={10} allowDecimals={false} />
                    <YAxis
                      type="category"
                      dataKey="path"
                      stroke="var(--admin-text)"
                      fontSize={11}
                      width={110}
                      tickFormatter={(v) => (v === "/" ? "Home" : v.slice(0, 14))}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#14171f",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="#4a8cff" radius={[0, 6, 6, 0]} name="Pageviews" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <EmptyState
                icon={<Eye size={20} />}
                title="Ainda sem dados"
                description="Os acessos aparecem aqui assim que chegarem."
              />
            )}
          </Panel>
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <MiniStat icon={<Calendar size={14} />} label="Eventos" value={kpis?.eventsCount ?? 0} href="/admin/events" />
          <MiniStat icon={<GraduationCap size={14} />} label="Cursos" value={kpis?.coursesCount ?? 0} href="/admin/courses" />
          <MiniStat icon={<Newspaper size={14} />} label="Posts do blog" value={kpis?.blogCount ?? 0} href="/admin/blog" />
          <MiniStat icon={<UserCheck size={14} />} label="Associados" value={kpis?.associatesApproved ?? 0} href="/admin/associates" />
          <MiniStat icon={<Inbox size={14} />} label="Msgs não lidas" value={kpis?.unreadMessages ?? 0} href="/admin/messages" highlight={!!(kpis?.unreadMessages ?? 0)} />
          <MiniStat icon={<ImageIcon size={14} />} label="Mídia" value={kpis?.mediaCount ?? 0} href="/admin/media" />
        </div>

        {/* Recent activity */}
        <div className="grid lg:grid-cols-2 gap-4">
          <Panel>
            <SectionTitle
              title="Últimos cadastros de associados"
              action={
                <Link
                  href="/admin/associates"
                  className="text-xs font-semibold"
                  style={{ color: "var(--admin-accent)" }}
                >
                  Ver todos →
                </Link>
              }
            />
            {recent.associates.length === 0 ? (
              <EmptyState
                icon={<UserCheck size={20} />}
                title="Nenhum cadastro ainda"
                description="Quando alguém se cadastrar no Conecta Associados, aparece aqui."
              />
            ) : (
              <ul className="space-y-2">
                {recent.associates.map((a) => (
                  <li
                    key={a.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                    style={{ background: "var(--admin-surface-2)" }}
                  >
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                      style={{
                        background: "var(--admin-accent-soft)",
                        color: "var(--admin-accent)",
                      }}
                    >
                      {a.companyName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {a.companyName}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--admin-text-muted)" }}>
                        {a.city ?? "—"} · {new Date(a.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <StatusPill status={a.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel>
            <SectionTitle
              title="Últimas mensagens de contato"
              action={
                <Link
                  href="/admin/messages"
                  className="text-xs font-semibold"
                  style={{ color: "var(--admin-accent)" }}
                >
                  Ver inbox →
                </Link>
              }
            />
            {recent.messages.length === 0 ? (
              <EmptyState
                icon={<Inbox size={20} />}
                title="Inbox limpa"
                description="Mensagens enviadas pelos formulários aparecem aqui."
              />
            ) : (
              <ul className="space-y-2">
                {recent.messages.map((m) => (
                  <li
                    key={m.id}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5"
                    style={{ background: "var(--admin-surface-2)" }}
                  >
                    {!m.read && (
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--admin-accent)" }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.name}</p>
                      <p className="text-[11px] truncate" style={{ color: "var(--admin-text-muted)" }}>
                        {m.subject ?? m.email}
                      </p>
                    </div>
                    <span className="text-[11px]" style={{ color: "var(--admin-text-subtle)" }}>
                      {new Date(m.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        {/* Top CTAs clicks */}
        <Panel>
          <SectionTitle
            title="Elementos mais clicados"
            subtitle="CTAs e botões rastreados no seu site"
          />
          {data && data.topClicks.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-3">
              {data.topClicks.map((c) => (
                <div
                  key={c.target}
                  className="flex items-center gap-3 rounded-lg px-4 py-3"
                  style={{ background: "var(--admin-surface-2)" }}
                >
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "rgba(74,140,255,0.15)",
                      color: "var(--admin-blue)",
                    }}
                  >
                    <MousePointerClick size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {TARGET_LABELS[c.target] ?? c.target}
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums">{c.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<MousePointerClick size={20} />}
              title="Ainda sem cliques rastreados"
              description="Ative o tracker em outros botões marcando com data-track."
            />
          )}
        </Panel>

        {/* Shortcuts */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--admin-text-muted)" }}>
            Atalhos
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <LinkCard
              href="/admin/events/new"
              title="Criar evento"
              description="Publique um novo evento em segundos"
              icon={<Calendar size={16} />}
            />
            <LinkCard
              href="/admin/courses/new"
              title="Criar curso"
              description="Adicione um curso ao catálogo"
              icon={<GraduationCap size={16} />}
            />
            <LinkCard
              href="/admin/blog/new"
              title="Novo post no blog"
              description="Escreva uma notícia ou artigo"
              icon={<Newspaper size={16} />}
            />
            <LinkCard
              href="/admin/global"
              title="Configurações globais"
              description="WhatsApp, redes e rodapé"
              icon={<MessageCircle size={16} />}
            />
          </div>
        </div>
      </div>
    </>
  );
}

function MiniStat({
  icon,
  label,
  value,
  href,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl p-3.5 admin-hover-ring"
      style={{
        background: highlight ? "rgba(246,129,30,0.08)" : "var(--admin-surface)",
        border: `1px solid ${highlight ? "rgba(246,129,30,0.35)" : "var(--admin-border)"}`,
      }}
    >
      <div className="flex items-center gap-2 mb-1.5" style={{ color: "var(--admin-text-muted)" }}>
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-bold tabular-nums">{value}</p>
    </Link>
  );
}

function StatusPill({ status }: { status: string }) {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    APPROVED: {
      bg: "rgba(34,197,94,0.12)",
      color: "#4ade80",
      label: "Aprovado",
    },
    PENDING: {
      bg: "rgba(245,158,11,0.12)",
      color: "#fbbf24",
      label: "Pendente",
    },
    REJECTED: {
      bg: "rgba(239,68,68,0.12)",
      color: "#f87171",
      label: "Rejeitado",
    },
  };
  const c = cfg[status] ?? cfg.PENDING;
  return (
    <span
      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.color }}
    >
      {c.label}
    </span>
  );
}

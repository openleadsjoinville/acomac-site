"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
  Plus,
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  Star,
  Search,
  Clock,
  AlertTriangle,
  CircleDot,
} from "lucide-react";
import { PageHeader, Panel, EmptyState } from "../_components/ui";

type Event = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  endDate: string | null;
  location: string;
  image: string;
  featured: boolean;
  published: boolean;
};

function eventDeadline(e: Event): Date {
  return new Date(e.endDate ?? e.date);
}

function eventIsExpired(e: Event): boolean {
  return eventDeadline(e).getTime() < Date.now();
}

export function EventsListClient() {
  const router = useRouter();
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "expired">("all");

  useEffect(() => {
    fetch("/api/admin/events")
      .then((r) => r.json())
      .then((d) => {
        setItems(d);
        setLoading(false);
      });
  }, []);

  async function togglePublished(e: Event) {
    const res = await fetch(`/api/admin/events/${e.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ published: !e.published }),
    });
    if (!res.ok) return toast.error("Erro ao atualizar");
    const updated = await res.json();
    setItems((prev) => prev.map((x) => (x.id === e.id ? updated : x)));
    toast.success(updated.published ? "Publicado" : "Rascunho");
  }

  async function toggleFeatured(e: Event) {
    const res = await fetch(`/api/admin/events/${e.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ featured: !e.featured }),
    });
    if (!res.ok) return toast.error("Erro ao atualizar");
    const updated = await res.json();
    setItems((prev) => prev.map((x) => (x.id === e.id ? updated : x)));
    toast.success(updated.featured ? "Destacado" : "Removido do destaque");
  }

  async function remove(e: Event) {
    if (!confirm(`Excluir "${e.title}"?`)) return;
    const res = await fetch(`/api/admin/events/${e.id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Erro ao excluir");
    setItems((prev) => prev.filter((x) => x.id !== e.id));
    toast.success("Evento excluído");
  }

  const filtered = items.filter((e) => {
    const expired = eventIsExpired(e);
    if (filter === "published" && (!e.published || expired)) return false;
    if (filter === "draft" && e.published) return false;
    if (filter === "expired" && !expired) return false;
    if (q && !`${e.title} ${e.location}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const activeCount = items.filter((e) => e.published && !eventIsExpired(e)).length;
  const expiredCount = items.filter((e) => eventIsExpired(e)).length;
  const draftCount = items.filter((e) => !e.published).length;

  return (
    <>
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: { background: "#14171f", border: "1px solid rgba(255,255,255,0.08)", color: "#e6e8ee" },
        }}
      />
      <PageHeader
        eyebrow="Coleções"
        title="Eventos"
        subtitle="Gerencie a agenda de eventos exibidos no site."
        actions={
          <Link href="/admin/events/new" className="admin-btn admin-btn-primary">
            <Plus size={14} />
            Novo evento
          </Link>
        }
      />

      <div className="px-6 lg:px-8 pb-10 space-y-4">
        <Panel padding="p-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-lg" style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)" }}>
              <Search size={14} style={{ color: "var(--admin-text-subtle)" }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar por título, local..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setFilter("all")} className={`admin-chip ${filter === "all" ? "active" : ""}`}>
                Todos ({items.length})
              </button>
              <button onClick={() => setFilter("published")} className={`admin-chip ${filter === "published" ? "active" : ""}`}>
                Ativos ({activeCount})
              </button>
              <button onClick={() => setFilter("draft")} className={`admin-chip ${filter === "draft" ? "active" : ""}`}>
                Rascunhos ({draftCount})
              </button>
              <button onClick={() => setFilter("expired")} className={`admin-chip ${filter === "expired" ? "active" : ""}`}>
                Expirados ({expiredCount})
              </button>
            </div>
          </div>
        </Panel>

        {loading ? (
          <Panel>
            <div className="py-10 text-center" style={{ color: "var(--admin-text-subtle)" }}>
              Carregando...
            </div>
          </Panel>
        ) : filtered.length === 0 ? (
          <Panel>
            <EmptyState
              icon={<Calendar size={20} />}
              title="Nenhum evento aqui"
              description="Crie o primeiro evento para aparecer no site."
              action={
                <Link href="/admin/events/new" className="admin-btn admin-btn-primary">
                  <Plus size={14} />
                  Novo evento
                </Link>
              }
            />
          </Panel>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((e) => {
              const expired = eventIsExpired(e);
              const deadline = eventDeadline(e);
              const status: "active" | "draft" | "expired" = !e.published
                ? "draft"
                : expired
                ? "expired"
                : "active";
              const statusStyle = {
                active: { bg: "rgba(34,197,94,0.15)", color: "#16a34a", label: "Ativo no site" },
                draft: { bg: "rgba(10,14,26,0.08)", color: "#8c93a3", label: "Rascunho" },
                expired: { bg: "rgba(217,119,6,0.15)", color: "#d97706", label: "Expirado" },
              }[status];

              return (
              <article
                key={e.id}
                className="rounded-2xl overflow-hidden admin-hover-ring"
                style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
              >
                <div className="relative">
                  {e.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.image}
                      alt={e.title}
                      className="block w-full h-auto"
                      style={{ background: "var(--admin-surface-2)" }}
                    />
                  ) : (
                    <div
                      className="w-full aspect-video"
                      style={{
                        background:
                          "linear-gradient(135deg, #0059AB 0%, #003d7a 100%)",
                      }}
                    />
                  )}
                  <div
                    className="absolute inset-x-0 top-0 h-20 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent)",
                    }}
                  />
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    {e.featured && !expired && e.published && (
                      <span className="admin-badge" style={{ color: "#fbbf24", background: "rgba(245,158,11,0.15)" }}>
                        <Star size={10} fill="currentColor" /> Destaque
                      </span>
                    )}
                    <span className="admin-badge" style={{ color: statusStyle.color, background: statusStyle.bg }}>
                      {status === "active" ? <CircleDot size={10} /> : status === "expired" ? <AlertTriangle size={10} /> : null}
                      {statusStyle.label}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-white mb-1 truncate">{e.title}</h3>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--admin-text-muted)" }}>
                    {e.description || "—"}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] mb-4" style={{ color: "var(--admin-text-muted)" }}>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(e.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                    {e.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} />
                        {e.location}
                      </span>
                    )}
                    <span
                      className="inline-flex items-center gap-1"
                      style={{ color: expired ? "#d97706" : undefined }}
                      title={expired ? "Data já passou — evento oculto no site" : "Sai do site nesta data"}
                    >
                      <Clock size={11} />
                      {expired ? "Expirou em " : "Até "}
                      {deadline.toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3" style={{ borderTop: "1px solid var(--admin-border)" }}>
                    <div className="flex items-center gap-2">
                      <ToggleSwitch
                        checked={e.published}
                        onChange={() => togglePublished(e)}
                        label={e.published ? "Ativo" : "Inativo"}
                      />
                      <button onClick={() => toggleFeatured(e)} title={e.featured ? "Remover destaque" : "Destacar"} className="p-1.5 rounded hover:bg-white/5" style={{ color: e.featured ? "#fbbf24" : "var(--admin-text-muted)" }}>
                        <Star size={14} fill={e.featured ? "currentColor" : "none"} />
                      </button>
                      <button onClick={() => remove(e)} className="p-1.5 rounded hover:bg-red-500/10" style={{ color: "var(--admin-text-muted)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => router.push(`/admin/events/${e.id}`)}
                      className="admin-btn admin-btn-ghost text-[11px] py-1.5 px-3"
                    >
                      <Edit3 size={12} />
                      Editar
                    </button>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="inline-flex items-center gap-2 rounded-full transition-colors"
      style={{ color: checked ? "var(--admin-success)" : "var(--admin-text-muted)" }}
    >
      <span
        className="relative inline-flex h-5 w-9 rounded-full transition-colors"
        style={{
          background: checked ? "var(--admin-success)" : "rgba(10,14,26,0.12)",
        }}
      >
        <span
          className="absolute inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
          style={{
            transform: `translate(${checked ? "18px" : "3px"}, 3px)`,
            boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
          }}
        />
      </span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
  Plus,
  GraduationCap,
  Edit3,
  Trash2,
  Star,
  Search,
  Clock,
  Tag,
  CalendarX,
  CircleDot,
  AlertTriangle,
} from "lucide-react";
import { PageHeader, Panel, EmptyState } from "../_components/ui";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  price: string;
  image: string;
  endDate: string | null;
  featured: boolean;
  published: boolean;
};

function courseIsExpired(c: Course): boolean {
  if (!c.endDate) return false;
  return new Date(c.endDate).getTime() < Date.now();
}

export function CoursesListClient() {
  const router = useRouter();
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft" | "expired">("all");

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((r) => r.json())
      .then((d) => {
        setItems(d);
        setLoading(false);
      });
  }, []);

  async function togglePublished(c: Course) {
    const res = await fetch(`/api/admin/courses/${c.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ published: !c.published }),
    });
    if (!res.ok) return toast.error("Erro ao atualizar");
    const u = await res.json();
    setItems((prev) => prev.map((x) => (x.id === c.id ? u : x)));
    toast.success(u.published ? "Publicado" : "Rascunho");
  }
  async function toggleFeatured(c: Course) {
    const res = await fetch(`/api/admin/courses/${c.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ featured: !c.featured }),
    });
    if (!res.ok) return toast.error("Erro ao atualizar");
    const u = await res.json();
    setItems((prev) => prev.map((x) => (x.id === c.id ? u : x)));
    toast.success(u.featured ? "Destacado" : "Removido");
  }
  async function remove(c: Course) {
    if (!confirm(`Excluir "${c.title}"?`)) return;
    const res = await fetch(`/api/admin/courses/${c.id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Erro ao excluir");
    setItems((prev) => prev.filter((x) => x.id !== c.id));
    toast.success("Curso excluído");
  }

  const categories = ["Todos", ...new Set(items.map((c) => c.category).filter(Boolean))];

  const filtered = items.filter((c) => {
    const expired = courseIsExpired(c);
    if (statusFilter === "active" && (!c.published || expired)) return false;
    if (statusFilter === "draft" && c.published) return false;
    if (statusFilter === "expired" && !expired) return false;
    if (cat !== "Todos" && c.category !== cat) return false;
    if (q && !`${c.title} ${c.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const activeCount = items.filter((c) => c.published && !courseIsExpired(c)).length;
  const draftCount = items.filter((c) => !c.published).length;
  const expiredCount = items.filter((c) => courseIsExpired(c)).length;

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow="Coleções"
        title="Cursos"
        subtitle="Cadastre cursos da Academia da Construção. Cada curso aparece no catálogo do site."
        actions={
          <Link href="/admin/courses/new" className="admin-btn admin-btn-primary">
            <Plus size={14} />
            Novo curso
          </Link>
        }
      />

      <div className="px-6 lg:px-8 pb-10 space-y-4">
        <Panel padding="p-3">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2 rounded-lg" style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)" }}>
              <Search size={14} style={{ color: "var(--admin-text-subtle)" }} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Buscar curso..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              <button onClick={() => setStatusFilter("all")} className={`admin-chip ${statusFilter === "all" ? "active" : ""}`}>
                Todos ({items.length})
              </button>
              <button onClick={() => setStatusFilter("active")} className={`admin-chip ${statusFilter === "active" ? "active" : ""}`}>
                Ativos ({activeCount})
              </button>
              <button onClick={() => setStatusFilter("draft")} className={`admin-chip ${statusFilter === "draft" ? "active" : ""}`}>
                Rascunhos ({draftCount})
              </button>
              <button onClick={() => setStatusFilter("expired")} className={`admin-chip ${statusFilter === "expired" ? "active" : ""}`}>
                Expirados ({expiredCount})
              </button>
            </div>
          </div>
          <div className="flex gap-1 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={`admin-chip ${cat === c ? "active" : ""}`}>
                {c}
              </button>
            ))}
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
              icon={<GraduationCap size={20} />}
              title="Nenhum curso aqui"
              description="Crie o primeiro curso para aparecer no site."
              action={
                <Link href="/admin/courses/new" className="admin-btn admin-btn-primary">
                  <Plus size={14} />
                  Novo curso
                </Link>
              }
            />
          </Panel>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c) => {
              const expired = courseIsExpired(c);
              const status: "active" | "draft" | "expired" = !c.published
                ? "draft"
                : expired
                ? "expired"
                : "active";
              const statusStyle = {
                active: { bg: "rgba(34,197,94,0.15)", color: "#16a34a", label: "Ativo", icon: <CircleDot size={10} /> },
                draft: { bg: "rgba(10,14,26,0.08)", color: "#8c93a3", label: "Rascunho", icon: null as React.ReactNode },
                expired: { bg: "rgba(217,119,6,0.15)", color: "#d97706", label: "Expirado", icon: <AlertTriangle size={10} /> },
              }[status];

              return (
              <article
                key={c.id}
                className="rounded-2xl overflow-hidden admin-hover-ring"
                style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
              >
                <div
                  className="h-32 relative"
                  style={{
                    background: c.image
                      ? `url(${c.image}) center/cover`
                      : "linear-gradient(135deg, #4a8cff 0%, #0059AB 100%)",
                  }}
                >
                  <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                    {c.featured && !expired && c.published && (
                      <span className="admin-badge" style={{ color: "#fbbf24", background: "rgba(245,158,11,0.15)" }}>
                        <Star size={10} fill="currentColor" /> Destaque
                      </span>
                    )}
                    <span className="admin-badge" style={{ color: statusStyle.color, background: statusStyle.bg }}>
                      {statusStyle.icon}
                      {statusStyle.label}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  {c.category && (
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--admin-accent)" }}>
                      {c.category}
                    </span>
                  )}
                  <h3 className="font-semibold text-white mt-1 mb-1 truncate">{c.title}</h3>
                  <p className="text-xs mb-3 line-clamp-2" style={{ color: "var(--admin-text-muted)" }}>
                    {c.description || "—"}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] mb-3" style={{ color: "var(--admin-text-muted)" }}>
                    {c.duration && (
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} />
                        {c.duration}
                      </span>
                    )}
                    {c.level && (
                      <span className="inline-flex items-center gap-1">
                        <Tag size={11} />
                        {c.level}
                      </span>
                    )}
                    {c.endDate && (
                      <span
                        className="inline-flex items-center gap-1"
                        style={{ color: expired ? "#d97706" : undefined }}
                        title={expired ? "Curso oculto no site (expirado)" : "Sai do site nesta data"}
                      >
                        <CalendarX size={11} />
                        {expired ? "Expirou em " : "Até "}
                        {new Date(c.endDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-3" style={{ borderTop: "1px solid var(--admin-border)" }}>
                    <div className="flex items-center gap-2">
                      <CourseToggle
                        checked={c.published}
                        onChange={() => togglePublished(c)}
                        label={c.published ? "Ativo" : "Inativo"}
                      />
                      <button onClick={() => toggleFeatured(c)} className="p-1.5 rounded hover:bg-white/5" style={{ color: c.featured ? "#fbbf24" : "var(--admin-text-muted)" }}>
                        <Star size={14} fill={c.featured ? "currentColor" : "none"} />
                      </button>
                      <button onClick={() => remove(c)} className="p-1.5 rounded hover:bg-red-500/10" style={{ color: "var(--admin-text-muted)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <button onClick={() => router.push(`/admin/courses/${c.id}`)} className="admin-btn admin-btn-ghost text-[11px] py-1.5 px-3">
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

function CourseToggle({
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
      <span className="relative inline-flex h-5 w-9 rounded-full transition-colors" style={{ background: checked ? "var(--admin-success)" : "rgba(10,14,26,0.12)" }}>
        <span className="absolute inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform" style={{ transform: `translate(${checked ? "18px" : "3px"}, 3px)`, boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
      </span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

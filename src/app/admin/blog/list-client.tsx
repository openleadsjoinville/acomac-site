"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import {
  Plus,
  Newspaper,
  Eye,
  EyeOff,
  Edit3,
  Trash2,
  Star,
  Search,
  Clock,
  ExternalLink,
} from "lucide-react";
import { PageHeader, Panel, EmptyState } from "../_components/ui";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: string;
  tags: string;
  category: string;
  readTime: string;
  featured: boolean;
  published: boolean;
  publishedAt: string | null;
};

export function BlogListClient() {
  const router = useRouter();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((d) => {
        setItems(d);
        setLoading(false);
      });
  }, []);

  async function toggle(p: Post, key: "published" | "featured") {
    const res = await fetch(`/api/admin/blog/${p.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ [key]: !p[key] }),
    });
    if (!res.ok) return toast.error("Erro ao atualizar");
    const u = await res.json();
    setItems((prev) => prev.map((x) => (x.id === p.id ? u : x)));
    toast.success("Atualizado");
  }
  async function remove(p: Post) {
    if (!confirm(`Excluir "${p.title}"?`)) return;
    const res = await fetch(`/api/admin/blog/${p.id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Erro ao excluir");
    setItems((prev) => prev.filter((x) => x.id !== p.id));
    toast.success("Post excluído");
  }

  const filtered = items.filter((p) => {
    if (filter === "published" && !p.published) return false;
    if (filter === "draft" && p.published) return false;
    if (q && !`${p.title} ${p.category}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow="Coleções"
        title="Blog"
        subtitle="Notícias, artigos e conteúdos publicados no site."
        actions={
          <Link href="/admin/blog/new" className="admin-btn admin-btn-primary">
            <Plus size={14} />
            Novo post
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
                placeholder="Buscar posts..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            <div className="flex gap-1">
              {(["all", "published", "draft"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`admin-chip ${filter === f ? "active" : ""}`}>
                  {f === "all" ? "Todos" : f === "published" ? "Publicados" : "Rascunhos"}
                </button>
              ))}
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
              icon={<Newspaper size={20} />}
              title="Nenhum post ainda"
              description="Escreva sua primeira notícia ou artigo."
              action={
                <Link href="/admin/blog/new" className="admin-btn admin-btn-primary">
                  <Plus size={14} />
                  Novo post
                </Link>
              }
            />
          </Panel>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <article
                key={p.id}
                className="rounded-xl p-4 flex gap-4 admin-hover-ring"
                style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
              >
                <div
                  className="w-28 h-20 rounded-lg flex-shrink-0"
                  style={{
                    background: p.coverImage
                      ? `url(${p.coverImage}) center/cover`
                      : "linear-gradient(135deg, #003d7a 0%, #0059AB 50%, #1a72c4 100%)",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {p.featured && (
                        <span className="admin-badge" style={{ color: "#fbbf24", background: "rgba(245,158,11,0.15)" }}>
                          <Star size={10} fill="currentColor" /> Destaque
                        </span>
                      )}
                      <span className="admin-badge" style={{ color: p.published ? "#4ade80" : "#8c93a3", background: p.published ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)" }}>
                        {p.published ? "Publicado" : "Rascunho"}
                      </span>
                      {p.category && (
                        <span className="text-[11px] font-semibold" style={{ color: "var(--admin-accent)" }}>
                          {p.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-1 truncate">{p.title}</h3>
                  <p className="text-xs line-clamp-2 mb-2" style={{ color: "var(--admin-text-muted)" }}>
                    {p.excerpt || "—"}
                  </p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px]" style={{ color: "var(--admin-text-subtle)" }}>
                    <span>{p.author}</span>
                    {p.publishedAt && (
                      <span>
                        {new Date(p.publishedAt).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                    {p.readTime && (
                      <span className="inline-flex items-center gap-1">
                        <Clock size={10} />
                        {p.readTime}
                      </span>
                    )}
                    {p.published && (
                      <Link href={`/blog/${p.slug}`} target="_blank" className="inline-flex items-center gap-1 hover:text-white">
                        <ExternalLink size={10} />
                        Ver no site
                      </Link>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-0.5">
                  <button onClick={() => toggle(p, "published")} className="p-1.5 rounded hover:bg-white/5" style={{ color: "var(--admin-text-muted)" }}>
                    {p.published ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => toggle(p, "featured")} className="p-1.5 rounded hover:bg-white/5" style={{ color: p.featured ? "#fbbf24" : "var(--admin-text-muted)" }}>
                    <Star size={14} fill={p.featured ? "currentColor" : "none"} />
                  </button>
                  <button onClick={() => router.push(`/admin/blog/${p.id}`)} className="p-1.5 rounded hover:bg-white/5" style={{ color: "var(--admin-text-muted)" }}>
                    <Edit3 size={14} />
                  </button>
                  <button onClick={() => remove(p)} className="p-1.5 rounded hover:bg-red-500/10" style={{ color: "var(--admin-text-muted)" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import {
  ArrowLeft,
  Save,
  Trash2,
  ExternalLink,
  Eye,
  Send,
  CircleDot,
  Sparkles,
  Plus,
  Check,
  X,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { PageHeader, Panel, ToggleRow, StatusPill } from "../_components/ui";
import { LargeImageField } from "@/components/ui/LargeImageField";
import { CONTEXT_PRESETS } from "@/lib/image-presets";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { autoExcerpt, autoReadTime, stripHtml } from "@/lib/blog-helpers";
import BlogPostView, { type BlogPostData } from "@/components/public/BlogPostView";

const PREVIEW_STORAGE_KEY = "acomac_blog_preview";

type Data = {
  slug?: string;
  title: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string;
  category: string;
  published: boolean;
  featured: boolean;
  publishedAt: string;
};

const empty: Data = {
  title: "",
  content: "",
  coverImage: "",
  author: "ACOMAC Joinville",
  tags: "",
  category: "",
  published: false,
  featured: false,
  publishedAt: "",
};

type Category = { id: string; name: string; slug: string };

function nowLocalInput(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function BlogForm({ id }: { id?: string }) {
  const router = useRouter();
  const [data, setData] = useState<Data>({ ...empty, publishedAt: nowLocalInput() });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    fetch("/api/admin/blog-categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then((items) => {
        const found = items.find((x: { id: string }) => x.id === id);
        if (found) {
          setData({
            title: found.title ?? "",
            content: found.content ?? "",
            coverImage: found.coverImage ?? "",
            author: found.author ?? "ACOMAC Joinville",
            tags: found.tags ?? "",
            category: found.category ?? "",
            published: !!found.published,
            featured: !!found.featured,
            publishedAt: found.publishedAt
              ? toLocalInput(new Date(found.publishedAt))
              : nowLocalInput(),
          });
          setSlug(found.slug);
        }
        setLoading(false);
      });
  }, [id]);

  async function save() {
    if (!data.title.trim()) return toast.error("Título obrigatório");
    setSaving(data.published ? "publish" : "draft");
    const payload = {
      ...data,
      publishedAt:
        data.published && !data.publishedAt
          ? nowLocalInput()
          : data.publishedAt || null,
    };
    const url = id ? `/api/admin/blog/${id}` : "/api/admin/blog";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(null);
    if (!res.ok) return toast.error("Erro ao salvar");
    const saved = await res.json();
    toast.success(
      data.published ? "Publicado no site!" : "Salvo como rascunho"
    );
    setSlug(saved.slug);
    setData((d) => ({
      ...d,
      published: !!saved.published,
      featured: !!saved.featured,
    }));
    if (!id) router.push(`/admin/blog/${saved.id}`);
  }

  async function remove() {
    if (!id || !confirm("Excluir este post?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    router.push("/admin/blog");
  }

  async function createCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const res = await fetch("/api/admin/blog-categories", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      toast.error("Erro ao criar categoria");
      return;
    }
    const cat: Category = await res.json();
    setCategories((prev) =>
      prev.some((c) => c.id === cat.id)
        ? prev
        : [...prev, cat].sort((a, b) => a.name.localeCompare(b.name))
    );
    setData((d) => ({ ...d, category: cat.name }));
    setNewCategoryName("");
    setNewCategoryOpen(false);
    toast.success("Categoria criada");
  }

  const set = <K extends keyof Data>(k: K) => (v: Data[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const wordCount = useMemo(
    () => stripHtml(data.content).split(/\s+/).filter(Boolean).length,
    [data.content]
  );
  const readTime = useMemo(() => autoReadTime(data.content), [data.content]);
  const excerptPreview = useMemo(() => autoExcerpt(data.content), [data.content]);

  // Sincroniza dados do post no localStorage para a rota /blog/preview
  useEffect(() => {
    if (typeof window === "undefined") return;
    const payload: BlogPostData = {
      title: data.title,
      content: data.content,
      excerpt: excerptPreview,
      coverImage: data.coverImage,
      author: data.author,
      tags: data.tags,
      category: data.category,
      readTime,
      publishedAt: data.publishedAt
        ? new Date(data.publishedAt).toISOString()
        : null,
    };
    try {
      localStorage.setItem(
        PREVIEW_STORAGE_KEY,
        JSON.stringify({ data: payload, time: Date.now() })
      );
    } catch {
      /* ignore quota errors */
    }
  }, [data, excerptPreview, readTime]);

  function openInNewTab() {
    window.open("/blog/preview", "_blank", "noopener,noreferrer");
  }

  if (loading) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--admin-text-subtle)" }}>
        Carregando...
      </div>
    );
  }

  const isPublished = data.published;

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow={id ? "Editar post" : "Novo post"}
        title={id ? data.title || "Post" : "Escrever novo post"}
        subtitle="Crie artigos, notícias e publicações do blog ACOMAC."
        actions={
          <>
            <Link href="/admin/blog" className="admin-btn admin-btn-ghost">
              <ArrowLeft size={14} />
              Voltar
            </Link>
            {id && isPublished && slug && (
              <Link
                href={`/blog/${slug}`}
                target="_blank"
                className="admin-btn admin-btn-ghost"
              >
                <ExternalLink size={14} />
                Ver no site
              </Link>
            )}
            {id && (
              <button onClick={remove} className="admin-btn admin-btn-danger-ghost">
                <Trash2 size={14} />
                Excluir
              </button>
            )}
          </>
        }
      />

      <div className="px-6 lg:px-8 pb-10 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Panel>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Título do post</label>
                <input
                  className="admin-input"
                  style={{ fontSize: 18, fontWeight: 600 }}
                  value={data.title}
                  onChange={(e) => set("title")(e.target.value)}
                  placeholder="Título chamativo que aparece no topo"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="admin-label" style={{ marginBottom: 0 }}>
                    Conteúdo
                  </label>
                  <div
                    className="flex items-center gap-3 text-[11px]"
                    style={{ color: "var(--admin-text-muted)" }}
                  >
                    <span>{wordCount} palavras</span>
                    {readTime && (
                      <span className="inline-flex items-center gap-1">
                        <Clock size={11} />
                        {readTime}
                      </span>
                    )}
                  </div>
                </div>
                <RichTextEditor
                  value={data.content}
                  onChange={set("content")}
                  placeholder="Comece a escrever seu post..."
                />
                {excerptPreview && (
                  <p
                    className="text-[11px] mt-2"
                    style={{ color: "var(--admin-text-subtle)" }}
                  >
                    <strong style={{ color: "var(--admin-text-muted)" }}>
                      Resumo automático:
                    </strong>{" "}
                    {excerptPreview}
                  </p>
                )}
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          {/* Ações principais */}
          <Panel>
            <h3
              className="font-semibold mb-3"
              style={{ color: "var(--admin-text-strong)" }}
            >
              Publicação
            </h3>

            <div className="mb-4">
              <StatusPill
                active={isPublished}
                activeLabel="Publicado"
                inactiveLabel="Rascunho"
                extra={data.featured ? "Em destaque" : undefined}
              />
            </div>

            {/* Toggles de status */}
            <div className="space-y-1 mb-4">
              <ToggleRow
                icon={<CircleDot size={14} />}
                label="Publicar no site"
                hint={
                  isPublished
                    ? "Visível em /blog"
                    : "Salvar manterá como rascunho (oculto no site)"
                }
                value={data.published}
                onChange={set("published")}
              />
              <ToggleRow
                icon={<Sparkles size={14} />}
                label="Destacar"
                hint={
                  data.featured
                    ? "Aparece como matéria principal na listagem"
                    : "Post comum, sem destaque visual"
                }
                value={data.featured}
                onChange={set("featured")}
              />
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => save()}
                disabled={saving !== null}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all hover:-translate-y-0.5"
                style={{
                  background: isPublished
                    ? "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)"
                    : "linear-gradient(135deg, #F6811E 0%, #ff9a3f 100%)",
                  boxShadow: isPublished
                    ? "0 6px 18px rgba(22,163,74,0.35)"
                    : "0 6px 18px rgba(246,129,30,0.35)",
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {isPublished ? <Send size={15} /> : <Save size={15} />}
                {saving === "publish"
                  ? "Publicando..."
                  : saving === "draft"
                  ? "Salvando..."
                  : isPublished
                  ? "Salvar e publicar"
                  : "Salvar rascunho"}
              </button>
              <button
                onClick={() => setPreviewOpen(true)}
                disabled={!data.title && !data.content}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                style={{
                  background: "var(--admin-accent-soft)",
                  color: "var(--admin-accent)",
                  border: "1px solid rgba(246,129,30,0.25)",
                }}
              >
                <Eye size={14} />
                Ver prévia (pop-up)
              </button>
              <button
                onClick={openInNewTab}
                disabled={!data.title && !data.content}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs transition-all hover:-translate-y-0.5"
                style={{
                  background: "var(--admin-surface-2)",
                  color: "var(--admin-text-strong)",
                  border: "1px solid var(--admin-border)",
                }}
                title="Abre uma nova guia mostrando o post exatamente como vai aparecer no site"
              >
                <ExternalLink size={13} />
                Ver em nova guia (como no site)
              </button>
            </div>
          </Panel>

          <Panel>
            <h3
              className="font-semibold mb-3"
              style={{ color: "var(--admin-text-strong)" }}
            >
              Categoria
            </h3>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => set("category")(c.name)}
                  className={`admin-chip ${
                    data.category === c.name ? "active" : ""
                  }`}
                >
                  {data.category === c.name && <Check size={11} />}
                  {c.name}
                </button>
              ))}
              <button
                onClick={() => setNewCategoryOpen((v) => !v)}
                className="admin-chip"
                style={{ background: "transparent", borderStyle: "dashed" }}
              >
                <Plus size={11} />
                Nova
              </button>
            </div>
            {newCategoryOpen && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  className="admin-input"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      createCategory();
                    }
                  }}
                  placeholder="Nome da categoria"
                  autoFocus
                />
                <button
                  onClick={createCategory}
                  className="admin-btn admin-btn-primary"
                  style={{ padding: "8px 12px" }}
                >
                  <Check size={13} />
                </button>
                <button
                  onClick={() => {
                    setNewCategoryOpen(false);
                    setNewCategoryName("");
                  }}
                  className="admin-btn admin-btn-ghost"
                  style={{ padding: "8px 10px" }}
                >
                  <X size={13} />
                </button>
              </div>
            )}
            <p
              className="text-[11px] mt-2"
              style={{ color: "var(--admin-text-muted)" }}
            >
              Novas categorias ficam salvas pra os próximos posts.
            </p>
          </Panel>

          <Panel>
            <h3
              className="font-semibold mb-3"
              style={{ color: "var(--admin-text-strong)" }}
            >
              Detalhes
            </h3>
            <div className="space-y-3">
              <div>
                <label className="admin-label flex items-center gap-1.5">
                  <Calendar size={11} />
                  Data de publicação
                </label>
                <div className="flex gap-2">
                  <input
                    type="datetime-local"
                    className="admin-input flex-1"
                    value={data.publishedAt}
                    onChange={(e) => set("publishedAt")(e.target.value)}
                  />
                  <button
                    onClick={() => set("publishedAt")(nowLocalInput())}
                    className="admin-btn admin-btn-ghost"
                    title="Usar data e hora atual"
                    style={{ padding: "8px 12px" }}
                  >
                    Agora
                  </button>
                </div>
              </div>
              <div>
                <label className="admin-label flex items-center gap-1.5">
                  <User size={11} />
                  Autor
                </label>
                <input
                  className="admin-input"
                  value={data.author}
                  onChange={(e) => set("author")(e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Tags (separadas por vírgula)</label>
                <input
                  className="admin-input"
                  value={data.tags}
                  onChange={(e) => set("tags")(e.target.value)}
                  placeholder="mercado, pesquisa"
                />
              </div>
              {slug && (
                <div>
                  <label className="admin-label">URL do post</label>
                  <p
                    className="text-xs font-mono"
                    style={{ color: "var(--admin-text-muted)" }}
                  >
                    /blog/{slug}
                  </p>
                </div>
              )}
            </div>
          </Panel>

          <Panel>
            <h3
              className="font-semibold mb-3"
              style={{ color: "var(--admin-text-strong)" }}
            >
              Imagem de capa
            </h3>
            <LargeImageField
              value={data.coverImage}
              onChange={set("coverImage")}
              preset={CONTEXT_PRESETS.blogCover}
              endpoint="/api/admin/upload"
            />
          </Panel>
        </div>
      </div>

      {previewOpen && (
        <PreviewModal
          data={data}
          slug={slug}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="relative inline-flex h-5 w-9 rounded-full transition-colors"
      style={{
        background: value ? "var(--admin-accent)" : "rgba(10,14,26,0.12)",
      }}
    >
      <span
        className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
        style={{
          transform: `translate(${value ? "18px" : "3px"}, 3px)`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

function PreviewModal({
  data,
  onClose,
}: {
  data: Data;
  slug: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const viewData: BlogPostData = {
    title: data.title,
    content: data.content,
    coverImage: data.coverImage,
    author: data.author,
    tags: data.tags,
    category: data.category,
    publishedAt: data.publishedAt || undefined,
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(5,7,12,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-4xl flex flex-col overflow-hidden"
        style={{
          background: "#fff",
          borderRadius: 16,
          height: "min(92vh, 820px)",
          maxHeight: "calc(100vh - 32px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between gap-3 px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid #eceef2", background: "#fff" }}
        >
          <div className="min-w-0">
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "#F6811E" }}
            >
              Prévia do post
            </p>
            <p className="text-xs" style={{ color: "#6b7486" }}>
              Atualiza em tempo real enquanto você edita
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100"
            style={{ color: "#6b7486" }}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="flex-1 min-h-0 overflow-y-auto"
          style={{ background: "#f7f7f7" }}
        >
          <BlogPostView data={viewData} />
        </div>
      </div>
    </div>
  );
}

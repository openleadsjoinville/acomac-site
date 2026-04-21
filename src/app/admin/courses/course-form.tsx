"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import {
  ArrowLeft,
  CircleDot,
  MessageCircle,
  Phone,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import { PageHeader, Panel, ToggleRow, StatusPill } from "../_components/ui";
import { LargeImageField } from "@/components/ui/LargeImageField";
import { CONTEXT_PRESETS } from "@/lib/image-presets";

function autoMessage(title: string): string {
  const clean = title.trim();
  if (!clean) return "Olá! Tenho interesse em um curso da ACOMAC e gostaria de mais informações.";
  return `Olá! Tenho interesse no curso "${clean}" da ACOMAC. Gostaria de receber mais informações sobre datas, valores e como me inscrever.`;
}

function formatPhoneInput(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

type CourseData = {
  title: string;
  description: string;
  content: string;
  category: string;
  duration: string;
  level: string;
  price: string;
  instructor: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  startDate: string;
  endDate: string;
  published: boolean;
  featured: boolean;
  orderIndex: number;
};

const empty: CourseData = {
  title: "",
  description: "",
  content: "",
  category: "",
  duration: "",
  level: "Básico",
  price: "",
  instructor: "",
  image: "",
  ctaLabel: "",
  ctaHref: "",
  startDate: "",
  endDate: "",
  published: true,
  featured: false,
  orderIndex: 0,
};

export function CourseForm({ id }: { id?: string }) {
  const router = useRouter();
  const [data, setData] = useState<CourseData>(empty);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [globalWhatsapp, setGlobalWhatsapp] = useState<string>("");
  // Marca se a mensagem já foi tocada manualmente — quando false, sincroniza com o título
  const messageTouched = useRef(false);

  useEffect(() => {
    fetch("/api/public/global")
      .then((r) => r.json())
      .then((g) => setGlobalWhatsapp(g?.whatsapp?.number ?? ""))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch("/api/admin/courses")
      .then((r) => r.json())
      .then((items) => {
        const found = items.find((x: { id: string }) => x.id === id);
        if (found) {
          setData({
            ...found,
            startDate: found.startDate ? new Date(found.startDate).toISOString().slice(0, 16) : "",
            endDate: found.endDate ? new Date(found.endDate).toISOString().slice(0, 16) : "",
          });
          if (found.ctaLabel) messageTouched.current = true;
        }
        setLoading(false);
      });
  }, [id]);

  // Auto-gerar mensagem com base no título enquanto o usuário não editar manualmente
  useEffect(() => {
    if (messageTouched.current) return;
    setData((d) => ({ ...d, ctaLabel: autoMessage(d.title) }));
  }, [data.title]);

  async function save() {
    if (!data.title.trim()) return toast.error("Título obrigatório");
    setSaving(true);
    const body = {
      ...data,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
    };
    const url = id ? `/api/admin/courses/${id}` : "/api/admin/courses";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) return toast.error("Erro ao salvar");
    const saved = await res.json();
    toast.success(id ? "Salvo!" : "Curso criado!");
    if (!id) router.push(`/admin/courses/${saved.id}`);
  }

  async function remove() {
    if (!id || !confirm("Excluir este curso?")) return;
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    router.push("/admin/courses");
  }

  const set = <K extends keyof CourseData>(k: K) => (v: CourseData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  if (loading) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--admin-text-subtle)" }}>
        Carregando...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow={id ? "Editar curso" : "Novo curso"}
        title={id ? data.title || "Curso" : "Criar novo curso"}
        subtitle="Dados do curso exibidos no catálogo público."
        actions={
          <>
            <Link href="/admin/courses" className="admin-btn admin-btn-ghost">
              <ArrowLeft size={14} />
              Voltar
            </Link>
            {id && (
              <button onClick={remove} className="admin-btn admin-btn-danger-ghost">
                <Trash2 size={14} />
                Excluir
              </button>
            )}
            <button onClick={save} disabled={saving} className="admin-btn admin-btn-primary">
              <Save size={14} />
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </>
        }
      />

      <div className="px-6 lg:px-8 pb-10 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Panel>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Título do curso</label>
                <input className="admin-input" value={data.title} onChange={(e) => set("title")(e.target.value)} placeholder="Ex: Vendas Consultivas no Varejo" />
              </div>
              <div>
                <label className="admin-label">Descrição curta</label>
                <textarea className="admin-input admin-textarea" value={data.description} onChange={(e) => set("description")(e.target.value)} placeholder="O que o aluno vai aprender" />
              </div>
              <div>
                <label className="admin-label">Ementa completa (opcional)</label>
                <textarea className="admin-input admin-textarea" value={data.content} onChange={(e) => set("content")(e.target.value)} rows={8} placeholder="Conteúdo programático detalhado" />
              </div>
            </div>
          </Panel>

          <Panel>
            <h3 className="font-semibold text-white mb-4">Detalhes</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Categoria</label>
                <CategoryField value={data.category} onChange={set("category")} />
              </div>
              <div>
                <label className="admin-label">Duração</label>
                <input className="admin-input" value={data.duration} onChange={(e) => set("duration")(e.target.value)} placeholder="16h" />
              </div>
              <div>
                <label className="admin-label">Nível</label>
                <select className="admin-input" value={data.level} onChange={(e) => set("level")(e.target.value)}>
                  <option>Básico</option>
                  <option>Intermediário</option>
                  <option>Avançado</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Instrutor</label>
                <input className="admin-input" value={data.instructor} onChange={(e) => set("instructor")(e.target.value)} placeholder="Nome do instrutor" />
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Preço</label>
                <input className="admin-input" value={data.price} onChange={(e) => set("price")(e.target.value)} placeholder="Ex: R$ 380 · Associados: grátis" />
              </div>
              <div>
                <label className="admin-label">Data de início (opcional)</label>
                <input type="datetime-local" className="admin-input" value={data.startDate} onChange={(e) => set("startDate")(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Data de encerramento (opcional)</label>
                <input type="datetime-local" className="admin-input" value={data.endDate} onChange={(e) => set("endDate")(e.target.value)} />
                <p className="text-[11px] mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
                  Ao chegar esta data, o curso sai automaticamente do site. Deixe em branco para exibir sempre.
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <h3 className="font-semibold text-white mb-1.5">Chamada de ação (WhatsApp)</h3>
            <p
              className="text-[12px] mb-4"
              style={{ color: "var(--admin-text-muted)" }}
            >
              Quando o aluno clicar no botão do card, o WhatsApp abre com a mensagem pré-preenchida e direcionada ao número configurado.
            </p>
            <div className="grid lg:grid-cols-[1fr_280px] gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className="admin-label flex items-center gap-1.5"
                    style={{ margin: 0 }}
                  >
                    <MessageCircle size={11} />
                    Mensagem a ser enviada (pelo aluno interessado)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      messageTouched.current = false;
                      set("ctaLabel")(autoMessage(data.title));
                    }}
                    className="text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 px-2 py-1 rounded-md hover:opacity-80"
                    style={{
                      background: "var(--admin-accent-soft)",
                      color: "var(--admin-accent)",
                    }}
                    title="Gerar mensagem automaticamente a partir do título"
                  >
                    <RotateCcw size={10} />
                    Gerar do título
                  </button>
                </div>
                <textarea
                  className="admin-input admin-textarea"
                  value={data.ctaLabel}
                  rows={4}
                  onChange={(e) => {
                    messageTouched.current = true;
                    set("ctaLabel")(e.target.value);
                  }}
                  placeholder={autoMessage(data.title || "Nome do curso")}
                />
                <p
                  className="text-[11px] mt-1.5"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  Texto editável. Por padrão é gerado a partir do título do curso.
                </p>
              </div>

              <div>
                <label className="admin-label flex items-center gap-1.5">
                  <Phone size={11} />
                  WhatsApp de destino
                </label>
                <input
                  type="text"
                  inputMode="tel"
                  className="admin-input"
                  value={data.ctaHref}
                  onChange={(e) => set("ctaHref")(formatPhoneInput(e.target.value))}
                  placeholder={
                    globalWhatsapp
                      ? formatPhoneInput(globalWhatsapp)
                      : "(47) 99999-0000"
                  }
                />
                <p
                  className="text-[11px] mt-1.5"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  {data.ctaHref.trim()
                    ? "Esse curso usa um WhatsApp exclusivo."
                    : globalWhatsapp
                    ? `Em branco usa o número geral do site: ${formatPhoneInput(globalWhatsapp)}`
                    : "Em branco usa o número geral do site."}
                </p>
              </div>
            </div>

            <div
              className="mt-4 p-3 rounded-lg flex items-start gap-2"
              style={{
                background: "rgba(37,211,102,0.08)",
                border: "1px solid rgba(37,211,102,0.25)",
              }}
            >
              <MessageCircle
                size={14}
                className="flex-shrink-0 mt-0.5"
                style={{ color: "#16a34a" }}
              />
              <div className="text-[12px]" style={{ color: "var(--admin-text-strong)" }}>
                <p className="font-semibold mb-0.5">Pré-visualização</p>
                <p className="leading-snug" style={{ color: "var(--admin-text-muted)" }}>
                  &ldquo;{data.ctaLabel || autoMessage(data.title || "Nome do curso")}&rdquo;
                </p>
                <p
                  className="mt-1.5 text-[11px]"
                  style={{ color: "var(--admin-text-muted)" }}
                >
                  Será enviada para:{" "}
                  <strong style={{ color: "var(--admin-text-strong)" }}>
                    {data.ctaHref.trim()
                      ? formatPhoneInput(data.ctaHref)
                      : globalWhatsapp
                      ? `${formatPhoneInput(globalWhatsapp)} (geral)`
                      : "número geral não configurado"}
                  </strong>
                </p>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel>
            <h3 className="font-semibold text-white mb-3">Publicação</h3>

            <div className="mb-4">
              <StatusPill
                active={data.published}
                activeLabel="Publicado"
                inactiveLabel="Rascunho"
                extra={data.featured ? "Em destaque" : undefined}
              />
            </div>

            <div className="space-y-1">
              <ToggleRow
                icon={<CircleDot size={14} />}
                label="Publicar no site"
                hint={
                  data.published
                    ? "Visível em /cursos"
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
                    ? "Aparece como destaque na seção de cursos"
                    : "Curso comum, sem destaque visual"
                }
                value={data.featured}
                onChange={set("featured")}
              />
              <div className="pt-2">
                <label className="admin-label">Ordem</label>
                <input type="number" className="admin-input" value={data.orderIndex} onChange={(e) => set("orderIndex")(Number(e.target.value))} />
              </div>
            </div>
          </Panel>
          <Panel>
            <h3 className="font-semibold text-white mb-4">Imagem de capa</h3>
            <LargeImageField
              value={data.image}
              onChange={set("image")}
              preset={CONTEXT_PRESETS.courseCover}
              endpoint="/api/admin/upload"
            />
          </Panel>
        </div>
      </div>
    </>
  );
}

/**
 * Campo de categoria: input livre + chips das categorias já em uso.
 * Permite escolher uma existente ou digitar uma nova, tudo no mesmo campo.
 */
function CategoryField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [existing, setExisting] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((r) => (r.ok ? r.json() : []))
      .then((items: { category?: string }[]) => {
        const set = new Set<string>();
        items.forEach((i) => {
          const c = (i.category ?? "").trim();
          if (c) set.add(c);
        });
        setExisting(Array.from(set).sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-2">
      <input
        className="admin-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: Vendas, Gestão, Técnico..."
        list="course-categories"
      />
      <datalist id="course-categories">
        {existing.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      {existing.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {existing.map((c) => {
            const active = value.trim().toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors"
                style={{
                  background: active
                    ? "var(--admin-accent-soft)"
                    : "var(--admin-surface-2)",
                  color: active ? "var(--admin-accent)" : "var(--admin-text-muted)",
                  border: `1px solid ${active ? "rgba(246,129,30,0.35)" : "var(--admin-border)"}`,
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-[11px]" style={{ color: "var(--admin-text-muted)" }}>
        Clique num chip pra reutilizar ou digite uma nova categoria — ela vai aparecer como filtro na página pública.
      </p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import {
  Plus,
  Megaphone,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  X,
  CircleDot,
  Calendar,
  Sparkles,
} from "lucide-react";
import { PageHeader, Panel, EmptyState } from "../_components/ui";
import { LargeImageField } from "@/components/ui/LargeImageField";
import { CONTEXT_PRESETS } from "@/lib/image-presets";

type Sponsor = {
  id: string;
  name: string;
  image: string;
  url: string;
  description: string;
  active: boolean;
  weight: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
};

const empty: Omit<Sponsor, "id" | "createdAt"> = {
  name: "",
  image: "",
  url: "",
  description: "",
  active: true,
  weight: 5,
  startDate: null,
  endDate: null,
};

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function SponsorsClient() {
  const [items, setItems] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Sponsor | "new" | null>(null);

  async function load() {
    setLoading(true);
    const r = await fetch("/api/admin/sponsors");
    const d = await r.json();
    setItems(d);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(s: Sponsor) {
    const res = await fetch(`/api/admin/sponsors/${s.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ active: !s.active }),
    });
    if (!res.ok) return toast.error("Erro");
    const u = await res.json();
    setItems((prev) => prev.map((x) => (x.id === s.id ? u : x)));
    toast.success(u.active ? "Ativado" : "Desativado");
  }

  async function remove(s: Sponsor) {
    if (!confirm(`Excluir "${s.name}"?`)) return;
    await fetch(`/api/admin/sponsors/${s.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((x) => x.id !== s.id));
    toast.success("Excluído");
  }

  const activeCount = items.filter((s) => s.active).length;

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow="Conteúdo"
        title="Patrocinadores"
        subtitle="Banners 300×200 (medium rectangle, 3:2) que rotacionam aleatoriamente na lateral das páginas internas — até 3 patrocinadores empilhados em telas largas (≥1280px). Cada visitante vê uma seleção diferente."
        actions={
          <button
            onClick={() => setEditing("new")}
            className="admin-btn admin-btn-primary"
          >
            <Plus size={14} />
            Novo patrocinador
          </button>
        }
      />

      <div className="px-6 lg:px-8 pb-10 space-y-4">
        <Panel>
          <div className="flex items-center gap-3 flex-wrap">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{
                background: "var(--admin-accent-soft)",
                color: "var(--admin-accent)",
              }}
            >
              <Sparkles size={16} />
            </div>
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm font-semibold" style={{ color: "var(--admin-text-strong)" }}>
                {activeCount} patrocinador{activeCount === 1 ? "" : "es"} ativo{activeCount === 1 ? "" : "s"}
              </p>
              <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
                A rotação é ponderada pelo peso. Patrocinadores fora do período (datas) ficam ocultos automaticamente.
              </p>
            </div>
          </div>
        </Panel>

        {loading ? (
          <Panel>
            <div className="py-10 text-center" style={{ color: "var(--admin-text-subtle)" }}>
              Carregando…
            </div>
          </Panel>
        ) : items.length === 0 ? (
          <Panel>
            <EmptyState
              icon={<Megaphone size={20} />}
              title="Nenhum patrocinador cadastrado"
              description="Cadastre o primeiro patrocinador para começar a rotacionar banners no site."
              action={
                <button onClick={() => setEditing("new")} className="admin-btn admin-btn-primary">
                  <Plus size={14} />
                  Novo patrocinador
                </button>
              }
            />
          </Panel>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((s) => {
              const expired = s.endDate ? new Date(s.endDate).getTime() < Date.now() : false;
              const inactive = !s.active || expired;
              return (
                <article
                  key={s.id}
                  className="rounded-2xl overflow-hidden admin-hover-ring"
                  style={{
                    background: "var(--admin-surface)",
                    border: "1px solid var(--admin-border)",
                    opacity: inactive ? 0.7 : 1,
                  }}
                >
                  <div
                    className="relative"
                    style={{
                      aspectRatio: "1 / 1",
                      background: s.image
                        ? `#0b0f1a url(${s.image}) center/contain no-repeat`
                        : "linear-gradient(135deg, #4a8cff 0%, #0059AB 100%)",
                    }}
                  >
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span
                        className="admin-badge"
                        style={{
                          color: s.active ? "#16a34a" : "#8c93a3",
                          background: s.active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                        }}
                      >
                        {s.active ? <><CircleDot size={10} /> Ativo</> : "Inativo"}
                      </span>
                      {expired && (
                        <span
                          className="admin-badge"
                          style={{
                            color: "#d97706",
                            background: "rgba(217,119,6,0.15)",
                          }}
                        >
                          Expirado
                        </span>
                      )}
                    </div>
                    <div
                      className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        backdropFilter: "blur(6px)",
                      }}
                      title="Peso de exibição"
                    >
                      Peso {s.weight}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-semibold truncate" style={{ color: "var(--admin-text-strong)" }}>
                      {s.name}
                    </p>
                    {s.url && (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] mt-0.5 truncate max-w-full"
                        style={{ color: "var(--admin-text-muted)" }}
                      >
                        <ExternalLink size={10} />
                        <span className="truncate">{s.url}</span>
                      </a>
                    )}
                    <div
                      className="flex items-center justify-between gap-2 mt-3 pt-3"
                      style={{ borderTop: "1px solid var(--admin-border)" }}
                    >
                      <div className="flex gap-1">
                        <button
                          onClick={() => toggle(s)}
                          className="p-1.5 rounded hover:bg-white/5"
                          style={{ color: "var(--admin-text-muted)" }}
                          title={s.active ? "Desativar" : "Ativar"}
                        >
                          {s.active ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button
                          onClick={() => remove(s)}
                          className="p-1.5 rounded hover:bg-red-500/10"
                          style={{ color: "var(--admin-text-muted)" }}
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => setEditing(s)}
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

      {editing && (
        <SponsorEditor
          sponsor={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(saved, isNew) => {
            if (isNew) setItems((prev) => [saved, ...prev]);
            else setItems((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
            setEditing(null);
          }}
        />
      )}
    </>
  );
}

function SponsorEditor({
  sponsor,
  onClose,
  onSaved,
}: {
  sponsor: Sponsor | null;
  onClose: () => void;
  onSaved: (s: Sponsor, isNew: boolean) => void;
}) {
  const isNew = !sponsor;
  const [data, setData] = useState({
    ...empty,
    ...(sponsor ?? {}),
    startDate: sponsor?.startDate ? toLocalInput(new Date(sponsor.startDate)) : "",
    endDate: sponsor?.endDate ? toLocalInput(new Date(sponsor.endDate)) : "",
  });
  const [saving, setSaving] = useState(false);

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

  async function save() {
    if (!data.name.trim()) return toast.error("Nome obrigatório");
    if (!data.image.trim()) return toast.error("Imagem obrigatória");
    setSaving(true);
    const payload = {
      ...data,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
    };
    const url = isNew ? "/api/admin/sponsors" : `/api/admin/sponsors/${sponsor!.id}`;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) return toast.error("Erro ao salvar");
    const saved = await res.json();
    toast.success(isNew ? "Patrocinador criado" : "Salvo");
    onSaved(saved, isNew);
  }

  const set = <K extends keyof typeof data>(k: K) => (v: (typeof data)[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(5,7,12,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-3xl flex flex-col overflow-hidden"
        style={{
          background: "var(--admin-surface)",
          borderRadius: 16,
          height: "min(92vh, 720px)",
          maxHeight: "calc(100vh - 32px)",
          border: "1px solid var(--admin-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between gap-3 px-5 py-3 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--admin-border)" }}
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--admin-accent)" }}>
              {isNew ? "Novo patrocinador" : "Editar patrocinador"}
            </p>
            <h3 className="text-base font-bold" style={{ color: "var(--admin-text-strong)" }}>
              {data.name || "Sem nome"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5"
            style={{ color: "var(--admin-text-muted)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="admin-label">Imagem do banner *</label>
            <LargeImageField
              value={data.image}
              onChange={set("image")}
              preset={CONTEXT_PRESETS.sponsorBanner}
              endpoint="/api/admin/upload"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="admin-label">Nome do patrocinador *</label>
              <input
                className="admin-input"
                value={data.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Ex: Tintas Fortaleza"
              />
            </div>
            <div>
              <label className="admin-label">Link de destino</label>
              <input
                className="admin-input"
                value={data.url}
                onChange={(e) => set("url")(e.target.value)}
                placeholder="https://"
              />
            </div>
          </div>
          <div>
            <label className="admin-label">Descrição (aparece embaixo do banner)</label>
            <textarea
              className="admin-input admin-textarea"
              value={data.description}
              onChange={(e) => set("description")(e.target.value)}
              placeholder="Texto curto que aparece no card. Opcional."
              rows={2}
            />
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="admin-label">Peso (1 a 10)</label>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={data.weight}
                onChange={(e) => set("weight")(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
              <p className="text-[11px]" style={{ color: "var(--admin-text-muted)" }}>
                Peso atual: <strong>{data.weight}</strong> · maior peso = mais exibições
              </p>
            </div>
            <div>
              <label className="admin-label flex items-center gap-1">
                <Calendar size={11} />
                Início (opcional)
              </label>
              <input
                type="datetime-local"
                className="admin-input"
                value={data.startDate}
                onChange={(e) => set("startDate")(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label flex items-center gap-1">
                <Calendar size={11} />
                Término (opcional)
              </label>
              <input
                type="datetime-local"
                className="admin-input"
                value={data.endDate}
                onChange={(e) => set("endDate")(e.target.value)}
              />
            </div>
          </div>
          <label className="flex items-center justify-between cursor-pointer py-1">
            <span className="text-sm">Ativo no site</span>
            <button
              type="button"
              onClick={() => set("active")(!data.active)}
              className="relative inline-flex h-5 w-9 rounded-full transition-colors"
              style={{ background: data.active ? "var(--admin-accent)" : "rgba(10,14,26,0.12)" }}
            >
              <span
                className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
                style={{ transform: `translate(${data.active ? "18px" : "3px"}, 3px)` }}
              />
            </button>
          </label>
        </div>

        <div
          className="flex items-center justify-end gap-2 px-5 py-3 flex-shrink-0"
          style={{ borderTop: "1px solid var(--admin-border)" }}
        >
          <button onClick={onClose} className="admin-btn admin-btn-ghost">
            Cancelar
          </button>
          <button onClick={save} disabled={saving} className="admin-btn admin-btn-primary">
            <Save size={13} />
            {saving ? "Salvando…" : isNew ? "Criar patrocinador" : "Salvar alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

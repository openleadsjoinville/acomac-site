"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { ArrowLeft, Save, Trash2, Calendar, CircleDot, ExternalLink, Sparkles } from "lucide-react";
import { PageHeader, Panel, ToggleRow, StatusPill } from "../_components/ui";
import { LargeImageField } from "@/components/ui/LargeImageField";
import { CONTEXT_PRESETS } from "@/lib/image-presets";

type EventData = {
  id?: string;
  slug?: string;
  title: string;
  description: string;
  content: string;
  date: string;
  endDate: string;
  location: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  ctaType: string;
  ctaWhatsappNumber: string;
  ctaWhatsappMessage: string;
  featured: boolean;
  published: boolean;
  orderIndex: number;
};

const empty: EventData = {
  title: "",
  description: "",
  content: "",
  date: new Date().toISOString().slice(0, 16),
  endDate: "",
  location: "",
  image: "",
  ctaLabel: "",
  ctaHref: "",
  ctaType: "link",
  ctaWhatsappNumber: "",
  ctaWhatsappMessage: "",
  featured: false,
  published: true,
  orderIndex: 0,
};

export function EventForm({ id }: { id?: string }) {
  const router = useRouter();
  const [data, setData] = useState<EventData>(empty);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch("/api/admin/events")
      .then((r) => r.json())
      .then((items) => {
        const found = items.find((x: { id: string }) => x.id === id);
        if (found) {
          setData({
            ...found,
            date: new Date(found.date).toISOString().slice(0, 16),
            endDate: found.endDate ? new Date(found.endDate).toISOString().slice(0, 16) : "",
          });
        }
        setLoading(false);
      });
  }, [id]);

  async function save() {
    if (!data.title.trim()) return toast.error("Título obrigatório");
    setSaving(true);
    const body = {
      ...data,
      endDate: data.endDate || null,
    };
    const url = id ? `/api/admin/events/${id}` : "/api/admin/events";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) return toast.error("Erro ao salvar");
    const saved = await res.json();
    toast.success(id ? "Salvo!" : "Evento criado!");
    if (!id) router.push(`/admin/events/${saved.id}`);
  }

  async function remove() {
    if (!id) return;
    if (!confirm("Excluir este evento?")) return;
    const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Erro ao excluir");
    toast.success("Excluído");
    router.push("/admin/events");
  }

  const set = <K extends keyof EventData>(k: K) => (v: EventData[K]) =>
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
        eyebrow={id ? "Editar evento" : "Novo evento"}
        title={id ? data.title || "Evento" : "Criar novo evento"}
        subtitle="Preencha os dados. Você pode deixar como rascunho e publicar depois."
        actions={
          <>
            <Link href="/admin/events" className="admin-btn admin-btn-ghost">
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
                <label className="admin-label">Título do evento</label>
                <input className="admin-input" value={data.title} onChange={(e) => set("title")(e.target.value)} placeholder="Ex: FENAC 2026" />
              </div>
              <div>
                <label className="admin-label">Descrição curta</label>
                <textarea
                  className="admin-input admin-textarea"
                  value={data.description}
                  onChange={(e) => set("description")(e.target.value)}
                  placeholder="Uma frase que explica o evento"
                />
              </div>
              <div>
                <label className="admin-label">Conteúdo completo (opcional)</label>
                <textarea
                  className="admin-input admin-textarea"
                  value={data.content}
                  onChange={(e) => set("content")(e.target.value)}
                  placeholder="Descrição detalhada do evento..."
                  rows={6}
                />
              </div>
            </div>
          </Panel>

          <Panel>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar size={15} />
              Quando e onde
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Data e hora de início</label>
                <input
                  type="datetime-local"
                  className="admin-input"
                  value={data.date}
                  onChange={(e) => set("date")(e.target.value)}
                />
              </div>
              <div>
                <label className="admin-label">Data e hora de término</label>
                <input
                  type="datetime-local"
                  className="admin-input"
                  value={data.endDate}
                  onChange={(e) => set("endDate")(e.target.value)}
                />
                <p className="text-[11px] mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
                  Ao chegar este horário, o evento sai automaticamente do site. Se deixar em branco, usaremos a data/hora de início como deadline.
                </p>
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Local</label>
                <input className="admin-input" value={data.location} onChange={(e) => set("location")(e.target.value)} placeholder="Ex: Expoville · Joinville, SC" />
              </div>
            </div>
          </Panel>

          <Panel>
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <ExternalLink size={15} />
              Chamada de ação
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Texto do botão</label>
                <input className="admin-input" value={data.ctaLabel} onChange={(e) => set("ctaLabel")(e.target.value)} placeholder="Ex: Inscrever-se" />
              </div>
              <div>
                <label className="admin-label">Tipo de ação</label>
                <select 
                  className="admin-input" 
                  value={data.ctaType} 
                  onChange={(e) => set("ctaType")(e.target.value)}
                >
                  <option value="link">Link externo</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>
            </div>

            {data.ctaType === "link" ? (
              <div className="mt-4">
                <label className="admin-label">URL do link</label>
                <input 
                  className="admin-input" 
                  value={data.ctaHref} 
                  onChange={(e) => set("ctaHref")(e.target.value)} 
                  placeholder="https://..." 
                />
                <p className="text-[11px] mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
                  O link será aberto em uma nova aba quando clicarem no botão.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="admin-label">Número do WhatsApp</label>
                  <input 
                    className="admin-input" 
                    value={data.ctaWhatsappNumber} 
                    onChange={(e) => set("ctaWhatsappNumber")(e.target.value)} 
                    placeholder="5547991103681"
                  />
                  <p className="text-[11px] mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
                    Incluir código do país (55 para Brasil) + DDD + número
                  </p>
                </div>
                <div>
                  <label className="admin-label">Mensagem padrão</label>
                  <textarea 
                    className="admin-input admin-textarea" 
                    value={data.ctaWhatsappMessage} 
                    onChange={(e) => set("ctaWhatsappMessage")(e.target.value)} 
                    placeholder="Ex: Olá! Tenho interesse em participar deste evento."
                    rows={3}
                  />
                  <p className="text-[11px] mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
                    Esta será a mensagem enviada quando a pessoa clica no botão.
                  </p>
                </div>
              </div>
            )}
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
                    ? "Visível em /eventos"
                    : "Salvar manterá como rascunho (oculto no site)"
                }
                value={data.published}
                onChange={set("published")}
              />
              <ToggleRow
                icon={<Sparkles size={14} />}
                label="Destacar como principal"
                hint={
                  data.featured
                    ? "Aparece como evento principal na seção de Eventos"
                    : "Evento comum, sem destaque visual"
                }
                value={data.featured}
                onChange={set("featured")}
              />
              <div className="pt-2">
                <label className="admin-label">Ordem de exibição</label>
                <input
                  type="number"
                  className="admin-input"
                  value={data.orderIndex}
                  onChange={(e) => set("orderIndex")(Number(e.target.value))}
                />
              </div>
            </div>
          </Panel>

          <Panel>
            <h3 className="font-semibold text-white mb-4">Imagem de capa</h3>
            <LargeImageField
              value={data.image}
              onChange={set("image")}
              preset={CONTEXT_PRESETS.eventCover}
              endpoint="/api/admin/upload"
            />
          </Panel>
        </div>
      </div>
    </>
  );
}


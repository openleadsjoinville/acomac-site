"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Inbox, Mail, Phone, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "../_components/ui";

type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  source: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
};

export function MessagesClient() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [archived, setArchived] = useState(false);
  const [selected, setSelected] = useState<Message | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/messages?archived=${archived ? 1 : 0}`)
      .then((r) => r.json())
      .then((d) => {
        setItems(d);
        setLoading(false);
      });
  }, [archived]);

  async function markRead(id: string, read: boolean) {
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ read }),
    });
    if (!res.ok) return;
    const u = await res.json();
    setItems((prev) => prev.map((x) => (x.id === id ? u : x)));
  }

  async function toggleArchive(m: Message) {
    const res = await fetch(`/api/admin/messages/${m.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ archived: !m.archived }),
    });
    if (!res.ok) return toast.error("Erro");
    setItems((prev) => prev.filter((x) => x.id !== m.id));
    if (selected?.id === m.id) setSelected(null);
    toast.success(m.archived ? "Restaurado" : "Arquivado");
  }

  async function remove(m: Message) {
    if (!confirm("Excluir mensagem?")) return;
    await fetch(`/api/admin/messages/${m.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((x) => x.id !== m.id));
    if (selected?.id === m.id) setSelected(null);
    toast.success("Excluída");
  }

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow="Pessoas"
        title="Formulários recebidos"
        subtitle="Mensagens enviadas pelos formulários de contato do site."
        actions={
          <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
            <button
              onClick={() => setArchived(false)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md"
              style={{ background: !archived ? "var(--admin-accent)" : "transparent", color: !archived ? "#fff" : "var(--admin-text-muted)" }}
            >
              Caixa de entrada
            </button>
            <button
              onClick={() => setArchived(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-md"
              style={{ background: archived ? "var(--admin-accent)" : "transparent", color: archived ? "#fff" : "var(--admin-text-muted)" }}
            >
              Arquivadas
            </button>
          </div>
        }
      />

      <div className="px-6 lg:px-8 pb-10 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-2">
          {loading ? (
            <Panel>
              <div className="py-10 text-center" style={{ color: "var(--admin-text-subtle)" }}>Carregando...</div>
            </Panel>
          ) : items.length === 0 ? (
            <Panel>
              <EmptyState icon={<Inbox size={20} />} title="Inbox vazia" description="Mensagens aparecem aqui em tempo real." />
            </Panel>
          ) : (
            items.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setSelected(m);
                  if (!m.read) markRead(m.id, true);
                }}
                className="w-full text-left rounded-xl p-4 transition-colors admin-hover-ring"
                style={{
                  background: selected?.id === m.id ? "rgba(246,129,30,0.08)" : "var(--admin-surface)",
                  border: `1px solid ${selected?.id === m.id ? "var(--admin-accent)" : "var(--admin-border)"}`,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {!m.read && <span className="w-2 h-2 rounded-full" style={{ background: "var(--admin-accent)" }} />}
                  <span className={`text-sm font-semibold truncate ${m.read ? "" : "text-white"}`}>{m.name}</span>
                </div>
                <p className="text-xs truncate" style={{ color: "var(--admin-text-muted)" }}>
                  {m.subject || m.message.slice(0, 60)}
                </p>
                <p className="text-[10px] mt-1" style={{ color: "var(--admin-text-subtle)" }}>
                  {new Date(m.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          <Panel className="min-h-[400px]">
            {selected ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3 pb-4" style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  <div>
                    <h3 className="text-lg font-bold text-white">{selected.name}</h3>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{ color: "var(--admin-text-muted)" }}>
                      <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1 hover:text-white">
                        <Mail size={12} />
                        {selected.email}
                      </a>
                      {selected.phone && (
                        <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1 hover:text-white">
                          <Phone size={12} />
                          {selected.phone}
                        </a>
                      )}
                      <span>
                        {new Date(selected.createdAt).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => toggleArchive(selected)} className="admin-btn admin-btn-ghost">
                      {selected.archived ? <><ArchiveRestore size={13} /> Restaurar</> : <><Archive size={13} /> Arquivar</>}
                    </button>
                    <button onClick={() => remove(selected)} className="admin-btn admin-btn-danger-ghost">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {selected.subject && (
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "var(--admin-text-muted)" }}>Assunto</p>
                    <p className="text-sm text-white">{selected.subject}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold mb-2" style={{ color: "var(--admin-text-muted)" }}>Mensagem</p>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{selected.message}</p>
                </div>
                <div className="flex gap-2 pt-3">
                  <a href={`mailto:${selected.email}?subject=Re: ${selected.subject ?? ""}`} className="admin-btn admin-btn-primary">
                    <Mail size={13} />
                    Responder por email
                  </a>
                </div>
              </div>
            ) : (
              <EmptyState icon={<Inbox size={22} />} title="Selecione uma mensagem" description="Clique em uma mensagem da lista para ver os detalhes." />
            )}
          </Panel>
        </div>
      </div>
    </>
  );
}

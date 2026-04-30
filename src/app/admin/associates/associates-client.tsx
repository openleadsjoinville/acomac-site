"use client";

import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import {
  UserCheck,
  Check,
  X,
  Edit3,
  Trash2,
  ChevronDown,
  ChevronUp,
  Search,
  Mail,
  Phone,
  MapPin,
  Globe,
  Instagram,
  Link2,
  Copy,
  ExternalLink,
  Share2,
} from "lucide-react";
import { PageHeader, Panel, EmptyState } from "../_components/ui";
import { LargeImageField } from "@/components/ui/LargeImageField";
import { CONTEXT_PRESETS } from "@/lib/image-presets";

type Associate = {
  id: string;
  companyName: string;
  cnpj: string | null;
  contactName: string;
  phone: string;
  email: string;
  city: string | null;
  website: string | null;
  instagram: string | null;
  segment: string | null;
  description: string | null;
  logoUrl: string | null;
  displayName: string | null;
  displayDescription: string | null;
  displayLogo: string | null;
  orderIndex: number;
  status: string;
  createdAt: string;
};

export function AssociatesClient() {
  const [items, setItems] = useState<Associate[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/associates")
      .then((r) => r.json())
      .then((d) => {
        setItems(d);
        setLoading(false);
      });
  }, []);

  async function update(id: string, patch: Partial<Associate>) {
    const res = await fetch(`/api/admin/associates/${id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return toast.error("Erro");
    const u = await res.json();
    setItems((prev) => prev.map((x) => (x.id === id ? u : x)));
    toast.success("Atualizado");
  }

  async function remove(id: string) {
    if (!confirm("Excluir este cadastro?")) return;
    await fetch(`/api/admin/associates/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((x) => x.id !== id));
    toast.success("Excluído");
  }

  const pending = items.filter((i) => i.status === "PENDING").length;
  const approved = items.filter((i) => i.status === "APPROVED").length;
  const rejected = items.filter((i) => i.status === "REJECTED").length;

  const filtered = items.filter((i) => {
    if (status !== "ALL" && i.status !== status) return false;
    if (q && !`${i.companyName} ${i.contactName} ${i.city ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow="Pessoas"
        title="Associados"
        subtitle="Aprove novos cadastros e gerencie a vitrine de associados do site."
      />

      <div className="px-6 lg:px-8 pb-10 space-y-4">
        <RegisterLinkCard />

        <div className="grid grid-cols-3 gap-3">
          <StatTab label="Pendentes" count={pending} active={status === "PENDING"} onClick={() => setStatus("PENDING")} color="#fbbf24" />
          <StatTab label="Aprovados" count={approved} active={status === "APPROVED"} onClick={() => setStatus("APPROVED")} color="#4ade80" />
          <StatTab label="Rejeitados" count={rejected} active={status === "REJECTED"} onClick={() => setStatus("REJECTED")} color="#f87171" />
        </div>

        <Panel padding="p-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)" }}>
            <Search size={14} style={{ color: "var(--admin-text-subtle)" }} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por empresa, contato ou cidade..."
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
        </Panel>

        {loading ? (
          <Panel>
            <div className="py-10 text-center" style={{ color: "var(--admin-text-subtle)" }}>Carregando...</div>
          </Panel>
        ) : filtered.length === 0 ? (
          <Panel>
            <EmptyState icon={<UserCheck size={20} />} title="Nada aqui" description="Quando houver associados nessa categoria, eles aparecem aqui." />
          </Panel>
        ) : (
          <div className="space-y-2">
            {filtered.map((a) => (
              <AssociateRow
                key={a.id}
                item={a}
                expanded={expanded === a.id}
                onExpand={() => setExpanded(expanded === a.id ? null : a.id)}
                onUpdate={(patch) => update(a.id, patch)}
                onDelete={() => remove(a.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StatTab({
  label,
  count,
  active,
  onClick,
  color,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl p-4 admin-hover-ring transition-all"
      style={{
        background: active ? "rgba(246,129,30,0.08)" : "var(--admin-surface)",
        border: `1px solid ${active ? "var(--admin-accent)" : "var(--admin-border)"}`,
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>
          {label}
        </span>
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
      </div>
      <p className="text-2xl font-bold tabular-nums">{count}</p>
    </button>
  );
}

function AssociateRow({
  item,
  expanded,
  onExpand,
  onUpdate,
  onDelete,
}: {
  item: Associate;
  expanded: boolean;
  onExpand: () => void;
  onUpdate: (patch: Partial<Associate>) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(item);
  useEffect(() => setDraft(item), [item]);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
    >
      <div className="flex items-center gap-3 p-4">
        <div
          className="h-11 w-11 rounded-lg flex-shrink-0 overflow-hidden"
          style={{ background: "var(--admin-surface-2)" }}
        >
          {item.displayLogo || item.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={(item.displayLogo ?? item.logoUrl) as string} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs font-bold" style={{ color: "var(--admin-text-muted)" }}>
              {item.companyName.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{item.displayName || item.companyName}</p>
          <p className="text-xs truncate" style={{ color: "var(--admin-text-muted)" }}>
            {[item.segment, item.city, item.contactName].filter(Boolean).join(" · ")}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {item.status === "PENDING" && (
            <>
              <button onClick={() => onUpdate({ status: "APPROVED" })} className="admin-btn admin-btn-success text-[11px] py-1.5 px-3">
                <Check size={12} /> Aprovar
              </button>
              <button onClick={() => onUpdate({ status: "REJECTED" })} className="admin-btn admin-btn-ghost text-[11px] py-1.5 px-3">
                <X size={12} />
              </button>
            </>
          )}
          <button onClick={onExpand} className="admin-btn admin-btn-ghost text-[11px] py-1.5 px-3">
            <Edit3 size={12} />
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4 pt-0 space-y-4" style={{ borderTop: "1px solid var(--admin-border)" }}>
          <div className="pt-4 grid sm:grid-cols-2 gap-3">
            <Field label="Nome da empresa" value={draft.companyName} onChange={(v) => setDraft({ ...draft, companyName: v })} />
            <Field label="CNPJ" value={draft.cnpj ?? ""} onChange={(v) => setDraft({ ...draft, cnpj: v })} />
            <Field label="Contato" value={draft.contactName} onChange={(v) => setDraft({ ...draft, contactName: v })} icon={<UserCheck size={12} />} />
            <Field label="Telefone" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} icon={<Phone size={12} />} />
            <Field label="Email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} icon={<Mail size={12} />} />
            <Field label="Cidade" value={draft.city ?? ""} onChange={(v) => setDraft({ ...draft, city: v })} icon={<MapPin size={12} />} />
            <Field label="Website" value={draft.website ?? ""} onChange={(v) => setDraft({ ...draft, website: v })} icon={<Globe size={12} />} />
            <Field label="Instagram" value={draft.instagram ?? ""} onChange={(v) => setDraft({ ...draft, instagram: v })} icon={<Instagram size={12} />} />
            <Field label="Segmento" value={draft.segment ?? ""} onChange={(v) => setDraft({ ...draft, segment: v })} />
            <Field label="Ordem" value={String(draft.orderIndex)} onChange={(v) => setDraft({ ...draft, orderIndex: Number(v) || 0 })} />
          </div>
          <div>
            <label className="admin-label">Descrição</label>
            <textarea className="admin-input admin-textarea" value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
          </div>
          <div className="pt-3" style={{ borderTop: "1px solid var(--admin-border)" }}>
            <p className="admin-label">Exibição no site (sobrescrever)</p>
            <div className="space-y-3">
              <Field label="Nome de exibição" value={draft.displayName ?? ""} onChange={(v) => setDraft({ ...draft, displayName: v })} />
              <div>
                <label className="admin-label">Descrição de exibição</label>
                <textarea className="admin-input admin-textarea" value={draft.displayDescription ?? ""} onChange={(e) => setDraft({ ...draft, displayDescription: e.target.value })} />
              </div>
              <div>
                <label className="admin-label">Logo enviado pelo associado</label>
                <LargeImageField
                  value={draft.logoUrl ?? ""}
                  onChange={(v) => setDraft({ ...draft, logoUrl: v })}
                  preset={CONTEXT_PRESETS.logoAssociate}
                  endpoint="/api/admin/upload"
                />
              </div>
              <div>
                <label className="admin-label">Logo de exibição (sobrescreve)</label>
                <LargeImageField
                  value={draft.displayLogo ?? ""}
                  onChange={(v) => setDraft({ ...draft, displayLogo: v })}
                  preset={CONTEXT_PRESETS.logoAssociate}
                  endpoint="/api/admin/upload"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 pt-3" style={{ borderTop: "1px solid var(--admin-border)" }}>
            <button onClick={onDelete} className="admin-btn admin-btn-danger-ghost">
              <Trash2 size={12} />
              Excluir cadastro
            </button>
            <button onClick={() => onUpdate(draft)} className="admin-btn admin-btn-primary">
              Salvar alterações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="admin-label">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-text-subtle)" }}>
            {icon}
          </span>
        )}
        <input
          className="admin-input"
          style={{ paddingLeft: icon ? 34 : undefined }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function RegisterLinkCard() {
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const url = origin ? `${origin}/associar` : "/participe-do-conecta-associados";

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiado para a área de transferência");
    } catch {
      toast.error("Não foi possível copiar");
    }
  }

  async function share() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await (navigator as Navigator).share({
          title: "Cadastre sua empresa — ACOMAC Joinville",
          text: "Formulário de cadastro de associados da ACOMAC Joinville",
          url,
        });
      } catch {
        /* canceled */
      }
    } else {
      copy();
    }
  }

  return (
    <Panel>
      <div className="flex items-start gap-4 flex-wrap">
        <div
          className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--admin-accent-soft)", color: "var(--admin-accent)" }}
        >
          <Share2 size={17} />
        </div>
        <div className="flex-1 min-w-[220px]">
          <h3 className="font-semibold" style={{ color: "var(--admin-text-strong)" }}>
            Link público de cadastro
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--admin-text-muted)" }}>
            Envie este link para quem deseja se associar. Formulário gamificado em 8 etapas — o cadastro chega aqui como <strong>pendente</strong> para sua aprovação.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <a
            href="/participe-do-conecta-associados"
            target="_blank"
            rel="noreferrer"
            className="admin-btn admin-btn-ghost"
          >
            <ExternalLink size={13} />
            Abrir
          </a>
          <button onClick={share} className="admin-btn admin-btn-ghost">
            <Share2 size={13} />
            Compartilhar
          </button>
          <button onClick={copy} className="admin-btn admin-btn-primary">
            <Copy size={13} />
            Copiar link
          </button>
        </div>
      </div>
      <div
        className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono truncate"
        style={{ background: "var(--admin-surface-2)", color: "var(--admin-text-muted)", border: "1px solid var(--admin-border)" }}
      >
        <Link2 size={12} style={{ color: "var(--admin-text-subtle)" }} />
        {url}
      </div>
    </Panel>
  );
}

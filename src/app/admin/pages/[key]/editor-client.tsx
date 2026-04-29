"use client";

import { useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { ArrowLeft, ExternalLink, Eye, Edit3 } from "lucide-react";
import {
  PageHeader,
  Panel,
  StickyDirtyBar,
  DraftRecoveredBanner,
} from "../../_components/ui";
import { SchemaEditor } from "../../_components/schema-editor";
import { useDraftCache } from "../../_components/useDraftCache";
import { pageSchemas, type PageKey, type PageContentMap } from "@/lib/content/schema";

export function PageContentEditor<K extends PageKey>({
  pageKey,
  title,
  previewUrl,
  initial,
}: {
  pageKey: K;
  title: string;
  previewUrl: string;
  initial: PageContentMap[K];
}) {
  const [value, setValue] = useState<PageContentMap[K]>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const schema = pageSchemas[pageKey];

  const { hasDraft, restoreDraft, clearDraft, markSaved, getDraftSavedAt } =
    useDraftCache<PageContentMap[K]>({
      key: `pages/${pageKey}`,
      dirty,
      value,
      onRestore: (cached) => {
        setValue(cached);
        setDirty(true);
        toast.success("Rascunho restaurado.");
      },
    });

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/content/${pageKey}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return toast.error(d.error ?? "Erro ao salvar");
    }
    toast.success("Página salva");
    setDirty(false);
    markSaved();
  }

  function reset() {
    setValue(initial);
    setDirty(false);
    clearDraft();
  }

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow="Editar página"
        title={title}
        subtitle="Cada bloco abaixo corresponde a uma seção da página. Clique para abrir e editar."
        actions={
          <>
            <Link href="/admin/pages" className="admin-btn admin-btn-ghost">
              <ArrowLeft size={14} />
              Páginas
            </Link>
            <div className="flex gap-1 p-1 rounded-lg" style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}>
              <button onClick={() => setMode("edit")} className="px-3 py-1.5 text-xs font-semibold rounded-md inline-flex items-center gap-1.5" style={{ background: mode === "edit" ? "var(--admin-accent)" : "transparent", color: mode === "edit" ? "#fff" : "var(--admin-text-muted)" }}>
                <Edit3 size={12} /> Editar
              </button>
              <button onClick={() => setMode("preview")} className="px-3 py-1.5 text-xs font-semibold rounded-md inline-flex items-center gap-1.5" style={{ background: mode === "preview" ? "var(--admin-accent)" : "transparent", color: mode === "preview" ? "#fff" : "var(--admin-text-muted)" }}>
                <Eye size={12} /> Preview
              </button>
            </div>
            <a href={previewUrl} target="_blank" rel="noreferrer" className="admin-btn admin-btn-ghost">
              <ExternalLink size={13} />
              Ver no site
            </a>
          </>
        }
      />

      <div className="px-6 lg:px-8 pb-24">
        {mode === "edit" && (
          <StickyDirtyBar
            dirty={dirty}
            saving={saving}
            onSave={save}
            onReset={reset}
            message="Você tem alterações não salvas nesta página"
          />
        )}
        {mode === "edit" && hasDraft && !dirty && (
          <DraftRecoveredBanner
            savedAt={getDraftSavedAt()}
            onRestore={restoreDraft}
            onDiscard={() => {
              clearDraft();
              toast.success("Rascunho descartado.");
            }}
          />
        )}
        {mode === "edit" ? (
          <Panel>
            <SchemaEditor
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              schema={schema as any}
              value={value}
              onChange={(v) => {
                setValue(v as PageContentMap[K]);
                setDirty(true);
              }}
              pageKey={pageKey}
            />
          </Panel>
        ) : (
          <Panel padding="p-2">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
                Preview em tempo real. As alterações refletem após salvar.
              </p>
              <a href={previewUrl} target="_blank" rel="noreferrer" className="admin-btn admin-btn-ghost text-xs">
                Abrir em nova guia
              </a>
            </div>
            <iframe
              src={previewUrl}
              className="w-full rounded-xl"
              style={{
                height: "min(82vh, 900px)",
                background: "#fff",
                border: "1px solid var(--admin-border)",
              }}
              title="Preview"
            />
          </Panel>
        )}
      </div>

    </>
  );
}

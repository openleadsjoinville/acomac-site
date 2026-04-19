"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import {
  PageHeader,
  Panel,
  StickyDirtyBar,
  DraftRecoveredBanner,
} from "../_components/ui";
import { SchemaEditor } from "../_components/schema-editor";
import { useDraftCache } from "../_components/useDraftCache";
import { GlobalSchema, type GlobalContent } from "@/lib/content/schema";

export function GlobalEditor({ initial }: { initial: GlobalContent }) {
  const [value, setValue] = useState<GlobalContent>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);

  const { hasDraft, restoreDraft, clearDraft, markSaved, getDraftSavedAt } =
    useDraftCache<GlobalContent>({
      key: "global",
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
    const res = await fetch("/api/admin/content/global", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(value),
    });
    setSaving(false);
    if (!res.ok) return toast.error("Erro ao salvar");
    toast.success("Configurações globais salvas");
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
        eyebrow="Conteúdo"
        title="Global & WhatsApp"
        subtitle="Configurações que valem para todas as páginas: WhatsApp, rodapé, redes sociais, cabeçalho e CTA institucional."
      />

      <div className="px-6 lg:px-8 pb-24">
        <StickyDirtyBar
          dirty={dirty}
          saving={saving}
          onSave={save}
          onReset={reset}
          message="Você tem alterações não salvas nas configurações globais"
        />
        {hasDraft && !dirty && (
          <DraftRecoveredBanner
            savedAt={getDraftSavedAt()}
            onRestore={restoreDraft}
            onDiscard={() => {
              clearDraft();
              toast.success("Rascunho descartado.");
            }}
          />
        )}
        <Panel>
          <SchemaEditor schema={GlobalSchema} value={value} onChange={(v) => { setValue(v); setDirty(true); }} />
        </Panel>
      </div>
    </>
  );
}

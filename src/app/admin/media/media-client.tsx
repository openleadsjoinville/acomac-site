"use client";

import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { Upload, Trash2, Copy, Image as ImageIcon } from "lucide-react";
import { PageHeader, Panel, EmptyState } from "../_components/ui";

type Media = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
};

export function MediaClient() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function load() {
    const r = await fetch("/api/admin/media");
    const d = await r.json();
    setItems(d);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload(files: FileList) {
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) toast.error(`Erro em ${file.name}`);
    }
    setUploading(false);
    await load();
    toast.success("Upload concluído");
  }

  async function remove(m: Media) {
    if (!confirm("Excluir esta imagem? (o arquivo também será removido)")) return;
    await fetch(`/api/admin/media/${m.id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((x) => x.id !== m.id));
    toast.success("Excluída");
  }

  async function copy(url: string) {
    const full = location.origin + url;
    await navigator.clipboard.writeText(full);
    toast.success("URL copiada");
  }

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow="Biblioteca"
        title="Mídia"
        subtitle="Todas as imagens enviadas ao painel. Faça upload, copie URLs ou exclua."
        actions={
          <button onClick={() => inputRef.current?.click()} className="admin-btn admin-btn-primary">
            <Upload size={14} />
            {uploading ? "Enviando..." : "Enviar imagens"}
          </button>
        }
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files && e.target.files.length) upload(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="px-6 lg:px-8 pb-10">
        {loading ? (
          <Panel>
            <div className="py-10 text-center" style={{ color: "var(--admin-text-subtle)" }}>Carregando...</div>
          </Panel>
        ) : items.length === 0 ? (
          <Panel>
            <EmptyState
              icon={<ImageIcon size={20} />}
              title="Biblioteca vazia"
              description="Envie imagens para reutilizar em qualquer página do site."
              action={
                <button onClick={() => inputRef.current?.click()} className="admin-btn admin-btn-primary">
                  <Upload size={14} />
                  Enviar imagens
                </button>
              }
            />
          </Panel>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {items.map((m) => (
              <div
                key={m.id}
                className="rounded-xl overflow-hidden group relative"
                style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
              >
                <div className="aspect-square">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt={m.filename} className="w-full h-full object-cover" />
                </div>
                <div className="p-2 text-[10px] truncate" style={{ color: "var(--admin-text-muted)" }}>
                  {(m.size / 1024).toFixed(0)} KB
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copy(m.url)} className="admin-btn admin-btn-ghost text-[11px]">
                    <Copy size={11} />
                    Copiar URL
                  </button>
                  <button onClick={() => remove(m)} className="admin-btn admin-btn-danger-ghost text-[11px] p-2">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

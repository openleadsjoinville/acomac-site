"use client";

import { useRef, useState } from "react";
import {
  Upload,
  Replace,
  Trash2,
  Image as ImageIcon,
  Link2,
  Info,
  Loader2,
} from "lucide-react";
import { CropDialog } from "./CropDialog";
import {
  resolveFieldPreset,
  type ImagePreset,
  DEFAULT_PRESET,
} from "@/lib/image-presets";

const ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/gif";
const MAX_SIZE = 10 * 1024 * 1024;

export function LargeImageField({
  value,
  onChange,
  fieldName,
  preset: presetOverride,
  endpoint = "/api/admin/upload",
  acceptVideo = false,
  allowCrop = true,
}: {
  value: string;
  onChange: (url: string) => void;
  fieldName?: string;
  preset?: ImagePreset;
  endpoint?: string;
  acceptVideo?: boolean;
  allowCrop?: boolean;
}) {
  const preset =
    presetOverride ?? (fieldName ? resolveFieldPreset(fieldName) : DEFAULT_PRESET);

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showUrl, setShowUrl] = useState(false);
  const [cropFile, setCropFile] = useState<File | null>(null);
  const isVideo =
    value?.toLowerCase().endsWith(".mp4") || value?.toLowerCase().endsWith(".webm");

  async function uploadFile(file: File) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(endpoint, { method: "POST", body: fd });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error ?? "Erro no upload");
        return;
      }
      const d = await res.json();
      onChange(d.url);
    } catch {
      setError("Erro ao enviar");
    } finally {
      setUploading(false);
    }
  }

  function handlePick(file: File) {
    if (file.size > MAX_SIZE) {
      setError("Arquivo muito grande (máx 10MB)");
      return;
    }
    // Vídeo → upload direto
    if (file.type.startsWith("video/")) {
      if (!acceptVideo) {
        setError("Só imagens neste campo");
        return;
      }
      void uploadFile(file);
      return;
    }
    // GIF e SVG → upload direto (sem corte)
    if (file.type === "image/gif" || file.type === "image/svg+xml") {
      void uploadFile(file);
      return;
    }
    if (allowCrop) {
      setCropFile(file);
      return;
    }
    void uploadFile(file);
  }

  const accept = acceptVideo ? `${ACCEPT},video/mp4,video/webm` : ACCEPT;
  const empty = !value;
  const isPortrait = preset.width < preset.height;
  const useContain = preset.fit === "contain";

  return (
    <div className="space-y-2">
      <div
        className="group relative w-full rounded-2xl overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px dashed rgba(255,255,255,0.12)",
          minHeight: preset.minHeight ?? 280,
        }}
      >
        {empty ? (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-3 py-10 hover:bg-white/5 transition-colors"
            style={{ minHeight: preset.minHeight ?? 280, color: "#8c93a3" }}
          >
            <div
              className="h-14 w-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(246,129,30,0.12)",
                color: "#F6811E",
              }}
            >
              {uploading ? <Loader2 size={22} className="animate-spin" /> : <Upload size={22} />}
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                {uploading ? "Enviando imagem…" : "Clique para enviar imagem"}
              </p>
              <p className="text-xs mt-1 flex items-center gap-1.5 justify-center">
                <Info size={11} />
                {preset.hint ?? `Recomendado: ${preset.width}×${preset.height}`}
              </p>
            </div>
          </button>
        ) : (
          <>
            {/* Preview */}
            {isVideo ? (
              <video
                src={value}
                className="w-full h-auto block"
                style={{ maxHeight: 480 }}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : isPortrait || useContain ? (
              <div
                className="w-full flex items-center justify-center py-4"
                style={{
                  background:
                    "repeating-linear-gradient(45deg, rgba(255,255,255,0.02) 0 10px, transparent 10px 20px)",
                  minHeight: preset.minHeight ?? 280,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={value}
                  alt=""
                  className="block rounded-lg"
                  style={{
                    width: useContain && !isPortrait ? preset.width : "auto",
                    maxWidth: "90%",
                    height:
                      useContain && !isPortrait
                        ? "auto"
                        : Math.min(preset.minHeight ?? 440, 520),
                    aspectRatio: useContain && !isPortrait
                      ? undefined
                      : `${preset.width} / ${preset.height}`,
                    objectFit: useContain ? "contain" : "cover",
                    background: useContain ? "rgba(255,255,255,0.04)" : undefined,
                    padding: useContain ? 8 : 0,
                    boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                  }}
                />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                className="w-full h-auto block"
                style={{
                  aspectRatio: `${preset.width} / ${preset.height}`,
                  objectFit: "cover",
                  maxHeight: 520,
                }}
              />
            )}

            {/* Overlay hover */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: "linear-gradient(180deg, rgba(5,7,12,0.35), rgba(5,7,12,0.78))" }}
            >
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{
                    background: "#F6811E",
                    boxShadow: "0 4px 18px rgba(246,129,30,0.4)",
                  }}
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Enviando…
                    </>
                  ) : (
                    <>
                      <Replace size={14} /> Trocar imagem
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  <Trash2 size={13} /> Remover
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrl((v) => !v)}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                  title="Editar URL manualmente"
                >
                  <Link2 size={13} />
                </button>
              </div>
              <p className="text-[11px] flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.75)" }}>
                <Info size={10} />
                {preset.hint ?? `Recomendado: ${preset.width}×${preset.height}`}
              </p>
            </div>

            {/* Empty-state icon badge on top-left */}
            <div
              className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(5,7,12,0.65)", color: "#fff", backdropFilter: "blur(6px)" }}
            >
              <ImageIcon size={11} /> {preset.label}
            </div>
          </>
        )}

        <input
          ref={fileRef}
          type="file"
          accept={accept}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handlePick(f);
            e.target.value = "";
          }}
        />
      </div>

      {showUrl && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL ou caminho da imagem"
          className="admin-input"
        />
      )}

      {error && (
        <p className="text-xs flex items-center gap-1" style={{ color: "#f87171" }}>
          {error}
        </p>
      )}

      <CropDialog
        open={!!cropFile}
        file={cropFile}
        preset={preset}
        onClose={() => setCropFile(null)}
        onConfirm={async (cropped) => {
          setCropFile(null);
          await uploadFile(cropped);
        }}
      />
    </div>
  );
}

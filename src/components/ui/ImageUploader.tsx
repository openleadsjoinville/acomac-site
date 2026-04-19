"use client";

import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

export function ImageUploader({
  value,
  onChange,
  label = "Imagem",
  endpoint = "/api/public/upload",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  endpoint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(endpoint, {
      method: "POST",
      body: fd,
    });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "erro no upload");
      return;
    }
    const data = await res.json();
    onChange(data.url);
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="flex items-start gap-3">
        <div className="relative w-24 h-24 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={24} className="text-slate-400" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL ou caminho da imagem"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0059AB]/20 focus:border-[#0059AB]"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              <Upload size={13} />
              {uploading ? "Enviando..." : "Upload"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100"
              >
                <X size={13} />
                Remover
              </button>
            )}
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

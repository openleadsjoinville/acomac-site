"use client";

import { useEffect, useState } from "react";
import { Eye, RefreshCcw } from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import BlogPostView, { type BlogPostData } from "@/components/public/BlogPostView";

const STORAGE_KEY = "acomac_blog_preview";
const TTL_MS = 60 * 60 * 1000; // 1h

type StoredPreview = {
  data: BlogPostData;
  time: number;
};

function read(): StoredPreview | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredPreview;
    if (!parsed || typeof parsed !== "object" || !parsed.data) return null;
    if (Date.now() - (parsed.time ?? 0) > TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function PreviewClient() {
  const [preview, setPreview] = useState<StoredPreview | null | "loading">("loading");

  useEffect(() => {
    setPreview(read());
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setPreview(read());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (preview === "loading") {
    return (
      <ClientSiteChrome pageKey="home">
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-sm" style={{ color: "#8a94a6" }}>
            Carregando prévia…
          </p>
        </div>
      </ClientSiteChrome>
    );
  }

  if (!preview) {
    return (
      <ClientSiteChrome pageKey="home">
        <div className="min-h-[60vh] flex items-center justify-center px-6">
          <div
            className="max-w-md text-center rounded-3xl p-10"
            style={{
              background: "#fff",
              border: "1px solid #eceef2",
              boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
            }}
          >
            <div
              className="inline-flex h-14 w-14 rounded-2xl items-center justify-center mb-4"
              style={{ background: "rgba(246,129,30,0.12)", color: "#F6811E" }}
            >
              <Eye size={22} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: "#0e1a2b" }}>
              Nenhuma prévia disponível
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#5a6577" }}>
              Esta página mostra a prévia do post que você está editando no painel.
              Abra um post no admin (<code style={{ background: "#f1f3f7", padding: "1px 6px", borderRadius: 4 }}>/admin/blog</code>) e clique em{" "}
              <strong>Ver prévia em nova guia</strong>.
            </p>
            <button
              onClick={() => setPreview(read())}
              className="inline-flex items-center gap-1.5 mt-5 text-xs font-semibold"
              style={{ color: "#0059AB" }}
            >
              <RefreshCcw size={12} />
              Atualizar
            </button>
          </div>
        </div>
      </ClientSiteChrome>
    );
  }

  return (
    <ClientSiteChrome pageKey="home">
      <BlogPostView data={preview.data} previewBadge />
    </ClientSiteChrome>
  );
}

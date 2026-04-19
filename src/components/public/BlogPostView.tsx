"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Share2,
  Link as LinkIcon,
  Check,
} from "lucide-react";
import { autoExcerpt, autoReadTime } from "@/lib/blog-helpers";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import SponsorAside from "./SponsorAside";

export type BlogPostData = {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author?: string;
  tags?: string;
  category?: string;
  readTime?: string;
  publishedAt?: string | Date | null;
};

function renderContent(content: string): string {
  if (!content) return "";
  if (/<(p|h[1-6]|ul|ol|li|blockquote|pre|img|hr|div)\b/i.test(content)) {
    return content;
  }
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  return content
    .split(/\n{2,}/)
    .map((raw) => {
      const b = raw.trim();
      if (!b) return "";
      if (b.startsWith("### ")) return `<h3>${escape(b.slice(4))}</h3>`;
      if (b.startsWith("## ")) return `<h2>${escape(b.slice(3))}</h2>`;
      if (b.startsWith("# ")) return `<h2>${escape(b.slice(2))}</h2>`;
      if (/^-\s/.test(b)) {
        const items = b
          .split("\n")
          .filter((l) => /^-\s/.test(l))
          .map((l) => `<li>${escape(l.replace(/^-\s+/, ""))}</li>`)
          .join("");
        return `<ul>${items}</ul>`;
      }
      return `<p>${escape(b).replace(/\n/g, "<br/>")}</p>`;
    })
    .join("");
}

function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(typeof window !== "undefined" ? window.location.href : "");
  }, []);

  const enc = encodeURIComponent;
  const wa = `https://wa.me/?text=${enc(`${title} — ${url}`)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;
  const tw = `https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`;
  const li = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="flex items-center gap-2 flex-wrap p-3 rounded-2xl"
      style={{ background: "#f7f7f7", border: "1px solid #eceef2" }}
    >
      <span
        className="text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mr-1"
        style={{ color: "#6b7486" }}
      >
        <Share2 size={12} />
        Compartilhar
      </span>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        data-track="blog_share"
        data-track-label="whatsapp"
        className="inline-flex items-center justify-center h-9 w-9 rounded-full text-white"
        style={{ background: "#25D366" }}
        title="WhatsApp"
      >
        <WhatsAppIcon size={15} />
      </a>
      <a
        href={fb}
        target="_blank"
        rel="noopener noreferrer"
        data-track="blog_share"
        data-track-label="facebook"
        className="inline-flex items-center justify-center h-9 w-9 rounded-full text-white text-sm font-bold"
        style={{ background: "#1877F2" }}
        title="Facebook"
      >
        f
      </a>
      <a
        href={tw}
        target="_blank"
        rel="noopener noreferrer"
        data-track="blog_share"
        data-track-label="twitter"
        className="inline-flex items-center justify-center h-9 w-9 rounded-full text-white text-sm font-bold"
        style={{ background: "#000" }}
        title="X / Twitter"
      >
        𝕏
      </a>
      <a
        href={li}
        target="_blank"
        rel="noopener noreferrer"
        data-track="blog_share"
        data-track-label="linkedin"
        className="inline-flex items-center justify-center h-9 w-9 rounded-full text-white text-sm font-bold"
        style={{ background: "#0A66C2" }}
        title="LinkedIn"
      >
        in
      </a>
      <button
        onClick={copy}
        data-track="blog_share"
        data-track-label="copy"
        className="inline-flex items-center justify-center h-9 w-9 rounded-full transition-colors"
        style={{
          background: copied ? "#22c55e" : "#fff",
          color: copied ? "#fff" : "#0e1a2b",
          border: "1px solid #eceef2",
        }}
        title={copied ? "Copiado" : "Copiar link"}
      >
        {copied ? <Check size={14} /> : <LinkIcon size={14} />}
      </button>
    </div>
  );
}

export default function BlogPostView({
  data,
  backHref,
  withSidebar = true,
  previewBadge,
}: {
  data: BlogPostData;
  backHref?: string;
  withSidebar?: boolean;
  previewBadge?: boolean;
}) {
  const excerpt = data.excerpt?.trim() || autoExcerpt(data.content);
  const readTime = data.readTime?.trim() || autoReadTime(data.content);
  const publishedDate = data.publishedAt
    ? new Date(data.publishedAt)
    : new Date();
  const tags = (data.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <article className="bg-white">
      {previewBadge && (
        <div className="bg-[#FEF3E2] border-b border-[#F6811E]/20 py-2.5">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <span
              className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "#F6811E" }}
            >
              ⚡ Prévia · este post ainda não foi publicado
            </span>
          </div>
        </div>
      )}

      {/* HERO com capa fullbleed */}
      <header
        className="relative overflow-hidden"
        style={{
          background: data.coverImage
            ? `url(${data.coverImage}) center/cover`
            : "linear-gradient(135deg, #002952 0%, #0059AB 60%, #1a72c4 100%)",
          minHeight: "min(70vh, 640px)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(5,7,12,0.35) 0%, rgba(5,7,12,0.15) 35%, rgba(5,7,12,0.85) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-14 min-h-[inherit] flex flex-col justify-end">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-xs font-semibold mb-6 self-start px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "#fff",
                backdropFilter: "blur(10px)",
              }}
            >
              <ArrowLeft size={12} />
              Voltar ao blog
            </Link>
          )}
          {data.category && (
            <span
              className="text-[11px] font-bold uppercase tracking-[0.25em] mb-3"
              style={{ color: "#F6811E" }}
            >
              {data.category}
            </span>
          )}
          <h1
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.05] mb-6 max-w-4xl"
            style={{ color: "#fff", textShadow: "0 2px 16px rgba(0,0,0,0.35)" }}
          >
            {data.title || "Título do post"}
          </h1>
          <div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs md:text-sm"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <User size={13} />
              {data.author || "ACOMAC Joinville"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar size={13} />
              {publishedDate.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
            {readTime && (
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} />
                {readTime} de leitura
              </span>
            )}
          </div>
        </div>
      </header>

      {/* CONTEÚDO + SIDEBAR */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div
          className={
            withSidebar
              ? "grid lg:grid-cols-[minmax(0,1fr)_320px] gap-10 lg:gap-12"
              : ""
          }
        >
          <div className="max-w-3xl mx-auto lg:mx-0 w-full">
            {excerpt && (
              <p
                className="text-lg md:text-xl leading-relaxed mb-8 pb-8"
                style={{
                  color: "#0e1a2b",
                  fontWeight: 500,
                  borderBottom: "1px solid #eceef2",
                }}
              >
                {excerpt}
              </p>
            )}

            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{
                __html:
                  renderContent(data.content) ||
                  "<p><em>Conteúdo vazio. Escreva algo no editor.</em></p>",
              }}
            />
            <style>{`
              .blog-post-content :first-child { margin-top: 0; }
              .blog-post-content > * + * { margin-top: 1em; }
              .blog-post-content h1,
              .blog-post-content h2 {
                font-size: 1.65em;
                font-weight: 800;
                line-height: 1.2;
                color: #0e1a2b;
                margin-top: 2em;
                letter-spacing: -0.01em;
              }
              .blog-post-content h3 {
                font-size: 1.25em;
                font-weight: 700;
                line-height: 1.3;
                color: #0e1a2b;
                margin-top: 1.6em;
                letter-spacing: -0.01em;
              }
              .blog-post-content p {
                font-size: 17px;
                line-height: 1.85;
                color: #2d3748;
              }
              .blog-post-content ul, .blog-post-content ol {
                padding-left: 1.5em;
                color: #2d3748;
                font-size: 17px;
                line-height: 1.8;
              }
              .blog-post-content ul { list-style: disc; }
              .blog-post-content ol { list-style: decimal; }
              .blog-post-content li { margin: 0.5em 0; }
              .blog-post-content li::marker { color: #F6811E; }
              .blog-post-content blockquote {
                border-left: 4px solid #F6811E;
                padding: 0.4em 0 0.4em 20px;
                margin: 1.5em 0;
                background: linear-gradient(90deg, rgba(246,129,30,0.06), transparent);
                color: #5a6577;
                font-style: italic;
                font-size: 1.1em;
                border-radius: 0 6px 6px 0;
              }
              .blog-post-content a {
                color: #0059AB;
                text-decoration: underline;
                text-decoration-color: rgba(0,89,171,0.35);
                text-underline-offset: 3px;
                transition: text-decoration-color 0.15s;
              }
              .blog-post-content a:hover {
                text-decoration-color: #0059AB;
              }
              .blog-post-content code {
                background: #f1f3f7;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 0.92em;
                color: #0e1a2b;
              }
              .blog-post-content pre {
                background: #0e1a2b;
                color: #e6e8ee;
                padding: 18px 22px;
                border-radius: 12px;
                overflow-x: auto;
                font-size: 14px;
              }
              .blog-post-content pre code { background: transparent; padding: 0; color: inherit; }
              .blog-post-content img {
                max-width: 100%;
                height: auto;
                border-radius: 14px;
                margin: 1.4em 0;
                box-shadow: 0 14px 40px rgba(16,24,40,0.12);
              }
              .blog-post-content hr {
                border: 0;
                height: 4px;
                background: radial-gradient(circle, #F6811E 0%, transparent 75%);
                margin: 2.4em auto;
                width: 80px;
                opacity: 0.6;
              }
              .blog-post-content strong { color: #0e1a2b; font-weight: 700; }
            `}</style>

            {tags.length > 0 && (
              <div
                className="flex flex-wrap items-center gap-2 mt-12 pt-8"
                style={{ borderTop: "1px solid #eceef2" }}
              >
                <Tag size={14} style={{ color: "#8a94a6" }} />
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "#eef4fd", color: "#0059AB" }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8">
              <ShareButtons title={data.title} />
            </div>

            <div
              className="mt-10 rounded-3xl p-6 flex items-start gap-4"
              style={{
                background: "linear-gradient(135deg, #f7f8fb 0%, #ffffff 100%)",
                border: "1px solid #eceef2",
              }}
            >
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #F6811E 0%, #ffb14a 100%)",
                  color: "#fff",
                  fontWeight: 800,
                }}
              >
                {(data.author || "A").charAt(0).toUpperCase()}
              </div>
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: "#8a94a6" }}
                >
                  Publicado por
                </p>
                <p className="font-bold text-base" style={{ color: "#0e1a2b" }}>
                  {data.author || "ACOMAC Joinville"}
                </p>
                <p className="text-xs mt-1" style={{ color: "#5a6577" }}>
                  Conteúdos sobre o varejo da construção civil em Santa Catarina.
                </p>
              </div>
            </div>
          </div>

          {withSidebar && (
            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <div className="hidden xl:flex justify-center">
                <SponsorAside slot="blog-post" stickyTop={0} />
              </div>
              {data.category && (
                <div
                  className="rounded-2xl p-5"
                  style={{ background: "#f7f8fb", border: "1px solid #eceef2" }}
                >
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
                    style={{ color: "#8a94a6" }}
                  >
                    Categoria
                  </p>
                  <Link
                    href={`/blog?category=${encodeURIComponent(data.category)}`}
                    className="text-sm font-bold inline-flex items-center gap-1"
                    style={{ color: "#0059AB" }}
                  >
                    {data.category}
                  </Link>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </article>
  );
}

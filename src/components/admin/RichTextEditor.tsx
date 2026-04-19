"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo2,
  Redo2,
  Minus,
  Unlink,
  UploadCloud,
  Loader2,
  X as CloseIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Comece a escrever…",
  autofocus = false,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  autofocus?: boolean;
}) {
  const lastExternalRef = useRef<string>(value);
  const [imageDialog, setImageDialog] = useState(false);
  const [dropping, setDropping] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: { class: "rte-content" },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (!items) return false;
        for (const it of Array.from(items)) {
          if (it.type.startsWith("image/")) {
            const file = it.getAsFile();
            if (file) {
              event.preventDefault();
              uploadAndInsert(file, (url) => {
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({ src: url })
                  )
                );
              });
              return true;
            }
          }
        }
        return false;
      },
      handleDrop: (view, event) => {
        if (!event.dataTransfer?.files?.length) return false;
        const file = Array.from(event.dataTransfer.files).find((f) =>
          f.type.startsWith("image/")
        );
        if (!file) return false;
        event.preventDefault();
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        uploadAndInsert(file, (url) => {
          const node = view.state.schema.nodes.image.create({ src: url });
          const tr = coordinates
            ? view.state.tr.insert(coordinates.pos, node)
            : view.state.tr.replaceSelectionWith(node);
          view.dispatch(tr);
        });
        return true;
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      lastExternalRef.current = html;
      onChange(html);
    },
    autofocus,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    if (value !== lastExternalRef.current) {
      lastExternalRef.current = value;
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  // Handler de drag-drop no container inteiro (para estilo visual)
  const containerRef = useRef<HTMLDivElement>(null);

  if (!editor) {
    return (
      <div
        className="rte-shell"
        style={{
          border: "1px solid var(--admin-border)",
          borderRadius: 12,
          padding: 16,
          color: "var(--admin-text-muted)",
          fontSize: 13,
        }}
      >
        Carregando editor…
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="rte-shell"
      onDragEnter={(e) => {
        if (e.dataTransfer?.types.includes("Files")) {
          e.preventDefault();
          setDropping(true);
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setDropping(false);
      }}
      onDragOver={(e) => {
        if (e.dataTransfer?.types.includes("Files")) e.preventDefault();
      }}
      onDrop={() => setDropping(false)}
      style={{
        position: "relative",
        border: `1px solid ${dropping ? "var(--admin-accent)" : "var(--admin-border)"}`,
        borderRadius: 12,
        background: "var(--admin-surface)",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
    >
      <RichTextToolbar editor={editor} onOpenImage={() => setImageDialog(true)} />
      <EditorContent editor={editor} />

      {dropping && (
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
          style={{
            background: "rgba(246,129,30,0.08)",
            border: "2px dashed var(--admin-accent)",
            borderRadius: 12,
            zIndex: 10,
          }}
        >
          <div
            className="flex flex-col items-center gap-2 px-5 py-3 rounded-xl"
            style={{
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              boxShadow: "var(--admin-shadow-lg)",
            }}
          >
            <UploadCloud size={22} style={{ color: "var(--admin-accent)" }} />
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--admin-text-strong)" }}
            >
              Solte a imagem para inserir
            </p>
          </div>
        </div>
      )}

      {imageDialog && (
        <ImageDialog
          onClose={() => setImageDialog(false)}
          onInsert={(url) => {
            editor.chain().focus().setImage({ src: url }).run();
            setImageDialog(false);
          }}
        />
      )}
      <RichTextStyles />
    </div>
  );
}

async function uploadAndInsert(file: File, cb: (url: string) => void) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) return;
  const data = await res.json();
  if (data.url) cb(data.url);
}

function RichTextToolbar({
  editor,
  onOpenImage,
}: {
  editor: Editor;
  onOpenImage: () => void;
}) {
  const btn = (active: boolean, disabled = false): React.CSSProperties => ({
    padding: "6px 8px",
    borderRadius: 6,
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: active ? "var(--admin-accent-soft)" : "transparent",
    color: active ? "var(--admin-accent)" : "var(--admin-text-muted)",
    opacity: disabled ? 0.4 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 12,
    fontWeight: 600,
    border: "1px solid transparent",
    transition: "all 0.15s",
  });

  function promptLink() {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL do link:", previousUrl || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const sep = (
    <span
      aria-hidden
      style={{
        width: 1,
        height: 20,
        background: "var(--admin-border)",
        margin: "0 4px",
        alignSelf: "center",
      }}
    />
  );

  return (
    <div
      className="rte-toolbar"
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 2,
        padding: 8,
        background: "var(--admin-surface-2)",
        borderBottom: "1px solid var(--admin-border)",
      }}
    >
      <button
        type="button"
        title="Desfazer"
        style={btn(false, !editor.can().undo())}
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 size={14} />
      </button>
      <button
        type="button"
        title="Refazer"
        style={btn(false, !editor.can().redo())}
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 size={14} />
      </button>
      {sep}
      <button
        type="button"
        title="Título 1"
        style={btn(editor.isActive("heading", { level: 1 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={15} />
      </button>
      <button
        type="button"
        title="Título 2"
        style={btn(editor.isActive("heading", { level: 2 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={15} />
      </button>
      <button
        type="button"
        title="Título 3"
        style={btn(editor.isActive("heading", { level: 3 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={15} />
      </button>
      {sep}
      <button
        type="button"
        title="Negrito (Ctrl+B)"
        style={btn(editor.isActive("bold"))}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={14} />
      </button>
      <button
        type="button"
        title="Itálico (Ctrl+I)"
        style={btn(editor.isActive("italic"))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={14} />
      </button>
      <button
        type="button"
        title="Sublinhado (Ctrl+U)"
        style={btn(editor.isActive("underline"))}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon size={14} />
      </button>
      <button
        type="button"
        title="Tachado"
        style={btn(editor.isActive("strike"))}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={14} />
      </button>
      {sep}
      <button
        type="button"
        title="Lista"
        style={btn(editor.isActive("bulletList"))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={14} />
      </button>
      <button
        type="button"
        title="Lista numerada"
        style={btn(editor.isActive("orderedList"))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={14} />
      </button>
      <button
        type="button"
        title="Citação"
        style={btn(editor.isActive("blockquote"))}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={14} />
      </button>
      <button
        type="button"
        title="Código"
        style={btn(editor.isActive("codeBlock"))}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <Code2 size={14} />
      </button>
      <button
        type="button"
        title="Linha horizontal"
        style={btn(false)}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Minus size={14} />
      </button>
      {sep}
      <button
        type="button"
        title="Link"
        style={btn(editor.isActive("link"))}
        onClick={promptLink}
      >
        <LinkIcon size={14} />
      </button>
      {editor.isActive("link") && (
        <button
          type="button"
          title="Remover link"
          style={btn(false)}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          <Unlink size={14} />
        </button>
      )}
      <button
        type="button"
        title="Inserir imagem"
        style={{
          ...btn(false),
          background: "var(--admin-accent-soft)",
          color: "var(--admin-accent)",
          padding: "6px 10px",
          gap: 6,
        }}
        onClick={onOpenImage}
      >
        <ImageIcon size={14} />
        Imagem
      </button>
    </div>
  );
}

function ImageDialog({
  onClose,
  onInsert,
}: {
  onClose: () => void;
  onInsert: (url: string) => void;
}) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setErr("");
    setPreviewUrl(URL.createObjectURL(f));
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function insertFromFile() {
    if (!file) return;
    setUploading(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setErr(d.error ?? "Erro ao enviar");
      return;
    }
    const d = await res.json();
    if (d.url) onInsert(d.url);
  }

  function insertFromUrl() {
    const u = url.trim();
    if (!u) {
      setErr("Informe a URL");
      return;
    }
    onInsert(u);
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
      style={{ background: "rgba(5,7,12,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderBottom: "1px solid var(--admin-border)" }}
        >
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--admin-accent)" }}
            >
              Inserir imagem
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--admin-text-muted)" }}
            >
              A imagem vai entrar no ponto onde está o cursor
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5"
            style={{ color: "var(--admin-text-muted)" }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div className="px-5 pt-4">
          <div
            className="inline-flex p-1 rounded-lg"
            style={{
              background: "var(--admin-surface-2)",
              border: "1px solid var(--admin-border)",
            }}
          >
            <button
              onClick={() => setMode("upload")}
              className="px-3 py-1.5 text-xs font-semibold rounded-md"
              style={{
                background: mode === "upload" ? "var(--admin-accent)" : "transparent",
                color: mode === "upload" ? "#fff" : "var(--admin-text-muted)",
              }}
            >
              Enviar arquivo
            </button>
            <button
              onClick={() => setMode("url")}
              className="px-3 py-1.5 text-xs font-semibold rounded-md"
              style={{
                background: mode === "url" ? "var(--admin-accent)" : "transparent",
                color: mode === "url" ? "#fff" : "var(--admin-text-muted)",
              }}
            >
              Colar URL
            </button>
          </div>
        </div>

        {mode === "upload" ? (
          <div className="p-5 space-y-3">
            {!previewUrl ? (
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f && f.type.startsWith("image/")) handleFile(f);
                }}
                className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-xl transition-colors"
                style={{
                  background: dragOver
                    ? "var(--admin-accent-soft)"
                    : "var(--admin-surface-2)",
                  border: `2px dashed ${dragOver ? "var(--admin-accent)" : "var(--admin-border)"}`,
                  color: "var(--admin-text-muted)",
                }}
              >
                <div
                  className="h-12 w-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: "var(--admin-accent-soft)",
                    color: "var(--admin-accent)",
                  }}
                >
                  <UploadCloud size={22} />
                </div>
                <div className="text-center">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--admin-text-strong)" }}
                  >
                    Clique para escolher uma imagem
                  </p>
                  <p className="text-xs mt-1">
                    Ou arraste e solte aqui · JPG, PNG, WebP, GIF, SVG · máx 10MB
                  </p>
                </div>
              </button>
            ) : (
              <div className="space-y-3">
                <div
                  className="rounded-xl overflow-hidden"
                  style={{ background: "var(--admin-surface-2)" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Pré-visualização"
                    className="w-full h-auto"
                    style={{ maxHeight: 280, objectFit: "contain", margin: "0 auto", display: "block" }}
                  />
                </div>
                <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
                  <strong>{file?.name}</strong> · {(file?.size ?? 0) / 1024 | 0} KB
                </p>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreviewUrl("");
                  }}
                  className="text-xs font-semibold"
                  style={{ color: "var(--admin-accent)" }}
                >
                  Trocar imagem
                </button>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </div>
        ) : (
          <div className="p-5 space-y-3">
            <div>
              <label
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "var(--admin-text-muted)" }}
              >
                URL da imagem
              </label>
              <input
                className="admin-input"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErr("");
                }}
                placeholder="https://exemplo.com/imagem.jpg"
                autoFocus
              />
            </div>
            {url && (
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background: "var(--admin-surface-2)",
                  border: "1px solid var(--admin-border)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt="Pré-visualização"
                  style={{
                    width: "100%",
                    maxHeight: 240,
                    objectFit: "contain",
                    display: "block",
                    margin: "0 auto",
                  }}
                  onError={() => setErr("Não foi possível carregar a URL")}
                />
              </div>
            )}
          </div>
        )}

        {err && (
          <p
            className="px-5 text-xs font-semibold"
            style={{ color: "var(--admin-danger)" }}
          >
            ⚠ {err}
          </p>
        )}

        <div
          className="flex items-center justify-end gap-2 px-5 py-3 mt-2"
          style={{ borderTop: "1px solid var(--admin-border)" }}
        >
          <button onClick={onClose} className="admin-btn admin-btn-ghost">
            Cancelar
          </button>
          <button
            onClick={mode === "upload" ? insertFromFile : insertFromUrl}
            disabled={
              uploading ||
              (mode === "upload" ? !file : !url.trim())
            }
            className="admin-btn admin-btn-primary"
          >
            {uploading ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Enviando…
              </>
            ) : (
              <>
                <ImageIcon size={13} />
                Inserir imagem
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function RichTextStyles() {
  return (
    <style>{`
      .rte-shell .rte-content {
        min-height: 320px;
        padding: 18px 20px;
        outline: none;
        color: var(--admin-text);
        font-size: 15px;
        line-height: 1.7;
      }
      .rte-shell .rte-content :first-child { margin-top: 0; }
      .rte-shell .rte-content > * + * { margin-top: 0.85em; }
      .rte-shell .rte-content h1 { font-size: 1.9em; font-weight: 800; line-height: 1.2; color: var(--admin-text-strong); }
      .rte-shell .rte-content h2 { font-size: 1.5em; font-weight: 800; line-height: 1.25; color: var(--admin-text-strong); }
      .rte-shell .rte-content h3 { font-size: 1.2em; font-weight: 700; line-height: 1.3; color: var(--admin-text-strong); }
      .rte-shell .rte-content p { color: var(--admin-text); }
      .rte-shell .rte-content ul, .rte-shell .rte-content ol { padding-left: 1.5em; }
      .rte-shell .rte-content ul { list-style: disc; }
      .rte-shell .rte-content ol { list-style: decimal; }
      .rte-shell .rte-content blockquote { border-left: 3px solid var(--admin-accent); padding-left: 14px; color: var(--admin-text-muted); font-style: italic; }
      .rte-shell .rte-content a { color: var(--admin-blue); text-decoration: underline; }
      .rte-shell .rte-content code { background: var(--admin-surface-2); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
      .rte-shell .rte-content pre { background: var(--admin-surface-2); padding: 14px 16px; border-radius: 8px; overflow-x: auto; font-size: 13px; }
      .rte-shell .rte-content pre code { background: transparent; padding: 0; }
      .rte-shell .rte-content img {
        max-width: 100%;
        height: auto;
        border-radius: 10px;
        margin: 0.6em 0;
        box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      }
      .rte-shell .rte-content hr { border: 0; border-top: 1px solid var(--admin-border); margin: 1.4em 0; }
      .rte-shell .rte-content p.is-editor-empty:first-child::before {
        content: attr(data-placeholder);
        color: var(--admin-text-subtle);
        float: left;
        height: 0;
        pointer-events: none;
      }
      .rte-shell .rte-toolbar button:hover:not(:disabled) {
        background: var(--admin-hover) !important;
        color: var(--admin-text-strong) !important;
      }
    `}</style>
  );
}

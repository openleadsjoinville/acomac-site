"use client";

import { useEffect, useState } from "react";
import { z, ZodTypeAny } from "zod";
import {
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { LargeImageField } from "@/components/ui/LargeImageField";
import { resolveFieldPreset } from "@/lib/image-presets";

function isWhatsAppCtaSchema(schema: ZodTypeAny): boolean {
  const inner = unwrap(schema);
  if (!(inner instanceof z.ZodObject)) return false;
  const keys = Object.keys((inner as z.ZodObject<z.ZodRawShape>).shape);
  return (
    keys.length === 3 &&
    keys.includes("label") &&
    keys.includes("message") &&
    keys.includes("whatsappNumber")
  );
}

function formatPhoneInput(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const WA_CTA_USED_IN: Record<string, string[]> = {
  associateNow: [
    "Botão \"Associe-se\" no Header",
    "CTA do menu flutuante mobile",
    "Botão primário do Hero da home",
    "Botão primário da seção institucional (CTA)",
  ],
  contactUs: [
    "Botão secundário da seção institucional (CTA)",
    "Botão \"Fale conosco\" do Sobre",
  ],
  requestInfo: [
    "Botões de \"Solicitar informações\" em páginas internas",
  ],
};

function WhatsAppCtaField({
  value,
  onChange,
  fieldName,
}: {
  value: { label?: string; message?: string; whatsappNumber?: string } | null;
  onChange: (v: { label: string; message: string; whatsappNumber: string }) => void;
  fieldName?: string;
}) {
  const v = {
    label: value?.label ?? "",
    message: value?.message ?? "",
    whatsappNumber: value?.whatsappNumber ?? "",
  };
  const [globalWa, setGlobalWa] = useState<string>("");

  useEffect(() => {
    fetch("/api/public/global")
      .then((r) => r.json())
      .then((g) => setGlobalWa(g?.whatsapp?.number ?? ""))
      .catch(() => {});
  }, []);

  const numberDisplay = v.whatsappNumber.trim()
    ? formatPhoneInput(v.whatsappNumber)
    : "";

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{
        background: "rgba(37,211,102,0.05)",
        border: "1px solid rgba(37,211,102,0.25)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="inline-flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0"
          style={{
            background: "rgba(37,211,102,0.18)",
            color: "#16a34a",
          }}
        >
          <MessageCircle size={13} />
        </span>
        <span
          className="text-xs font-bold uppercase tracking-[0.15em]"
          style={{ color: "#15803d" }}
        >
          Botão de WhatsApp
        </span>
      </div>

      {fieldName && WA_CTA_USED_IN[fieldName] && (
        <div
          className="rounded-md px-3 py-2 text-[11px] leading-relaxed"
          style={{
            background: "rgba(37,211,102,0.08)",
            color: "var(--admin-text-muted)",
            border: "1px dashed rgba(37,211,102,0.25)",
          }}
        >
          <strong style={{ color: "var(--admin-text-strong)" }}>
            Onde aparece no site:
          </strong>
          <ul className="list-disc pl-4 mt-1 space-y-0.5">
            {WA_CTA_USED_IN[fieldName].map((u) => (
              <li key={u}>{u}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="admin-label">Texto do botão</label>
        <input
          className="admin-input"
          value={v.label}
          onChange={(e) =>
            onChange({ ...v, label: e.target.value })
          }
          placeholder="Ex: Associe-se agora"
        />
      </div>

      <div>
        <label className="admin-label">Mensagem que será enviada</label>
        <textarea
          className="admin-input admin-textarea"
          rows={3}
          value={v.message}
          onChange={(e) =>
            onChange({ ...v, message: e.target.value })
          }
          placeholder="Olá! Tenho interesse em..."
        />
        <p className="text-[11px] mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
          Quando clicado, o WhatsApp abre com essa mensagem pré-preenchida.
        </p>
      </div>

      <div>
        <label className="admin-label flex items-center gap-1.5">
          <Phone size={11} />
          WhatsApp de destino
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            inputMode="tel"
            className="admin-input flex-1"
            value={numberDisplay}
            onChange={(e) =>
              onChange({
                ...v,
                whatsappNumber: e.target.value.replace(/\D/g, ""),
              })
            }
            placeholder={
              globalWa
                ? formatPhoneInput(globalWa)
                : "(47) 99999-0000"
            }
          />
          {v.whatsappNumber.trim() && (
            <button
              type="button"
              onClick={() => onChange({ ...v, whatsappNumber: "" })}
              className="text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 px-2 py-1.5 rounded-md hover:opacity-80"
              style={{
                background: "var(--admin-accent-soft)",
                color: "var(--admin-accent)",
              }}
              title="Voltar a usar o número geral do site"
            >
              <RotateCcw size={10} />
              Usar geral
            </button>
          )}
        </div>
        <p className="text-[11px] mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
          {v.whatsappNumber.trim()
            ? "Esse botão usa um WhatsApp exclusivo."
            : globalWa
            ? `Em branco usa o número geral: ${formatPhoneInput(globalWa)}`
            : "Em branco usa o número geral do site (Global → WhatsApp)."}
        </p>
        {fieldName && (
          <input type="hidden" data-cta-field={fieldName} />
        )}
      </div>
    </div>
  );
}

function unwrap(schema: ZodTypeAny): ZodTypeAny {
  let s: ZodTypeAny = schema;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  while ((s as any)?._def?.innerType) s = (s as any)._def.innerType;
  return s;
}

function getDefault(schema: ZodTypeAny): unknown {
  const s = unwrap(schema);
  if (s instanceof z.ZodString) return "";
  if (s instanceof z.ZodNumber) return 0;
  if (s instanceof z.ZodBoolean) return false;
  if (s instanceof z.ZodArray) return [];
  if (s instanceof z.ZodObject) {
    const obj: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(s.shape)) obj[k] = getDefault(v as ZodTypeAny);
    return obj;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((schema as any)?._def?.defaultValue !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = (schema as any)._def.defaultValue;
    return typeof d === "function" ? d() : d;
  }
  return "";
}

function looksLikeImage(keyName?: string): boolean {
  if (!keyName) return false;
  const k = keyName.toLowerCase();
  return (
    k === "image" ||
    k === "logo" ||
    k === "backgroundimage" ||
    k === "backgroundvideo" ||
    k === "src" ||
    k === "photo" ||
    k.endsWith("image") ||
    k.endsWith("logo") ||
    k.endsWith("icon") ||
    k.endsWith("photo")
  );
}

function looksLikeTextarea(keyName?: string): boolean {
  if (!keyName) return false;
  const k = keyName.toLowerCase();
  return (
    k === "description" ||
    k === "subtitle" ||
    k === "about" ||
    k === "excerpt" ||
    k === "bottom" ||
    k === "defaultmessage" ||
    k === "successmessage" ||
    k === "mapembedurl" ||
    k.endsWith("description") ||
    k.endsWith("text") ||
    k.endsWith("message")
  );
}

const HUMAN_LABELS: Record<string, string> = {
  badge: "Etiqueta",
  title: "Título",
  titleHighlight: "Destaque do título",
  titleSuffix: "Sufixo do título",
  subtitle: "Subtítulo",
  description: "Descrição",
  paragraphs: "Parágrafos",
  image: "Imagem",
  backgroundVideo: "Vídeo de fundo",
  backgroundImage: "Imagem de fundo",
  ctaLabel: "Texto do botão",
  ctaHref: "Link do botão",
  ctaPrimary: "Botão principal",
  ctaSecondary: "Botão secundário",
  label: "Texto",
  href: "Link",
  stats: "Estatísticas",
  value: "Valor",
  items: "Itens",
  features: "Recursos",
  highlights: "Destaques",
  categories: "Categorias",
  logos: "Logos",
  news: "Notícias",
  partners: "Parceiros",
  hero: "Hero (topo)",
  about: "Sobre",
  events: "Eventos",
  benefits: "Benefícios",
  infrastructure: "Infraestrutura",
  courses: "Cursos",
  exitPopup: "Pop-up de saída",
  enabled: "Ativado",
  icon: "Ícone",
  intro: "Introdução",
  registerCta: "CTA de cadastro",
  history: "História",
  mission: "Missão / Visão / Valores",
  vision: "Visão",
  values: "Valores",
  timeline: "Linha do tempo",
  team: "Equipe",
  members: "Membros",
  name: "Nome",
  role: "Cargo",
  year: "Ano",
  date: "Data",
  location: "Local",
  href2: "Link",
  ctaSection: "Seção de CTA",
  featured: "Evento principal",
  upcoming: "Próximos",
  past: "Anteriores",
  catalog: "Catálogo",
  instructor: "Instrutor",
  duration: "Duração",
  price: "Preço",
  category: "Categoria",
  segment: "Segmento",
  address: "Endereço",
  addressLines: "Linhas do endereço",
  phones: "Telefones",
  emails: "Emails",
  hours: "Horários",
  days: "Dias",
  time: "Horário",
  mapEmbedUrl: "URL do mapa (embed do Google Maps)",
  brand: "Marca",
  logoAlt: "Texto alternativo do logo",
  header: "Cabeçalho",
  nav: "Menu de navegação",
  topbar: "Barra superior",
  phone: "Telefone",
  email: "E-mail",
  city: "Cidade",
  whatsapp: "WhatsApp",
  number: "Número (apenas dígitos, com DDI)",
  floatingEnabled: "Botão flutuante ativado",
  bubbleTitle: "Título do balão",
  bubbleText: "Texto do balão",
  defaultMessage: "Mensagem pré-preenchida",
  socials: "Redes sociais",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  contactInfo: "Informações de contato",
  addressLine2: "Complemento",
  whatsappLabel: "Label do WhatsApp",
  footer: "Rodapé",
  columns: "Colunas do rodapé",
  links: "Links",
  bottom: "Rodapé — texto inferior",
  cta: "Chamada institucional",
  primaryLabel: "Texto do botão primário",
  primaryHref: "Link do botão primário",
  secondaryLabel: "Texto do botão secundário",
  secondaryHref: "Link do botão secundário",
  contactForm: "Formulário de contato",
  submitLabel: "Texto do botão enviar",
  successMessage: "Mensagem de sucesso",
  whatsappCtas: "Botões de WhatsApp",
  associateNow: "CTA \"Associe-se agora\"",
  contactUs: "CTA \"Fale com a gente\"",
  requestInfo: "CTA \"Solicitar informações\"",
  message: "Mensagem",
  whatsappNumber: "WhatsApp de destino",
};

function humanize(k: string): string {
  if (HUMAN_LABELS[k]) return HUMAN_LABELS[k];
  return k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
}

function StringField({ value, onChange, name }: { value: string; onChange: (v: string) => void; name?: string }) {
  if (looksLikeImage(name)) {
    const isVideoField = name?.toLowerCase() === "backgroundvideo";
    return (
      <LargeImageField
        value={value}
        onChange={onChange}
        fieldName={name}
        preset={resolveFieldPreset(name)}
        acceptVideo={!!isVideoField}
        endpoint="/api/admin/upload"
      />
    );
  }
  if (looksLikeTextarea(name) || (value?.length ?? 0) > 80) {
    return <textarea className="admin-input admin-textarea" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
  return <input className="admin-input" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
}

function BooleanField({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="relative inline-flex h-5 w-9 rounded-full transition-colors"
      style={{ background: value ? "var(--admin-accent)" : "rgba(255,255,255,0.1)" }}
    >
      <span className="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform" style={{ transform: `translate(${value ? "18px" : "3px"}, 3px)` }} />
    </button>
  );
}

function NumberField({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return <input type="number" className="admin-input w-40" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />;
}

function ArrayField({ schema, value, onChange, name }: { schema: z.ZodArray<ZodTypeAny>; value: unknown[]; onChange: (v: unknown[]) => void; name?: string }) {
  const items = value ?? [];
  // Zod v4: o schema do elemento está em `_def.element` (em v3 era `_def.type`).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const def = (schema as any)._def ?? {};
  const itemSchema = (def.element ?? def.type) as ZodTypeAny;
  const inner = unwrap(itemSchema);
  const isObject = inner instanceof z.ZodObject;

  const add = () => onChange([...items, getDefault(itemSchema)]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const update = (i: number, v: unknown) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="text-xs italic" style={{ color: "var(--admin-text-subtle)" }}>
          Nenhum item adicionado ainda.
        </p>
      )}
      {items.map((item, i) => (
        <div key={i} className="rounded-lg p-3" style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold" style={{ color: "var(--admin-text-muted)" }}>
              Item {i + 1}
              {isObject && (item as Record<string, unknown>)?.title ? (
                <span className="ml-2 font-normal" style={{ color: "var(--admin-text-subtle)" }}>
                  — {String((item as Record<string, unknown>).title)}
                </span>
              ) : null}
            </span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-white/5 disabled:opacity-30">↑</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 rounded hover:bg-white/5 disabled:opacity-30">↓</button>
              <button type="button" onClick={() => remove(i)} className="p-1 rounded hover:bg-red-500/10 text-red-400">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
          {isObject ? (
            <ObjectField schema={inner as z.ZodObject<z.ZodRawShape>} value={(item ?? {}) as Record<string, unknown>} onChange={(v) => update(i, v)} depth={1} />
          ) : (
            <FieldRenderer schema={itemSchema} value={item} onChange={(v) => update(i, v)} name={name ? `${name}-item` : undefined} />
          )}
        </div>
      ))}
      <button type="button" onClick={add} className="admin-btn admin-btn-ghost text-xs">
        <Plus size={12} />
        Adicionar item
      </button>
    </div>
  );
}

function sectionAnchorId(key: string): string {
  return `admin-section-${key}`;
}

function ObjectField({
  schema,
  value,
  onChange,
  depth = 0,
}: {
  schema: z.ZodObject<z.ZodRawShape>;
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
  depth?: number;
}) {
  const shape = schema.shape;
  // No depth 0 cada entrada vira uma SEÇÃO independente, em bloco próprio,
  // visualmente separada por divisor laranja + número grande + spacing forte.
  if (depth === 0) {
    const entries = Object.entries(shape);
    return (
      <div>
        {entries.map(([key, fieldSchema], idx) => (
          <section
            key={key}
            id={sectionAnchorId(key)}
            style={{ scrollMarginTop: 140 }}
            className={idx === 0 ? "" : "mt-14"}
          >
            {/* Divisor entre seções (não aparece antes da primeira) */}
            {idx > 0 && (
              <div
                aria-hidden
                className="-mx-5 mb-10 flex items-center gap-3"
                style={{ color: "var(--admin-text-subtle)" }}
              >
                <div
                  className="flex-1 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, var(--admin-border) 30%, var(--admin-border) 70%, transparent)",
                  }}
                />
                <span
                  className="inline-flex items-center justify-center w-2 h-2 rounded-full"
                  style={{ background: "var(--admin-accent)" }}
                />
                <div
                  className="flex-1 h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, var(--admin-border) 30%, var(--admin-border) 70%, transparent)",
                  }}
                />
              </div>
            )}

            {/* Cabeçalho da seção */}
            <header className="flex items-center gap-3 mb-5">
              <span
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg flex-shrink-0 text-sm font-extrabold tabular-nums"
                style={{
                  background:
                    "linear-gradient(135deg, var(--admin-accent) 0%, #ff9a3f 100%)",
                  color: "#fff",
                  boxShadow: "0 4px 12px rgba(246,129,30,0.35)",
                }}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 min-w-0">
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "var(--admin-accent)" }}
                >
                  Seção {idx + 1} de {entries.length}
                </p>
                <h2
                  className="text-lg md:text-xl font-bold tracking-tight leading-tight"
                  style={{ color: "var(--admin-text-strong)" }}
                >
                  {humanize(key)}
                </h2>
              </div>
            </header>

            {/* Conteúdo da seção em bloco próprio */}
            <FieldBlock
              name={key}
              schema={fieldSchema as ZodTypeAny}
              value={(value ?? {})[key]}
              onChange={(v) => onChange({ ...(value ?? {}), [key]: v })}
              depth={depth}
            />
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Object.entries(shape).map(([key, fieldSchema]) => (
        <FieldBlock
          key={key}
          name={key}
          schema={fieldSchema as ZodTypeAny}
          value={(value ?? {})[key]}
          onChange={(v) => onChange({ ...(value ?? {}), [key]: v })}
          depth={depth}
        />
      ))}
    </div>
  );
}

function FieldBlock({ name, schema, value, onChange, depth }: { name: string; schema: ZodTypeAny; value: unknown; onChange: (v: unknown) => void; depth: number }) {
  const inner = unwrap(schema);
  const isArray = inner instanceof z.ZodArray;
  const isObject = inner instanceof z.ZodObject;
  const isWaCta = isWhatsAppCtaSchema(inner);
  const [open, setOpen] = useState(depth < 1);

  // WhatsApp CTA: rendering próprio, sem o "collapse" genérico de objeto
  if (isWaCta) {
    return (
      <div>
        <label className="admin-label">{humanize(name)}</label>
        <FieldRenderer schema={schema} value={value} onChange={onChange} name={name} depth={depth + 1} />
      </div>
    );
  }

  if (isArray || isObject) {
    // No depth 0 o cabe\u00e7alho da se\u00e7\u00e3o j\u00e1 aparece acima (renderizado pelo ObjectField);
    // ent\u00e3o aqui s\u00f3 abre o conte\u00fado direto, sem card colaps\u00e1vel.
    if (depth === 0) {
      return (
        <div
          className="rounded-xl px-4 py-4"
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
          }}
        >
          <FieldRenderer schema={schema} value={value} onChange={onChange} name={name} depth={depth + 1} />
        </div>
      );
    }
    return (
      <div className="rounded-xl" style={{ background: "var(--admin-surface-2)", border: "1px solid var(--admin-border)" }}>
        <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-white hover:bg-white/5 rounded-xl">
          <span className="flex items-center gap-2">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {humanize(name)}
            {isArray && (
              <span className="text-xs font-normal" style={{ color: "var(--admin-text-subtle)" }}>
                ({Array.isArray(value) ? (value as unknown[]).length : 0})
              </span>
            )}
          </span>
        </button>
        {open && (
          <div className="px-4 pb-4">
            <FieldRenderer schema={schema} value={value} onChange={onChange} name={name} depth={depth + 1} />
          </div>
        )}
      </div>
    );
  }

  const isImage = looksLikeImage(name);

  if (isImage) {
    return (
      <div>
        <label className="admin-label flex items-center justify-between">
          <span>{humanize(name)}</span>
        </label>
        <FieldRenderer schema={schema} value={value} onChange={onChange} name={name} depth={depth + 1} />
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <label className="admin-label">{humanize(name)}</label>
        <FieldRenderer schema={schema} value={value} onChange={onChange} name={name} depth={depth + 1} />
      </div>
    </div>
  );
}

function FieldRenderer({ schema, value, onChange, name, depth = 0 }: { schema: ZodTypeAny; value: unknown; onChange: (v: unknown) => void; name?: string; depth?: number }) {
  const inner = unwrap(schema);
  if (isWhatsAppCtaSchema(inner)) {
    return (
      <WhatsAppCtaField
        value={value as { label?: string; message?: string; whatsappNumber?: string } | null}
        onChange={(v) => onChange(v)}
        fieldName={name}
      />
    );
  }
  if (inner instanceof z.ZodString) {
    return <StringField value={(value as string) ?? ""} onChange={onChange as (v: string) => void} name={name} />;
  }
  if (inner instanceof z.ZodNumber) {
    return <NumberField value={(value as number) ?? 0} onChange={onChange as (v: number) => void} />;
  }
  if (inner instanceof z.ZodBoolean) {
    return <BooleanField value={(value as boolean) ?? false} onChange={onChange as (v: boolean) => void} />;
  }
  if (inner instanceof z.ZodArray) {
    return <ArrayField schema={inner as z.ZodArray<ZodTypeAny>} value={(value as unknown[]) ?? []} onChange={onChange as (v: unknown[]) => void} name={name} />;
  }
  if (inner instanceof z.ZodObject) {
    return <ObjectField schema={inner as z.ZodObject<z.ZodRawShape>} value={(value as Record<string, unknown>) ?? {}} onChange={onChange as (v: Record<string, unknown>) => void} depth={depth} />;
  }
  return <p className="text-xs text-red-400">Tipo não suportado</p>;
}

function SectionNav({ keys }: { keys: string[] }) {
  if (keys.length <= 1) return null;
  return (
    <div
      className="sticky z-10 -mx-5 px-5 py-2 mb-6 flex flex-wrap items-center gap-1.5"
      style={{
        top: 116,
        background: "var(--admin-surface)",
        borderTop: "1px solid var(--admin-border)",
        borderBottom: "1px solid var(--admin-border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <span
        className="text-[10px] font-bold uppercase tracking-[0.18em] mr-2"
        style={{ color: "var(--admin-text-muted)" }}
      >
        Seções
      </span>
      {keys.map((key, i) => (
        <a
          key={key}
          href={`#${sectionAnchorId(key)}`}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-md transition-colors"
          style={{
            background: "var(--admin-surface-2)",
            color: "var(--admin-text-strong)",
            border: "1px solid var(--admin-border)",
          }}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(sectionAnchorId(key));
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
              window.history.replaceState(
                null,
                "",
                `#${sectionAnchorId(key)}`
              );
            }
          }}
        >
          <span
            className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded text-[9px] font-bold tabular-nums"
            style={{
              background: "var(--admin-accent-soft)",
              color: "var(--admin-accent)",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          {humanize(key)}
        </a>
      ))}
    </div>
  );
}

export function SchemaEditor<T extends z.ZodObject<z.ZodRawShape>>({
  schema,
  value,
  onChange,
}: {
  schema: T;
  value: z.infer<T>;
  onChange: (v: z.infer<T>) => void;
}) {
  const sectionKeys = Object.keys(schema.shape);
  return (
    <>
      <SectionNav keys={sectionKeys} />
      <ObjectField
        schema={schema}
        value={value as Record<string, unknown>}
        onChange={(v) => onChange(v as z.infer<T>)}
        depth={0}
      />
    </>
  );
}

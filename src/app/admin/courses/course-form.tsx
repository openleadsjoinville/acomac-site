"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import {
  ArrowLeft,
  CircleDot,
  ExternalLink,
  Eye,
  Link2,
  MessageCircle,
  Phone,
  RotateCcw,
  Save,
  Scissors,
  Sparkles,
  Trash2,
} from "lucide-react";
import { PageHeader, Panel, ToggleRow, StatusPill } from "../_components/ui";
import { LargeImageField } from "@/components/ui/LargeImageField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { CONTEXT_PRESETS } from "@/lib/image-presets";
import { autoCourseMessage as autoMessage } from "@/lib/course-cta";
import { resumo } from "@/lib/rich-text";

/** Limite do resumo que aparece no card do site — acima disso o card fica feio. */
const RESUMO_MAX = 220;

function formatPhoneInput(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

type CourseData = {
  title: string;
  description: string;
  content: string;
  category: string;
  duration: string;
  level: string;
  price: string;
  instructor: string;
  image: string;
  /** "whatsapp" (conversa com mensagem pronta) ou "link" (URL externa) */
  ctaType: string;
  /** Rótulo do botão de inscrição */
  ctaLabel: string;
  /** URL de inscrição, quando ctaType = "link" */
  ctaHref: string;
  ctaWhatsappNumber: string;
  ctaWhatsappMessage: string;
  startDate: string;
  endDate: string;
  published: boolean;
  featured: boolean;
  orderIndex: number;
};

const empty: CourseData = {
  title: "",
  description: "",
  content: "",
  category: "",
  duration: "",
  level: "Básico",
  price: "",
  instructor: "",
  image: "",
  ctaType: "whatsapp",
  ctaLabel: "",
  ctaHref: "",
  ctaWhatsappNumber: "",
  ctaWhatsappMessage: "",
  startDate: "",
  endDate: "",
  published: true,
  featured: false,
  orderIndex: 0,
};

export function CourseForm({ id }: { id?: string }) {
  const router = useRouter();
  const [data, setData] = useState<CourseData>(empty);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [globalWhatsapp, setGlobalWhatsapp] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  // Enquanto false, a mensagem do WhatsApp acompanha o título automaticamente
  const [messageTouched, setMessageTouched] = useState(false);

  useEffect(() => {
    fetch("/api/public/global")
      .then((r) => r.json())
      .then((g) => setGlobalWhatsapp(g?.whatsapp?.number ?? ""))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    fetch("/api/admin/courses")
      .then((r) => r.json())
      .then((items) => {
        const found = items.find((x: { id: string }) => x.id === id);
        if (found) {
          setData({
            ...found,
            ctaType: found.ctaType === "link" ? "link" : "whatsapp",
            startDate: found.startDate ? new Date(found.startDate).toISOString().slice(0, 16) : "",
            endDate: found.endDate ? new Date(found.endDate).toISOString().slice(0, 16) : "",
          });
          setSlug(found.slug ?? "");
          if (found.ctaWhatsappMessage) setMessageTouched(true);
        }
        setLoading(false);
      });
  }, [id]);

  // Mensagem efetiva: segue o título até alguém editar o texto na mão
  const ctaMessage = messageTouched
    ? data.ctaWhatsappMessage
    : autoMessage(data.title);

  async function save() {
    if (!data.title.trim()) return toast.error("Título obrigatório");
    setSaving(true);
    const body = {
      ...data,
      ctaWhatsappMessage: ctaMessage,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
    };
    const url = id ? `/api/admin/courses/${id}` : "/api/admin/courses";
    const method = id ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!res.ok) return toast.error("Erro ao salvar");
    const saved = await res.json();
    toast.success(id ? "Salvo!" : "Curso criado!");
    if (!id) router.push(`/admin/courses/${saved.id}`);
  }

  async function remove() {
    if (!id || !confirm("Excluir este curso?")) return;
    await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    router.push("/admin/courses");
  }

  const set = <K extends keyof CourseData>(k: K) => (v: CourseData[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const linkInvalido =
    data.ctaType === "link" &&
    data.ctaHref.trim() !== "" &&
    !/^https?:\/\//i.test(data.ctaHref.trim());

  if (loading) {
    return (
      <div className="py-20 text-center" style={{ color: "var(--admin-text-subtle)" }}>
        Carregando...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow={id ? "Editar curso" : "Novo curso"}
        title={id ? data.title || "Curso" : "Criar novo curso"}
        subtitle="Dados do curso exibidos no catálogo público."
        actions={
          <>
            <Link href="/admin/courses" className="admin-btn admin-btn-ghost">
              <ArrowLeft size={14} />
              Voltar
            </Link>
            {id && slug && (
              <a
                href={`/cursos/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="admin-btn admin-btn-ghost"
                title="Abrir a página pública deste curso"
              >
                <Eye size={14} />
                Ver no site
              </a>
            )}
            {id && (
              <button onClick={remove} className="admin-btn admin-btn-danger-ghost">
                <Trash2 size={14} />
                Excluir
              </button>
            )}
            <button onClick={save} disabled={saving} className="admin-btn admin-btn-primary">
              <Save size={14} />
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </>
        }
      />

      <div className="px-6 lg:px-8 pb-10 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Panel>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Título do curso</label>
                <input className="admin-input" value={data.title} onChange={(e) => set("title")(e.target.value)} placeholder="Ex: Vendas Consultivas no Varejo" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="admin-label" style={{ margin: 0 }}>
                    Resumo do card
                  </label>
                  <span
                    className="text-[11px] font-bold tabular-nums"
                    style={{
                      color:
                        data.description.length > RESUMO_MAX
                          ? "var(--admin-danger)"
                          : "var(--admin-text-muted)",
                    }}
                  >
                    {data.description.length}/{RESUMO_MAX}
                  </span>
                </div>
                <textarea
                  className="admin-input admin-textarea"
                  value={data.description}
                  maxLength={RESUMO_MAX}
                  rows={3}
                  onChange={(e) => set("description")(e.target.value)}
                  placeholder="Uma ou duas frases sobre o que o aluno vai aprender. Ex: Aprenda a posicionar sua empresa para vender ao poder público, do cadastro à entrega."
                />
                <p className="text-[11px] mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
                  É o texto curto que aparece no <strong>card</strong> da home e da
                  página /cursos, junto do botão <em>Saiba mais</em>. Todo o detalhe
                  vai no campo de baixo — não repita a programação inteira aqui.
                </p>
                {data.description.length > RESUMO_MAX && (
                  <div
                    className="mt-2 p-3 rounded-lg flex items-start gap-2"
                    style={{
                      background: "rgba(246,129,30,0.1)",
                      border: "1px solid rgba(246,129,30,0.3)",
                    }}
                  >
                    <Scissors
                      size={14}
                      className="flex-shrink-0 mt-0.5"
                      style={{ color: "var(--admin-accent)" }}
                    />
                    <div className="text-[12px]">
                      <p className="font-semibold" style={{ color: "var(--admin-text-strong)" }}>
                        Esse texto é longo demais para o card
                      </p>
                      <p className="leading-snug mb-2" style={{ color: "var(--admin-text-muted)" }}>
                        No site ele já aparece cortado. Encurte aqui e mova o texto
                        completo para o campo de baixo.
                      </p>
                      <button
                        type="button"
                        onClick={() => set("description")(resumo(data.description, RESUMO_MAX))}
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md hover:opacity-80"
                        style={{
                          background: "var(--admin-accent-soft)",
                          color: "var(--admin-accent)",
                        }}
                      >
                        Encurtar automaticamente
                      </button>
                    </div>
                  </div>
                )}
                {data.description.trim() && (
                  <div
                    className="mt-2 p-3 rounded-lg"
                    style={{
                      background: "var(--admin-surface-2)",
                      border: "1px solid var(--admin-border)",
                    }}
                  >
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Como vai aparecer no card
                    </p>
                    <p className="text-[12px] leading-snug" style={{ color: "var(--admin-text-strong)" }}>
                      {resumo(data.description, 150)}
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="admin-label">Descrição completa (página do curso)</label>
                <RichTextEditor
                  value={data.content}
                  onChange={set("content")}
                  placeholder="Programação completa, o que será abordado, para quem é, palestrante, local, horário…"
                />
                <p className="text-[11px] mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
                  Aparece na página do curso, aberta quando o visitante clica em
                  <em> Saiba mais</em>. Aqui pode escrever à vontade — use títulos,
                  listas e negrito para organizar.
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <h3 className="font-semibold text-white mb-4">Detalhes</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">Categoria</label>
                <CategoryField value={data.category} onChange={set("category")} />
              </div>
              <div>
                <label className="admin-label">Duração</label>
                <input className="admin-input" value={data.duration} onChange={(e) => set("duration")(e.target.value)} placeholder="16h" />
              </div>
              <div>
                <label className="admin-label">Nível</label>
                <select className="admin-input" value={data.level} onChange={(e) => set("level")(e.target.value)}>
                  <option>Básico</option>
                  <option>Intermediário</option>
                  <option>Avançado</option>
                </select>
              </div>
              <div>
                <label className="admin-label">Instrutor</label>
                <input className="admin-input" value={data.instructor} onChange={(e) => set("instructor")(e.target.value)} placeholder="Nome do instrutor" />
              </div>
              <div className="sm:col-span-2">
                <label className="admin-label">Preço</label>
                <input className="admin-input" value={data.price} onChange={(e) => set("price")(e.target.value)} placeholder="Ex: R$ 380 · Associados: grátis" />
              </div>
              <div>
                <label className="admin-label">Data de início (opcional)</label>
                <input type="datetime-local" className="admin-input" value={data.startDate} onChange={(e) => set("startDate")(e.target.value)} />
              </div>
              <div>
                <label className="admin-label">Data de encerramento (opcional)</label>
                <input type="datetime-local" className="admin-input" value={data.endDate} onChange={(e) => set("endDate")(e.target.value)} />
                <p className="text-[11px] mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
                  Ao chegar esta data, o curso sai automaticamente do site. Deixe em branco para exibir sempre.
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <h3 className="font-semibold text-white mb-1.5">Botão de inscrição</h3>
            <p
              className="text-[12px] mb-4"
              style={{ color: "var(--admin-text-muted)" }}
            >
              É o botão que aparece na página do curso, embaixo das informações.
              Escolha para onde ele leva quem quer se inscrever:
            </p>

            <div className="grid sm:grid-cols-2 gap-3 mb-5">
              <CtaTipoCard
                active={data.ctaType !== "link"}
                onClick={() => set("ctaType")("whatsapp")}
                icon={<MessageCircle size={16} />}
                title="Abrir o WhatsApp"
                description="A pessoa cai na conversa com uma mensagem já escrita. Você recebe e responde."
                accent="#16a34a"
              />
              <CtaTipoCard
                active={data.ctaType === "link"}
                onClick={() => set("ctaType")("link")}
                icon={<Link2 size={16} />}
                title="Levar para um link"
                description="Manda para uma página de inscrição — Sympla, Google Forms, site do parceiro."
                accent="#3b82f6"
              />
            </div>

            {data.ctaType === "link" ? (
              <div className="space-y-4">
                <div>
                  <label className="admin-label flex items-center gap-1.5">
                    <Link2 size={11} />
                    Endereço da página de inscrição
                  </label>
                  <input
                    type="url"
                    inputMode="url"
                    className="admin-input"
                    value={data.ctaHref}
                    onChange={(e) => set("ctaHref")(e.target.value)}
                    placeholder="https://www.sympla.com.br/evento/..."
                  />
                  <p
                    className="text-[11px] mt-1.5"
                    style={{ color: "var(--admin-text-muted)" }}
                  >
                    Cole o endereço completo, começando com <code>https://</code>.
                    Abre em uma nova aba.
                  </p>
                  {linkInvalido && (
                    <p
                      className="text-[11px] mt-1.5 font-semibold"
                      style={{ color: "var(--admin-danger)" }}
                    >
                      Esse endereço não parece completo — precisa começar com
                      http:// ou https://
                    </p>
                  )}
                </div>

                <div>
                  <label className="admin-label">Texto do botão (opcional)</label>
                  <input
                    className="admin-input"
                    value={data.ctaLabel}
                    onChange={(e) => set("ctaLabel")(e.target.value)}
                    placeholder="Fazer inscrição"
                  />
                  <p
                    className="text-[11px] mt-1.5"
                    style={{ color: "var(--admin-text-muted)" }}
                  >
                    Em branco, o botão mostra <strong>Fazer inscrição</strong>.
                    Exemplos: &ldquo;Inscreva-se no Sympla&rdquo;, &ldquo;Garantir
                    minha vaga&rdquo;.
                  </p>
                </div>

                <div
                  className="p-3 rounded-lg flex items-start gap-2"
                  style={{
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.25)",
                  }}
                >
                  <ExternalLink
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#3b82f6" }}
                  />
                  <div className="text-[12px]" style={{ color: "var(--admin-text-strong)" }}>
                    <p className="font-semibold mb-0.5">Pré-visualização</p>
                    <p className="leading-snug" style={{ color: "var(--admin-text-muted)" }}>
                      Botão <strong style={{ color: "var(--admin-text-strong)" }}>
                        {data.ctaLabel.trim() || "Fazer inscrição"}
                      </strong>{" "}
                      →{" "}
                      {data.ctaHref.trim() || (
                        <em>nenhum link informado (o botão vai para o contato do site)</em>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid lg:grid-cols-[1fr_280px] gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        className="admin-label flex items-center gap-1.5"
                        style={{ margin: 0 }}
                      >
                        <MessageCircle size={11} />
                        Mensagem que a pessoa vai te enviar
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setMessageTouched(false);
                          set("ctaWhatsappMessage")(autoMessage(data.title));
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 px-2 py-1 rounded-md hover:opacity-80"
                        style={{
                          background: "var(--admin-accent-soft)",
                          color: "var(--admin-accent)",
                        }}
                        title="Gerar mensagem automaticamente a partir do título"
                      >
                        <RotateCcw size={10} />
                        Gerar do título
                      </button>
                    </div>
                    <textarea
                      className="admin-input admin-textarea"
                      value={ctaMessage}
                      rows={4}
                      onChange={(e) => {
                        setMessageTouched(true);
                        set("ctaWhatsappMessage")(e.target.value);
                      }}
                      placeholder={autoMessage(data.title || "Nome do curso")}
                    />
                    <p
                      className="text-[11px] mt-1.5"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Já vem escrita na conversa — a pessoa só aperta enviar. Deixe o
                      nome do curso na mensagem para você saber na hora do que se
                      trata. Por padrão é gerada a partir do título.
                    </p>
                  </div>

                  <div>
                    <label className="admin-label flex items-center gap-1.5">
                      <Phone size={11} />
                      Número que vai receber
                    </label>
                    <input
                      type="text"
                      inputMode="tel"
                      className="admin-input"
                      value={data.ctaWhatsappNumber}
                      onChange={(e) =>
                        set("ctaWhatsappNumber")(formatPhoneInput(e.target.value))
                      }
                      placeholder={
                        globalWhatsapp
                          ? formatPhoneInput(globalWhatsapp)
                          : "(47) 99999-0000"
                      }
                    />
                    <p
                      className="text-[11px] mt-1.5"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      {data.ctaWhatsappNumber.trim()
                        ? "Esse curso usa um WhatsApp exclusivo."
                        : globalWhatsapp
                        ? `Em branco usa o número geral do site: ${formatPhoneInput(globalWhatsapp)}`
                        : "Em branco usa o número geral do site."}
                    </p>

                    <label className="admin-label mt-4">Texto do botão (opcional)</label>
                    <input
                      className="admin-input"
                      value={data.ctaLabel}
                      onChange={(e) => set("ctaLabel")(e.target.value)}
                      placeholder="Quero me inscrever"
                    />
                  </div>
                </div>

                <div
                  className="p-3 rounded-lg flex items-start gap-2"
                  style={{
                    background: "rgba(37,211,102,0.08)",
                    border: "1px solid rgba(37,211,102,0.25)",
                  }}
                >
                  <MessageCircle
                    size={14}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: "#16a34a" }}
                  />
                  <div className="text-[12px]" style={{ color: "var(--admin-text-strong)" }}>
                    <p className="font-semibold mb-0.5">Pré-visualização</p>
                    <p className="leading-snug" style={{ color: "var(--admin-text-muted)" }}>
                      Botão{" "}
                      <strong style={{ color: "var(--admin-text-strong)" }}>
                        {data.ctaLabel.trim() || "Quero me inscrever"}
                      </strong>{" "}
                      → abre o WhatsApp com: &ldquo;
                      {ctaMessage || autoMessage(data.title || "Nome do curso")}
                      &rdquo;
                    </p>
                    <p
                      className="mt-1.5 text-[11px]"
                      style={{ color: "var(--admin-text-muted)" }}
                    >
                      Será enviada para:{" "}
                      <strong style={{ color: "var(--admin-text-strong)" }}>
                        {data.ctaWhatsappNumber.trim()
                          ? formatPhoneInput(data.ctaWhatsappNumber)
                          : globalWhatsapp
                          ? `${formatPhoneInput(globalWhatsapp)} (geral)`
                          : "número geral não configurado"}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel>
            <h3 className="font-semibold text-white mb-3">Publicação</h3>

            <div className="mb-4">
              <StatusPill
                active={data.published}
                activeLabel="Publicado"
                inactiveLabel="Rascunho"
                extra={data.featured ? "Em destaque" : undefined}
              />
            </div>

            <div className="space-y-1">
              <ToggleRow
                icon={<CircleDot size={14} />}
                label="Publicar no site"
                hint={
                  data.published
                    ? "Visível em /cursos"
                    : "Salvar manterá como rascunho (oculto no site)"
                }
                value={data.published}
                onChange={set("published")}
              />
              <ToggleRow
                icon={<Sparkles size={14} />}
                label="Destacar"
                hint={
                  data.featured
                    ? "Aparece como destaque na seção de cursos"
                    : "Curso comum, sem destaque visual"
                }
                value={data.featured}
                onChange={set("featured")}
              />
              <div className="pt-2">
                <label className="admin-label">Ordem</label>
                <input type="number" className="admin-input" value={data.orderIndex} onChange={(e) => set("orderIndex")(Number(e.target.value))} />
              </div>
            </div>
          </Panel>
          <Panel>
            <h3 className="font-semibold text-white mb-4">Imagem de capa</h3>
            <LargeImageField
              value={data.image}
              onChange={set("image")}
              preset={CONTEXT_PRESETS.courseCover}
              endpoint="/api/admin/upload"
            />
          </Panel>
        </div>
      </div>
    </>
  );
}

/** Cartão de escolha do tipo de botão (WhatsApp ou link externo). */
function CtaTipoCard({
  active,
  onClick,
  icon,
  title,
  description,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left p-4 rounded-xl transition-all duration-200"
      style={{
        background: active ? `${accent}14` : "var(--admin-surface-2)",
        border: `1px solid ${active ? accent : "var(--admin-border)"}`,
        boxShadow: active ? `0 0 0 1px ${accent}55` : "none",
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span style={{ color: active ? accent : "var(--admin-text-muted)" }}>
          {icon}
        </span>
        <span
          className="text-[13px] font-bold"
          style={{ color: active ? "var(--admin-text-strong)" : "var(--admin-text-muted)" }}
        >
          {title}
        </span>
        {active && (
          <span
            className="ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ background: accent, color: "#fff" }}
          >
            Escolhido
          </span>
        )}
      </div>
      <p className="text-[11px] leading-snug" style={{ color: "var(--admin-text-muted)" }}>
        {description}
      </p>
    </button>
  );
}

/**
 * Campo de categoria: input livre + chips das categorias já em uso.
 * Permite escolher uma existente ou digitar uma nova, tudo no mesmo campo.
 */
function CategoryField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [existing, setExisting] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((r) => (r.ok ? r.json() : []))
      .then((items: { category?: string }[]) => {
        const set = new Set<string>();
        items.forEach((i) => {
          const c = (i.category ?? "").trim();
          if (c) set.add(c);
        });
        setExisting(Array.from(set).sort((a, b) => a.localeCompare(b)));
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-2">
      <input
        className="admin-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: Vendas, Gestão, Técnico..."
        list="course-categories"
      />
      <datalist id="course-categories">
        {existing.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>
      {existing.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {existing.map((c) => {
            const active = value.trim().toLowerCase() === c.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md transition-colors"
                style={{
                  background: active
                    ? "var(--admin-accent-soft)"
                    : "var(--admin-surface-2)",
                  color: active ? "var(--admin-accent)" : "var(--admin-text-muted)",
                  border: `1px solid ${active ? "rgba(246,129,30,0.35)" : "var(--admin-border)"}`,
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      )}
      <p className="text-[11px]" style={{ color: "var(--admin-text-muted)" }}>
        Clique num chip pra reutilizar ou digite uma nova categoria — ela vai aparecer como filtro na página pública.
      </p>
    </div>
  );
}

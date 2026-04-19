"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Flame,
  Image as ImageIcon,
  Instagram,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Rocket,
  Sparkles,
  Trophy,
  User,
  Globe,
  UploadCloud,
  Phone,
} from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";
import {
  AssociateCard,
  type AssociateItem,
} from "@/components/public/AssociateCard";
import type { GlobalContent } from "@/lib/content/schema";

type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type DayRange = { enabled: boolean; open: string; close: string };
type HoursSchedule = Record<DayKey, DayRange>;

const DAY_ORDER: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_SHORT: Record<DayKey, string> = {
  mon: "Seg",
  tue: "Ter",
  wed: "Qua",
  thu: "Qui",
  fri: "Sex",
  sat: "Sáb",
  sun: "Dom",
};
const DAY_LONG: Record<DayKey, string> = {
  mon: "Segunda",
  tue: "Terça",
  wed: "Quarta",
  thu: "Quinta",
  fri: "Sexta",
  sat: "Sábado",
  sun: "Domingo",
};

type LunchBreak = { enabled: boolean; start: string; end: string };

const emptySchedule: HoursSchedule = {
  mon: { enabled: true, open: "08:00", close: "18:00" },
  tue: { enabled: true, open: "08:00", close: "18:00" },
  wed: { enabled: true, open: "08:00", close: "18:00" },
  thu: { enabled: true, open: "08:00", close: "18:00" },
  fri: { enabled: true, open: "08:00", close: "18:00" },
  sat: { enabled: true, open: "08:00", close: "12:00" },
  sun: { enabled: false, open: "09:00", close: "13:00" },
};

const emptyLunch: LunchBreak = {
  enabled: false,
  start: "12:00",
  end: "13:30",
};

function prettyTime(t: string): string {
  const [hStr, mStr] = t.split(":");
  const h = parseInt(hStr ?? "0", 10);
  const m = parseInt(mStr ?? "0", 10);
  if (Number.isNaN(h)) return t;
  if (!m) return `${h}h`;
  return `${h}h${String(m).padStart(2, "0")}`;
}

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map((x) => parseInt(x, 10) || 0);
  return h * 60 + m;
}

function formatHours(schedule: HoursSchedule, lunch?: LunchBreak): string {
  const entries = DAY_ORDER.map((d) => ({ day: d, ...schedule[d] }));
  const groups: { days: DayKey[]; open: string; close: string }[] = [];
  for (const e of entries) {
    if (!e.enabled) continue;
    const last = groups[groups.length - 1];
    if (last && last.open === e.open && last.close === e.close) {
      last.days.push(e.day);
    } else {
      groups.push({ days: [e.day], open: e.open, close: e.close });
    }
  }
  const parts = groups.map((g) => {
    const label =
      g.days.length === 1
        ? DAY_SHORT[g.days[0]]
        : `${DAY_SHORT[g.days[0]]}–${DAY_SHORT[g.days[g.days.length - 1]]}`;
    const lunchApplies =
      lunch?.enabled &&
      toMinutes(lunch.start) > toMinutes(g.open) &&
      toMinutes(lunch.end) < toMinutes(g.close);
    if (lunchApplies) {
      return `${label} ${prettyTime(g.open)}–${prettyTime(lunch!.start)} · ${prettyTime(lunch!.end)}–${prettyTime(g.close)}`;
    }
    return `${label} ${prettyTime(g.open)}–${prettyTime(g.close)}`;
  });
  return parts.join(" · ");
}

type FormState = {
  segment: string;
  segmentOther: string;
  companyName: string;
  cnpj: string;
  contactName: string;
  phone: string;
  email: string;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  hoursSchedule: HoursSchedule;
  lunchBreak: LunchBreak;
  description: string;
  website: string;
  instagram: string;
  logoUrl: string;
  coverImage: string;
};

const initialForm: FormState = {
  segment: "",
  segmentOther: "",
  companyName: "",
  cnpj: "",
  contactName: "",
  phone: "",
  email: "",
  zipCode: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "SC",
  hoursSchedule: emptySchedule,
  lunchBreak: emptyLunch,
  description: "",
  website: "",
  instagram: "",
  logoUrl: "",
  coverImage: "",
};

const SEGMENTS = [
  { value: "Materiais de construção", icon: "🏗️" },
  { value: "Home center", icon: "🏠" },
  { value: "Tintas e acabamentos", icon: "🎨" },
  { value: "Hidráulica e elétrica", icon: "💡" },
  { value: "Ferragens e ferramentas", icon: "🔧" },
  { value: "Cerâmica e revestimentos", icon: "🧱" },
  { value: "Madeiras e esquadrias", icon: "🪵" },
  { value: "Móveis planejados", icon: "🪑" },
  { value: "Móveis e interiores", icon: "🛋️" },
  { value: "Distribuidor / Atacado", icon: "📦" },
  { value: "Indústria", icon: "🏭" },
  { value: "Empresa de marketing", icon: "📣" },
  { value: "Arquitetura e projetos", icon: "📐" },
  { value: "Iluminação", icon: "💡" },
  { value: "Paisagismo e jardinagem", icon: "🌿" },
  { value: "Serviços para construção", icon: "🛠️" },
  { value: "Outro", icon: "✨" },
];

const OTHER_SEGMENT_VALUE = "Outro";

type Step = {
  id: string;
  title: string;
  subtitle: string;
  reward: string;
  icon: typeof Building2;
  validate: (f: FormState) => string | null;
};

const steps: Step[] = [
  {
    id: "welcome",
    title: "Entre para o Conecta Associados da ACOMAC",
    subtitle:
      "Seu perfil fica público no site — pessoas e empresas que procuram seu ramo vão encontrar você e entrar em contato direto para fechar negócio.",
    reward: "+10 XP",
    icon: Rocket,
    validate: () => null,
  },
  {
    id: "segment",
    title: "Qual é o ramo da sua empresa?",
    subtitle:
      "Isso define em qual categoria seu perfil aparece no Conecta Associados — quem busca esse segmento vai encontrar você.",
    reward: "+15 XP",
    icon: Sparkles,
    validate: (f) => {
      if (!f.segment) return "Selecione um segmento";
      if (f.segment === OTHER_SEGMENT_VALUE && !f.segmentOther.trim()) {
        return "Descreva em poucas palavras o segmento da sua empresa";
      }
      return null;
    },
  },
  {
    id: "company",
    title: "Como sua empresa é conhecida?",
    subtitle:
      "Este é o nome que aparece no card do Conecta Associados — use o nome pelo qual seus clientes reconhecem a empresa.",
    reward: "+20 XP",
    icon: Building2,
    validate: (f) =>
      !f.companyName.trim() ? "Nome da empresa é obrigatório" : null,
  },
  {
    id: "contact",
    title: "Como os clientes entram em contato?",
    subtitle:
      "Estes dados aparecem no seu card do Conecta Associados e viram os botões de WhatsApp, ligar e e-mail pra quem quer falar com você.",
    reward: "+20 XP",
    icon: MessageCircle,
    validate: (f) => {
      if (!f.contactName.trim()) return "Nome do contato é obrigatório";
      if (!f.phone.trim()) return "Telefone é obrigatório";
      if (!f.email.trim() || !/^\S+@\S+\.\S+$/.test(f.email))
        return "E-mail inválido";
      return null;
    },
  },
  {
    id: "location",
    title: "Qual é o endereço e horário da empresa?",
    subtitle:
      "Usamos o endereço para gerar o mapa do Google no seu card. O horário de atendimento aparece direto no perfil — clientes sabem quando podem ir até a loja.",
    reward: "+15 XP",
    icon: MapPin,
    validate: (f) => {
      const cep = f.zipCode.replace(/\D/g, "");
      if (cep.length !== 8) return "Informe um CEP válido";
      if (!f.street.trim()) return "Informe a rua";
      if (!f.number.trim()) return "Informe o número";
      if (!f.city.trim()) return "Informe a cidade";
      return null;
    },
  },
  {
    id: "presentation",
    title: "Conte pro cliente o que faz vocês brilharem",
    subtitle:
      "Uma boa apresentação chama atenção e gera mais contatos. Site e Instagram também aparecem como botões no card (opcional).",
    reward: "+15 XP",
    icon: Sparkles,
    validate: () => null,
  },
  {
    id: "images",
    title: "Capa e logo da empresa",
    subtitle:
      "A capa é a imagem que aparece no topo do card (pode ser a fachada, a loja por dentro, a equipe ou algo que represente a marca). A logo é o identificador quadrado. Ambas são obrigatórias.",
    reward: "+15 XP",
    icon: UploadCloud,
    validate: (f) => {
      if (!f.coverImage.trim())
        return "Envie a imagem de capa (fachada, loja, equipe…)";
      if (!f.logoUrl.trim()) return "Envie a logo da empresa";
      return null;
    },
  },
  {
    id: "review",
    title: "Tudo certo pra gerar negócio?",
    subtitle:
      "Confira os dados antes de enviar. A ACOMAC analisa, aprova e seu perfil vai pro ar no Conecta Associados.",
    reward: "Finalizar",
    icon: Trophy,
    validate: () => null,
  },
];

export function AssociarWizard() {
  const [stepIdx, setStepIdx] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [xp, setXp] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [global, setGlobal] = useState<GlobalContent | null>(null);
  const [launching, setLaunching] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  const current = steps[stepIdx];
  const CurrentIcon = current.icon;
  const isLast = stepIdx === steps.length - 1;
  const progress = Math.round(((stepIdx + 1) / steps.length) * 100);

  useEffect(() => {
    fetch("/api/public/global")
      .then((r) => r.json())
      .then(setGlobal)
      .catch(() => {});
  }, []);

  useEffect(() => {
    stepRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [stepIdx]);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((prev) => ({ ...prev, [k]: v }));
    if (error) setError(null);
  }

  function handleNext() {
    const err = current.validate(form);
    if (err) {
      setError(err);
      setShake(true);
      setTimeout(() => setShake(false), 350);
      return;
    }
    const gain = stepIdx === 0 ? 10 : stepIdx === 2 ? 20 : stepIdx === 3 ? 20 : 15;
    setXp((x) => x + gain);
    if (isLast) return;
    setStepIdx((i) => Math.min(i + 1, steps.length - 1));
  }

  function handleBack() {
    setError(null);
    setStepIdx((i) => Math.max(i - 1, 0));
  }

  async function handleSubmit() {
    setSendError(null);
    setSending(true);
    const finalSegment =
      form.segment === OTHER_SEGMENT_VALUE && form.segmentOther.trim()
        ? form.segmentOther.trim()
        : form.segment;
    const fullAddress = [form.street.trim(), form.number.trim()]
      .filter(Boolean)
      .join(", ");
    const { hoursSchedule, lunchBreak, ...rest } = form;
    const payload = {
      ...rest,
      segment: finalSegment,
      address: fullAddress,
      hours: formatHours(hoursSchedule, lunchBreak),
    };
    const res = await fetch("/api/associates", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSending(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setSendError(d.error ?? "Erro ao enviar. Tente novamente.");
      return;
    }
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "form_submit",
        target: "associar",
        path: "/associar",
      }),
    }).catch(() => {});
    // Decolagem do foguete antes de abrir a tela de sucesso
    setLaunching(true);
    setTimeout(() => setSent(true), 1550);
  }

  if (sent) return <SuccessScreen companyName={form.companyName} global={global} />;

  const logoSrc = global?.brand.logo || "/LOGO ACOMAC Joinville - 2020 - FINAL-01.avif";
  const logoAlt = global?.brand.logoAlt || "ACOMAC Joinville";

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header com logo */}
      <header
        className="px-6 py-3 flex-shrink-0"
        style={{ background: "#fff", borderBottom: "1px solid var(--ar-border)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src={logoSrc}
              alt={logoAlt}
              width={140}
              height={42}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <div className="flex items-center gap-2">
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold"
              style={{ background: "var(--ar-accent-soft)", color: "var(--ar-accent)" }}
            >
              <Flame size={12} />
              {xp} XP
            </div>
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-2 text-xs font-semibold"
              style={{ color: "var(--ar-muted)" }}
            >
              <ArrowLeft size={13} />
              Voltar ao site
            </Link>
          </div>
        </div>
      </header>

      {/* Progress com foguete */}
      <div className="px-6 pt-3 flex-shrink-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold" style={{ color: "var(--ar-muted)" }}>
              Etapa {stepIdx + 1} de {steps.length}
            </span>
            <span className="text-[11px] font-semibold" style={{ color: "var(--ar-muted)" }}>
              {progress}%
            </span>
          </div>
          <RocketProgress progress={progress} launching={launching} />
        </div>
      </div>

      <main
        ref={stepRef}
        className="flex-1 min-h-0 px-6 py-3 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 items-stretch">
          {/* Form card */}
          <div
            className={`ar-card p-6 md:p-7 flex flex-col min-h-0 ${shake ? "ar-shake" : ""}`}
          >
            <div className="flex items-center gap-2 mb-1.5 flex-shrink-0">
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center ar-pop"
                style={{ background: "var(--ar-accent-soft)", color: "var(--ar-accent)" }}
              >
                <CurrentIcon size={17} />
              </div>
              <span className="ar-badge text-[10px]">{current.reward}</span>
            </div>
            <h1
              className="text-xl md:text-2xl font-extrabold tracking-tight mb-1 leading-tight flex-shrink-0"
              style={{ color: "var(--ar-text)" }}
            >
              {current.title}
            </h1>
            <p
              className="text-[13px] leading-relaxed mb-4 flex-shrink-0"
              style={{ color: "var(--ar-muted)" }}
            >
              {current.subtitle}
            </p>

            <ScrollHintContainer className="ar-form-body flex-1 min-h-0" stepKey={current.id}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StepBody stepId={current.id} form={form} set={set} />
                </motion.div>
              </AnimatePresence>

              {error && (
                <p
                  className="mt-3 text-sm font-semibold inline-flex items-center gap-1.5"
                  style={{ color: "var(--ar-danger)" }}
                >
                  ⚠ {error}
                </p>
              )}
              {sendError && (
                <p
                  className="mt-3 text-sm font-semibold"
                  style={{ color: "var(--ar-danger)" }}
                >
                  ⚠ {sendError}
                </p>
              )}
            </ScrollHintContainer>

            <div
              className="flex items-center justify-between mt-4 pt-3 flex-shrink-0"
              style={{ borderTop: "1px solid var(--ar-border)" }}
            >
              <button
                type="button"
                onClick={handleBack}
                disabled={stepIdx === 0}
                className="ar-btn-ghost"
                style={{ opacity: stepIdx === 0 ? 0.35 : 1 }}
              >
                <ArrowLeft size={14} />
                Voltar
              </button>
              {isLast ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={sending}
                  className="ar-btn-primary"
                >
                  {sending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Enviando...
                    </>
                  ) : (
                    <>
                      Enviar cadastro <CheckCircle2 size={18} />
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="ar-btn-primary"
                >
                  {stepIdx === 0 ? "Começar" : "Avançar"}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Card lateral de qualidade — visível em telas grandes */}
          <div className="hidden lg:flex flex-col min-h-0">
            <QualityCard form={form} stepIdx={stepIdx} totalSteps={steps.length} />
          </div>
        </div>
      </main>

      {/* Rodapé curto */}
      <footer
        className="px-6 py-3 flex-shrink-0 text-center text-[11px]"
        style={{
          background: "#fff",
          borderTop: "1px solid var(--ar-border)",
          color: "var(--ar-subtle)",
        }}
      >
        <span>
          ACOMAC Joinville · Conecta Associados ·{" "}
          <Link href="/" style={{ color: "var(--ar-muted)" }} className="hover:underline">
            voltar ao site
          </Link>
        </span>
      </footer>
    </div>
  );
}

// ============== QualityCard ==============

type QualityCheck = {
  id: string;
  label: string;
  weight: number; // 0-100
  done: boolean;
  hint?: string;
};

function buildChecks(form: FormState): QualityCheck[] {
  const desc = form.description.trim();
  const cnpjOk = form.cnpj.replace(/\D/g, "").length >= 14;
  const phoneOk = form.phone.replace(/\D/g, "").length >= 10;
  const cepOk = form.zipCode.replace(/\D/g, "").length === 8;
  return [
    { id: "segment", label: "Segmento da empresa", weight: 6, done: !!form.segment.trim() },
    { id: "company", label: "Nome da empresa", weight: 6, done: !!form.companyName.trim() },
    { id: "cnpj", label: "CNPJ informado", weight: 4, done: cnpjOk, hint: "Passa mais credibilidade" },
    { id: "contact", label: "Nome do contato", weight: 5, done: !!form.contactName.trim() },
    { id: "phone", label: "Telefone / WhatsApp", weight: 10, done: phoneOk, hint: "Vira o botão verde de contato" },
    { id: "email", label: "E-mail válido", weight: 5, done: !!form.email && /^\S+@\S+\.\S+$/.test(form.email) },
    { id: "cep", label: "CEP completo", weight: 6, done: cepOk, hint: "Necessário para o mapa" },
    { id: "street", label: "Rua / logradouro", weight: 4, done: !!form.street.trim() },
    { id: "number", label: "Número do imóvel", weight: 3, done: !!form.number.trim(), hint: "Deixa o mapa preciso" },
    { id: "city", label: "Cidade definida", weight: 4, done: !!form.city.trim() },
    { id: "hours", label: "Horário de atendimento", weight: 5, done: !!formatHours(form.hoursSchedule, form.lunchBreak), hint: "Aparece com ícone de relógio no card" },
    { id: "desc-min", label: "Descrição da empresa", weight: 6, done: desc.length >= 40, hint: "Mínimo 40 caracteres" },
    { id: "desc-rich", label: "Descrição completa (140+)", weight: 5, done: desc.length >= 140, hint: "Quanto mais rica, mais contatos" },
    { id: "website", label: "Website / loja online", weight: 4, done: !!form.website.trim() },
    { id: "instagram", label: "Instagram", weight: 4, done: !!form.instagram.trim(), hint: "Vira botão de IG no card" },
    { id: "cover", label: "Imagem de capa", weight: 12, done: !!form.coverImage.trim(), hint: "Topo do card — fachada, loja ou equipe" },
    { id: "logo", label: "Logo enviada", weight: 11, done: !!form.logoUrl.trim(), hint: "Card sem logo perde 60% dos cliques" },
  ];
}

function levelFor(score: number): {
  label: string;
  color: string;
  message: string;
} {
  if (score >= 90)
    return {
      label: "Top 5%",
      color: "#16a34a",
      message: "Cadastro impecável! Alta chance de gerar contato.",
    };
  if (score >= 75)
    return {
      label: "Excelente",
      color: "#16a34a",
      message: "Sua empresa vai se destacar no diretório.",
    };
  if (score >= 55)
    return {
      label: "Muito bom",
      color: "#22c55e",
      message: "Bom progresso. Algumas tags a mais e fica perfeito.",
    };
  if (score >= 35)
    return {
      label: "Razoável",
      color: "#f59e0b",
      message: "Bom começo! Capriche nos próximos campos.",
    };
  if (score >= 15)
    return {
      label: "Inicial",
      color: "#f59e0b",
      message: "Vamos lá! Cada campo aumenta sua visibilidade.",
    };
  return {
    label: "Começando",
    color: "#94a3b8",
    message: "Preencha as etapas para liberar mais visibilidade.",
  };
}

function QualityCard({
  form,
  stepIdx,
  totalSteps,
}: {
  form: FormState;
  stepIdx: number;
  totalSteps: number;
}) {
  const checks = buildChecks(form);
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const earned = checks.reduce((s, c) => (c.done ? s + c.weight : s), 0);
  const score = Math.round((earned / total) * 100);
  const level = levelFor(score);

  // Ring math
  const RING = 110;
  const STROKE = 10;
  const r = (RING - STROKE) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  // Animar o número
  const [shownScore, setShownScore] = useState(0);
  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const from = shownScore;
    const to = score;
    const duration = 600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShownScore(Math.round(from + (to - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score]);

  // Próximo critério faltando
  const nextMissing = checks.find((c) => !c.done);

  return (
    <aside
      className="ar-card flex flex-col min-h-0 overflow-hidden"
      style={{ padding: 0 }}
    >
      <div
        className="px-5 pt-5 pb-4 flex flex-col items-center"
        style={{
          background:
            "linear-gradient(180deg, rgba(246,129,30,0.08) 0%, rgba(246,129,30,0) 100%)",
          borderBottom: "1px solid var(--ar-border)",
        }}
      >
        <div className="flex items-center gap-1.5 mb-3">
          <Sparkles size={12} style={{ color: "var(--ar-accent)" }} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--ar-accent)" }}
          >
            Qualidade do cadastro
          </span>
        </div>
        <div
          className="ar-ring"
          style={
            {
              "--ring-size": `${RING}px`,
              "--ring-stroke": `${STROKE}px`,
              "--ring-color": level.color,
            } as React.CSSProperties
          }
        >
          <svg viewBox={`0 0 ${RING} ${RING}`}>
            <circle
              className="ar-ring-track"
              cx={RING / 2}
              cy={RING / 2}
              r={r}
            />
            <circle
              className="ar-ring-fill"
              cx={RING / 2}
              cy={RING / 2}
              r={r}
              strokeDasharray={circ}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="ar-ring-label">
            <span
              className="text-2xl font-extrabold leading-none tabular-nums"
              style={{ color: level.color }}
            >
              {shownScore}%
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-wider mt-0.5"
              style={{ color: "var(--ar-muted)" }}
            >
              {level.label}
            </span>
          </div>
        </div>
        <p
          className="text-xs text-center mt-3 leading-snug"
          style={{ color: "var(--ar-muted)" }}
        >
          {level.message}
        </p>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 ar-form-body">
        <p
          className="text-[10px] font-bold uppercase tracking-wider mb-2.5"
          style={{ color: "var(--ar-subtle)" }}
        >
          Checklist
        </p>
        <ul className="space-y-1.5">
          {checks.map((c) => (
            <li
              key={c.id}
              className="flex items-start gap-2 text-xs"
              style={{
                color: c.done ? "var(--ar-text)" : "var(--ar-subtle)",
              }}
            >
              <span
                className={`flex-shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full mt-px transition-colors ${c.done ? "ar-check-pop" : ""}`}
                style={{
                  background: c.done ? level.color : "rgba(10,14,26,0.06)",
                  color: c.done ? "#fff" : "transparent",
                }}
              >
                {c.done && <Check size={10} strokeWidth={3} />}
              </span>
              <div className="flex-1 min-w-0">
                <span
                  className={`leading-tight ${c.done ? "font-medium" : ""}`}
                  style={{
                    textDecoration: c.done ? "none" : "none",
                  }}
                >
                  {c.label}
                </span>
                {!c.done && c.hint && (
                  <p className="text-[10px] mt-0.5" style={{ color: "var(--ar-subtle)" }}>
                    {c.hint}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="px-5 py-3 flex-shrink-0"
        style={{
          background: "var(--ar-accent-soft)",
          borderTop: "1px solid var(--ar-border)",
        }}
      >
        {nextMissing ? (
          <div className="flex items-start gap-2">
            <Rocket size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--ar-accent)" }} />
            <p className="text-[11px] leading-snug" style={{ color: "var(--ar-text)" }}>
              <strong>Próximo +{nextMissing.weight}%:</strong> {nextMissing.label.toLowerCase()}
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <Trophy size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--ar-accent)" }} />
            <p className="text-[11px] leading-snug" style={{ color: "var(--ar-text)" }}>
              <strong>100%!</strong> Cadastro top, pronto pra gerar negócios.
            </p>
          </div>
        )}
        <p
          className="text-[10px] mt-2 text-center"
          style={{ color: "var(--ar-muted)" }}
        >
          Etapa {stepIdx + 1} de {totalSteps}
        </p>
      </div>
    </aside>
  );
}

// ============== Foguete + partículas ==============

type BoostParticle = {
  id: number;
  left: number; // posição em % na barra (posição anterior do foguete)
  px: number; // deslocamento horizontal final
  py: number; // deslocamento vertical final
  size: number;
  color: string;
  delay: number;
};

type Burst = {
  id: number;
  left: number; // % da barra
};

const ROCKET_WIDTH = 64;
// Mesmo padding lateral usado em .ar-progress-line (left/right: 28px)
const TRACK_PADDING = 28;

function RocketProgress({
  progress,
  launching,
}: {
  progress: number;
  launching: boolean;
}) {
  const prevProgressRef = useRef(progress);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [particles, setParticles] = useState<BoostParticle[]>([]);
  const [bursts, setBursts] = useState<Burst[]>([]);
  const [boosting, setBoosting] = useState(false);

  useEffect(() => {
    if (!trackRef.current) return;
    setTrackWidth(trackRef.current.getBoundingClientRect().width);
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setTrackWidth(w);
    });
    ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, []);

  // Posiciona o CENTRO do foguete exatamente na ponta da barra de progresso.
  // A barra começa em TRACK_PADDING px e termina em (trackWidth - TRACK_PADDING) px.
  const usableWidth = Math.max(0, trackWidth - TRACK_PADDING * 2);
  const fillEndX = TRACK_PADDING + (progress / 100) * usableWidth;
  const targetX = fillEndX - ROCKET_WIDTH / 2;
  // Posição em % usada pelas partículas e bursts (alinhada à ponta da barra)
  const leftPct = trackWidth > 0 ? (fillEndX / trackWidth) * 100 : 0;

  useEffect(() => {
    const prev = prevProgressRef.current;
    prevProgressRef.current = progress;
    // só dispara rajada se avançou (não no load inicial)
    if (progress <= prev) return;

    // Posição em % onde o foguete estava antes (mesma lógica do leftPct)
    const prevFillEndX = TRACK_PADDING + (prev / 100) * usableWidth;
    const prevLeftPct = trackWidth > 0 ? (prevFillEndX / trackWidth) * 100 : 0;

    setBoosting(true);
    const burstTime = Date.now();
    const colors = ["#F6811E", "#ff9a3f", "#ffd89a", "#ffb14a", "#ff7a00", "#fff5c2"];
    const next: BoostParticle[] = Array.from({ length: 60 }).map((_, i) => ({
      id: burstTime + i,
      left: prevLeftPct,
      px: -40 - Math.random() * 220 - (leftPct - prevLeftPct) * 2.5,
      py: (Math.random() - 0.5) * 60,
      size: 10 + Math.random() * 22,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.35,
    }));
    setParticles((old) => [...old, ...next]);

    const burst: Burst = { id: burstTime, left: prevLeftPct };
    setBursts((old) => [...old, burst]);

    const cleanupParticles = setTimeout(() => {
      setParticles((old) => old.filter((p) => !next.some((n) => n.id === p.id)));
    }, 1700);
    const cleanupBurst = setTimeout(() => {
      setBursts((old) => old.filter((b) => b.id !== burst.id));
    }, 1100);
    const stopBoost = setTimeout(() => setBoosting(false), 1180);
    return () => {
      clearTimeout(cleanupParticles);
      clearTimeout(cleanupBurst);
      clearTimeout(stopBoost);
    };
  }, [leftPct]);

  return (
    <div className="ar-progress-track" ref={trackRef}>
      <div className="ar-progress-line">
        <div
          className="ar-progress-line-fill"
          style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
        />
      </div>

      {/* Partículas de rajada (reboost) */}
      {/* Onda de calor + jet stream gigante a cada burst */}
      {bursts.map((b) => (
        <div key={`burst-${b.id}`}>
          <span
            className="ar-jet-stream"
            style={{ left: `${b.left}%`, top: "37px" }}
          />
          <span
            className="ar-heatwave"
            style={{ left: `${b.left - 6}%`, top: "37px" }}
          />
        </div>
      ))}

      <div className="ar-boost-particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="ar-boost-particle"
            style={
              {
                left: `${p.left}%`,
                top: "5px",
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle at 30% 30%, #fff 0%, ${p.color} 55%, rgba(246,129,30,0) 100%)`,
                boxShadow: `0 0 ${p.size * 1.2}px ${p.color}`,
                animationDelay: `${p.delay}s`,
                "--px": `${p.px}px`,
                "--py": `${p.py}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <motion.div
        className="ar-rocket-wrap"
        animate={{ x: targetX }}
        initial={false}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 14,
          mass: 1.1,
          restDelta: 0.5,
        }}
        style={{ left: 0 }}
      >
        <div
          className={`${launching ? "ar-rocket-launch " : ""}${
            boosting && !launching ? "ar-rocket-boosting" : ""
          }`}
        >
          <svg
            className="ar-rocket-svg"
            width="64"
            height="36"
            viewBox="0 0 64 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="rBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#e5eaf0" />
                <stop offset="100%" stopColor="#c9d2dd" />
              </linearGradient>
              <linearGradient id="rNose" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#F6811E" />
                <stop offset="100%" stopColor="#ff6b1a" />
              </linearGradient>
              <linearGradient id="rFin" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d96a0a" />
                <stop offset="100%" stopColor="#F6811E" />
              </linearGradient>
              <radialGradient id="rWindow" cx="0.35" cy="0.35">
                <stop offset="0%" stopColor="#a7d3ff" />
                <stop offset="45%" stopColor="#4a8cff" />
                <stop offset="100%" stopColor="#0b3a91" />
              </radialGradient>
              <radialGradient id="rGlow" cx="0.5" cy="0.5">
                <stop offset="0%" stopColor="#fff5c2" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#ffa64a" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F6811E" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Halo de luz em volta do escape (à esquerda) — fica enorme no boost */}
            <ellipse
              cx={boosting ? -8 : 6}
              cy="16"
              rx={boosting ? 30 : 10}
              ry={boosting ? 12 : 6}
              fill="url(#rGlow)"
              className="ar-rocket-glow"
              opacity={boosting ? 0.9 : 0.5}
            />

            {/* Chamas saindo pela esquerda — explodem em tamanho durante o boost */}
            <g className="ar-flame-main">
              <path
                d={`M 10 8 Q ${boosting ? -70 : -4} 16 10 24 Q ${boosting ? -20 : 4} 16 10 8 Z`}
                fill="#F6811E"
                opacity="0.92"
              />
            </g>
            <g className="ar-flame-mid">
              <path
                d={`M 10 10 Q ${boosting ? -45 : 0} 16 10 22 Q ${boosting ? -10 : 4} 16 10 10 Z`}
                fill="#ffbf6a"
                opacity={boosting ? 0.95 : 0.85}
              />
            </g>
            <g className="ar-flame-core">
              <path
                d={`M 10 11 Q ${boosting ? -25 : 4} 16 10 21 Q ${boosting ? 0 : 6} 16 10 11 Z`}
                fill="#fff3c4"
                opacity={boosting ? 1 : 0.85}
              />
            </g>

            {/* Núcleo branco extra no centro durante boost */}
            {boosting && (
              <ellipse cx={-12} cy="16" rx="14" ry="4" fill="#fff" opacity="0.85" />
            )}

            {/* Aletas traseiras (esquerda) */}
            <path
              d="M 14 8 L 6 4 Q 4 4 4 6 L 14 12 Z"
              fill="url(#rFin)"
              stroke="#0b3a91"
              strokeWidth="0.7"
            />
            <path
              d="M 14 24 L 6 28 Q 4 28 4 26 L 14 20 Z"
              fill="url(#rFin)"
              stroke="#0b3a91"
              strokeWidth="0.7"
            />

            {/* Corpo principal (retângulo arredondado horizontal) */}
            <path
              d="M 12 8
                 Q 14 8, 14 10
                 L 14 22
                 Q 14 24, 12 24
                 L 12 10 Z"
              fill="#3a4555"
            />
            <rect x="12" y="8" width="34" height="16" rx="4" fill="url(#rBody)" stroke="#0b3a91" strokeWidth="1.1" />

            {/* Faixa laranja central */}
            <rect x="22" y="8" width="6" height="16" fill="#F6811E" />
            <line x1="22" y1="8" x2="22" y2="24" stroke="#0b3a91" strokeWidth="0.7" />
            <line x1="28" y1="8" x2="28" y2="24" stroke="#0b3a91" strokeWidth="0.7" />

            {/* Parafusos na faixa */}
            <circle cx="25" cy="11" r="0.55" fill="#0b3a91" />
            <circle cx="25" cy="16" r="0.55" fill="#0b3a91" />
            <circle cx="25" cy="21" r="0.55" fill="#0b3a91" />

            {/* Janela (um pouco à esquerda) */}
            <circle cx="19" cy="16" r="3.3" fill="url(#rWindow)" stroke="#0b3a91" strokeWidth="1.1" />
            <circle cx="17.8" cy="14.8" r="0.9" fill="#fff" opacity="0.95" />
            <circle cx="20.2" cy="17.2" r="0.45" fill="#fff" opacity="0.5" />

            {/* Nose cone (à direita) */}
            <path
              d="M 46 8 Q 58 13 62 16 Q 58 19 46 24 Z"
              fill="url(#rNose)"
              stroke="#0b3a91"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
            {/* Highlight do nose */}
            <path
              d="M 48 10 Q 56 13 60 16"
              stroke="#ffd89a"
              strokeWidth="0.9"
              fill="none"
              opacity="0.85"
              strokeLinecap="round"
            />

            {/* Base traseira */}
            <rect x="10" y="11" width="4" height="10" rx="1" fill="#3a4555" />
            <rect x="10" y="11" width="4" height="2" fill="#6b7486" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

function StepBody({
  stepId,
  form,
  set,
}: {
  stepId: string;
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  if (stepId === "welcome") {
    return (
      <div className="grid gap-3">
        {[
          { icon: Trophy, title: "Apareça para o público certo", desc: "Seu perfil fica público no Conecta Associados do site ACOMAC." },
          { icon: MessageCircle, title: "Contato direto por WhatsApp", desc: "Quem encontra sua empresa fala com você em 1 clique." },
          { icon: Rocket, title: "Aprovação rápida", desc: "A ACOMAC analisa e aprova em até 2 dias úteis." },
        ].map((b, i) => {
          const I = b.icon;
          return (
            <div key={i} className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: "rgba(246,129,30,0.06)", border: "1px solid rgba(246,129,30,0.12)" }}>
              <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--ar-accent)", color: "#fff" }}>
                <I size={16} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: "var(--ar-text)" }}>{b.title}</p>
                <p className="text-sm" style={{ color: "var(--ar-muted)" }}>{b.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (stepId === "segment") {
    return (
      <div className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-3">
          {SEGMENTS.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => {
                set("segment", s.value);
                if (s.value !== OTHER_SEGMENT_VALUE) set("segmentOther", "");
              }}
              className={`ar-option ${form.segment === s.value ? "selected" : ""}`}
            >
              <span className="text-xl">{s.icon}</span>
              <span>{s.value}</span>
              {form.segment === s.value && (
                <Check size={16} className="ml-auto" style={{ color: "var(--ar-accent)" }} />
              )}
            </button>
          ))}
        </div>
        {form.segment === OTHER_SEGMENT_VALUE && (
          <div className="rounded-2xl p-5 ar-pop" style={{ background: "var(--ar-accent-soft)", border: "1px solid rgba(246,129,30,0.25)" }}>
            <label className="ar-label">Qual é o ramo da sua empresa? *</label>
            <input
              autoFocus
              type="text"
              className="ar-input"
              value={form.segmentOther}
              onChange={(e) => set("segmentOther", e.target.value)}
              placeholder="Ex: Revenda de equipamentos industriais, Locação de máquinas..."
              maxLength={80}
            />
            <p className="text-xs mt-2" style={{ color: "var(--ar-muted)" }}>
              Descreva em poucas palavras — essa categoria é usada na busca do Conecta Associados.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (stepId === "company") {
    return (
      <div className="space-y-4">
        <FieldWithIcon icon={<Building2 size={15} />} label="Nome da empresa *" value={form.companyName} onChange={(v) => set("companyName", v)} placeholder="Ex: Casa da Construção" />
        <FieldWithIcon label="CNPJ (opcional)" value={form.cnpj} onChange={(v) => set("cnpj", v)} placeholder="00.000.000/0000-00" />
      </div>
    );
  }

  if (stepId === "contact") {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldWithIcon icon={<User size={15} />} label="Nome do contato *" value={form.contactName} onChange={(v) => set("contactName", v)} placeholder="Seu nome" />
        <FieldWithIcon icon={<Phone size={15} />} label="Telefone / WhatsApp *" value={form.phone} onChange={(v) => set("phone", v)} placeholder="(47) 99999-0000" />
        <div className="sm:col-span-2">
          <FieldWithIcon icon={<Mail size={15} />} label="E-mail *" value={form.email} onChange={(v) => set("email", v)} placeholder="voce@empresa.com" type="email" />
        </div>
        <div className="sm:col-span-2 p-3 rounded-xl text-xs" style={{ background: "rgba(37,211,102,0.08)", color: "var(--ar-text)", border: "1px solid rgba(37,211,102,0.25)" }}>
          💡 <strong>Dica:</strong> o número informado vira um <strong>botão de WhatsApp</strong> no seu card. Isso é o que mais gera contatos no Conecta Associados.
        </div>
      </div>
    );
  }

  if (stepId === "location") {
    return <LocationStep form={form} set={set} />;
  }

  if (stepId === "presentation") {
    return (
      <div className="space-y-4">
        <div>
          <label className="ar-label">Descrição da empresa</label>
          <textarea
            className="ar-input"
            rows={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="O que sua empresa faz, há quanto tempo está no mercado, diferencial, produtos principais..."
          />
          <p className="text-xs mt-1.5" style={{ color: "var(--ar-subtle)" }}>
            Esse texto aparece no card do seu perfil — é como uma mini-propaganda pra quem está escolhendo com quem fechar.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldWithIcon icon={<Globe size={15} />} label="Website" value={form.website} onChange={(v) => set("website", v)} placeholder="https://" />
          <FieldWithIcon icon={<Instagram size={15} />} label="Instagram" value={form.instagram} onChange={(v) => set("instagram", v)} placeholder="@suaempresa" />
        </div>
      </div>
    );
  }

  if (stepId === "images") {
    return (
      <div className="space-y-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={15} style={{ color: "var(--ar-accent)" }} />
            <span className="text-sm font-bold" style={{ color: "var(--ar-text)" }}>
              Imagem de capa *
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--ar-muted)" }}>
            Aparece no topo do card. Use uma foto da <strong>fachada</strong>, da <strong>loja por dentro</strong>, da <strong>equipe</strong> ou algo que represente a marca. Recomendado: 1200×600 (horizontal).
          </p>
          <ImageUploader
            value={form.coverImage}
            onChange={(v) => set("coverImage", v)}
            label=""
            endpoint="/api/public/upload"
          />
        </div>

        <div className="h-px" style={{ background: "var(--ar-border)" }} />

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={15} style={{ color: "var(--ar-accent)" }} />
            <span className="text-sm font-bold" style={{ color: "var(--ar-text)" }}>
              Logo da empresa *
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: "var(--ar-muted)" }}>
            Identificador quadrado que aparece sobre a capa. PNG quadrado (400×400) — com fundo transparente fica ainda mais profissional.
          </p>
          <ImageUploader
            value={form.logoUrl}
            onChange={(v) => set("logoUrl", v)}
            label=""
            endpoint="/api/public/upload"
          />
        </div>

        <p className="text-[11px] mt-1" style={{ color: "var(--ar-subtle)" }}>
          Máximo 10MB por imagem · JPG ou PNG.
        </p>
      </div>
    );
  }

  if (stepId === "review") {
    const displaySegment =
      form.segment === OTHER_SEGMENT_VALUE && form.segmentOther.trim()
        ? form.segmentOther.trim()
        : form.segment || "";
    const addressLine = [form.street.trim(), form.number.trim()]
      .filter(Boolean)
      .join(", ");
    const previewItem: AssociateItem = {
      id: "preview",
      companyName: form.companyName || "Sua empresa",
      displayName: null,
      description: form.description || "",
      displayDescription: null,
      logoUrl: form.logoUrl || null,
      displayLogo: null,
      coverImage: form.coverImage || null,
      city: form.city || null,
      neighborhood: form.neighborhood || null,
      address: addressLine || null,
      state: form.state || null,
      phone: form.phone || null,
      whatsapp: form.phone || null,
      email: form.email || null,
      hours: formatHours(form.hoursSchedule, form.lunchBreak) || null,

      products: null,
      yearsInMarket: null,
      segment: displaySegment || null,
      website: form.website || null,
      instagram: form.instagram || null,
      facebook: null,
    };
    const addressSummary = [
      addressLine,
      form.neighborhood,
      [form.city, form.state].filter(Boolean).join("/"),
      form.zipCode,
    ]
      .filter(Boolean)
      .join(" · ");

    return (
      <div className="space-y-5">
        <div
          className="rounded-2xl p-4 sm:p-5"
          style={{
            background:
              "linear-gradient(180deg, rgba(246,129,30,0.06) 0%, rgba(246,129,30,0) 100%)",
            border: "1px solid rgba(246,129,30,0.18)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} style={{ color: "var(--ar-accent)" }} />
            <span
              className="text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "var(--ar-accent)" }}
            >
              Assim fica seu card no site
            </span>
          </div>
          <div className="max-w-[360px] mx-auto">
            <AssociateCard item={previewItem} onOpenMap={() => {}} />
          </div>
          <p
            className="text-[11px] mt-3 text-center"
            style={{ color: "var(--ar-muted)" }}
          >
            Preview real do card do Conecta Associados depois da aprovação.
          </p>
        </div>

        <div className="space-y-2.5">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "var(--ar-muted)" }}
          >
            Resumo do cadastro
          </p>
          {displaySegment && <Review label="Segmento" value={displaySegment} />}
          <Review label="Empresa" value={form.companyName || "—"} />
          {form.cnpj && <Review label="CNPJ" value={form.cnpj} />}
          <Review
            label="Contato"
            value={[form.contactName, form.phone, form.email]
              .filter(Boolean)
              .join(" · ") || "—"}
          />
          <Review label="Endereço" value={addressSummary || "—"} />
          {formatHours(form.hoursSchedule, form.lunchBreak) && (
            <Review
              label="Horário"
              value={formatHours(form.hoursSchedule, form.lunchBreak)}
            />
          )}
        </div>
      </div>
    );
  }

  return null;
}

function LocationStep({
  form,
  set,
}: {
  form: FormState;
  set: <K extends keyof FormState>(k: K, v: FormState[K]) => void;
}) {
  const [fetchingCep, setFetchingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  function formatCep(raw: string) {
    const d = raw.replace(/\D/g, "").slice(0, 8);
    if (d.length > 5) return `${d.slice(0, 5)}-${d.slice(5)}`;
    return d;
  }

  async function lookup(cep: string) {
    const clean = cep.replace(/\D/g, "");
    if (clean.length !== 8) return;
    setFetchingCep(true);
    setCepError(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (data?.erro) {
        setCepError("CEP não encontrado. Preencha manualmente.");
        return;
      }
      if (data.logradouro) set("street", form.street || data.logradouro);
      if (data.bairro) set("neighborhood", form.neighborhood || data.bairro);
      if (data.localidade) set("city", form.city || data.localidade);
      if (data.uf) set("state", data.uf);
    } catch {
      setCepError("Não foi possível buscar o CEP. Preencha manualmente.");
    } finally {
      setFetchingCep(false);
    }
  }

  const addressLine = [form.street.trim(), form.number.trim()]
    .filter(Boolean)
    .join(", ");
  const mapPreviewEnabled = !!(addressLine && form.city.trim());
  const rawQuery = [addressLine, form.neighborhood, form.city, form.state, form.zipCode]
    .filter(Boolean)
    .join(", ");
  const mapQuery = encodeURIComponent(rawQuery);

  // Debounce da query do mapa para evitar recarregar o iframe a cada tecla
  const [debouncedQuery, setDebouncedQuery] = useState(mapQuery);
  const [mapLoading, setMapLoading] = useState(false);

  useEffect(() => {
    if (!mapPreviewEnabled) return;
    setMapLoading(true);
    const t = setTimeout(() => setDebouncedQuery(mapQuery), 600);
    return () => clearTimeout(t);
  }, [mapQuery, mapPreviewEnabled]);

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-6 gap-3">
        <div className="sm:col-span-2">
          <label className="ar-label">CEP *</label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              className="ar-input"
              value={form.zipCode}
              onChange={(e) => {
                const v = formatCep(e.target.value);
                set("zipCode", v);
                setCepError(null);
              }}
              onBlur={(e) => lookup(e.target.value)}
              placeholder="00000-000"
              maxLength={9}
            />
            {fetchingCep && (
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-xs"
                style={{ color: "var(--ar-muted)" }}
              >
                <Loader2 size={11} className="animate-spin" />
                Buscando
              </span>
            )}
          </div>
          <p className="text-[11px] mt-1" style={{ color: "var(--ar-subtle)" }}>
            Digite o CEP e preenchemos o resto.
          </p>
          {cepError && (
            <p className="text-[11px] mt-1" style={{ color: "var(--ar-danger)" }}>
              {cepError}
            </p>
          )}
        </div>
        <div className="sm:col-span-3">
          <FieldWithIcon
            icon={<MapPin size={15} />}
            label="Rua *"
            value={form.street}
            onChange={(v) => set("street", v)}
            placeholder="Ex: Rua Princesa Isabel"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="ar-label">Número *</label>
          <input
            type="text"
            inputMode="numeric"
            className="ar-input"
            value={form.number}
            onChange={(e) => set("number", e.target.value.slice(0, 12))}
            placeholder="438"
            maxLength={12}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-6 gap-4">
        <div className="sm:col-span-3">
          <FieldWithIcon
            label="Bairro"
            value={form.neighborhood}
            onChange={(v) => set("neighborhood", v)}
            placeholder="Ex: Costa e Silva"
          />
        </div>
        <div className="sm:col-span-2">
          <FieldWithIcon
            label="Cidade *"
            value={form.city}
            onChange={(v) => set("city", v)}
            placeholder="Ex: Joinville"
          />
        </div>
        <div className="sm:col-span-1">
          <FieldWithIcon
            label="UF"
            value={form.state}
            onChange={(v) => set("state", v.toUpperCase().slice(0, 2))}
            placeholder="SC"
          />
        </div>
      </div>

      <HoursScheduler
        schedule={form.hoursSchedule}
        lunch={form.lunchBreak}
        onSchedule={(s) => set("hoursSchedule", s)}
        onLunch={(l) => set("lunchBreak", l)}
      />

      {mapPreviewEnabled && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid var(--ar-border)",
            boxShadow: "0 4px 16px rgba(16,24,40,0.06)",
          }}
        >
          <div
            className="flex items-center justify-between gap-2 px-4 py-2.5"
            style={{
              background: "#f7f8fb",
              color: "var(--ar-muted)",
              borderBottom: "1px solid var(--ar-border)",
            }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-semibold">
              <MapPin size={13} />
              Pré-visualização do mapa
            </span>
            {mapLoading && (
              <span
                className="inline-flex items-center gap-1.5 text-[11px]"
                style={{ color: "var(--ar-muted)" }}
              >
                <Loader2 size={11} className="animate-spin" />
                Carregando Google Maps…
              </span>
            )}
          </div>
          <div className="relative" style={{ height: 240, background: "#eef2f7" }}>
            {mapLoading && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                style={{ background: "#eef2f7", zIndex: 1 }}
              >
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    background: "var(--ar-accent-soft)",
                    color: "var(--ar-accent)",
                  }}
                >
                  <Loader2 size={18} className="animate-spin" />
                </div>
                <p
                  className="text-[11px] font-semibold"
                  style={{ color: "var(--ar-muted)" }}
                >
                  Carregando mapa…
                </p>
              </div>
            )}
            <iframe
              key={debouncedQuery}
              src={`https://www.google.com/maps?q=${debouncedQuery}&output=embed`}
              title="Mapa da empresa"
              className="w-full h-full"
              style={{ border: 0, position: "relative", zIndex: 2 }}
              loading="lazy"
              onLoad={() => setMapLoading(false)}
            />
          </div>
        </div>
      )}

      <div
        className="p-3 rounded-xl text-xs"
        style={{
          background: "rgba(0,89,171,0.06)",
          border: "1px solid rgba(0,89,171,0.2)",
          color: "var(--ar-text)",
        }}
      >
        💡 <strong>Dica:</strong> quanto mais preciso (com CEP e número), melhor o mapa aparece pros clientes.
      </div>
    </div>
  );
}

function ScrollHintContainer({
  children,
  className,
  stepKey,
}: {
  children: React.ReactNode;
  className?: string;
  stepKey: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasMoreBelow, setHasMoreBelow] = useState(false);

  const recompute = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const more =
      el.scrollHeight > el.clientHeight + 8 &&
      el.scrollTop + el.clientHeight < el.scrollHeight - 12;
    setHasMoreBelow(more);
  }, []);

  useEffect(() => {
    recompute();
    const el = ref.current;
    if (!el) return;
    const onScroll = () => recompute();
    el.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => recompute());
    ro.observe(el);
    // Também reage a mudanças do conteúdo interno
    const mo = new MutationObserver(() => recompute());
    mo.observe(el, { childList: true, subtree: true, characterData: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
      mo.disconnect();
    };
  }, [recompute]);

  useEffect(() => {
    // Ao trocar de step, resetar scroll e recomputar
    if (ref.current) ref.current.scrollTop = 0;
    // um tick depois do re-render
    const t = setTimeout(recompute, 50);
    return () => clearTimeout(t);
  }, [stepKey, recompute]);

  function scrollABit() {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ top: Math.max(160, el.clientHeight * 0.6), behavior: "smooth" });
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <div
        ref={ref}
        className="absolute inset-0 overflow-y-auto ar-form-body pr-1 -mr-1"
      >
        {children}
      </div>
      <div
        aria-hidden={!hasMoreBelow}
        className="pointer-events-none absolute left-0 right-0 bottom-0 h-16"
        style={{
          background:
            "linear-gradient(to bottom, rgba(255,255,255,0) 0%, #ffffff 80%)",
          opacity: hasMoreBelow ? 1 : 0,
          transition: "opacity 0.25s ease",
        }}
      />
      <button
        type="button"
        onClick={scrollABit}
        aria-hidden={!hasMoreBelow}
        tabIndex={hasMoreBelow ? 0 : -1}
        className="absolute right-3 bottom-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-lg ar-scroll-hint"
        style={{
          background: "var(--ar-accent)",
          color: "#fff",
          border: "1px solid rgba(0,0,0,0.06)",
          opacity: hasMoreBelow ? 1 : 0,
          transform: hasMoreBelow ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: hasMoreBelow ? "auto" : "none",
          boxShadow: "0 8px 24px rgba(246,129,30,0.35)",
        }}
        title="Rolar para ver mais"
      >
        <ArrowDown size={12} />
        Ver mais abaixo
      </button>
    </div>
  );
}

function HoursScheduler({
  schedule,
  lunch,
  onSchedule,
  onLunch,
}: {
  schedule: HoursSchedule;
  lunch: LunchBreak;
  onSchedule: (s: HoursSchedule) => void;
  onLunch: (l: LunchBreak) => void;
}) {
  function toggle(day: DayKey) {
    onSchedule({
      ...schedule,
      [day]: { ...schedule[day], enabled: !schedule[day].enabled },
    });
  }
  function setTime(day: DayKey, field: "open" | "close", value: string) {
    onSchedule({
      ...schedule,
      [day]: { ...schedule[day], [field]: value },
    });
  }
  function applyToAll(day: DayKey) {
    const ref = schedule[day];
    const next = { ...schedule };
    DAY_ORDER.forEach((d) => {
      if (schedule[d].enabled) {
        next[d] = { ...next[d], open: ref.open, close: ref.close };
      }
    });
    onSchedule(next);
  }

  const preview = formatHours(schedule, lunch);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Clock size={15} style={{ color: "var(--ar-accent)" }} />
        <span className="ar-label" style={{ margin: 0 }}>
          Horário de atendimento
        </span>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          border: "1px solid var(--ar-border)",
        }}
      >
        {DAY_ORDER.map((d, i) => {
          const row = schedule[d];
          return (
            <div
              key={d}
              className="flex items-center gap-3 px-3 sm:px-4 py-2.5"
              style={{
                borderTop: i === 0 ? "none" : "1px solid var(--ar-border)",
                background: row.enabled ? "#fff" : "#fafbfc",
              }}
            >
              <button
                type="button"
                onClick={() => toggle(d)}
                className="flex items-center gap-2.5 flex-shrink-0 w-[116px]"
                aria-pressed={row.enabled}
              >
                <span
                  className="relative inline-flex items-center flex-shrink-0 w-9 h-5 rounded-full transition-colors"
                  style={{
                    background: row.enabled
                      ? "var(--ar-accent)"
                      : "rgba(10,14,26,0.15)",
                  }}
                >
                  <span
                    className="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform"
                    style={{
                      transform: row.enabled
                        ? "translateX(18px)"
                        : "translateX(2px)",
                    }}
                  />
                </span>
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: row.enabled ? "var(--ar-text)" : "var(--ar-subtle)",
                  }}
                >
                  {DAY_LONG[d]}
                </span>
              </button>

              {row.enabled ? (
                <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider flex-shrink-0"
                    style={{ color: "var(--ar-subtle)" }}
                  >
                    De
                  </span>
                  <input
                    type="time"
                    value={row.open}
                    onChange={(e) => setTime(d, "open", e.target.value)}
                    className="ar-input"
                    style={{
                      padding: "8px 10px",
                      fontSize: 13,
                      width: 110,
                      textAlign: "center",
                    }}
                  />
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider flex-shrink-0"
                    style={{ color: "var(--ar-subtle)" }}
                  >
                    até
                  </span>
                  <input
                    type="time"
                    value={row.close}
                    onChange={(e) => setTime(d, "close", e.target.value)}
                    className="ar-input"
                    style={{
                      padding: "8px 10px",
                      fontSize: 13,
                      width: 110,
                      textAlign: "center",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => applyToAll(d)}
                    className="ml-auto text-[11px] font-semibold inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                    style={{ color: "var(--ar-muted)" }}
                    title={`Aplicar ${prettyTime(row.open)}–${prettyTime(row.close)} nos outros dias abertos`}
                  >
                    Aplicar nos outros
                  </button>
                </div>
              ) : (
                <span
                  className="text-xs italic"
                  style={{ color: "var(--ar-subtle)" }}
                >
                  Fechado
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="mt-3 rounded-2xl px-3 sm:px-4 py-3"
        style={{
          background: "#fff",
          border: "1px solid var(--ar-border)",
        }}
      >
        <button
          type="button"
          onClick={() => onLunch({ ...lunch, enabled: !lunch.enabled })}
          className="flex items-center gap-2.5 w-full text-left"
          aria-pressed={lunch.enabled}
        >
          <span
            className="relative inline-flex items-center flex-shrink-0 w-9 h-5 rounded-full transition-colors"
            style={{
              background: lunch.enabled
                ? "var(--ar-accent)"
                : "rgba(10,14,26,0.15)",
            }}
          >
            <span
              className="inline-block w-4 h-4 bg-white rounded-full shadow transition-transform"
              style={{
                transform: lunch.enabled
                  ? "translateX(18px)"
                  : "translateX(2px)",
              }}
            />
          </span>
          <span
            className="text-sm font-semibold flex-1"
            style={{
              color: lunch.enabled ? "var(--ar-text)" : "var(--ar-muted)",
            }}
          >
            A empresa para para o almoço?
          </span>
          <span
            className="text-[10px] uppercase tracking-wider font-bold"
            style={{ color: "var(--ar-subtle)" }}
          >
            {lunch.enabled ? "Sim" : "Não"}
          </span>
        </button>

        {lunch.enabled && (
          <div
            className="mt-3 pt-3 flex items-center gap-2 flex-wrap sm:flex-nowrap"
            style={{ borderTop: "1px solid var(--ar-border)" }}
          >
            <span
              className="text-[11px] font-semibold uppercase tracking-wider flex-shrink-0"
              style={{ color: "var(--ar-subtle)" }}
            >
              Das
            </span>
            <input
              type="time"
              value={lunch.start}
              onChange={(e) => onLunch({ ...lunch, start: e.target.value })}
              className="ar-input"
              style={{
                padding: "8px 10px",
                fontSize: 13,
                width: 110,
                textAlign: "center",
              }}
            />
            <span
              className="text-[11px] font-semibold uppercase tracking-wider flex-shrink-0"
              style={{ color: "var(--ar-subtle)" }}
            >
              às
            </span>
            <input
              type="time"
              value={lunch.end}
              onChange={(e) => onLunch({ ...lunch, end: e.target.value })}
              className="ar-input"
              style={{
                padding: "8px 10px",
                fontSize: 13,
                width: 110,
                textAlign: "center",
              }}
            />
            <span
              className="text-[11px] ml-auto"
              style={{ color: "var(--ar-subtle)" }}
            >
              Aplica em todos os dias abertos
            </span>
          </div>
        )}
      </div>

      <div
        className="mt-2 px-3 py-2 rounded-xl text-xs flex items-start gap-2"
        style={{
          background: preview ? "rgba(246,129,30,0.06)" : "rgba(10,14,26,0.04)",
          border: `1px solid ${preview ? "rgba(246,129,30,0.18)" : "var(--ar-border)"}`,
          color: "var(--ar-muted)",
        }}
      >
        <Clock
          size={13}
          className="flex-shrink-0 mt-0.5"
          style={{ color: preview ? "var(--ar-accent)" : "var(--ar-subtle)" }}
        />
        <span>
          {preview ? (
            <>
              <strong style={{ color: "var(--ar-text)" }}>No card:</strong>{" "}
              {preview}
            </>
          ) : (
            "Selecione pelo menos um dia para que o horário apareça no card."
          )}
        </span>
      </div>
    </div>
  );
}

function Review({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "#f7f8fb" }}>
      <span className="text-[11px] font-bold uppercase tracking-wider w-24 flex-shrink-0 mt-0.5" style={{ color: "var(--ar-muted)" }}>
        {label}
      </span>
      <span className="text-sm" style={{ color: "var(--ar-text)" }}>
        {value}
      </span>
    </div>
  );
}

function FieldWithIcon({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="ar-label">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--ar-subtle)" }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="ar-input"
          style={{ paddingLeft: icon ? 44 : undefined }}
        />
      </div>
    </div>
  );
}

function SuccessScreen({
  companyName,
  global,
}: {
  companyName: string;
  global: GlobalContent | null;
}) {
  const colors = useMemo(() => ["#F6811E", "#0059AB", "#22c55e", "#fbbf24", "#ec4899", "#ffa64a"], []);
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        color: colors[i % colors.length],
        duration: 2 + Math.random() * 1.8,
      })),
    [colors]
  );
  const particles = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const dist = 200 + Math.random() * 180;
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          color: colors[i % colors.length],
        };
      }),
    [colors]
  );
  const firstName = companyName.split(" ")[0] || companyName || "sua empresa";

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Explosion layer */}
      <div className="ar-explosion">
        <div className="ar-explosion-ring" />
        {particles.map((p) => (
          <span
            key={p.id}
            className="ar-explosion-particle"
            style={
              {
                background: p.color,
                "--pdx": `${p.dx}px`,
                "--pdy": `${p.dy}px`,
                boxShadow: `0 0 10px ${p.color}`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Confetti */}
      {pieces.map((p) => (
        <span
          key={p.id}
          className="ar-confetti-piece"
          style={{
            left: `${p.left}%`,
            top: "-20px",
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            zIndex: 55,
          }}
        />
      ))}

      <div className="flex-1 flex items-center justify-center px-6 py-20 relative z-10">
        <div className="ar-card max-w-xl w-full p-10 md:p-14 text-center relative ar-success-reveal">
          <div
            className="inline-flex h-20 w-20 rounded-full items-center justify-center mb-6"
            style={{
              background: "linear-gradient(135deg, #F6811E 0%, #ffb14a 100%)",
              boxShadow: "0 16px 40px rgba(246, 129, 30, 0.4)",
            }}
          >
            <Rocket size={34} color="#fff" />
          </div>
          <span
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4"
            style={{ background: "var(--ar-accent-soft)", color: "var(--ar-accent)" }}
          >
            <Sparkles size={11} />
            Missão lançada!
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight" style={{ color: "var(--ar-text)" }}>
            A <span style={{ color: "var(--ar-accent)" }}>{firstName}</span> está a caminho do Conecta Associados 🚀
          </h2>
          <p className="text-base md:text-lg leading-relaxed mb-3" style={{ color: "var(--ar-muted)" }}>
            Recebemos seu cadastro com sucesso. Logo logo a equipe da ACOMAC vai revisar tudo e <strong style={{ color: "var(--ar-text)" }}>sua empresa estará visível no site da ACOMAC</strong> para gerar negócios.
          </p>
          <div
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl mb-7 mt-6"
            style={{ background: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)" }}
          >
            <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
            <span className="text-sm font-semibold" style={{ color: "#166534" }}>
              Aprovação em até 2 dias úteis
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/conecta-associados" className="ar-btn-ghost">
              Ver Conecta Associados
            </Link>
            <Link href="/" className="ar-btn-primary">
              Voltar ao site
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <footer
        className="px-6 py-3 text-center text-[11px]"
        style={{
          background: "#fff",
          borderTop: "1px solid var(--ar-border)",
          color: "var(--ar-subtle)",
        }}
      >
        ACOMAC Joinville · Conecta Associados
      </footer>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, CircleDot, Save, Undo2 } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="px-6 lg:px-8 pt-8 pb-6">
      {eyebrow && (
        <p
          className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: "var(--admin-accent)" }}
        >
          {eyebrow}
        </p>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>
          {subtitle && (
            <p
              className="text-sm mt-1.5 max-w-2xl"
              style={{ color: "var(--admin-text-muted)" }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
    </header>
  );
}

export function Panel({
  children,
  className = "",
  padding = "p-5",
}: {
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <div
      className={`rounded-2xl admin-surface ${padding} ${className}`}
      style={{
        boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset",
      }}
    >
      {children}
    </div>
  );
}

export function KPICard({
  label,
  value,
  hint,
  trend,
  accent = "blue",
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  trend?: { value: number; positive: boolean };
  accent?: "blue" | "accent" | "success" | "warning";
  icon?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const accentColor =
    accent === "accent"
      ? "var(--admin-accent)"
      : accent === "success"
      ? "var(--admin-success)"
      : accent === "warning"
      ? "var(--admin-warning)"
      : "var(--admin-blue)";

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
        ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
      }}
      className="admin-kpi rounded-2xl p-5 admin-hover-ring"
      style={{
        background: "var(--admin-surface)",
        border: "1px solid var(--admin-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[11px] font-semibold uppercase tracking-[0.1em]"
          style={{ color: "var(--admin-text-muted)" }}
        >
          {label}
        </span>
        {icon && (
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{
              background: `${accentColor}22`,
              color: accentColor,
            }}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-bold tracking-tight tabular-nums text-white">
          {value}
        </p>
        {trend && (
          <span
            className="text-[11px] font-semibold mb-1"
            style={{
              color: trend.positive
                ? "var(--admin-success)"
                : "var(--admin-danger)",
            }}
          >
            {trend.positive ? "+" : ""}
            {trend.value}%
          </span>
        )}
      </div>
      {hint && (
        <p
          className="text-[11px] mt-2"
          style={{ color: "var(--admin-text-subtle)" }}
        >
          {hint}
        </p>
      )}
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-3 mb-4">
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {subtitle && (
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--admin-text-muted)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-14">
      {icon && (
        <div
          className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-4"
          style={{
            background: "var(--admin-surface-2)",
            color: "var(--admin-text-muted)",
          }}
        >
          {icon}
        </div>
      )}
      <p className="font-semibold text-white">{title}</p>
      {description && (
        <p
          className="text-sm mt-1 max-w-sm mx-auto"
          style={{ color: "var(--admin-text-muted)" }}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LinkCard({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl p-4 admin-hover-ring"
      style={{
        background: "var(--admin-surface)",
        border: "1px solid var(--admin-border)",
      }}
    >
      <div
        className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "rgba(246,129,30,0.12)",
          color: "var(--admin-accent)",
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-white flex items-center gap-1">
          {title}
          <ArrowUpRight
            size={13}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: "var(--admin-accent)" }}
          />
        </p>
        <p
          className="text-xs mt-0.5"
          style={{ color: "var(--admin-text-muted)" }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

export function StatusDot({ color = "var(--admin-success)" }: { color?: string }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full"
      style={{ background: color }}
    />
  );
}

/**
 * Toggle premium para painéis de publicação/destaque do admin.
 * Linha inteira muda de cor + ícone laranja quando ativo,
 * com toggle de alto contraste tanto no ON quanto no OFF.
 */
export function ToggleRow({
  icon,
  label,
  hint,
  value,
  onChange,
}: {
  icon?: ReactNode;
  label: string;
  hint?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className="flex items-center gap-3 cursor-pointer py-2.5 px-3 rounded-lg transition-colors"
      style={{
        background: value ? "rgba(246,129,30,0.06)" : "transparent",
        border: `1px solid ${value ? "rgba(246,129,30,0.22)" : "transparent"}`,
      }}
    >
      <span
        className="inline-flex items-center justify-center w-7 h-7 rounded-md flex-shrink-0"
        style={{
          background: value
            ? "rgba(246,129,30,0.18)"
            : "var(--admin-surface-2)",
          color: value ? "var(--admin-accent)" : "var(--admin-text-muted)",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span
          className="block text-sm font-semibold"
          style={{ color: "var(--admin-text-strong)" }}
        >
          {label}
        </span>
        {hint && (
          <span
            className="block text-[11px] mt-0.5 leading-snug"
            style={{ color: "var(--admin-text-muted)" }}
          >
            {hint}
          </span>
        )}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onChange(!value);
        }}
        className="relative inline-flex h-6 w-11 rounded-full flex-shrink-0 transition-colors"
        style={{
          background: value
            ? "var(--admin-accent)"
            : "rgba(8,10,18,0.55)",
          border: value
            ? "1px solid rgba(246,129,30,0.5)"
            : "1.5px solid rgba(255,255,255,0.35)",
          boxShadow: value
            ? "inset 0 1px 0 rgba(255,255,255,0.18), 0 0 0 4px rgba(246,129,30,0.08)"
            : "inset 0 1px 2px rgba(0,0,0,0.45)",
        }}
        aria-pressed={value}
        aria-label={label}
      >
        <span
          className="inline-block h-4 w-4 rounded-full transition-all"
          style={{
            transform: `translate(${value ? "22px" : "3px"}, 2px)`,
            background: value ? "#ffffff" : "#cbd1da",
            boxShadow: value
              ? "0 2px 6px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.05)"
              : "0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </label>
  );
}

/**
 * Barra flutuante de "Salvar alterações" — renderizada via PORTAL no body
 * para garantir que `position: fixed` ancore no viewport real,
 * acompanhando o scroll em qualquer página de edição.
 */
export function StickyDirtyBar({
  dirty,
  saving,
  onSave,
  onReset,
  message = "Você tem alterações não salvas",
  saveLabel = "Salvar alterações",
  savingLabel = "Salvando...",
}: {
  dirty: boolean;
  saving?: boolean;
  onSave: () => void;
  onReset?: () => void;
  message?: string;
  saveLabel?: string;
  savingLabel?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  // Detecta se .admin-root tem classe `.dark` para tema correto no portal (que
  // sai da árvore de classes do admin-root).
  const isDark =
    typeof document !== "undefined" &&
    document.querySelector(".admin-root")?.classList.contains("dark");

  // Outer portal posicionado SEMPRE à direita do sidebar do admin (lg:left-72)
  // para nunca se sobrepor ao menu lateral.
  return createPortal(
    <div
      className={`admin-root${isDark ? " dark" : ""} fixed top-[60px] right-0 left-0 lg:left-72 px-3 lg:px-6 z-[60]`}
      style={{
        pointerEvents: "none",
        transform: dirty ? "translateY(0)" : "translateY(-150%)",
        opacity: dirty ? 1 : 0,
        transition:
          "transform 0.32s cubic-bezier(0.16,1,0.3,1), opacity 0.22s ease",
      }}
    >
      <div
        className="max-w-3xl ml-auto rounded-xl flex items-center gap-3 px-4 py-2.5"
        style={{
          background: "var(--admin-surface)",
          border: "1px solid rgba(246,129,30,0.45)",
          boxShadow:
            "0 16px 36px rgba(0,0,0,0.22), 0 0 0 1px rgba(246,129,30,0.1)",
          backdropFilter: "blur(12px)",
          pointerEvents: dirty ? "auto" : "none",
        }}
      >
        <span
          className="inline-flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
          style={{
            background: "rgba(246,129,30,0.15)",
            color: "var(--admin-accent)",
          }}
        >
          <CircleDot size={13} />
        </span>
        <span
          className="text-xs font-semibold flex-1 min-w-0"
          style={{ color: "var(--admin-text-strong)" }}
        >
          {message}
        </span>
        {onReset && (
          <button
            onClick={onReset}
            className="admin-btn admin-btn-ghost text-xs"
            style={{ padding: "6px 12px" }}
            type="button"
          >
            <Undo2 size={12} />
            Desfazer
          </button>
        )}
        <button
          onClick={onSave}
          disabled={!!saving}
          className="admin-btn admin-btn-primary text-xs"
          style={{ padding: "6px 14px" }}
          type="button"
        >
          <Save size={12} />
          {saving ? savingLabel : saveLabel}
        </button>
      </div>
    </div>,
    document.body
  );
}

/**
 * Banner que aparece quando há um rascunho local não salvo recuperado do cache.
 * Permite restaurar ou descartar.
 */
export function DraftRecoveredBanner({
  savedAt,
  onRestore,
  onDiscard,
}: {
  savedAt: Date | null;
  onRestore: () => void;
  onDiscard: () => void;
}) {
  const when = savedAt
    ? savedAt.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  return (
    <div
      className="mb-5 rounded-xl px-4 py-3 flex items-center gap-3"
      style={{
        background: "rgba(246,129,30,0.06)",
        border: "1px solid rgba(246,129,30,0.3)",
      }}
    >
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
        style={{
          background: "rgba(246,129,30,0.15)",
          color: "var(--admin-accent)",
        }}
      >
        <CircleDot size={14} />
      </span>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-bold"
          style={{ color: "var(--admin-text-strong)" }}
        >
          Rascunho local encontrado
        </p>
        <p className="text-[12px]" style={{ color: "var(--admin-text-muted)" }}>
          Você tem alterações não salvas {when && `de ${when}`}. Restaure para
          continuar de onde parou.
        </p>
      </div>
      <button
        onClick={onDiscard}
        className="admin-btn admin-btn-ghost text-xs"
        style={{ padding: "6px 12px" }}
        type="button"
      >
        Descartar
      </button>
      <button
        onClick={onRestore}
        className="admin-btn admin-btn-primary text-xs"
        style={{ padding: "6px 14px" }}
        type="button"
      >
        <Undo2 size={12} />
        Restaurar rascunho
      </button>
    </div>
  );
}

/**
 * Pill de status (Publicado / Rascunho / etc) usado no topo dos painéis de publicação.
 * Verde quando active, neutro caso contrário.
 */
export function StatusPill({
  active,
  activeLabel,
  inactiveLabel,
  extra,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  extra?: string;
}) {
  return (
    <div
      className="p-3 rounded-lg flex items-center gap-2"
      style={{
        background: active
          ? "rgba(22,163,74,0.1)"
          : "var(--admin-surface-2)",
        border: `1px solid ${
          active ? "rgba(22,163,74,0.25)" : "var(--admin-border)"
        }`,
      }}
    >
      <CircleDot
        size={13}
        style={{
          color: active ? "#16a34a" : "var(--admin-text-muted)",
        }}
      />
      <span
        className="text-xs font-semibold"
        style={{
          color: active ? "#16a34a" : "var(--admin-text-muted)",
        }}
      >
        {active ? activeLabel : inactiveLabel}
        {extra && active && ` · ${extra}`}
      </span>
    </div>
  );
}

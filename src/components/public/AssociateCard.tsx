"use client";

import { useEffect, useRef, useState } from "react";
import {
  Phone,
  MapPin,
  Clock,
  Globe,
  X,
  ExternalLink,
  Navigation,
  Loader2,
} from "lucide-react";
import { WhatsAppIcon, InstagramIcon } from "@/components/icons/SocialIcons";

export type AssociateItem = {
  id: string;
  companyName: string;
  displayName: string | null;
  description: string | null;
  displayDescription: string | null;
  logoUrl: string | null;
  displayLogo: string | null;
  coverImage: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  state: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  hours: string | null;
  products: string | null;
  yearsInMarket: number | null;
  segment: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
};

function digits(s: string | null | undefined): string {
  return (s ?? "").replace(/\D/g, "");
}

export function fullAddress(item: AssociateItem): string {
  return [item.address, item.neighborhood, item.city, item.state]
    .filter(Boolean)
    .join(", ");
}

export function hasLocation(item: AssociateItem): boolean {
  return !!(item.address || item.city);
}

function waLink(number: string | null, companyName: string): string | null {
  const d = digits(number);
  if (!d) return null;
  const phone = d.length <= 11 ? `55${d}` : d;
  const msg = encodeURIComponent(
    `Olá! Vim do Conecta Associados da ACOMAC Joinville e tenho interesse nos produtos/serviços da ${companyName}. Poderia me passar mais informações?`
  );
  return `https://wa.me/${phone}?text=${msg}`;
}

function instagramUrl(raw: string): string {
  if (!raw) return "#";
  if (raw.startsWith("http")) return raw;
  return `https://instagram.com/${raw.replace(/^@/, "")}`;
}

function mapsLink(item: AssociateItem): string {
  const q = encodeURIComponent(fullAddress(item));
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

function mapsEmbedSrc(item: AssociateItem): string {
  const q = encodeURIComponent(fullAddress(item));
  return `https://www.google.com/maps?q=${q}&output=embed`;
}

const DAY_NAME_TO_IDX: Record<string, number> = {
  dom: 0,
  seg: 1,
  ter: 2,
  qua: 3,
  qui: 4,
  sex: 5,
  sab: 6,
  "sáb": 6,
};

type DayRanges = { day: number; ranges: { openM: number; closeM: number }[] };

/**
 * Parses the `hours` string produced by formatHours() in the associate form.
 * Supported shapes:
 *   "Seg–Sex 8h–18h"
 *   "Seg–Sex 8h–12h · 13h30–18h"  (lunch break splits the range)
 *   "Seg–Sex 8h–18h · Sáb 8h–12h"
 * Returns null if the string doesn't parse in this format.
 */
function parseHoursString(s: string): DayRanges[] | null {
  const clean = s
    .replace(/\u00a0/g, " ")
    .replace(/—|–/g, "-")
    .trim();
  if (!clean) return null;
  const parts = clean.split(/\s+·\s+/).map((p) => p.trim()).filter(Boolean);
  const dayRangeRe =
    /^([A-Za-zÀ-ÿ]{3,4})(?:\s*-\s*([A-Za-zÀ-ÿ]{3,4}))?\s+(\d{1,2})h(\d{0,2})\s*-\s*(\d{1,2})h(\d{0,2})$/;
  const timeOnlyRe = /^(\d{1,2})h(\d{0,2})\s*-\s*(\d{1,2})h(\d{0,2})$/;
  const result: DayRanges[] = [];
  let currentDays: number[] = [];
  const toMin = (h: string, m: string) =>
    parseInt(h, 10) * 60 + (m ? parseInt(m, 10) : 0);
  const push = (days: number[], o: number, c: number) => {
    for (const d of days) {
      let entry = result.find((r) => r.day === d);
      if (!entry) {
        entry = { day: d, ranges: [] };
        result.push(entry);
      }
      entry.ranges.push({ openM: o, closeM: c });
    }
  };
  for (const p of parts) {
    const m = p.match(dayRangeRe);
    if (m) {
      const aKey = m[1].toLowerCase();
      const bKey = m[2]?.toLowerCase();
      const a = DAY_NAME_TO_IDX[aKey];
      const b = bKey ? DAY_NAME_TO_IDX[bKey] : a;
      if (a === undefined || b === undefined) continue;
      currentDays = [];
      for (let d = a; d <= b; d++) currentDays.push(d);
      push(currentDays, toMin(m[3], m[4]), toMin(m[5], m[6]));
      continue;
    }
    const t = p.match(timeOnlyRe);
    if (t && currentDays.length > 0) {
      push(currentDays, toMin(t[1], t[2]), toMin(t[3], t[4]));
    }
  }
  return result.length ? result : null;
}

const DAY_SHORT: Record<number, string> = {
  0: "Dom",
  1: "Seg",
  2: "Ter",
  3: "Qua",
  4: "Qui",
  5: "Sex",
  6: "Sáb",
};
const DISPLAY_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Seg…Sáb, Dom

function formatMinutes(m: number): string {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return mm ? `${h}h${String(mm).padStart(2, "0")}` : `${h}h`;
}

type HoursStatus =
  | { state: "open"; untilM: number }
  | { state: "lunch"; untilM: number }
  | { state: "closed"; openAgainM?: number }
  | { state: "unknown" };

function computeStatus(parsed: DayRanges[], now: Date): HoursStatus {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const today = parsed.find((r) => r.day === day);
  if (today) {
    const sorted = [...today.ranges].sort((a, b) => a.openM - b.openM);
    for (let i = 0; i < sorted.length; i++) {
      const r = sorted[i];
      if (minutes >= r.openM && minutes < r.closeM) {
        return { state: "open", untilM: r.closeM };
      }
      // Gap entre dois intervalos do mesmo dia = pausa (almoço)
      if (
        i < sorted.length - 1 &&
        minutes >= r.closeM &&
        minutes < sorted[i + 1].openM
      ) {
        return { state: "lunch", untilM: sorted[i + 1].openM };
      }
    }
    // Antes do primeiro abrir de hoje
    if (minutes < sorted[0].openM) {
      return { state: "closed", openAgainM: sorted[0].openM };
    }
  }
  return { state: "closed" };
}

type HoursGroup = {
  days: number[];
  ranges: { openM: number; closeM: number }[];
  lunchGap?: { openM: number; closeM: number };
};

function groupHours(parsed: DayRanges[]): HoursGroup[] {
  const byDay = new Map<number, { openM: number; closeM: number }[]>();
  for (const e of parsed) {
    const sorted = [...e.ranges].sort((a, b) => a.openM - b.openM);
    byDay.set(e.day, sorted);
  }
  const groups: HoursGroup[] = [];
  for (const d of DISPLAY_DAY_ORDER) {
    const ranges = byDay.get(d);
    if (!ranges) continue;
    const last = groups[groups.length - 1];
    const sig = JSON.stringify(ranges);
    const lastSig = last ? JSON.stringify(last.ranges) : "";
    if (last && sig === lastSig) {
      last.days.push(d);
    } else {
      const group: HoursGroup = { days: [d], ranges };
      if (ranges.length === 2) {
        group.lunchGap = { openM: ranges[0].closeM, closeM: ranges[1].openM };
      }
      groups.push(group);
    }
  }
  return groups;
}

function useHoursInsight(hours: string | null | undefined) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const iv = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(iv);
  }, []);
  if (!hours || !now) return null;
  const parsed = parseHoursString(hours);
  if (!parsed) return null;
  return {
    groups: groupHours(parsed),
    status: computeStatus(parsed, now),
  };
}

function dayLabel(days: number[]): string {
  if (days.length === 1) return DAY_SHORT[days[0]];
  return `${DAY_SHORT[days[0]]}–${DAY_SHORT[days[days.length - 1]]}`;
}

function HoursDisplay({
  hours,
  insight,
}: {
  hours: string;
  insight: ReturnType<typeof useHoursInsight>;
}) {
  if (!insight) {
    return (
      <p
        className="text-xs inline-flex items-center gap-1.5"
        style={{ color: "#8a94a6" }}
      >
        <Clock size={12} className="flex-shrink-0" />
        <span className="truncate">{hours}</span>
      </p>
    );
  }
  const { groups, status } = insight;

  const statusStyle = (() => {
    if (status.state === "open") {
      return {
        label: "Aberto",
        color: "#15803d",
        bg: "transparent",
        border: "transparent",
        dot: "#16a34a",
        glow: "none",
        subtle: true,
      };
    }
    if (status.state === "lunch") {
      return {
        label: `Em pausa para almoço · volta ${formatMinutes(status.untilM)}`,
        color: "#9a3412",
        bg: "rgba(246,129,30,0.10)",
        border: "rgba(246,129,30,0.30)",
        dot: "#F6811E",
        glow: "0 0 0 3px rgba(246,129,30,0.22)",
        subtle: false,
      };
    }
    if (status.state === "closed" && status.openAgainM !== undefined) {
      return {
        label: `Fechado · abre ${formatMinutes(status.openAgainM)}`,
        color: "#b91c1c",
        bg: "rgba(239,68,68,0.08)",
        border: "rgba(239,68,68,0.25)",
        dot: "#ef4444",
        glow: "none",
        subtle: false,
      };
    }
    return {
      label: "Fechado",
      color: "#b91c1c",
      bg: "rgba(239,68,68,0.08)",
      border: "rgba(239,68,68,0.25)",
      dot: "#ef4444",
      glow: "none",
      subtle: false,
    };
  })();

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#f7f8fb", border: "1px solid #eceef2" }}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <Clock size={13} style={{ color: "#6b7486" }} />
        <span
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: "#8a94a6" }}
        >
          Atendimento
        </span>
        <span
          className={
            statusStyle.subtle
              ? "ml-auto inline-flex items-center gap-1 text-[9px] font-medium"
              : "ml-auto inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
          }
          style={
            statusStyle.subtle
              ? { color: statusStyle.color }
              : {
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  border: `1px solid ${statusStyle.border}`,
                }
          }
          aria-live="polite"
        >
          <span
            className={
              statusStyle.subtle
                ? "inline-block w-1 h-1 rounded-full"
                : "inline-block w-1.5 h-1.5 rounded-full"
            }
            style={{ background: statusStyle.dot, boxShadow: statusStyle.glow }}
          />
          {statusStyle.label}
        </span>
      </div>
      <div className="px-3 pb-2 space-y-1.5">
        {groups.map((g) => (
          <div
            key={g.days.join("-")}
            className="flex items-center gap-2 text-[12px]"
          >
            <span
              className="inline-flex items-center justify-center text-[10px] font-bold uppercase tracking-wider rounded-md px-1.5 py-0.5 flex-shrink-0"
              style={{
                background: "#fff",
                color: "#0e1a2b",
                border: "1px solid #eceef2",
                minWidth: 52,
              }}
            >
              {dayLabel(g.days)}
            </span>
            <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
              {g.ranges.map((r, i) => (
                <span key={i} className="inline-flex items-center gap-1.5">
                  {i > 0 && (
                    <span
                      className="inline-block w-1 h-1 rounded-full"
                      style={{ background: "#cbd1da" }}
                    />
                  )}
                  <span
                    className="font-semibold tabular-nums"
                    style={{ color: "#0e1a2b" }}
                  >
                    {formatMinutes(r.openM)}–{formatMinutes(r.closeM)}
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const DESCRIPTION_CHAR_LIMIT = 160;

function truncateAtWord(text: string, limit: number): string {
  if (text.length <= limit) return text;
  const cut = text.slice(0, limit);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

export function AssociateCard({
  item,
  onOpenMap,
  expanded = false,
  onToggleExpand,
}: {
  item: AssociateItem;
  onOpenMap: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
}) {
  const name = item.displayName || item.companyName;
  const description = item.displayDescription || item.description || "";
  const logo = item.displayLogo || item.logoUrl;
  const wa = waLink(item.whatsapp || item.phone, name);
  const tel = digits(item.phone);
  const tags = (item.products ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 6);
  const locationText = [item.neighborhood, item.city, item.state]
    .filter(Boolean)
    .join(" · ");
  const hoursInsight = useHoursInsight(item.hours);

  const isLongDescription = description.length > DESCRIPTION_CHAR_LIMIT;
  // Sem onToggleExpand (preview do wizard, etc.) mostra completo sem o ver mais.
  const canToggle = !!onToggleExpand;
  const showFullDescription = !canToggle || expanded || !isLongDescription;
  const visibleDescription = showFullDescription
    ? description
    : truncateAtWord(description, DESCRIPTION_CHAR_LIMIT);

  // Tracking de view: dispara 1x por sessão por associado quando o card fica
  // 50% visível no viewport. Permite contar impressões pra mostrar pro associado.
  const articleRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!canToggle) return; // não trackeia em preview do wizard
    const key = `assoc_view_${item.id}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      return;
    }
    const el = articleRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        try {
          sessionStorage.setItem(key, "1");
        } catch {
          /* ignore */
        }
        // Mesma session id usada pelo Analytics, pra agrupar uniques.
        let sessionId = "";
        try {
          sessionId = sessionStorage.getItem("acomac_sid") ?? "";
        } catch {
          /* ignore */
        }
        fetch("/api/track", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            type: "view",
            target: "associate_view",
            label: item.id,
            sessionId,
            path: typeof location !== "undefined" ? location.pathname : "",
          }),
          keepalive: true,
        }).catch(() => {});
        obs.disconnect();
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [item.id, canToggle]);

  return (
    <article
      ref={articleRef}
      className="rounded-3xl overflow-hidden flex flex-col h-full"
      style={{
        background: "#fff",
        border: "1px solid #eceef2",
        boxShadow: "0 8px 24px rgba(16,24,40,0.06)",
      }}
    >
      <div
        className="relative h-36"
        style={{
          background: item.coverImage
            ? `url(${item.coverImage}) center/cover`
            : "linear-gradient(135deg, #003566 0%, #0059AB 55%, #1a72c4 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.55), transparent 60%)",
          }}
        />
        {item.segment && (
          <span
            className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(255,255,255,0.92)",
              color: "#0059AB",
              backdropFilter: "blur(6px)",
            }}
          >
            {item.segment}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col p-5 -mt-8 relative">
        <div
          className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center flex-shrink-0 overflow-hidden mb-3"
          style={{
            boxShadow: "0 8px 20px rgba(16,24,40,0.1)",
            border: "1px solid #eceef2",
          }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-black text-lg" style={{ color: "#0059AB" }}>
              {name.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        <h3
          className="text-lg font-extrabold tracking-tight leading-tight mb-1"
          style={{ color: "#0e1a2b" }}
        >
          {name}
        </h3>

        {locationText && (
          <p
            className="text-xs inline-flex items-center gap-1.5 mb-3"
            style={{ color: "#8a94a6" }}
          >
            <MapPin size={12} />
            {locationText}
          </p>
        )}

        {description && (
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "#5a6577" }}
          >
            {visibleDescription}
            {isLongDescription && onToggleExpand && (
              <>
                {" "}
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className="font-semibold hover:underline cursor-pointer"
                  style={{ color: "#0059AB", background: "none", border: 0, padding: 0 }}
                  aria-expanded={expanded}
                >
                  {expanded ? "ver menos" : "ver mais"}
                </button>
              </>
            )}
          </p>
        )}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tags.map((t, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md"
                style={{ background: "#eef4fd", color: "#0059AB" }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        {item.hours && (
          <div className="mb-4">
            <HoursDisplay hours={item.hours} insight={hoursInsight} />
          </div>
        )}

        {/* Ações secundárias: ficam acima do CTA principal.
            Importante: o botão de WhatsApp é o ÚLTIMO elemento do card pra
            que sua posição (Y) seja card_bottom - altura_do_botão — constante
            entre todos os cards da linha, independente de ter website ou não. */}
        <div
          className="mt-auto pt-4 space-y-2.5"
          style={{ borderTop: "1px solid #eceef2" }}
        >
          <div className="grid grid-cols-3 gap-2">
            {item.instagram ? (
              <a
                href={instagramUrl(item.instagram)}
                target="_blank"
                rel="noopener noreferrer"
                data-track="associate_instagram"
                data-track-label={item.id}
                className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-semibold transition-colors hover:bg-slate-50"
                style={{
                  background: "#fafbfc",
                  color: "#0e1a2b",
                  border: "1px solid #eceef2",
                }}
              >
                <InstagramIcon size={18} />
                Instagram
              </a>
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-semibold opacity-30"
                style={{
                  background: "#fafbfc",
                  color: "#0e1a2b",
                  border: "1px solid #eceef2",
                }}
              >
                <InstagramIcon size={18} />
                Instagram
              </div>
            )}

            {hasLocation(item) ? (
              <button
                onClick={onOpenMap}
                data-track="associate_location"
                data-track-label={item.id}
                className="cursor-pointer flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-semibold transition-colors hover:bg-slate-50"
                style={{
                  background: "#fafbfc",
                  color: "#0e1a2b",
                  border: "1px solid #eceef2",
                }}
              >
                <MapPin size={18} style={{ color: "#ef4444" }} />
                Localização
              </button>
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-semibold opacity-30"
                style={{
                  background: "#fafbfc",
                  color: "#0e1a2b",
                  border: "1px solid #eceef2",
                }}
              >
                <MapPin size={18} />
                Localização
              </div>
            )}

            {tel ? (
              <a
                href={`tel:${tel}`}
                data-track="associate_phone"
                data-track-label={item.id}
                className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-semibold transition-colors hover:bg-slate-50"
                style={{
                  background: "#fafbfc",
                  color: "#0e1a2b",
                  border: "1px solid #eceef2",
                }}
              >
                <Phone size={18} style={{ color: "#0059AB" }} />
                Ligar
              </a>
            ) : (
              <div
                className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-[11px] font-semibold opacity-30"
                style={{
                  background: "#fafbfc",
                  color: "#0e1a2b",
                  border: "1px solid #eceef2",
                }}
              >
                <Phone size={18} />
                Ligar
              </div>
            )}
          </div>

          {item.website && (
            <a
              href={
                item.website.startsWith("http")
                  ? item.website
                  : `https://${item.website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              data-track="associate_website"
              data-track-label={item.id}
              className="flex items-center justify-center gap-1.5 text-xs font-semibold pt-1"
              style={{ color: "#0059AB" }}
            >
              <Globe size={12} />
              Visitar website
              <ExternalLink size={11} />
            </a>
          )}

          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              data-track="associate_whatsapp"
              data-track-label={item.id}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:-translate-y-0.5"
              style={{
                background: "#25D366",
                boxShadow: "0 6px 20px rgba(37,211,102,0.3)",
              }}
            >
              <WhatsAppIcon size={17} />
              Entrar em contato no WhatsApp
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function AssociateMapModal({
  item,
  onClose,
}: {
  item: AssociateItem;
  onClose: () => void;
}) {
  const name = item.displayName || item.companyName;
  const full = fullAddress(item);
  const embed = mapsEmbedSrc(item);
  const openLink = mapsLink(item);
  const [mapLoading, setMapLoading] = useState(true);

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

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(5,7,12,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: "#fff",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          maxHeight: "calc(100vh - 24px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-start justify-between gap-3 px-5 py-4"
          style={{ borderBottom: "1px solid #eceef2" }}
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
            >
              <MapPin size={18} />
            </div>
            <div className="min-w-0">
              <p
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: "#8a94a6" }}
              >
                Localização
              </p>
              <h3
                className="text-lg font-bold truncate"
                style={{ color: "#0e1a2b" }}
              >
                {name}
              </h3>
              {full && (
                <p className="text-xs mt-0.5" style={{ color: "#5a6577" }}>
                  {full}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 flex-shrink-0"
            style={{ color: "#6b7486" }}
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="relative flex-1 min-h-[340px]"
          style={{ background: "#eef2f7" }}
        >
          {mapLoading && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
              style={{ background: "#eef2f7" }}
            >
              <div
                className="inline-flex h-12 w-12 items-center justify-center rounded-full"
                style={{
                  background: "rgba(239,68,68,0.1)",
                  color: "#ef4444",
                }}
              >
                <Loader2 size={22} className="animate-spin" />
              </div>
              <p
                className="text-xs font-semibold"
                style={{ color: "#6b7486" }}
              >
                Carregando Google Maps…
              </p>
              <p className="text-[11px]" style={{ color: "#8a94a6" }}>
                Localizando endereço
              </p>
            </div>
          )}
          <iframe
            key={embed}
            src={embed}
            title={`Mapa — ${name}`}
            className="absolute inset-0 w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            onLoad={() => setMapLoading(false)}
          />
        </div>

        <div
          className="flex items-center justify-end gap-2 px-5 py-3"
          style={{ borderTop: "1px solid #eceef2", background: "#fff" }}
        >
          <a
            href={openLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: "#0059AB" }}
          >
            <Navigation size={14} />
            Abrir no Google Maps
          </a>
        </div>
      </div>
    </div>
  );
}

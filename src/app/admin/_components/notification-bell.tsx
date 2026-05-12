"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Bell, UserCheck, Inbox, ExternalLink } from "lucide-react";

type Notif = {
  kind: "associate" | "message";
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  href: string;
};

type ApiResponse = {
  notifications: Notif[];
  counts: { associates: number; messages: number; total: number };
};

const LAST_SEEN_KEY = "acomac_notif_seen_at";
const POLL_MS = 30_000;

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [counts, setCounts] = useState({ associates: 0, messages: 0, total: 0 });
  const [lastSeen, setLastSeen] = useState<number>(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setLastSeen(Number(localStorage.getItem(LAST_SEEN_KEY) ?? "0"));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      fetch("/api/admin/notifications")
        .then((r) => (r.ok ? r.json() : null))
        .then((d: ApiResponse | null) => {
          if (cancelled || !d) return;
          setNotifs(d.notifications);
          setCounts(d.counts);
        })
        .catch(() => {});
    };
    load();
    const iv = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(iv);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const unread = notifs.filter(
    (n) => new Date(n.createdAt).getTime() > lastSeen
  ).length;

  function toggle() {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen) {
      const now = Date.now();
      setLastSeen(now);
      try {
        localStorage.setItem(LAST_SEEN_KEY, String(now));
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={toggle}
        className="relative p-2 rounded-lg transition-colors"
        style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
          color: "var(--admin-text-muted)",
        }}
        title="Notificações"
        aria-label={`Notificações${unread > 0 ? `, ${unread} não vistas` : ""}`}
      >
        <Bell size={14} />
        {unread > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 flex items-center justify-center rounded-full text-[9px] font-bold tabular-nums"
            style={{
              background: "#F6811E",
              color: "#fff",
              boxShadow: "0 0 0 2px var(--admin-topbar-bg)",
            }}
          >
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] max-h-[480px] flex flex-col rounded-xl overflow-hidden"
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
            boxShadow: "0 24px 48px rgba(0,0,0,0.35)",
            zIndex: 60,
          }}
        >
          <div
            className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: "1px solid var(--admin-border)" }}
          >
            <div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "var(--admin-accent)" }}
              >
                Notificações
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--admin-text-muted)" }}
              >
                {counts.total === 0
                  ? "Nada precisa da sua atenção"
                  : counts.total === 1
                  ? "1 item aguarda sua ação"
                  : `${counts.total} itens aguardam sua ação`}
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifs.length === 0 ? (
              <div
                className="px-4 py-10 text-center"
                style={{ color: "var(--admin-text-muted)" }}
              >
                <Bell
                  size={22}
                  className="mx-auto mb-2"
                  style={{ color: "var(--admin-text-subtle)" }}
                />
                <p className="text-sm">Tudo em dia por aqui</p>
                <p className="text-xs mt-1" style={{ color: "var(--admin-text-subtle)" }}>
                  Novos cadastros e contatos aparecem aqui
                </p>
              </div>
            ) : (
              <ul>
                {notifs.slice(0, 12).map((n) => {
                  const isNew = new Date(n.createdAt).getTime() > lastSeen;
                  const Icon = n.kind === "associate" ? UserCheck : Inbox;
                  return (
                    <li key={`${n.kind}-${n.id}`}>
                      <Link
                        href={n.href}
                        onClick={() => setOpen(false)}
                        className="flex items-start gap-3 px-4 py-3 transition-colors"
                        style={{
                          borderBottom: "1px solid var(--admin-border)",
                          background: isNew ? "var(--admin-accent-soft)" : "transparent",
                        }}
                      >
                        <div
                          className="flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center"
                          style={{
                            background:
                              n.kind === "associate"
                                ? "rgba(74,140,255,0.15)"
                                : "rgba(246,129,30,0.15)",
                            color: n.kind === "associate" ? "#4a8cff" : "#F6811E",
                          }}
                        >
                          <Icon size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className="text-sm font-semibold truncate flex-1"
                              style={{ color: "var(--admin-text-strong)" }}
                            >
                              {n.title}
                            </p>
                            {isNew && (
                              <span
                                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                                style={{
                                  background: "#F6811E",
                                  color: "#fff",
                                }}
                              >
                                Novo
                              </span>
                            )}
                          </div>
                          <p
                            className="text-xs truncate mt-0.5"
                            style={{ color: "var(--admin-text-muted)" }}
                          >
                            {n.subtitle}
                          </p>
                          <p
                            className="text-[10px] mt-1"
                            style={{ color: "var(--admin-text-subtle)" }}
                          >
                            {n.kind === "associate"
                              ? "Cadastro Conecta"
                              : "Mensagem de contato"}{" "}
                            · há {timeAgo(n.createdAt)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div
            className="px-4 py-2.5 flex items-center justify-between gap-3"
            style={{ borderTop: "1px solid var(--admin-border)" }}
          >
            <Link
              href="/admin/associates"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: "var(--admin-accent)" }}
            >
              Associados
              {counts.associates > 0 && <span>({counts.associates})</span>}
              <ExternalLink size={11} />
            </Link>
            <Link
              href="/admin/messages"
              onClick={() => setOpen(false)}
              className="flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: "var(--admin-accent)" }}
            >
              Formulários
              {counts.messages > 0 && <span>({counts.messages})</span>}
              <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

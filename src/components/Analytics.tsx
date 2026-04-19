"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem("acomac_sid");
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem("acomac_sid", id);
  }
  return id;
}

async function send(payload: Record<string, string>) {
  try {
    await fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    /* ignore */
  }
}

export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const sessionId = getSessionId();
    void send({ type: "pageview", path: pathname ?? "", sessionId });
  }, [pathname]);

  useEffect(() => {
    if (pathname?.startsWith("/admin")) return;
    const sessionId = getSessionId();

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      const trackTarget = el.dataset.track ?? "";
      const trackLabel = el.dataset.trackLabel ?? el.textContent?.trim().slice(0, 80) ?? "";
      void send({
        type: "click",
        path: pathname ?? "",
        target: trackTarget,
        label: trackLabel,
        sessionId,
      });
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  return null;
}

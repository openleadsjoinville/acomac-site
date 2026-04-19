"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";

type Sponsor = {
  id: string;
  name: string;
  image: string;
  url: string;
  description: string;
  weight: number;
};

let cached: Sponsor[] | null = null;
let cachePromise: Promise<Sponsor[]> | null = null;

async function loadSponsors(): Promise<Sponsor[]> {
  if (cached) return cached;
  if (cachePromise) return cachePromise;
  cachePromise = fetch("/api/public/sponsors")
    .then((r) => (r.ok ? r.json() : []))
    .then((d) => {
      cached = Array.isArray(d) ? d : [];
      return cached;
    })
    .catch(() => {
      cached = [];
      return cached;
    });
  return cachePromise;
}

function pickWeighted(items: Sponsor[]): Sponsor | null {
  if (items.length === 0) return null;
  if (items.length === 1) return items[0];
  const total = items.reduce((s, i) => s + Math.max(1, i.weight), 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= Math.max(1, it.weight);
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

export default function SponsorAside({
  slot = "aside",
  stickyTop = 96,
}: {
  slot?: string;
  stickyTop?: number;
}) {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);

  useEffect(() => {
    let mounted = true;
    loadSponsors().then((all) => {
      if (!mounted) return;
      setSponsor(pickWeighted(all));
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!sponsor) return;
    const key = `sponsor_view_${sponsor.id}_${slot}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "click",
        target: "sponsor_aside_view",
        label: sponsor.name,
        path: typeof location !== "undefined" ? location.pathname : "",
      }),
      keepalive: true,
    }).catch(() => {});
  }, [sponsor, slot]);

  if (!sponsor) return null;
  const isExternal = sponsor.url && /^https?:\/\//i.test(sponsor.url);
  const href = sponsor.url || "#";

  return (
    <>
      {/* DESKTOP — vertical 160×600 sticky */}
      <aside
        className="hidden xl:block w-[160px] shrink-0"
        aria-label="Publicidade"
      >
        <div className="sticky" style={{ top: stickyTop }}>
          <span
            className="block text-center mb-2"
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8a94a6",
            }}
          >
            Publicidade
          </span>
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            data-track="sponsor_aside_click"
            data-track-label={sponsor.name}
            aria-label={`Anúncio: ${sponsor.name}`}
            className="group relative block w-[160px] h-[600px] rounded-xl overflow-hidden hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            style={{
              backgroundImage: `url(${sponsor.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: "#f7f7f7",
              border: "1px solid #eceef2",
              boxShadow: "0 6px 20px rgba(16,24,40,0.08)",
            }}
          >
            <div
              className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
              style={{
                background:
                  "linear-gradient(180deg, rgba(10,14,26,0) 0%, rgba(10,14,26,0.55) 50%, rgba(10,14,26,0.92) 100%)",
              }}
            >
              <p
                className="text-[9px] font-bold uppercase tracking-[0.25em] mb-2"
                style={{ color: "#F6811E" }}
              >
                Patrocinador
              </p>
              <h4
                className="text-white font-extrabold leading-tight mb-1.5"
                style={{
                  fontSize: 15,
                  textShadow: "0 1px 8px rgba(0,0,0,0.45)",
                }}
              >
                {sponsor.name}
              </h4>
              {sponsor.description && (
                <p
                  className="text-white/85 text-[11px] leading-snug mb-3 line-clamp-4"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.35)" }}
                >
                  {sponsor.description}
                </p>
              )}
              {sponsor.url && (
                <span
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-[11px] font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #F6811E 0%, #ff9a3f 100%)",
                    color: "#fff",
                    boxShadow: "0 4px 14px rgba(246,129,30,0.45)",
                  }}
                >
                  Visitar site
                  <ExternalLink size={11} />
                </span>
              )}
            </div>
          </a>
        </div>
      </aside>

      {/* MOBILE — native card horizontal */}
      <div className="xl:hidden block" aria-label="Publicidade">
        <span
          className="block mb-2"
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8a94a6",
          }}
        >
          Publicidade
        </span>
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          data-track="sponsor_native_click"
          data-track-label={sponsor.name}
          aria-label={`Anúncio: ${sponsor.name}`}
          className="flex w-full rounded-2xl overflow-hidden"
          style={{
            background: "#fff",
            border: "1px solid #eceef2",
            boxShadow: "0 8px 24px rgba(16,24,40,0.08)",
          }}
        >
          {/* Banner em strip vertical à esquerda */}
          <div
            className="flex-shrink-0"
            style={{
              width: 96,
              minHeight: 152,
              background: `#f7f7f7 url(${sponsor.image}) center/cover no-repeat`,
              borderRight: "1px solid #eceef2",
            }}
          />
          {/* Conteúdo à direita */}
          <div className="flex-1 min-w-0 p-4 flex flex-col">
            <p
              className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1"
              style={{ color: "#F6811E" }}
            >
              Patrocinador
            </p>
            <h4
              className="text-[15px] font-extrabold leading-tight mb-1"
              style={{ color: "#0e1a2b" }}
            >
              {sponsor.name}
            </h4>
            {sponsor.description && (
              <p
                className="text-[12px] leading-snug line-clamp-2 mb-3 flex-1"
                style={{ color: "#5a6577" }}
              >
                {sponsor.description}
              </p>
            )}
            {sponsor.url && (
              <span
                className="inline-flex items-center gap-1.5 self-start text-[12px] font-bold"
                style={{ color: "#0059AB" }}
              >
                Visitar site
                <ExternalLink size={12} />
              </span>
            )}
          </div>
        </a>
      </div>

    </>
  );
}

"use client";

import { useEffect, useState } from "react";

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

export default function SponsorSideRail({
  slot = "side",
  side = "right",
}: {
  slot?: string;
  side?: "right" | "left";
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
        target: "sponsor_siderail_view",
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
    <aside
      className={`sponsor-side-rail sponsor-side-rail-${side}`}
      aria-label="Publicidade"
    >
      <span className="sponsor-side-rail-label">Publicidade</span>
      <a
        href={href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        data-track="sponsor_siderail_click"
        data-track-label={sponsor.name}
        className="sponsor-side-rail-banner"
        aria-label={`Anúncio: ${sponsor.name}`}
        style={{ backgroundImage: `url(${sponsor.image})` }}
      />
      <style jsx>{`
        .sponsor-side-rail {
          /* Só aparece em telas realmente largas, onde sobra espaço ao lado do conteúdo (max-w-7xl = 1280px) */
          display: none;
          position: fixed;
          top: 50%;
          transform: translateY(-50%);
          z-index: 30;
          width: 160px;
          pointer-events: none;
          animation: side-in 0.45s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sponsor-side-rail-right {
          right: max(12px, calc((100vw - 1280px) / 2 - 172px));
        }
        .sponsor-side-rail-left {
          left: max(12px, calc((100vw - 1280px) / 2 - 172px));
        }
        @media (min-width: 1440px) {
          .sponsor-side-rail {
            display: block;
          }
        }
        @keyframes side-in {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
        .sponsor-side-rail-label {
          display: block;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #8a94a6;
          margin-bottom: 6px;
          text-align: center;
          pointer-events: auto;
        }
        .sponsor-side-rail-banner {
          display: block;
          width: 160px;
          height: 600px;
          background-size: cover;
          background-position: center;
          background-color: #f7f7f7;
          border-radius: 12px;
          border: 1px solid #eceef2;
          box-shadow: 0 6px 20px rgba(16, 24, 40, 0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          pointer-events: auto;
        }
        .sponsor-side-rail-banner:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(16, 24, 40, 0.14);
        }
      `}</style>
    </aside>
  );
}

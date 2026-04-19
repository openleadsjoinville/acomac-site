"use client";

import { useEffect, useState } from "react";
import { Sparkles, X, ExternalLink } from "lucide-react";

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

const DISMISS_KEY = "sponsor_rail_dismissed";

export default function SponsorRail({ slot = "rail" }: { slot?: string }) {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Respeita "fechou nesta sessão"
    if (typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY)) {
      setDismissed(true);
      return;
    }
    loadSponsors().then((all) => setSponsor(pickWeighted(all)));
  }, []);

  // Faz o rail aparecer depois do usuário rolar um pouco (bom UX)
  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => {
      if (window.scrollY > 240) setVisible(true);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  // Registra impressão uma vez por sessão + sponsor
  useEffect(() => {
    if (!sponsor || !visible) return;
    const key = `sponsor_view_${sponsor.id}_rail`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "click",
        target: "sponsor_rail_view",
        label: sponsor.name,
        path: typeof location !== "undefined" ? location.pathname : "",
      }),
      keepalive: true,
    }).catch(() => {});
  }, [sponsor, visible]);

  if (dismissed || !sponsor || !visible) return null;

  const isExternal = sponsor.url && /^https?:\/\//i.test(sponsor.url);
  const href = sponsor.url || "#";

  function close(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <aside
      aria-label="Patrocinador"
      className="sponsor-rail"
    >
      <div className="sponsor-rail-card">
        <button
          onClick={close}
          aria-label="Fechar"
          className="sponsor-rail-close"
          title="Fechar"
        >
          <X size={12} />
        </button>
        <span className="sponsor-rail-tag">
          <Sparkles size={10} />
          Patrocinado
        </span>
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          data-track="sponsor_rail_click"
          data-track-label={sponsor.name}
          className="sponsor-rail-banner"
          style={{ backgroundImage: `url(${sponsor.image})` }}
        >
          <span className="sr-only">{sponsor.name}</span>
        </a>
        <div className="sponsor-rail-body">
          <p className="sponsor-rail-eyebrow">Apoia este conteúdo</p>
          <p className="sponsor-rail-title">{sponsor.name}</p>
          {sponsor.description && (
            <p className="sponsor-rail-desc">{sponsor.description}</p>
          )}
          {sponsor.url && (
            <a
              href={href}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              data-track="sponsor_rail_click"
              data-track-label={sponsor.name}
              className="sponsor-rail-cta"
            >
              Visitar
              {isExternal && <ExternalLink size={11} />}
            </a>
          )}
        </div>
      </div>

      <style jsx>{`
        .sponsor-rail {
          position: fixed;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 40;
          pointer-events: none;
          display: none;
          animation: sr-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (min-width: 1200px) {
          .sponsor-rail {
            display: block;
          }
        }
        @keyframes sr-in {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
        .sponsor-rail-card {
          position: relative;
          width: 200px;
          background: #fff;
          border: 1px solid #eceef2;
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 14px 40px rgba(16, 24, 40, 0.12);
          pointer-events: auto;
        }
        .sponsor-rail-close {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 22px;
          height: 22px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.92);
          color: #0e1a2b;
          backdrop-filter: blur(6px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          z-index: 2;
          cursor: pointer;
          transition: all 0.15s;
        }
        .sponsor-rail-close:hover {
          background: #fff;
          transform: scale(1.08);
        }
        .sponsor-rail-tag {
          position: absolute;
          top: 10px;
          left: 10px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.55);
          color: #fff;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          backdrop-filter: blur(6px);
          z-index: 2;
        }
        .sponsor-rail-banner {
          display: block;
          aspect-ratio: 1 / 1;
          background-size: cover;
          background-position: center;
          background-color: #f7f7f7;
        }
        .sponsor-rail-body {
          padding: 12px 14px 14px;
        }
        .sponsor-rail-eyebrow {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #8a94a6;
          margin-bottom: 4px;
        }
        .sponsor-rail-title {
          font-size: 13px;
          font-weight: 700;
          color: #0e1a2b;
          line-height: 1.25;
          margin-bottom: 4px;
        }
        .sponsor-rail-desc {
          font-size: 11px;
          color: #5a6577;
          line-height: 1.4;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .sponsor-rail-cta {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          color: #F6811E;
        }
        .sponsor-rail-cta:hover {
          text-decoration: underline;
        }
      `}</style>
    </aside>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

type Sponsor = {
  id: string;
  name: string;
  image: string;
  url: string;
  description: string;
  weight: number;
};

let cachedSponsors: Sponsor[] | null = null;
let cachePromise: Promise<Sponsor[]> | null = null;

async function loadSponsors(): Promise<Sponsor[]> {
  if (cachedSponsors) return cachedSponsors;
  if (cachePromise) return cachePromise;
  cachePromise = fetch("/api/public/sponsors")
    .then((r) => (r.ok ? r.json() : []))
    .then((data) => {
      cachedSponsors = Array.isArray(data) ? data : [];
      return cachedSponsors;
    })
    .catch(() => {
      cachedSponsors = [];
      return cachedSponsors;
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

export default function SponsorBanner({
  slot = "default",
}: {
  slot?: string;
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
        target: "sponsor_view",
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
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      data-track="sponsor_click"
      data-track-label={sponsor.name}
      aria-label={`Anúncio: ${sponsor.name}`}
      className="block group relative overflow-hidden rounded-2xl"
      style={{
        boxShadow: "0 8px 24px rgba(16,24,40,0.08)",
      }}
    >
      <div
        style={{
          aspectRatio: "1 / 1",
          background: `url(${sponsor.image}) center/cover`,
          width: "100%",
        }}
      />
      <span
        className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.12em]"
        style={{
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          backdropFilter: "blur(8px)",
        }}
      >
        <Sparkles size={10} />
        Patrocinado
      </span>
    </a>
  );
}

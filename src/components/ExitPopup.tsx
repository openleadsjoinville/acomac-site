"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export type ExitPopupConfig = {
  enabled: boolean;
  title: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
};

export default function ExitPopup({ config, pageKey }: { config: ExitPopupConfig; pageKey: string }) {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(true);

  useEffect(() => {
    if (!config.enabled) return;
    const storageKey = `acomac_exit_${pageKey}`;
    // Show only once per session
    const already = sessionStorage.getItem(storageKey);
    if (already) return;
    setSeen(false);

    let armed = false;
    const arm = setTimeout(() => {
      armed = true;
    }, 6000); // arm after 6s on page

    const onMouseLeave = (e: MouseEvent) => {
      if (!armed) return;
      if (e.clientY <= 0) {
        setOpen(true);
        sessionStorage.setItem(storageKey, "1");
        document.removeEventListener("mouseleave", onMouseLeave);
      }
    };

    // Mobile: fallback via scroll-up detection after time on page
    let lastY = window.scrollY;
    const onScroll = () => {
      if (!armed) return;
      if (window.scrollY < lastY - 40 && window.scrollY < 200) {
        // user scrolled up near top, show popup
        setOpen(true);
        sessionStorage.setItem(storageKey, "1");
        document.removeEventListener("scroll", onScroll);
      }
      lastY = window.scrollY;
    };

    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(arm);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("scroll", onScroll);
    };
  }, [config.enabled, pageKey]);

  if (!config.enabled || seen || !open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl grid md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-slate-700 hover:bg-white shadow"
          aria-label="Fechar"
        >
          <X size={16} />
        </button>

        {/* Left: image */}
        <div className="bg-slate-100 relative min-h-[240px] md:min-h-[340px]">
          {config.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={config.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-white"
              style={{ background: "linear-gradient(135deg, #0059AB, #003d7a)" }}
            >
              <span className="text-6xl font-black opacity-30">ACOMAC</span>
            </div>
          )}
        </div>

        {/* Right: text */}
        <div className="p-7 md:p-9 flex flex-col justify-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            {config.title || "Antes de sair..."}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {config.description}
          </p>
          {config.ctaLabel && config.ctaHref && (
            <a
              href={config.ctaHref}
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-bold text-sm transition-colors"
              style={{ backgroundColor: "#F6811E" }}
            >
              {config.ctaLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

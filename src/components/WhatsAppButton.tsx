"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { whatsappLink } from "@/lib/utils";

export default function WhatsAppButton({
  number,
  enabled,
  title,
  text,
  message,
}: {
  number: string;
  enabled: boolean;
  title: string;
  text: string;
  message: string;
}) {
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!enabled || dismissed) return;
    const t = setTimeout(() => setShowBubble(true), 4000);
    return () => clearTimeout(t);
  }, [enabled, dismissed]);

  if (!enabled) return null;

  const href = whatsappLink(number, message);

  return (
    <div className="fixed bottom-24 right-4 lg:bottom-5 lg:right-5 z-[60] flex flex-col items-end gap-3">
      {/* Bubble */}
      {showBubble && (
        <div
          className="relative bg-white rounded-2xl shadow-xl border border-slate-200 max-w-[260px] p-3.5 pr-8 animate-in"
          style={{
            animation: "wa-bubble-in 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <style>{`
            @keyframes wa-bubble-in {
              from { opacity: 0; transform: translateY(8px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>
          <button
            onClick={() => {
              setShowBubble(false);
              setDismissed(true);
            }}
            aria-label="Fechar"
            className="absolute top-2 right-2 w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X size={12} />
          </button>
          <a href={href} target="_blank" rel="noopener noreferrer" className="block">
            <p className="text-xs font-bold text-slate-900">{title}</p>
            <p className="text-xs text-slate-600 mt-0.5 leading-snug">{text}</p>
          </a>
          {/* Tail pointing down-right towards the button */}
          <div
            className="absolute -bottom-1.5 right-5 w-3 h-3 rotate-45 bg-white border-r border-b border-slate-200"
          />
        </div>
      )}

      {/* Round WhatsApp button */}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative w-14 h-14 flex items-center justify-center rounded-full shadow-xl transition-transform hover:scale-105"
        style={{ backgroundColor: "#25D366" }}
        aria-label="Fale conosco pelo WhatsApp"
        data-track="whatsapp_floating"
      >
        {/* Pulse ring */}
        <span
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: "#25D366",
            animation: "wa-pulse 2.2s ease-out infinite",
          }}
        />
        <style>{`
          @keyframes wa-pulse {
            0% { transform: scale(1); opacity: 0.5; }
            80% { transform: scale(1.6); opacity: 0; }
            100% { transform: scale(1.6); opacity: 0; }
          }
        `}</style>
        {/* Real WhatsApp logo (SVG) */}
        <svg
          viewBox="0 0 32 32"
          width="28"
          height="28"
          className="relative z-10"
          fill="white"
          aria-hidden
        >
          <path d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.8 5.6 2.2 8L.2 31.6l7.8-2.4c2.3 1.2 4.9 1.9 7.6 1.9h.3C24.4 31 31.4 24 31.4 15.4 31.4 11.3 29.8 7.5 26.9 4.6 24 1.7 20.1.4 16 .4zm0 28.3c-2.5 0-4.9-.7-7-2l-.5-.3-4.6 1.4 1.4-4.5-.3-.5c-1.4-2.3-2.2-4.8-2.2-7.5 0-7 5.7-12.7 12.7-12.7 3.4 0 6.6 1.3 9 3.7 2.4 2.4 3.7 5.6 3.7 9C28.7 23.5 23 28.7 16 28.7zm7-9.2c-.4-.2-2.3-1.1-2.6-1.3-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.2-.8 0-.4-.2-1.7-.6-3.2-1.9-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.3 0-.5-.1-.7-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.5-.3.4-1.2 1.2-1.2 3s1.2 3.5 1.4 3.7c.2.3 2.4 3.6 5.8 5.1.8.3 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.3-.9 2.6-1.9.3-.9.3-1.7.2-1.9-.1-.2-.3-.3-.7-.5z" />
        </svg>
      </a>
    </div>
  );
}

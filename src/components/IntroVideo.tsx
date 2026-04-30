"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animação de entrada mostrada a cada carregamento da home.
 * - Render por padrão no SSR (evita flash do conteúdo antes do overlay aparecer).
 * - Sem persistência de sessão: toca a vinheta TODA vez que a home carrega.
 * - Barra de progresso moderna sincronizada com o tempo do vídeo.
 */
export default function IntroVideo({
  webm = "/intro-acomac.webm?v=2",
  mp4 = "/intro-acomac.mp4?v=2",
}: {
  webm?: string;
  mp4?: string;
} = {}) {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll enquanto ativo
  useEffect(() => {
    if (dismissed) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [dismissed]);

  // Sincronizar barra de progresso com tempo do vídeo
  useEffect(() => {
    const v = videoRef.current;
    if (!v || dismissed) return;
    const onTime = () => {
      if (v.duration > 0) {
        setProgress(Math.min(100, (v.currentTime / v.duration) * 100));
      }
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, [dismissed]);

  function dismiss() {
    if (fading) return;
    setProgress(100);
    setFading(true);
    setTimeout(() => setDismissed(true), 520);
  }

  if (dismissed) return null;

  return (
    <div
      className="acomac-intro fixed inset-0 z-[200] flex items-center justify-center"
      style={{
        background: "#ffffff",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.5s ease",
        // Antes da hidratação: não tem onEnded; deixa o vídeo rolar via autoplay
        pointerEvents: fading ? "none" : "auto",
      }}
      aria-hidden={fading || !mounted}
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={dismiss}
          onError={dismiss}
          className="w-[240px] sm:w-[320px] md:w-[360px]"
          style={{
            aspectRatio: "16 / 9",
            objectFit: "contain",
            background: "#ffffff",
          }}
        >
          <source src={webm} type="video/webm" />
          <source src={mp4} type="video/mp4" />
        </video>

        {/* Barra de progresso moderna */}
        <div className="w-[240px] sm:w-[320px] md:w-[360px]">
          <div
            className="relative w-full overflow-hidden rounded-full"
            style={{
              height: 3,
              background: "rgba(10,14,26,0.08)",
            }}
          >
            <div
              className="absolute left-0 top-0 bottom-0 rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  "linear-gradient(90deg, #F6811E 0%, #ff9a3f 60%, #ffb57a 100%)",
                boxShadow: "0 0 12px rgba(246,129,30,0.55)",
                transition: "width 0.2s ease-out",
              }}
            />
            {/* brilho que desliza na frente do fill */}
            <div
              className="absolute top-0 bottom-0 intro-bar-shimmer"
              style={{
                left: `calc(${progress}% - 32px)`,
                width: 64,
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.85), transparent)",
                transition: "left 0.2s ease-out",
                mixBlendMode: "overlay",
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-3">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.3em]"
              style={{ color: "#8a94a6" }}
            >
              Carregando
            </span>
            <span
              className="text-[10px] font-bold tabular-nums"
              style={{ color: "#0e1a2b" }}
            >
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

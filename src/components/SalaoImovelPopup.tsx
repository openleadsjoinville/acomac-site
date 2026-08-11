"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  MapPin,
  Ticket,
  X,
} from "lucide-react";

/**
 * Pop-up de campanha do 3º Salão do Imóvel de Joinville, realizado pela ACOMAC.
 * Aparece uma vez por sessão enquanto a campanha estiver na janela de datas
 * abaixo — passou de 23/08/2026, o componente para de renderizar sozinho e pode
 * ser removido do ClientSiteChrome no próximo deploy.
 */

// Janela da campanha (horário de Brasília)
const INICIO = Date.parse("2026-08-11T00:00:00-03:00");
const FIM = Date.parse("2026-08-23T23:59:59-03:00");

const SITE_SALAO = "https://www.salaodoimoveljoinville.com.br/";

/**
 * Trava só em memória: some a cada carregamento do site, então o pop-up
 * reaparece em toda visita nova (e em todo F5), mas não pisca de novo a cada
 * clique no menu — navegar entre páginas não é "entrar no site outra vez".
 */
let jaAbriuNestaNavegacao = false;

/** true enquanto a campanha estiver no ar — usado também para calar o exit popup */
export function campanhaSalaoAtiva(): boolean {
  const agora = Date.now();
  return agora >= INICIO && agora <= FIM;
}

type Logo = { nome: string; arquivo: string };

const GRUPOS: { titulo: string; logos: Logo[] }[] = [
  {
    titulo: "Realização oficial",
    logos: [{ nome: "ACOMAC Joinville", arquivo: "acomac.jpg" }],
  },
  {
    titulo: "Parceiros principais",
    logos: [
      { nome: "Prefeitura de Joinville", arquivo: "prefeitura.png" },
      { nome: "Sebrae-SC", arquivo: "sebrae.png" },
    ],
  },
  {
    titulo: "Patrocinadores",
    logos: [
      { nome: "Caixa Econômica Federal", arquivo: "caixa.jpeg" },
      { nome: "NORTHAUS", arquivo: "northaus.png" },
      { nome: "RÔGGA", arquivo: "rogga.png" },
    ],
  },
  {
    titulo: "Apoiadores",
    logos: [
      { nome: "ACIN", arquivo: "acin.jpeg" },
      { nome: "ACCA", arquivo: "acca.jpg" },
      { nome: "Creci-SC", arquivo: "creci.png" },
    ],
  },
];

export default function SalaoImovelPopup() {
  const [open, setOpen] = useState(false);
  const [entrando, setEntrando] = useState(false);

  const fechar = useCallback(() => {
    setEntrando(false);
    setTimeout(() => setOpen(false), 180);
  }, []);

  useEffect(() => {
    if (!campanhaSalaoAtiva()) return;
    if (jaAbriuNestaNavegacao) return;

    let cancelado = false;
    let timer: ReturnType<typeof setTimeout>;

    const abrir = () => {
      if (cancelado) return;
      jaAbriuNestaNavegacao = true;
      setOpen(true);
      requestAnimationFrame(() => setEntrando(true));
    };

    // Na home a vinheta de entrada (IntroVideo) cobre a tela — só aparecemos
    // depois que ela sai, senão o pop-up atropela o vídeo.
    const esperarIntro = (tentativas: number) => {
      if (cancelado) return;
      const introNaTela = document.querySelector(".acomac-intro");
      if (introNaTela && tentativas < 75) {
        timer = setTimeout(() => esperarIntro(tentativas + 1), 400);
        return;
      }
      timer = setTimeout(abrir, introNaTela ? 0 : 1200);
    };
    esperarIntro(0);

    return () => {
      cancelado = true;
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
    };
    document.addEventListener("keydown", onKey);
    const overflowAntes = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowAntes;
    };
  }, [open, fechar]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6"
      style={{
        background: "rgba(10,15,25,0.55)",
        backdropFilter: "blur(4px)",
        opacity: entrando ? 1 : 0,
        transition: "opacity 0.25s ease",
      }}
      onClick={fechar}
      role="dialog"
      aria-modal="true"
      aria-label="3º Salão do Imóvel de Joinville"
    >
      <div
        className="relative w-full max-w-[1040px] max-h-[92vh] overflow-y-auto rounded-3xl bg-white"
        style={{
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          transform: entrando ? "translateY(0) scale(1)" : "translateY(16px) scale(0.98)",
          transition: "transform 0.28s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={fechar}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "rgba(255,255,255,0.9)", color: "#555" }}
        >
          <X size={18} />
        </button>

        <div className="grid md:grid-cols-2">
          {/* Lado esquerdo — chamada */}
          <div className="p-7 sm:p-9 flex flex-col">
            <div className="relative h-9 w-[190px] mb-6">
              <Image
                src="/salao-imovel/logo-salao.png"
                alt="Salão do Imóvel — 3ª Edição em Joinville"
                fill
                sizes="190px"
                className="object-contain object-left"
              />
            </div>

            <span
              className="self-start inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-5"
              style={{ backgroundColor: "#FDEBDC", color: "#D2691E" }}
            >
              <Ticket size={12} />
              Entrada gratuita
            </span>

            <h2
              className="text-[30px] sm:text-[36px] font-extrabold leading-[1.05] tracking-tight mb-3"
              style={{ color: "#111" }}
            >
              3º Salão do Imóvel{" "}
              <span style={{ color: "#F6811E" }}>de Joinville</span>
            </h2>

            <p className="text-[15px] leading-relaxed mb-6" style={{ color: "#5a6472" }}>
              O maior encontro do mercado imobiliário do Litoral de Santa
              Catarina, <strong style={{ color: "#111" }}>realizado pela ACOMAC
              Joinville</strong>. Três dias reunindo construtoras, imobiliárias e
              bancos, com condições especiais para quem quer comprar o próprio
              imóvel.
            </p>

            <div className="space-y-2.5 mb-7">
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                style={{ backgroundColor: "#f7f8fa" }}
              >
                <CalendarDays size={16} style={{ color: "#F6811E" }} />
                <span className="text-[14px] font-semibold" style={{ color: "#222" }}>
                  21, 22 e 23 de agosto de 2026
                </span>
              </div>
              <div
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                style={{ backgroundColor: "#f7f8fa" }}
              >
                <MapPin size={16} style={{ color: "#F6811E" }} />
                <span className="text-[14px] font-semibold" style={{ color: "#222" }}>
                  Expocentro Edmundo Doubrawa — Joinville/SC
                </span>
              </div>
            </div>

            <ul className="space-y-2.5 mb-7">
              {[
                "Imóveis com condições abaixo da tabela",
                "Construtoras, imobiliárias e bancos no mesmo lugar",
                "Três dias de feira, com entrada gratuita",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: "#F6811E" }}
                  />
                  <span className="text-[14px] leading-snug" style={{ color: "#44505f" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap items-center gap-3">
              <a
                href={SITE_SALAO}
                target="_blank"
                rel="noopener noreferrer"
                data-track="salao_popup_cta"
                data-track-label="quero-visitar"
                onClick={fechar}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-[14px] font-bold text-white transition-transform duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#F6811E",
                  boxShadow: "0 8px 24px rgba(246,129,30,0.35)",
                }}
              >
                Quero visitar
                <ArrowRight size={16} />
              </a>
              <button
                onClick={fechar}
                className="text-[14px] font-semibold px-2 py-2 transition-colors"
                style={{ color: "#98a1ad" }}
              >
                Agora não
              </button>
            </div>
          </div>

          {/* Lado direito — arte + quem faz acontecer */}
          <div
            className="p-6 sm:p-7 flex flex-col gap-5"
            style={{
              background: "linear-gradient(160deg, #fff8f1 0%, #fdf1e4 100%)",
            }}
          >
            <div
              className="relative w-full aspect-[1200/630] rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.18)" }}
            >
              <Image
                src="/salao-imovel/banner-salao.png"
                alt="3º Salão do Imóvel de Joinville — 21 a 23 de agosto de 2026"
                fill
                sizes="(min-width:768px) 440px, 100vw"
                className="object-cover"
                priority
              />
            </div>

            <div className="space-y-4">
              {GRUPOS.map((grupo, i) => (
                <div key={grupo.titulo}>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2"
                    style={{ color: "#b08b6a" }}
                  >
                    {grupo.titulo}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {grupo.logos.map((logo) => (
                      <div
                        key={logo.arquivo}
                        className={`relative flex-1 rounded-xl bg-white ${
                          i === 0
                            ? "h-[104px] min-w-[220px]"
                            : "h-[86px] min-w-[132px]"
                        }`}
                        style={{ border: "1px solid rgba(0,0,0,0.06)" }}
                        title={logo.nome}
                      >
                        <Image
                          src={`/salao-imovel/${logo.arquivo}`}
                          alt={logo.nome}
                          fill
                          sizes="260px"
                          className="object-contain p-2.5"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

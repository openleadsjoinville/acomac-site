"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ArrowRight,
  Filter,
  Building2,
  Sparkles,
} from "lucide-react";
import ClientSiteChrome from "@/components/ClientSiteChrome";
import SponsorAside from "@/components/public/SponsorAside";
import {
  AssociateCard,
  AssociateMapModal,
  type AssociateItem,
} from "@/components/public/AssociateCard";
import { usePageContent } from "@/hooks/usePageContent";
import { useCollection } from "@/hooks/useCollection";
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

// Associados são buscados de /api/public/associates (apenas com status APPROVED)

// Detecta a contagem de colunas do grid de cards conforme breakpoint do Tailwind
// (grid md:grid-cols-2 xl:grid-cols-3): <768 = 1, 768-1280 = 2, >=1280 = 3.
function useColumnCount(): number {
  const [cols, setCols] = useState(3);
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setCols(w >= 1280 ? 3 : w >= 768 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  return cols;
}

export default function ConectaAssociadosPage() {
  const page = usePageContent("conecta-associados");
  const hero = page?.hero;
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todos");
  const [busca, setBusca] = useState("");
  const [mapFor, setMapFor] = useState<AssociateItem | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const cols = useColumnCount();

  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: filtroRef, inView: filtroInView } = useInView(0.12);
  const { ref: gridRef, inView: gridInView } = useInView(0.05);

  const associadosData = useCollection<AssociateItem>("/api/public/associates");
  const associados = useMemo<AssociateItem[]>(
    () => associadosData ?? [],
    [associadosData]
  );

  const categorias = useMemo(
    () => [
      "Todos",
      ...Array.from(
        new Set(associados.map((a) => a.segment ?? ""))
      ).filter(Boolean),
    ],
    [associados]
  );

  const filtrados = useMemo(() => {
    return associados.filter((a) => {
      const matchCat =
        categoriaAtiva === "Todos" || a.segment === categoriaAtiva;
      const termo = busca.trim().toLowerCase();
      const name = (a.displayName ?? a.companyName).toLowerCase();
      const desc = (a.displayDescription ?? a.description ?? "").toLowerCase();
      const prod = (a.products ?? "").toLowerCase();
      const city = (a.city ?? "").toLowerCase();
      const matchBusca =
        termo === "" ||
        name.includes(termo) ||
        desc.includes(termo) ||
        (a.segment ?? "").toLowerCase().includes(termo) ||
        prod.includes(termo) ||
        city.includes(termo);
      return matchCat && matchBusca;
    });
  }, [categoriaAtiva, busca, associados]);

  // Filtros e mudança de colunas remapeiam os índices → indices de linha
  // expandidas viram inconsistentes. Reseta pra não revelar/ocultar errado.
  useEffect(() => {
    setExpandedRows(new Set());
  }, [categoriaAtiva, busca, cols]);

  const toggleRow = (row: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(row)) next.delete(row);
      else next.add(row);
      return next;
    });
  };

  return (
    <>
      <ClientSiteChrome pageKey="conecta-associados" hideCtaBanner>

      <main>
        {/* ═══════ HERO ═══════ */}
        <section
          className="relative pt-24 pb-20 overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #002952 0%, #004a94 35%, #0059AB 60%, #0068c7 100%)",
          }}
        >
          {/* Grid pattern — same as PartnersSection / Hero */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          {/* Glow */}
          <div
            className="absolute top-[10%] right-[5%] w-[350px] h-[350px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(246,129,30,0.10) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div
            ref={heroRef}
            className="relative z-10 max-w-7xl mx-auto px-6"
            style={fadeIn(heroInView)}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-[3px] rounded-full"
                style={{ backgroundColor: "#F6811E" }}
              />
              <span
                className="text-[11px] font-bold uppercase tracking-[0.25em]"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {hero?.badge ?? "Conecta Associados"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.02] text-white max-w-4xl mb-6">
              {hero?.title ?? (
                <>
                  Conecta{" "}
                  <span className="relative inline-block" style={{ color: "#F6811E" }}>
                    Associados
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                      style={{ backgroundColor: "#F6811E", opacity: 0.5 }}
                    />
                  </span>
                </>
              )}
            </h1>

            <p
              className="text-base md:text-lg leading-relaxed max-w-2xl"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              {hero?.subtitle ??
                "Uma rede de empresas associadas à ACOMAC em Santa Catarina. Explore, filtre por categoria e entre em contato diretamente com quem faz parte da nossa associação."}
            </p>
          </div>
        </section>

        {/* ═══════ FILTROS + GRID ═══════ */}
        <section className="relative py-20 bg-white">
          <div className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-12">
            <div className="min-w-0">
            {/* Busca + chips */}
            <div ref={filtroRef} style={fadeIn(filtroInView)}>
              {/* Search input */}
              <div className="relative max-w-xl mb-8">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#888" }}
                />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Buscar empresa, categoria ou descrição..."
                  className="form-input w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none"
                  style={{
                    border: "1px solid #e5e5e5",
                    color: "#222",
                    backgroundColor: "#fafafa",
                  }}
                />
              </div>

              {/* Chips */}
              <div className="flex items-center gap-2 mb-3">
                <Filter size={14} style={{ color: "#888" }} />
                <span
                  className="text-[11px] font-bold uppercase tracking-[0.2em]"
                  style={{ color: "#888" }}
                >
                  Filtrar por categoria
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categorias.map((cat) => {
                  const ativa = cat === categoriaAtiva;
                  return (
                    <button
                      key={cat}
                      onClick={() => setCategoriaAtiva(cat)}
                      className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200"
                      style={{
                        backgroundColor: ativa ? "#0059AB" : "#f0f0f0",
                        color: ativa ? "#ffffff" : "#444444",
                        border: ativa
                          ? "1px solid #0059AB"
                          : "1px solid transparent",
                        boxShadow: ativa
                          ? "0 4px 16px rgba(0,89,171,0.25)"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!ativa) {
                          e.currentTarget.style.backgroundColor = "#e5e5e5";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!ativa) {
                          e.currentTarget.style.backgroundColor = "#f0f0f0";
                        }
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Result count */}
              <p
                className="text-sm mt-6"
                style={{ color: "#777" }}
              >
                <strong style={{ color: "#111" }}>{filtrados.length}</strong>{" "}
                {filtrados.length === 1 ? "associado encontrado" : "associados encontrados"}
                {categoriaAtiva !== "Todos" && (
                  <> em <strong style={{ color: "#0059AB" }}>{categoriaAtiva}</strong></>
                )}
              </p>
            </div>

            {/* Grid */}
            {filtrados.length === 0 ? (
              <div
                className="mt-12 rounded-2xl p-12 text-center"
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px dashed #e0e0e0",
                }}
              >
                <div
                  className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(0,89,171,0.08)" }}
                >
                  <Building2 size={22} style={{ color: "#0059AB" }} />
                </div>
                <h3
                  className="text-lg font-bold mb-1.5"
                  style={{ color: "#111" }}
                >
                  Nenhum associado encontrado
                </h3>
                <p className="text-sm" style={{ color: "#777" }}>
                  Tente ajustar a busca ou selecionar outra categoria.
                </p>
              </div>
            ) : (
              <div
                ref={gridRef}
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10 items-stretch"
              >
                {filtrados.map((a, i) => {
                  const row = Math.floor(i / cols);
                  return (
                    <div
                      key={a.id}
                      className="h-full"
                      style={staggerStyle(gridInView, i, 0.04)}
                    >
                      <AssociateCard
                        item={a}
                        onOpenMap={() => setMapFor(a)}
                        expanded={expandedRows.has(row)}
                        onToggleExpand={() => toggleRow(row)}
                      />
                    </div>
                  );
                })}
              </div>
            )}

            </div>
            <SponsorAside slot="conecta-associados" />
          </div>
        </section>

        {/* CTA: quero me associar */}
        <section className="max-w-5xl mx-auto px-6 pb-24">
          <div
            className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-center"
            style={{
              background:
                "linear-gradient(135deg, #002952 0%, #0059AB 60%, #0068c7 100%)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, rgba(246,129,30,0.2), transparent 40%)",
              }}
            />
            <div className="relative z-10">
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded-full mb-5"
                style={{ background: "rgba(255,255,255,0.12)", color: "#F6811E" }}
              >
                <Sparkles size={12} />
                Faça parte
              </span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                Sua empresa no Conecta Associados
              </h3>
              <p className="text-base md:text-lg max-w-2xl mx-auto mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
                Exclusivo para associados ACOMAC. Se a sua empresa já é associada, preencha o cadastro rápido — após a aprovação, seu perfil aparece aqui e fica visível para toda a rede.
              </p>
              <a
                href="/participe-do-conecta-associados"
                data-track="cta_associar"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-white transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  backgroundColor: "#F6811E",
                  boxShadow: "0 8px 28px rgba(246,129,30,0.4)",
                }}
              >
                Iniciar meu cadastro
                <ArrowRight size={18} />
              </a>
              <p className="text-xs mt-5" style={{ color: "rgba(255,255,255,0.55)" }}>
                Leva menos de 3 minutos · Sem compromisso
              </p>
            </div>
          </div>
        </section>
      </main>

      </ClientSiteChrome>

      {mapFor && (
        <AssociateMapModal item={mapFor} onClose={() => setMapFor(null)} />
      )}
    </>
  );
}

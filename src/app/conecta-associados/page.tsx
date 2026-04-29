"use client";

import { useMemo, useState } from "react";
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
import { useInView, fadeIn, staggerStyle } from "@/hooks/useAnimations";

const LOGO_PARAMS = "?w=400&h=400&fit=crop&q=80&auto=format";
const COVER_PARAMS = "?w=1200&h=600&fit=crop&q=80&auto=format";

const associados: AssociateItem[] = [
  {
    id: "demo-1",
    companyName: "Construtotal Materiais",
    displayName: null,
    description:
      "Loja completa de materiais básicos, cimento, argamassa e estruturas para obras residenciais e comerciais. Atendimento técnico consultivo e entrega em toda região.",
    displayDescription: null,
    logoUrl: `https://images.unsplash.com/photo-1541888946425-d81bb19240f5${LOGO_PARAMS}`,
    displayLogo: null,
    coverImage: `https://images.unsplash.com/photo-1504307651254-35680f356dfd${COVER_PARAMS}`,
    city: "Joinville",
    neighborhood: "Bucarein",
    address: "Rua das Obras, 1250",
    state: "SC",
    phone: "(47) 3435-1100",
    whatsapp: "5547988880001",
    email: "contato@construtotal.com.br",
    hours: "Seg–Sex 8h–18h · Sáb 8h–12h",
    products:
      "Cimento, Argamassa, Areia, Brita, Blocos, Vergalhões, Telhas",
    yearsInMarket: 18,
    segment: "Material de Construção",
    website: "construtotal.com.br",
    instagram: "construtotalmateriais",
    facebook: null,
  },
  {
    id: "demo-2",
    companyName: "Eletro Sul Componentes",
    displayName: null,
    description:
      "Fios, cabos, disjuntores e materiais elétricos de alta performance com as principais marcas do mercado. Projetos sob medida e pronta entrega.",
    displayDescription: null,
    logoUrl: `https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7${LOGO_PARAMS}`,
    displayLogo: null,
    coverImage: `https://images.unsplash.com/photo-1558449028-b53a39d100fc${COVER_PARAMS}`,
    city: "Joinville",
    neighborhood: "América",
    address: "Rua Blumenau, 480",
    state: "SC",
    phone: "(47) 3028-4420",
    whatsapp: "5547988880002",
    email: "vendas@eletrosul.com.br",
    hours: "Seg–Sex 8h–18h30 · Sáb 8h–13h",
    products:
      "Fios, Cabos, Disjuntores, Tomadas, Lâmpadas, Quadros, Eletrocalhas",
    yearsInMarket: 12,
    segment: "Elétrica",
    website: "eletrosul.com.br",
    instagram: "eletrosulcomponentes",
    facebook: null,
  },
  {
    id: "demo-3",
    companyName: "Hidro Flux Soluções",
    displayName: null,
    description:
      "Especializada em tubos, conexões, caixas d'água e sistemas completos de encanamento para obras de todos os portes. Estoque técnico e suporte a encanadores.",
    displayDescription: null,
    logoUrl: `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab${LOGO_PARAMS}`,
    displayLogo: null,
    coverImage: `https://images.unsplash.com/photo-1581091226825-a6a2a5aee158${COVER_PARAMS}`,
    city: "Araquari",
    neighborhood: "Centro",
    address: "Av. Getúlio Vargas, 760",
    state: "SC",
    phone: "(47) 3373-6650",
    whatsapp: "5547988880003",
    email: "atendimento@hidroflux.com.br",
    hours: "Seg–Sex 7h30–18h · Sáb 8h–12h",
    products:
      "Tubos PVC, Conexões, Caixas d'água, Registros, Válvulas, Bombas",
    yearsInMarket: 9,
    segment: "Hidráulica",
    website: null,
    instagram: "hidrofluxsolucoes",
    facebook: null,
  },
  {
    id: "demo-4",
    companyName: "Cores & Tons Tintas",
    displayName: null,
    description:
      "Linha completa de tintas imobiliárias, texturas, vernizes e revestimentos decorativos com atendimento consultivo e máquina de tintometria.",
    displayDescription: null,
    logoUrl: `https://images.unsplash.com/photo-1562259949-e8e7689d7828${LOGO_PARAMS}`,
    displayLogo: null,
    coverImage: `https://images.unsplash.com/photo-1562259949-e8e7689d7828${COVER_PARAMS}`,
    city: "Joinville",
    neighborhood: "Santo Antônio",
    address: "Rua dos Pintores, 330",
    state: "SC",
    phone: "(47) 3455-2277",
    whatsapp: "5547988880004",
    email: "ola@corestons.com.br",
    hours: "Seg–Sex 8h–18h · Sáb 8h30–13h",
    products:
      "Tintas acrílicas, Esmalte, Textura, Verniz, Massa corrida, Selador",
    yearsInMarket: 15,
    segment: "Tintas e Acabamentos",
    website: "corestons.com.br",
    instagram: "corestonstintas",
    facebook: null,
  },
  {
    id: "demo-5",
    companyName: "Ferragem Central",
    displayName: null,
    description:
      "Ferramentas manuais, elétricas e industriais. Linha profissional para marceneiros, eletricistas e construtores com assistência técnica autorizada.",
    displayDescription: null,
    logoUrl: `https://images.unsplash.com/photo-1504148455328-c376907d081c${LOGO_PARAMS}`,
    displayLogo: null,
    coverImage: `https://images.unsplash.com/photo-1530124566582-a618bc2615dc${COVER_PARAMS}`,
    city: "Jaraguá do Sul",
    neighborhood: "Centro",
    address: "Rua Reinoldo Rau, 230",
    state: "SC",
    phone: "(47) 3274-8910",
    whatsapp: "5547988880005",
    email: "comercial@ferragemcentral.com.br",
    hours: "Seg–Sex 8h–18h · Sáb 8h–12h30",
    products:
      "Furadeiras, Parafusadeiras, Serras, EPIs, Kits, Chaves, Fixadores",
    yearsInMarket: 22,
    segment: "Ferramentas",
    website: "ferragemcentral.com.br",
    instagram: "ferragemcentralsc",
    facebook: null,
  },
  {
    id: "demo-6",
    companyName: "Madeireira Três Pinheiros",
    displayName: null,
    description:
      "Madeiras nobres, compensados, MDF e estruturas para telhados. Corte sob medida, entrega regional e atendimento a construtoras.",
    displayDescription: null,
    logoUrl: `https://images.unsplash.com/photo-1504307651254-35680f356dfd${LOGO_PARAMS}`,
    displayLogo: null,
    coverImage: `https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8${COVER_PARAMS}`,
    city: "São Bento do Sul",
    neighborhood: "Centenário",
    address: "BR-280, km 62",
    state: "SC",
    phone: "(47) 3631-0045",
    whatsapp: "5547988880006",
    email: "madeireira@trespinheiros.com.br",
    hours: "Seg–Sex 7h30–17h30 · Sáb 8h–11h30",
    products:
      "Compensados, MDF, Pinus, Eucalipto, Ripas, Caibros, Telhas shingle",
    yearsInMarket: 27,
    segment: "Madeira",
    website: "trespinheiros.com.br",
    instagram: null,
    facebook: "madeireiratrespinheiros",
  },
  {
    id: "demo-7",
    companyName: "AquaLife Piscinas",
    displayName: null,
    description:
      "Piscinas pré-moldadas, produtos de tratamento, bombas, filtros e acessórios para lazer residencial e condomínios. Assistência técnica especializada.",
    displayDescription: null,
    logoUrl: `https://images.unsplash.com/photo-1519167758481-83f550bb49b3${LOGO_PARAMS}`,
    displayLogo: null,
    coverImage: `https://images.unsplash.com/photo-1540541338287-41700207dee6${COVER_PARAMS}`,
    city: "Balneário Camboriú",
    neighborhood: "Centro",
    address: "Av. Brasil, 1500",
    state: "SC",
    phone: "(47) 3367-9912",
    whatsapp: "5547988880007",
    email: "vendas@aqualifepiscinas.com.br",
    hours: "Seg–Sex 9h–18h · Sáb 9h–13h",
    products:
      "Piscinas prontas, Bombas, Filtros, Cloro, Aquecedores, Iluminação",
    yearsInMarket: 11,
    segment: "Piscinas",
    website: "aqualifepiscinas.com.br",
    instagram: "aqualifepiscinasbc",
    facebook: null,
  },
  {
    id: "demo-8",
    companyName: "VidroMax Joinville",
    displayName: null,
    description:
      "Vidros temperados, box para banheiro, espelhos, fachadas e esquadrias de alumínio com instalação profissional e garantia estendida.",
    displayDescription: null,
    logoUrl: `https://images.unsplash.com/photo-1487958449943-2429e8be8625${LOGO_PARAMS}`,
    displayLogo: null,
    coverImage: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4${COVER_PARAMS}`,
    city: "Joinville",
    neighborhood: "Atiradores",
    address: "Rua XV de Novembro, 2100",
    state: "SC",
    phone: "(47) 3422-5588",
    whatsapp: "5547988880008",
    email: "atendimento@vidromax.com.br",
    hours: "Seg–Sex 8h–18h · Sáb 8h–12h",
    products:
      "Box banheiro, Espelhos, Fachadas, Esquadrias, Guarda-corpos, Coberturas",
    yearsInMarket: 16,
    segment: "Vidraçaria",
    website: "vidromax.com.br",
    instagram: "vidromaxjoinville",
    facebook: null,
  },
  {
    id: "demo-9",
    companyName: "Solaris Energia",
    displayName: null,
    description:
      "Projetos completos de energia solar fotovoltaica residencial e comercial com financiamento facilitado e monitoramento em tempo real.",
    displayDescription: null,
    logoUrl: `https://images.unsplash.com/photo-1509391366360-2e959784a276${LOGO_PARAMS}`,
    displayLogo: null,
    coverImage: `https://images.unsplash.com/photo-1509391366360-2e959784a276${COVER_PARAMS}`,
    city: "Joinville",
    neighborhood: "Anita Garibaldi",
    address: "Rua Tuiuti, 875",
    state: "SC",
    phone: "(47) 3041-7733",
    whatsapp: "5547988880009",
    email: "projetos@solarisenergia.com.br",
    hours: "Seg–Sex 8h30–18h",
    products:
      "Painéis solares, Inversores, Baterias, Estruturas, Monitoramento",
    yearsInMarket: 7,
    segment: "Energia Solar",
    website: "solarisenergia.com.br",
    instagram: "solarisenergia.sc",
    facebook: null,
  },
  {
    id: "demo-10",
    companyName: "Piso Nobre Revestimentos",
    displayName: null,
    description:
      "Porcelanatos, cerâmicas, pisos vinílicos e laminados das melhores marcas com showroom e consultoria de ambientes por arquitetos parceiros.",
    displayDescription: null,
    logoUrl: `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c${LOGO_PARAMS}`,
    displayLogo: null,
    coverImage: `https://images.unsplash.com/photo-1600607687939-ce8a6c25118c${COVER_PARAMS}`,
    city: "Joinville",
    neighborhood: "Costa e Silva",
    address: "Av. Santos Dumont, 3200",
    state: "SC",
    phone: "(47) 3436-0099",
    whatsapp: "5547988880010",
    email: "showroom@pisonobre.com.br",
    hours: "Seg–Sex 8h30–19h · Sáb 9h–14h",
    products:
      "Porcelanato, Cerâmica, Vinílico, Laminado, Pedras, Decks, Rodapés",
    yearsInMarket: 14,
    segment: "Revestimentos",
    website: "pisonobre.com.br",
    instagram: "pisonobrejoinville",
    facebook: null,
  },
];

const categorias = [
  "Todos",
  ...Array.from(new Set(associados.map((a) => a.segment ?? ""))).filter(Boolean),
];

export default function ConectaAssociadosPage() {
  const page = usePageContent("conecta-associados");
  const hero = page?.hero;
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("Todos");
  const [busca, setBusca] = useState("");
  const [mapFor, setMapFor] = useState<AssociateItem | null>(null);

  const { ref: heroRef, inView: heroInView } = useInView(0.12);
  const { ref: filtroRef, inView: filtroInView } = useInView(0.12);
  const { ref: gridRef, inView: gridInView } = useInView(0.05);

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
  }, [categoriaAtiva, busca]);

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
                "Uma rede de empresas do varejo de material de construção em Santa Catarina. Explore, filtre por categoria e entre em contato diretamente com quem conecta o setor."}
            </p>
          </div>
        </section>

        {/* ═══════ FILTROS + GRID ═══════ */}
        <section className="relative py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-[1fr_200px] gap-12">
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
                className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-10"
              >
                {filtrados.map((a, i) => (
                  <div key={a.id} style={staggerStyle(gridInView, i, 0.04)}>
                    <AssociateCard
                      item={a}
                      onOpenMap={() => setMapFor(a)}
                    />
                  </div>
                ))}
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
                href="/associar"
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

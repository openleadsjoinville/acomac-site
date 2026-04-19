import Link from "next/link";
import {
  Home,
  Info,
  Gift,
  Handshake,
  GraduationCap,
  Calendar,
  Users,
  Mail,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";
import { PageHeader, Panel } from "../_components/ui";

const pages = [
  { key: "home", label: "Home", url: "/", icon: Home, description: "Página inicial — hero, seções e CTAs" },
  { key: "sobre", label: "A ACOMAC", url: "/sobre", icon: Info, description: "Quem somos, história, missão e valores" },
  { key: "beneficios", label: "Benefícios", url: "/beneficios", icon: Gift, description: "Vantagens exclusivas para associados" },
  { key: "convenios", label: "Convênios", url: "/convenios", icon: Handshake, description: "Rede de parceiros e descontos" },
  { key: "cursos", label: "Cursos", url: "/cursos", icon: GraduationCap, description: "Página da Academia (hero + intro)" },
  { key: "eventos", label: "Eventos", url: "/eventos", icon: Calendar, description: "Página de eventos (hero + intro)" },
  { key: "conecta-associados", label: "Conecta Associados", url: "/conecta-associados", icon: Users, description: "Diretório e cadastro de associados" },
  { key: "contato", label: "Contato", url: "/contato", icon: Mail, description: "Endereço, telefones e mapa" },
];

export default function PagesListPage() {
  return (
    <>
      <PageHeader
        eyebrow="Conteúdo"
        title="Páginas do site"
        subtitle="Edite textos, imagens, botões e pop-ups de cada página."
      />
      <div className="px-6 lg:px-8 pb-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {pages.map((p) => {
            const Icon = p.icon;
            return (
              <Link
                key={p.key}
                href={`/admin/pages/${p.key}`}
                className="group rounded-2xl p-5 admin-hover-ring flex items-start gap-4"
                style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
              >
                <div
                  className="h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(246,129,30,0.12)", color: "var(--admin-accent)" }}
                >
                  <Icon size={17} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{p.label}</h3>
                    <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--admin-accent)" }} />
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--admin-text-muted)" }}>
                    {p.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] mt-2"
                    style={{ color: "var(--admin-text-subtle)" }}
                  >
                    <ExternalLink size={10} />
                    {p.url}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

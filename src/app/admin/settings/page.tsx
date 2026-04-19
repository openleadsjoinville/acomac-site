import Link from "next/link";
import { ShieldCheck, KeyRound, Server, Globe, Sparkles, Users, ArrowUpRight } from "lucide-react";
import { PageHeader, Panel } from "../_components/ui";

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sistema"
        title="Configurações"
        subtitle="Informações técnicas do seu painel."
      />

      <div className="px-6 lg:px-8 pb-10 space-y-4 max-w-3xl">
        <Link
          href="/admin/settings/users"
          className="block rounded-2xl p-5 admin-hover-ring group"
          style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
        >
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "var(--admin-accent-soft)", color: "var(--admin-accent)" }}>
              <Users size={16} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-1" style={{ color: "var(--admin-text-strong)" }}>
                Usuários do painel
                <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--admin-accent)" }} />
              </h3>
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>
                Cadastre novos administradores e editores. Defina permissões individuais por usuário.
              </p>
            </div>
          </div>
        </Link>

        <Panel>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "var(--admin-accent-soft)", color: "var(--admin-accent)" }}>
              <KeyRound size={16} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ color: "var(--admin-text-strong)" }}>Senha superadmin (recuperação)</h3>
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>
                A variável <code className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--admin-surface-2)" }}>ADMIN_PASSWORD</code> no arquivo <code className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--admin-surface-2)" }}>.env</code> é uma senha de recuperação que sempre funciona, mesmo sem nenhum usuário no banco. Use para acessar o painel caso perca a senha dos usuários cadastrados.
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)", color: "#4ade80" }}>
              <ShieldCheck size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Segurança da sessão (JWT)</h3>
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>
                A variável <code className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--admin-surface-2)" }}>JWT_SECRET</code> no <code className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--admin-surface-2)" }}>.env</code> assina o cookie de sessão (válido por 7 dias). Use uma string aleatória com 32+ caracteres em produção.
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(74,140,255,0.12)", color: "var(--admin-blue)" }}>
              <Server size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Banco de dados</h3>
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>
                SQLite — arquivo único em <code className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--admin-surface-2)" }}>prisma/dev.db</code>. Faça backup desse arquivo regularmente. Uploads ficam em <code className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--admin-surface-2)" }}>public/uploads/</code>.
              </p>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(245,158,11,0.12)", color: "#fbbf24" }}>
              <Globe size={16} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Domínio e site público</h3>
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>
                O site público roda no mesmo servidor que este painel. Abra o site pelo atalho abaixo:
              </p>
              <Link href="/" target="_blank" className="admin-btn admin-btn-ghost mt-3 text-xs">
                Abrir site público
              </Link>
            </div>
          </div>
        </Panel>

        <Panel>
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(246,129,30,0.12)", color: "var(--admin-accent)" }}>
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-white">Tracking de acessos</h3>
              <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>
                Cada visita à página registra um pageview anonimizado. Cliques em botões marcados com <code className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--admin-surface-2)" }}>data-track</code> também são contabilizados. Os dados ficam no seu próprio banco de dados — nada vai para serviços externos.
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

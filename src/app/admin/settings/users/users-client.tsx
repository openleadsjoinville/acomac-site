"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import {
  Users as UsersIcon,
  Plus,
  Mail,
  Shield,
  ShieldCheck,
  KeyRound,
  Trash2,
  ArrowLeft,
  UserCircle,
  Loader2,
  Info,
} from "lucide-react";
import { PageHeader, Panel, EmptyState } from "../../_components/ui";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  createdAt: string;
  lastLoginAt: string | null;
};

type Session = { authenticated: boolean; role: "admin" | "editor"; email?: string };

export function UsersClient() {
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ email: "", name: "", password: "", role: "editor" as "admin" | "editor" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void reload();
    fetch("/api/admin/session").then((r) => r.json()).then(setSession);
  }, []);

  async function reload() {
    const res = await fetch("/api/admin/users");
    if (res.status === 401) {
      setUsers([]);
      return;
    }
    const d = await res.json();
    setUsers(d);
  }

  async function create() {
    if (!form.email || !form.password) {
      return toast.error("Email e senha são obrigatórios");
    }
    setSaving(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return toast.error(d.error ?? "Erro ao criar");
    }
    const u = await res.json();
    setUsers((prev) => [u, ...(prev ?? [])]);
    setForm({ email: "", name: "", password: "", role: "editor" });
    setCreating(false);
    toast.success("Usuário criado");
  }

  async function changePassword(u: AdminUser) {
    const pw = prompt(`Nova senha para ${u.email} (mínimo 6 caracteres):`);
    if (!pw) return;
    if (pw.length < 6) return toast.error("Senha muito curta");
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return toast.error(d.error ?? "Erro");
    }
    toast.success("Senha alterada");
  }

  async function toggleRole(u: AdminUser) {
    const newRole: "admin" | "editor" = u.role === "admin" ? "editor" : "admin";
    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    if (!res.ok) return toast.error("Erro ao atualizar");
    const updated = await res.json();
    setUsers((prev) => prev?.map((x) => (x.id === u.id ? updated : x)) ?? null);
    toast.success(`Agora ${updated.role === "admin" ? "administrador" : "editor"}`);
  }

  async function remove(u: AdminUser) {
    if (!confirm(`Excluir ${u.email}?`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      return toast.error(d.error ?? "Erro ao excluir");
    }
    setUsers((prev) => prev?.filter((x) => x.id !== u.id) ?? null);
    toast.success("Usuário excluído");
  }

  const isAdmin = session?.role === "admin";

  return (
    <>
      <Toaster position="top-right" theme="dark" />
      <PageHeader
        eyebrow="Configurações"
        title="Usuários do painel"
        subtitle="Gerencie quem tem acesso ao painel e com qual permissão."
        actions={
          <>
            <Link href="/admin/settings" className="admin-btn admin-btn-ghost">
              <ArrowLeft size={13} /> Configurações
            </Link>
            {isAdmin && !creating && (
              <button onClick={() => setCreating(true)} className="admin-btn admin-btn-primary">
                <Plus size={13} /> Novo usuário
              </button>
            )}
          </>
        }
      />

      <div className="px-6 lg:px-8 pb-10 space-y-4 max-w-4xl">
        {!isAdmin && session && (
          <Panel>
            <div className="flex items-start gap-3">
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(217,119,6,0.15)", color: "#d97706" }}
              >
                <Info size={15} />
              </div>
              <div>
                <p className="font-semibold" style={{ color: "var(--admin-text-strong)" }}>
                  Somente administradores gerenciam usuários
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>
                  Você está logado como <strong>{session.role}</strong>. Peça para um administrador promover seu usuário se precisar editar esta área.
                </p>
              </div>
            </div>
          </Panel>
        )}

        {creating && (
          <Panel>
            <div className="space-y-3">
              <h3 className="font-semibold" style={{ color: "var(--admin-text-strong)" }}>
                Convidar novo usuário
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="admin-label">Email</label>
                  <input
                    className="admin-input"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="usuario@empresa.com"
                  />
                </div>
                <div>
                  <label className="admin-label">Nome (opcional)</label>
                  <input
                    className="admin-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nome de exibição"
                  />
                </div>
                <div>
                  <label className="admin-label">Senha provisória (mín. 6)</label>
                  <input
                    className="admin-input"
                    type="text"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="ex: TempSenha123"
                  />
                </div>
                <div>
                  <label className="admin-label">Perfil</label>
                  <select
                    className="admin-input"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "editor" })}
                  >
                    <option value="editor">Editor (edita conteúdo)</option>
                    <option value="admin">Administrador (tudo, inclusive usuários)</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button onClick={() => setCreating(false)} className="admin-btn admin-btn-ghost">
                  Cancelar
                </button>
                <button onClick={create} disabled={saving} className="admin-btn admin-btn-primary">
                  {saving ? <><Loader2 size={13} className="animate-spin" /> Criando…</> : <>Criar usuário</>}
                </button>
              </div>
            </div>
          </Panel>
        )}

        {users === null ? (
          <Panel><div className="py-10 text-center" style={{ color: "var(--admin-text-subtle)" }}>Carregando…</div></Panel>
        ) : users.length === 0 ? (
          <Panel>
            <EmptyState
              icon={<UsersIcon size={20} />}
              title="Nenhum usuário cadastrado"
              description="Você está logado como superadmin (senha definida no .env). Crie usuários editores para dar acesso a outras pessoas."
              action={
                isAdmin && (
                  <button onClick={() => setCreating(true)} className="admin-btn admin-btn-primary">
                    <Plus size={13} /> Criar primeiro usuário
                  </button>
                )
              }
            />
          </Panel>
        ) : (
          <Panel padding="p-0">
            <ul>
              {users.map((u, i) => (
                <li
                  key={u.id}
                  className="flex items-center gap-4 px-5 py-4 flex-wrap"
                  style={{ borderBottom: i === users.length - 1 ? "none" : "1px solid var(--admin-border)" }}
                >
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--admin-accent-soft)", color: "var(--admin-accent)" }}
                  >
                    <UserCircle size={18} />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold" style={{ color: "var(--admin-text-strong)" }}>
                        {u.name || u.email}
                      </p>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{
                          background: u.role === "admin" ? "rgba(246,129,30,0.15)" : "rgba(37,99,235,0.15)",
                          color: u.role === "admin" ? "var(--admin-accent)" : "var(--admin-blue)",
                        }}
                      >
                        {u.role === "admin" ? (
                          <><ShieldCheck size={10} className="inline mr-1" /> admin</>
                        ) : (
                          <><Shield size={10} className="inline mr-1" /> editor</>
                        )}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 inline-flex items-center gap-1.5" style={{ color: "var(--admin-text-muted)" }}>
                      <Mail size={11} />
                      {u.email}
                    </p>
                    {u.lastLoginAt && (
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--admin-text-subtle)" }}>
                        Último login: {new Date(u.lastLoginAt).toLocaleString("pt-BR")}
                      </p>
                    )}
                  </div>
                  {isAdmin && (
                    <div className="flex gap-1 items-center">
                      <button
                        onClick={() => changePassword(u)}
                        className="admin-btn admin-btn-ghost text-[11px] px-2.5 py-1.5"
                        title="Alterar senha"
                      >
                        <KeyRound size={12} />
                      </button>
                      <button
                        onClick={() => toggleRole(u)}
                        className="admin-btn admin-btn-ghost text-[11px] px-2.5 py-1.5"
                        title={u.role === "admin" ? "Rebaixar a editor" : "Promover a admin"}
                      >
                        {u.role === "admin" ? <Shield size={12} /> : <ShieldCheck size={12} />}
                        {u.role === "admin" ? "Rebaixar" : "Promover"}
                      </button>
                      <button
                        onClick={() => remove(u)}
                        className="admin-btn admin-btn-danger-ghost text-[11px] px-2.5 py-1.5"
                        title="Excluir"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Panel>
        )}

        <Panel>
          <div className="flex items-start gap-3">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--admin-accent-soft)", color: "var(--admin-accent)" }}
            >
              <Info size={15} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--admin-text-strong)" }}>
                Sobre os perfis
              </p>
              <ul className="text-xs mt-2 space-y-1.5 pl-4 list-disc" style={{ color: "var(--admin-text-muted)" }}>
                <li><strong>Administrador</strong>: todas as permissões, incluindo gerenciar usuários e configurações.</li>
                <li><strong>Editor</strong>: pode editar páginas, criar/editar eventos, cursos, blog, aprovar associados, ver formulários.</li>
                <li>A senha do <code style={{ background: "var(--admin-surface-2)", padding: "1px 4px", borderRadius: 4 }}>ADMIN_PASSWORD</code> no <code style={{ background: "var(--admin-surface-2)", padding: "1px 4px", borderRadius: 4 }}>.env</code> continua funcionando como superadmin de recuperação.</li>
              </ul>
            </div>
          </div>
        </Panel>
      </div>
    </>
  );
}

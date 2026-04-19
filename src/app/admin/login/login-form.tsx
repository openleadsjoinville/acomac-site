"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: email || undefined, password }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Credenciais inválidas");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl p-6 space-y-4"
      style={{
        background: "var(--admin-surface)",
        border: "1px solid var(--admin-border)",
        boxShadow: "var(--admin-shadow-lg)",
      }}
    >
      <div>
        <label className="admin-label">Email (opcional)</label>
        <div className="relative">
          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-text-subtle)" }} />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-input pl-10"
            placeholder="admin@acomacjoinville.com.br"
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label className="admin-label">Senha</label>
        <div className="relative">
          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--admin-text-subtle)" }} />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input pl-10"
            placeholder="••••••••"
            autoFocus
            required
          />
        </div>
      </div>

      {error && (
        <div
          className="text-sm rounded-lg px-3 py-2.5"
          style={{
            background: "rgba(220,38,38,0.08)",
            border: "1px solid rgba(220,38,38,0.25)",
            color: "var(--admin-danger)",
          }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !password}
        className="admin-btn admin-btn-primary w-full justify-center py-3"
      >
        {loading ? <><Loader2 size={15} className="animate-spin" />Entrando...</> : <>Entrar no painel<ArrowRight size={15} /></>}
      </button>

      <p className="text-[11px] text-center mt-2" style={{ color: "var(--admin-text-subtle)" }}>
        Se você é o superadmin definido no <code style={{ background: "var(--admin-surface-2)", padding: "1px 4px", borderRadius: 4 }}>.env</code>, pode entrar só com a senha.
      </p>
    </form>
  );
}

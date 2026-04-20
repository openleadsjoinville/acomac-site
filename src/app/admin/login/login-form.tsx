"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, Loader2 } from "lucide-react";

export function LoginForm() {
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
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Senha incorreta");
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
        <label className="admin-label">Senha</label>
        <div className="relative">
          <Lock
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--admin-text-subtle)" }}
          />
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
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Entrando...
          </>
        ) : (
          <>
            Entrar no painel
            <ArrowRight size={15} />
          </>
        )}
      </button>
    </form>
  );
}

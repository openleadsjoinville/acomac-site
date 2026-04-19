import { LoginForm } from "./login-form";

export const metadata = { title: "Login — Painel ACOMAC" };

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "var(--admin-bg)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(246,129,30,0.08), transparent 40%), radial-gradient(circle at 80% 80%, rgba(37,99,235,0.05), transparent 40%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="inline-flex h-14 w-14 rounded-2xl items-center justify-center mb-5 font-black text-xl text-white admin-gradient-accent"
            style={{ boxShadow: "0 10px 40px rgba(246,129,30,0.35)" }}
          >
            A
          </div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--admin-text-strong)" }}>
            Painel ACOMAC
          </h1>
          <p className="text-sm mt-1.5" style={{ color: "var(--admin-text-muted)" }}>
            Área administrativa restrita
          </p>
        </div>

        <LoginForm />

        <p className="text-center text-[11px] mt-6" style={{ color: "var(--admin-text-subtle)" }}>
          ACOMAC Joinville · Administração de conteúdo
        </p>
      </div>
    </div>
  );
}

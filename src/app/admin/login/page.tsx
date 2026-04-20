import Image from "next/image";
import { getGlobalContent } from "@/lib/content/get";
import { LoginForm } from "./login-form";

export const metadata = { title: "Login — Painel ACOMAC" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const global = await getGlobalContent();
  const logo =
    global?.brand?.logo || "/LOGO ACOMAC Joinville - 2020 - FINAL-01.avif";
  const logoAlt = global?.brand?.logoAlt || "ACOMAC Joinville";

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
            className="inline-flex items-center justify-center rounded-2xl px-5 py-4 mb-5"
            style={{
              background: "#ffffff",
              border: "1px solid var(--admin-border)",
              boxShadow: "0 8px 28px rgba(16,24,40,0.1)",
            }}
          >
            <Image
              src={logo}
              alt={logoAlt}
              width={200}
              height={56}
              priority
              unoptimized
              className="h-12 w-auto object-contain"
            />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--admin-text-strong)" }}
          >
            Painel ACOMAC
          </h1>
          <p
            className="text-sm mt-1.5"
            style={{ color: "var(--admin-text-muted)" }}
          >
            Área administrativa restrita
          </p>
        </div>

        <LoginForm />

        <p
          className="text-center text-[11px] mt-6"
          style={{ color: "var(--admin-text-subtle)" }}
        >
          ACOMAC Joinville · Administração de conteúdo
        </p>
      </div>
    </div>
  );
}

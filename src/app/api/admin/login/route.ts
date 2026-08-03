import { NextResponse } from "next/server";
import { authenticateUser, createSession } from "@/lib/auth";
import {
  checkLoginLock,
  clearLoginAttempts,
  getClientKey,
  registerFailedLogin,
  LOGIN_MAX_ATTEMPTS,
} from "@/lib/login-rate-limit";

function formatWait(seconds: number): string {
  const min = Math.ceil(seconds / 60);
  return min <= 1 ? "1 minuto" : `${min} minutos`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : undefined;
  const password = typeof body.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json({ error: "Senha obrigatória" }, { status: 400 });
  }

  const key = getClientKey(req);
  const lock = await checkLoginLock(key);
  if (lock.locked) {
    return NextResponse.json(
      {
        error: `Muitas tentativas. Tente novamente em ${formatWait(lock.retryAfterSec)}.`,
      },
      { status: 429, headers: { "Retry-After": String(lock.retryAfterSec) } }
    );
  }

  const session = await authenticateUser(email, password);
  if (!session) {
    const state = await registerFailedLogin(key);
    if (state.locked) {
      return NextResponse.json(
        {
          error: `Muitas tentativas. Acesso bloqueado por ${formatWait(state.retryAfterSec)}.`,
        },
        { status: 429, headers: { "Retry-After": String(state.retryAfterSec) } }
      );
    }
    return NextResponse.json(
      {
        error:
          state.remaining < LOGIN_MAX_ATTEMPTS
            ? `Credenciais inválidas. ${state.remaining} tentativa(s) restante(s).`
            : "Credenciais inválidas",
      },
      { status: 401 }
    );
  }

  await clearLoginAttempts(key);
  await createSession(session);
  return NextResponse.json({ ok: true, role: session.role });
}

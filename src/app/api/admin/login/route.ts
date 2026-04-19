import { NextResponse } from "next/server";
import { authenticateUser, createSession } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email : undefined;
  const password = typeof body.password === "string" ? body.password : "";
  if (!password) {
    return NextResponse.json({ error: "Senha obrigatória" }, { status: 400 });
  }
  const session = await authenticateUser(email, password);
  if (!session) {
    return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
  }
  await createSession(session);
  return NextResponse.json({ ok: true, role: session.role });
}

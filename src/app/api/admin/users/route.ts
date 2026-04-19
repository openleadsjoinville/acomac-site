import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

function selectUser() {
  return {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    lastLoginAt: true,
  } as const;
}

export async function GET() {
  const s = await getSession();
  if (!s || s.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const users = await prisma.adminUser.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
    select: selectUser(),
  });
  return NextResponse.json(users);
}

const CreateSchema = z.object({
  email: z.string().email(),
  name: z.string().optional().default(""),
  password: z.string().min(6, "Senha precisa de pelo menos 6 caracteres"),
  role: z.enum(["admin", "editor"]).default("editor"),
});

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "dados inválidos" }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Já existe um usuário com este email" }, { status: 409 });
  }
  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.adminUser.create({
    data: {
      email,
      name: parsed.data.name,
      passwordHash,
      role: parsed.data.role,
    },
    select: selectUser(),
  });
  return NextResponse.json(user);
}

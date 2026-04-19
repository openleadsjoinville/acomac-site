import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

const UpdateSchema = z.object({
  name: z.string().optional(),
  role: z.enum(["admin", "editor"]).optional(),
  password: z.string().min(6).optional(),
});

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s || s.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "dados inválidos" }, { status: 400 });
  }
  const data: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) data.name = parsed.data.name;
  if (parsed.data.role) data.role = parsed.data.role;
  if (parsed.data.password) data.passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.adminUser.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, role: true, createdAt: true, lastLoginAt: true },
  });
  return NextResponse.json(user);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const s = await getSession();
  if (!s || s.role !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  if (s.userId === id) {
    return NextResponse.json({ error: "Você não pode excluir a si mesmo" }, { status: 400 });
  }
  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

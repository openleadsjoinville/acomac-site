import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  if ("read" in body) data.read = !!body.read;
  if ("archived" in body) data.archived = !!body.archived;
  const item = await prisma.contactMessage.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  await prisma.contactMessage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  const keys = ["name", "image", "url", "description"] as const;
  for (const k of keys) if (k in body) data[k] = body[k] ?? "";
  if ("active" in body) data.active = !!body.active;
  if ("weight" in body) data.weight = Math.max(1, Math.min(10, Number(body.weight) || 5));
  if ("startDate" in body) data.startDate = body.startDate ? new Date(body.startDate) : null;
  if ("endDate" in body) data.endDate = body.endDate ? new Date(body.endDate) : null;
  const item = await prisma.sponsor.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  await prisma.sponsor.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

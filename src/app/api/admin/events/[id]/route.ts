import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  const keys = ["title", "description", "content", "location", "image", "ctaLabel", "ctaHref", "ctaType", "ctaWhatsappNumber", "ctaWhatsappMessage"] as const;
  for (const k of keys) if (k in body) data[k] = body[k] ?? "";
  if ("slug" in body && body.slug) data.slug = slugify(body.slug);
  if ("featured" in body) data.featured = !!body.featured;
  if ("published" in body) data.published = !!body.published;
  if ("orderIndex" in body) data.orderIndex = Number(body.orderIndex ?? 0);
  if ("date" in body && body.date) data.date = new Date(body.date);
  if ("endDate" in body) data.endDate = body.endDate ? new Date(body.endDate) : null;
  const item = await prisma.event.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

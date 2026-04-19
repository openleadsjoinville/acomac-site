import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  const body = await req.json();
  const allowed = [
    "companyName", "cnpj", "contactName", "phone", "whatsapp", "email",
    "city", "neighborhood", "address", "state", "zipCode",
    "hours", "products", "yearsInMarket", "coverImage",
    "website", "instagram", "facebook", "segment", "description", "logoUrl",
    "displayName", "displayDescription", "displayLogo", "orderIndex", "status",
  ] as const;
  const update: Record<string, unknown> = {};
  for (const k of allowed) if (k in body) update[k] = body[k];
  if ("yearsInMarket" in update) {
    const y = update.yearsInMarket;
    if (y === "" || y === null || y === undefined) update.yearsInMarket = null;
    else if (typeof y === "string") update.yearsInMarket = parseInt(y, 10) || null;
  }
  const item = await prisma.associate.update({ where: { id }, data: update });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  await prisma.associate.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET() {
  const g = await requireAdmin();
  if (g) return g;
  const items = await prisma.blogCategory.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const g = await requireAdmin();
  if (g) return g;
  const body = await req.json().catch(() => ({}));
  const rawName = typeof body.name === "string" ? body.name.trim() : "";
  if (!rawName) {
    return NextResponse.json({ error: "Nome obrigatório" }, { status: 400 });
  }
  // Normaliza: primeira letra maiúscula
  const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const slug = slugify(name);
  const existing = await prisma.blogCategory.findFirst({
    where: { OR: [{ name }, { slug }] },
  });
  if (existing) return NextResponse.json(existing);
  const item = await prisma.blogCategory.create({
    data: { name, slug },
  });
  return NextResponse.json(item);
}

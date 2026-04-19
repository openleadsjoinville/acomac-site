import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET() {
  const g = await requireAdmin();
  if (g) return g;
  const items = await prisma.event.findMany({ orderBy: [{ orderIndex: "asc" }, { date: "desc" }] });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const g = await requireAdmin();
  if (g) return g;
  const body = await req.json();
  const title = (body.title as string) || "Novo evento";
  let slug = slugify((body.slug as string) || title);
  const exists = await prisma.event.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;
  const item = await prisma.event.create({
    data: {
      slug,
      title,
      description: body.description ?? "",
      content: body.content ?? "",
      date: body.date ? new Date(body.date) : new Date(),
      endDate: body.endDate ? new Date(body.endDate) : null,
      location: body.location ?? "",
      image: body.image ?? "",
      ctaLabel: body.ctaLabel ?? "",
      ctaHref: body.ctaHref ?? "",
      featured: !!body.featured,
      published: body.published !== false,
      orderIndex: Number(body.orderIndex ?? 0),
    },
  });
  return NextResponse.json(item);
}

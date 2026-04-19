import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";

export async function GET() {
  const g = await requireAdmin();
  if (g) return g;
  const items = await prisma.course.findMany({ orderBy: [{ orderIndex: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const g = await requireAdmin();
  if (g) return g;
  const body = await req.json();
  const title = (body.title as string) || "Novo curso";
  let slug = slugify((body.slug as string) || title);
  const exists = await prisma.course.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;
  const item = await prisma.course.create({
    data: {
      slug,
      title,
      description: body.description ?? "",
      content: body.content ?? "",
      category: body.category ?? "",
      duration: body.duration ?? "",
      level: body.level ?? "Básico",
      price: body.price ?? "",
      instructor: body.instructor ?? "",
      image: body.image ?? "",
      ctaLabel: body.ctaLabel ?? "",
      ctaHref: body.ctaHref ?? "",
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      published: body.published !== false,
      featured: !!body.featured,
      orderIndex: Number(body.orderIndex ?? 0),
    },
  });
  return NextResponse.json(item);
}

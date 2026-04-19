import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { autoExcerpt, autoReadTime } from "@/lib/blog-helpers";

async function ensureCategory(name: string) {
  if (!name?.trim()) return;
  const pretty = name.trim().charAt(0).toUpperCase() + name.trim().slice(1);
  const slug = slugify(pretty);
  const existing = await prisma.blogCategory.findFirst({
    where: { OR: [{ name: pretty }, { slug }] },
  });
  if (existing) return;
  try {
    await prisma.blogCategory.create({ data: { name: pretty, slug } });
  } catch {
    // Race condition (unique) — ignora
  }
}

export async function GET() {
  const g = await requireAdmin();
  if (g) return g;
  const items = await prisma.blogPost.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const g = await requireAdmin();
  if (g) return g;
  const body = await req.json();
  const title = (body.title as string) || "Novo post";
  let slug = slugify((body.slug as string) || title);
  const exists = await prisma.blogPost.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString(36)}`;
  const content = typeof body.content === "string" ? body.content : "";
  const published = body.published !== false;
  const category = typeof body.category === "string" ? body.category.trim() : "";
  if (category) await ensureCategory(category);
  const item = await prisma.blogPost.create({
    data: {
      slug,
      title,
      excerpt: autoExcerpt(content),
      content,
      coverImage: body.coverImage ?? "",
      author: body.author ?? "ACOMAC Joinville",
      tags: body.tags ?? "",
      category,
      readTime: autoReadTime(content),
      published,
      featured: !!body.featured,
      publishedAt: published ? (body.publishedAt ? new Date(body.publishedAt) : new Date()) : null,
    },
  });
  return NextResponse.json(item);
}

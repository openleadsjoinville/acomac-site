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
    /* race */
  }
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  const body = await req.json();
  const data: Record<string, unknown> = {};
  const keys = ["title", "coverImage", "author", "tags", "category"] as const;
  for (const k of keys) if (k in body) data[k] = body[k] ?? "";
  if ("slug" in body && body.slug) data.slug = slugify(body.slug);
  if ("featured" in body) data.featured = !!body.featured;
  // Se o conteúdo mudou, regenera excerpt e readTime (mesmo que o usuário passe)
  if ("content" in body) {
    const content = String(body.content ?? "");
    data.content = content;
    data.excerpt = autoExcerpt(content);
    data.readTime = autoReadTime(content);
  }
  if ("published" in body) {
    data.published = !!body.published;
    if (body.published) {
      // Só atualiza publishedAt se ainda não tiver ou se o usuário mandou
      if (body.publishedAt) data.publishedAt = new Date(body.publishedAt);
      else {
        const current = await prisma.blogPost.findUnique({ where: { id } });
        if (!current?.publishedAt) data.publishedAt = new Date();
      }
    } else {
      data.publishedAt = null;
    }
  } else if ("publishedAt" in body) {
    data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
  }
  if (typeof data.category === "string" && data.category.trim()) {
    await ensureCategory(data.category);
  }
  const item = await prisma.blogPost.update({ where: { id }, data });
  return NextResponse.json(item);
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;
  const { id } = await ctx.params;
  await prisma.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

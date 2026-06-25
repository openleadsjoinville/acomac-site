import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PUBLIC_CACHE_HEADERS } from "@/lib/cache";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.published) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(post, { headers: PUBLIC_CACHE_HEADERS });
}

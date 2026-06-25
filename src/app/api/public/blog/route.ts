import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PUBLIC_CACHE_HEADERS } from "@/lib/cache";

export async function GET() {
  const items = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
  return NextResponse.json(items, { headers: PUBLIC_CACHE_HEADERS });
}

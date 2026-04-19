import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const items = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
  });
  return NextResponse.json(items, { headers: { "cache-control": "no-store" } });
}

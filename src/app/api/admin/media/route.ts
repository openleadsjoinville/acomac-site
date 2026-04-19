import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export async function GET() {
  const g = await requireAdmin();
  if (g) return g;
  const items = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

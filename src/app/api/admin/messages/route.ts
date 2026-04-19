import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const g = await requireAdmin();
  if (g) return g;
  const url = new URL(req.url);
  const archived = url.searchParams.get("archived") === "1";
  const items = await prisma.contactMessage.findMany({
    where: { archived },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

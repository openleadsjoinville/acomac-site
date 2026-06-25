import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PUBLIC_CACHE_HEADERS } from "@/lib/cache";

export async function GET() {
  const now = new Date();
  const items = await prisma.sponsor.findMany({
    where: {
      active: true,
      AND: [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ],
    },
    select: {
      id: true,
      name: true,
      image: true,
      url: true,
      description: true,
      weight: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items, { headers: PUBLIC_CACHE_HEADERS });
}

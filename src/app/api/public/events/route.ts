import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PUBLIC_CACHE_HEADERS } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";

  const now = new Date();
  const items = await prisma.event.findMany({
    where: {
      published: true,
      ...(all
        ? {}
        : {
            OR: [
              { endDate: { gte: now } },
              { AND: [{ endDate: null }, { date: { gte: now } }] },
            ],
          }),
    },
    orderBy: all
      ? [{ featured: "desc" }, { date: "desc" }]
      : [{ featured: "desc" }, { date: "asc" }],
  });
  return NextResponse.json(items, { headers: PUBLIC_CACHE_HEADERS });
}

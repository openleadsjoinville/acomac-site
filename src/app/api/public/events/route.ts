import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const now = new Date();
  const items = await prisma.event.findMany({
    where: {
      published: true,
      OR: [
        // Com data de término: só mostra se ainda não terminou
        { endDate: { gte: now } },
        // Sem data de término: só mostra se a data do evento ainda não passou
        { AND: [{ endDate: null }, { date: { gte: now } }] },
      ],
    },
    orderBy: [{ featured: "desc" }, { date: "asc" }],
  });
  return NextResponse.json(items, { headers: { "cache-control": "no-store" } });
}

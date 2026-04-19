import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const now = new Date();
  const items = await prisma.course.findMany({
    where: {
      published: true,
      OR: [
        { endDate: null }, // cursos sem data de expiração ficam sempre
        { endDate: { gte: now } }, // cursos com endDate só até a data
      ],
    },
    orderBy: [{ featured: "desc" }, { orderIndex: "asc" }],
  });
  return NextResponse.json(items, { headers: { "cache-control": "no-store" } });
}

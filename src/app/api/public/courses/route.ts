import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { PUBLIC_CACHE_HEADERS } from "@/lib/cache";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  // ?all=1 traz também as turmas já encerradas (usado no histórico de /cursos).
  const all = url.searchParams.get("all") === "1";

  const now = new Date();
  const items = await prisma.course.findMany({
    where: {
      published: true,
      ...(all
        ? {}
        : {
            OR: [
              { endDate: null }, // cursos sem data de expiração ficam sempre
              { endDate: { gte: now } }, // cursos com endDate só até a data
            ],
          }),
    },
    // Sem "content": os cards só mostram o resumo; a descrição completa é
    // renderizada no servidor na página /cursos/[slug].
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      category: true,
      duration: true,
      level: true,
      price: true,
      instructor: true,
      image: true,
      ctaType: true,
      ctaLabel: true,
      ctaHref: true,
      ctaWhatsappNumber: true,
      ctaWhatsappMessage: true,
      startDate: true,
      endDate: true,
    },
    orderBy: [{ featured: "desc" }, { orderIndex: "asc" }],
  });
  return NextResponse.json(items, { headers: PUBLIC_CACHE_HEADERS });
}

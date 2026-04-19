import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const associates = await prisma.associate.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ orderIndex: "asc" }, { displayName: "asc" }],
    select: {
      id: true,
      companyName: true,
      displayName: true,
      description: true,
      displayDescription: true,
      logoUrl: true,
      displayLogo: true,
      coverImage: true,
      city: true,
      neighborhood: true,
      address: true,
      state: true,
      phone: true,
      whatsapp: true,
      email: true,
      hours: true,
      products: true,
      yearsInMarket: true,
      segment: true,
      website: true,
      instagram: true,
      facebook: true,
    },
  });
  return NextResponse.json(associates, {
    headers: { "cache-control": "no-store" },
  });
}

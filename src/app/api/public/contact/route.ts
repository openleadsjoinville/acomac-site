import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const Schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().default(""),
  subject: z.string().optional().default(""),
  message: z.string().min(4),
  source: z.string().optional().default("contato"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "dados inválidos" }, { status: 400 });
  }
  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      subject: parsed.data.subject || null,
      message: parsed.data.message,
      source: parsed.data.source,
    },
  });
  await prisma.analyticsEvent.create({
    data: { type: "form_submit", target: parsed.data.source, path: "" },
  });
  return NextResponse.json({ ok: true });
}

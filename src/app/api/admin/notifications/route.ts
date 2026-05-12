import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

export async function GET() {
  const g = await requireAdmin();
  if (g) return g;

  const [pendingAssoc, unreadMsgs] = await Promise.all([
    prisma.associate.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        companyName: true,
        displayName: true,
        segment: true,
        city: true,
        createdAt: true,
      },
    }),
    prisma.contactMessage.findMany({
      where: { read: false, archived: false },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        subject: true,
        source: true,
        createdAt: true,
      },
    }),
  ]);

  const notifications = [
    ...pendingAssoc.map((a) => ({
      kind: "associate" as const,
      id: a.id,
      title: a.displayName || a.companyName,
      subtitle:
        [a.segment, a.city].filter(Boolean).join(" · ") ||
        "Aguardando aprovação",
      createdAt: a.createdAt.toISOString(),
      href: "/admin/associates",
    })),
    ...unreadMsgs.map((m) => ({
      kind: "message" as const,
      id: m.id,
      title: m.name,
      subtitle: m.subject ?? `Formulário: ${m.source}`,
      createdAt: m.createdAt.toISOString(),
      href: "/admin/messages",
    })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return NextResponse.json(
    {
      notifications,
      counts: {
        associates: pendingAssoc.length,
        messages: unreadMsgs.length,
        total: pendingAssoc.length + unreadMsgs.length,
      },
    },
    { headers: { "cache-control": "no-store" } }
  );
}

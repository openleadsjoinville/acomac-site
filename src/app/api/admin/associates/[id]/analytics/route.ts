import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

const ASSOCIATE_TARGETS = [
  "associate_view",
  "associate_whatsapp",
  "associate_instagram",
  "associate_phone",
  "associate_location",
  "associate_website",
] as const;

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = await requireAdmin();
  if (g) return g;

  const { id } = await ctx.params;
  const associate = await prisma.associate.findUnique({ where: { id } });
  if (!associate) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Casa eventos pelo id (formato novo) e pelos nomes (formato antigo, antes
  // de migrarmos o data-track-label pra id). Mantém histórico vivo.
  const legacyLabels = [associate.companyName, associate.displayName]
    .filter((v): v is string => !!v && v.trim().length > 0);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      target: { in: [...ASSOCIATE_TARGETS] },
      label: { in: [id, ...legacyLabels] },
    },
    select: {
      target: true,
      sessionId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  type Bucket = { total: number; sessions: Set<string> };
  const buckets: Record<string, Bucket> = {};
  for (const t of ASSOCIATE_TARGETS) {
    buckets[t] = { total: 0, sessions: new Set() };
  }
  let lastActivityAt: Date | null = null;
  for (const e of events) {
    const b = buckets[e.target];
    if (!b) continue;
    b.total++;
    if (e.sessionId) b.sessions.add(e.sessionId);
    if (!lastActivityAt || e.createdAt > lastActivityAt) {
      lastActivityAt = e.createdAt;
    }
  }

  const summary = {
    views: { total: buckets.associate_view.total, unique: buckets.associate_view.sessions.size },
    whatsapp: { total: buckets.associate_whatsapp.total, unique: buckets.associate_whatsapp.sessions.size },
    instagram: { total: buckets.associate_instagram.total, unique: buckets.associate_instagram.sessions.size },
    phone: { total: buckets.associate_phone.total, unique: buckets.associate_phone.sessions.size },
    location: { total: buckets.associate_location.total, unique: buckets.associate_location.sessions.size },
    website: { total: buckets.associate_website.total, unique: buckets.associate_website.sessions.size },
  };

  return NextResponse.json(
    {
      associate: {
        id: associate.id,
        name: associate.displayName ?? associate.companyName,
      },
      summary,
      totalEvents: events.length,
      lastActivityAt,
    },
    { headers: { "cache-control": "no-store" } }
  );
}

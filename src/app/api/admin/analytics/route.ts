import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d;
}

export async function GET(req: Request) {
  const g = await requireAdmin();
  if (g) return g;
  const url = new URL(req.url);
  const range = parseInt(url.searchParams.get("range") ?? "30", 10);
  const from = daysAgo(range);

  const events = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: from } },
    select: { type: true, path: true, target: true, createdAt: true, sessionId: true },
  });

  const today = daysAgo(0);
  const last7 = daysAgo(7);
  const last30 = daysAgo(30);

  const pageviews = events.filter((e) => e.type === "pageview");
  const uniqueSessions = (filter: (e: (typeof events)[number]) => boolean) =>
    new Set(events.filter(filter).map((e) => e.sessionId).filter(Boolean)).size;

  const visitorsToday = uniqueSessions((e) => e.type === "pageview" && e.createdAt >= today);
  const visitors7d = uniqueSessions((e) => e.type === "pageview" && e.createdAt >= last7);
  const visitors30d = uniqueSessions((e) => e.type === "pageview" && e.createdAt >= last30);

  // Daily timeseries
  const days: { date: string; visitors: number; pageviews: number }[] = [];
  for (let i = range - 1; i >= 0; i--) {
    const d = daysAgo(i);
    const next = daysAgo(i - 1);
    const iso = d.toISOString().slice(0, 10);
    const pv = pageviews.filter((e) => e.createdAt >= d && e.createdAt < next);
    const uniq = new Set(pv.map((e) => e.sessionId).filter(Boolean)).size;
    days.push({ date: iso, visitors: uniq, pageviews: pv.length });
  }

  // Top pages
  const pageCounts = new Map<string, number>();
  pageviews.forEach((e) => {
    pageCounts.set(e.path, (pageCounts.get(e.path) ?? 0) + 1);
  });
  const topPages = [...pageCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, count]) => ({ path, count }));

  // Clicks by target
  const clicks = events.filter((e) => e.type === "click");
  const clickCounts = new Map<string, number>();
  clicks.forEach((e) => {
    clickCounts.set(e.target, (clickCounts.get(e.target) ?? 0) + 1);
  });
  const topClicks = [...clickCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([target, count]) => ({ target, count }));

  // Contagens para cards do dashboard
  const [
    messagesCount,
    unreadMessages,
    associatesPending,
    associatesApproved,
    eventsCount,
    coursesCount,
    blogCount,
    mediaCount,
  ] = await Promise.all([
    prisma.contactMessage.count({ where: { archived: false } }),
    prisma.contactMessage.count({ where: { read: false, archived: false } }),
    prisma.associate.count({ where: { status: "PENDING" } }),
    prisma.associate.count({ where: { status: "APPROVED" } }),
    prisma.event.count({ where: { published: true } }),
    prisma.course.count({ where: { published: true } }),
    prisma.blogPost.count({ where: { published: true } }),
    prisma.media.count(),
  ]);

  const whatsappClicks = clicks.filter((e) => e.target.includes("whatsapp")).length;
  const formSubmits = events.filter((e) => e.type === "form_submit").length;

  return NextResponse.json({
    kpis: {
      visitorsToday,
      visitors7d,
      visitors30d,
      pageviews30d: pageviews.length,
      whatsappClicks,
      formSubmits,
      messagesCount,
      unreadMessages,
      associatesPending,
      associatesApproved,
      eventsCount,
      coursesCount,
      blogCount,
      mediaCount,
    },
    timeseries: days,
    topPages,
    topClicks,
  });
}

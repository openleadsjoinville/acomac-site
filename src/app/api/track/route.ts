import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const { type, path, target, label, sessionId } = body ?? {};
  if (!type || typeof type !== "string") {
    return NextResponse.json({ error: "type required" }, { status: 400 });
  }
  const allowed = ["pageview", "click", "form_submit"];
  if (!allowed.includes(type)) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }
  const ua = req.headers.get("user-agent") ?? "";
  const ref = req.headers.get("referer") ?? "";
  await prisma.analyticsEvent.create({
    data: {
      type,
      path: typeof path === "string" ? path.slice(0, 255) : "",
      target: typeof target === "string" ? target.slice(0, 120) : "",
      label: typeof label === "string" ? label.slice(0, 255) : "",
      sessionId: typeof sessionId === "string" ? sessionId.slice(0, 64) : "",
      userAgent: ua.slice(0, 255),
      referrer: ref.slice(0, 255),
    },
  });
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import {
  getGlobalContent,
  getPageContent,
  setGlobalContent,
  setPageContent,
} from "@/lib/content/get";
import { PAGE_KEYS, type PageKey } from "@/lib/content/schema";

function isPageKey(k: string): k is PageKey {
  return (PAGE_KEYS as readonly string[]).includes(k);
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const g = await requireAdmin();
  if (g) return g;
  const { key } = await ctx.params;
  if (key === "global") return NextResponse.json(await getGlobalContent());
  if (isPageKey(key)) return NextResponse.json(await getPageContent(key));
  return NextResponse.json({ error: "not found" }, { status: 404 });
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const g = await requireAdmin();
  if (g) return g;
  const { key } = await ctx.params;
  const body = await req.json();
  try {
    if (key === "global") await setGlobalContent(body);
    else if (isPageKey(key)) await setPageContent(key, body);
    else return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

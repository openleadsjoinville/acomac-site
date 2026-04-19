import { NextResponse } from "next/server";
import { getPageContent } from "@/lib/content/get";
import { PAGE_KEYS, type PageKey } from "@/lib/content/schema";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params;
  if (!(PAGE_KEYS as readonly string[]).includes(key)) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const data = await getPageContent(key as PageKey);
  return NextResponse.json(data, {
    headers: { "cache-control": "no-store" },
  });
}

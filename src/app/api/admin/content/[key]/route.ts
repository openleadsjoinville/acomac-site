import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import {
  getGlobalContent,
  getPageContent,
  setGlobalContent,
  setPageContent,
} from "@/lib/content/get";
import { PAGE_KEYS, type PageKey } from "@/lib/content/schema";
import {
  revalidateAllPublic,
  revalidateEventos,
  revalidateHome,
} from "@/lib/revalidate";

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
    if (key === "global") {
      await setGlobalContent(body);
      revalidateAllPublic();
    } else if (isPageKey(key)) {
      await setPageContent(key, body);
      // Só "home" e "eventos" são páginas renderizadas no servidor (ISR). As
      // demais são páginas client que buscam o conteúdo via /api/public/page/*
      // (cacheado por Cache-Control), então não há rota ISR para revalidar.
      if (key === "home") revalidateHome();
      else if (key === "eventos") revalidateEventos();
    } else {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "invalid payload";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

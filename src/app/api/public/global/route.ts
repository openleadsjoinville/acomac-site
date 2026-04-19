import { NextResponse } from "next/server";
import { getGlobalContent } from "@/lib/content/get";

export async function GET() {
  const data = await getGlobalContent();
  return NextResponse.json(data, {
    headers: { "cache-control": "no-store" },
  });
}

import { NextResponse } from "next/server";
import { getGlobalContent } from "@/lib/content/get";
import { PUBLIC_CACHE_HEADERS } from "@/lib/cache";

export async function GET() {
  const data = await getGlobalContent();
  return NextResponse.json(data, { headers: PUBLIC_CACHE_HEADERS });
}

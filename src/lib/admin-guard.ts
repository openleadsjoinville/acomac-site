import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function requireAdmin() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

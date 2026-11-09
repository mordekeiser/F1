import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/snapshot";

// One endpoint the browser polls for everything; upstream calls are cached per-source in snapshot.ts.
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await getSnapshot();
  return NextResponse.json(snapshot, { headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" } });
}

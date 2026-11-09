import { readFileSync } from "node:fs";
import path from "node:path";
import { CIRCUITS } from "@/data/circuits";

// Reads each circuit's single <path d="..."> from /public/circuits at build/revalidate time,
// keyed by Jolpica circuitId, so the client never has to fetch and regex-parse SVGs.
let cache: Record<string, string> | null = null;

export function getTrackPaths(): Record<string, string> {
  if (cache) return cache;
  const out: Record<string, string> = {};
  for (const [id, info] of Object.entries(CIRCUITS)) {
    if (!info.svg) continue;
    try {
      const text = readFileSync(path.join(process.cwd(), "public", "circuits", `${info.svg}.svg`), "utf8");
      const d = text.match(/\sd="([^"]+)"/)?.[1];
      if (d) out[id] = d;
    } catch { /* missing file → no layout */ }
  }
  return (cache = out);
}

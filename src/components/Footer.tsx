"use client";
import { useLive } from "./LiveData";

export default function Footer() {
  const { data, lastSync } = useLive();
  return (
    <footer className="relative border-t border-white/5 bg-black px-5 py-12">
      <div className="checker absolute inset-x-0 top-0 h-2 opacity-20" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 text-sm text-zinc-500 md:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--f1-red)] text-xs font-black italic text-white">F1</span>
          <span className="font-black text-white">NEXUS</span>
          <span className="text-zinc-600">· {data.season} season</span>
        </div>
        <div className="max-w-xl text-center text-xs leading-relaxed">
          Data refreshes automatically: results & standings via <a className="text-zinc-300 hover:text-white" href="https://api.jolpi.ca" target="_blank" rel="noopener noreferrer">Jolpica F1 API</a>, driver photos & team colours via <a className="text-zinc-300 hover:text-white" href="https://openf1.org" target="_blank" rel="noopener noreferrer">OpenF1</a>, circuit layouts via <a className="text-zinc-300 hover:text-white" href="https://github.com/julesr0y/f1-circuits-svg" target="_blank" rel="noopener noreferrer">f1-circuits-svg</a> (CC-BY-4.0).
          <div className="mt-1 text-zinc-700">Unofficial fan project — not affiliated with Formula 1 or the FIA.</div>
        </div>
        <div className="text-xs text-zinc-600" suppressHydrationWarning>{lastSync ? `Last sync ${lastSync.toLocaleTimeString()}` : ""}</div>
      </div>
    </footer>
  );
}

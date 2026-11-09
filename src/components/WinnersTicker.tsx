"use client";
import { countryIso, teamMeta } from "@/lib/f1";
import { useLive } from "./LiveData";
import { Flag } from "./ui";

/* Scrolling strip of every race winner so far this season. */
export default function WinnersTicker() {
  const { data } = useLive();
  const items = data.schedule.filter(r => data.winners[r.round]).map(r => ({ race: r, w: data.winners[r.round] }));
  if (!items.length) return null;
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/5 bg-black/60 py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent" />
      <div className="marquee flex w-max gap-8">
        {row.map(({ race, w }, i) => {
          const color = teamMeta({ constructorId: w.constructorId, name: w.team }).color;
          return (
            <div key={i} className="flex items-center gap-2.5 whitespace-nowrap text-sm">
              <span className="text-xs font-bold text-zinc-600">R{race.round}</span>
              <Flag iso={countryIso(race.Circuit.Location.country)} className="h-3.5 w-5" />
              <span className="text-zinc-400">{race.raceName.replace(" Grand Prix", " GP")}</span>
              <span className="h-3 w-0.5 rounded" style={{ background: color }} />
              <span className="font-bold text-white">{w.name}</span>
              <span className="text-zinc-700">●</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

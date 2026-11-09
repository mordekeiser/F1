"use client";
import { motion } from "framer-motion";
import { countryIso, teamMeta, type RaceResult } from "@/lib/f1";
import { useLive } from "./LiveData";
import { Avatar, Flag, SectionHeader } from "./ui";

const PODIUM = [
  { idx: 1, h: "h-28", medal: "from-zinc-100 to-zinc-400", label: "2ND" },
  { idx: 0, h: "h-40", medal: "from-yellow-300 to-amber-500", label: "1ST" },
  { idx: 2, h: "h-20", medal: "from-amber-500 to-amber-800", label: "3RD" },
];

export default function LastRaceResults() {
  const { data, fmt } = useLive();
  const race = data.lastRace;
  if (!race?.Results?.length) return null;
  const results = race.Results;
  const color = (r: RaceResult) => data.media[r.Driver.driverId]?.color ?? teamMeta(r.Constructor).color;
  const fastest = results.find(r => r.FastestLap?.rank === "1");
  const gained = [...results].filter(r => r.grid && r.grid !== "0").sort((a, b) => (Number(b.grid) - Number(b.position)) - (Number(a.grid) - Number(a.position)))[0];

  return (
    <section id="results" className="relative pb-24 pt-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionHeader kicker="Results" title="Last" accent="Race"
          sub={<span className="inline-flex items-center gap-2"><Flag iso={countryIso(race.Circuit.Location.country)} className="h-3.5 w-5" />Round {race.round} · {race.raceName} · {fmt(new Date(race.date), { day: "numeric", month: "long", year: "numeric" })}</span>} />

        <div className="mb-10 grid grid-cols-3 items-end gap-3 sm:gap-6">
          {PODIUM.map(({ idx, h, medal, label }, i) => {
            const r = results[idx];
            if (!r) return <div key={idx} />;
            const c = color(r);
            return (
              <motion.div key={idx} className="flex flex-col items-center" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.15, type: "spring", stiffness: 120 }}>
                <motion.div whileHover={{ scale: 1.08, rotate: idx === 0 ? 0 : idx === 1 ? -3 : 3 }}>
                  <Avatar driver={r.Driver} color={c} size={idx === 0 ? 112 : 88} className={idx === 0 ? "ring-4 ring-yellow-400/40" : ""} />
                </motion.div>
                <div className="mt-3 text-center">
                  <div className="text-xs text-zinc-400">{r.Driver.givenName}</div>
                  <div className="text-sm font-black uppercase text-white sm:text-lg">{r.Driver.familyName}</div>
                  <div className="text-xs text-zinc-500">{teamMeta(r.Constructor).name}</div>
                  <div className="mt-1 text-xs tabular-nums text-zinc-400">{r.Time?.time ?? r.status}</div>
                </div>
                <motion.div className={`mt-3 w-full origin-bottom rounded-t-xl ${h} relative flex items-start justify-center overflow-hidden pt-3`}
                  style={{ background: `linear-gradient(180deg, ${c}55, ${c}10)` }} initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.15, duration: 0.6, ease: "easeOut" }}>
                  <span className={`bg-gradient-to-br bg-clip-text text-2xl font-black italic text-transparent sm:text-4xl ${medal}`}>{label}</span>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          {fastest && (
            <div className="card flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-lg">⏱</span>
              <div><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">Fastest lap</div><div className="font-bold text-white">{fastest.Driver.givenName} {fastest.Driver.familyName} · <span className="tabular-nums">{fastest.FastestLap!.Time.time}</span></div></div>
            </div>
          )}
          {gained && Number(gained.grid) - Number(gained.position) > 0 && (
            <div className="card flex items-center gap-3 p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-lg">🚀</span>
              <div><div className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">Biggest climber</div><div className="font-bold text-white">{gained.Driver.givenName} {gained.Driver.familyName} · +{Number(gained.grid) - Number(gained.position)} places</div></div>
            </div>
          )}
        </div>

        <div className="card overflow-hidden">
          {results.slice(0, 20).map((r, i) => {
            const c = color(r);
            const delta = r.grid && r.grid !== "0" ? Number(r.grid) - Number(r.position) : null;
            return (
              <motion.div key={r.Driver.driverId} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i, 10) * 0.03 }}
                className={`flex items-center gap-3 border-b border-white/5 px-4 py-2.5 transition-colors last:border-0 hover:bg-white/[0.03] ${i >= 10 ? "opacity-60" : ""}`}>
                <span className="w-7 text-center text-sm font-black text-zinc-500">{r.position}</span>
                <span className="h-6 w-1 rounded" style={{ background: c }} />
                <Avatar driver={r.Driver} color={c} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-white">{r.Driver.givenName} <span className="uppercase">{r.Driver.familyName}</span></div>
                  <div className="truncate text-xs text-zinc-500">{teamMeta(r.Constructor).name}</div>
                </div>
                {r.FastestLap?.rank === "1" && <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-black text-violet-300">FL</span>}
                {delta !== null && <span className={`hidden w-10 text-right text-xs font-bold sm:block ${delta > 0 ? "text-emerald-400" : delta < 0 ? "text-rose-400" : "text-zinc-600"}`}>{delta > 0 ? `▲${delta}` : delta < 0 ? `▼${-delta}` : "–"}</span>}
                <span className="hidden w-24 truncate text-right text-xs tabular-nums text-zinc-500 sm:block">{r.Time?.time ?? r.status}</span>
                <span className="w-12 text-right text-sm font-black text-white">{Number(r.points) > 0 ? `+${r.points}` : ""}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { countryIso, raceDate, raceStatus, teamMeta, weekendSessions, type RaceStatus } from "@/lib/f1";
import { useLive } from "./LiveData";
import { Flag, SectionHeader, Track, TrackPlaceholder } from "./ui";

const BADGE: Record<RaceStatus, { text: string; cls: string }> = {
  live:     { text: "LIVE",     cls: "bg-[var(--f1-red)] text-white" },
  weekend:  { text: "THIS WEEKEND", cls: "bg-amber-400 text-black" },
  next:     { text: "NEXT",     cls: "bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40" },
  done:     { text: "FINISHED", cls: "bg-white/5 text-zinc-500" },
  upcoming: { text: "UPCOMING", cls: "bg-white/5 text-zinc-400" },
};

export default function RaceSchedule() {
  const { data, tracks, now, selectRound, fmt } = useLive();
  const [filter, setFilter] = useState<"all" | "upcoming" | "done">("all");
  const scrolled = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);
  const races = data.schedule.map(r => ({ r, status: raceStatus(r, data.schedule, now) }));
  const shown = races.filter(({ status }) => filter === "all" || (filter === "done" ? status === "done" : status !== "done"));

  // On first load, scroll the calendar so the next race is in view.
  useEffect(() => {
    if (scrolled.current || !scroller.current) return;
    const el = scroller.current.querySelector<HTMLElement>("[data-current='true']");
    if (el) { scroller.current.scrollLeft = el.offsetLeft - 16; scrolled.current = true; }
  });

  return (
    <section id="schedule" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader kicker="Calendar" title="Race" accent="Calendar"
          sub={<span suppressHydrationWarning>{data.season} season · {data.schedule.length} rounds · statuses update automatically</span>}
          right={
            <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-bold">
              {(["all", "upcoming", "done"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} className={`relative rounded-full px-4 py-1.5 uppercase tracking-wider ${filter === f ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                  {filter === f && <motion.span layoutId="sched-pill" className="absolute inset-0 rounded-full bg-[var(--f1-red)]" />}
                  <span className="relative">{f === "done" ? "Results" : f}</span>
                </button>
              ))}
            </div>
          } />

        <div ref={scroller} className="no-scrollbar relative -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
          {shown.map(({ r, status }, i) => {
            const winner = data.winners[r.round];
            const d = tracks[r.Circuit.circuitId];
            const sprint = weekendSessions(r).some(s => s.key === "Sprint");
            const highlight = status === "live" || status === "weekend" || status === "next";
            return (
              <motion.button key={r.round} data-current={highlight} onClick={() => selectRound(r.round)}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: Math.min(i, 6) * 0.05 }}
                whileHover={{ y: -6 }}
                className={`card card-hover group relative w-[260px] shrink-0 snap-start overflow-hidden p-5 text-left ${highlight ? "!border-[var(--f1-red)]/50 shadow-[0_0_40px_-10px_rgba(225,6,0,0.5)]" : ""} ${status === "done" ? "opacity-80 hover:opacity-100" : ""}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Round {r.round}</div>
                    <div className="mt-1 text-4xl font-black leading-none text-white/90" suppressHydrationWarning>
                      {fmt(raceDate(r), { day: "2-digit" })}
                      <span className="ml-1 text-sm font-bold uppercase text-zinc-500">{fmt(raceDate(r), { month: "short" })}</span>
                    </div>
                  </div>
                  <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider ${BADGE[status].cls}`} suppressHydrationWarning>
                    {status === "live" && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />}{BADGE[status].text}
                  </span>
                </div>

                <div className="my-4 h-28">{d ? <Track d={d} car={highlight} className="h-full w-full transition-transform duration-500 group-hover:scale-105" color={highlight ? "#e10600" : "#71717a"} /> : <TrackPlaceholder />}</div>

                <div className="flex items-center gap-2">
                  <Flag iso={countryIso(r.Circuit.Location.country)} className="h-4 w-6" />
                  <div className="truncate font-black text-white">{r.raceName.replace(" Grand Prix", " GP")}</div>
                  {sprint && <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-violet-300">SPRINT</span>}
                </div>
                <div className="mt-0.5 truncate text-xs text-zinc-500">{r.Circuit.circuitName}</div>

                <div className="mt-4 flex h-8 items-center border-t border-white/5 pt-3 text-xs">
                  {winner ? (
                    <span className="flex items-center gap-2 truncate text-zinc-400">
                      🏆 <span className="h-3 w-0.5 rounded" style={{ background: teamMeta({ constructorId: winner.constructorId, name: winner.team }).color }} />
                      <span className="font-bold text-white">{winner.name}</span>
                    </span>
                  ) : (
                    <span className="font-semibold text-zinc-500 transition-colors group-hover:text-white">View circuit →</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

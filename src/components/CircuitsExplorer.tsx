"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { CIRCUITS, DOWNFORCE_LEVEL } from "@/data/circuits";
import { countryIso, raceDate, raceStatus, teamMeta, weekendSessions } from "@/lib/f1";
import { useLive } from "./LiveData";
import { Flag, SECTOR_COLORS, SectionHeader, Track, TrackPlaceholder } from "./ui";

export default function CircuitsExplorer() {
  const { data, tracks, now, selectedRound, selectRound, fmt } = useLive();
  const races = data.schedule;
  const idx = Math.max(0, races.findIndex(r => r.round === selectedRound));
  const race = races[idx];
  const strip = useRef<HTMLDivElement>(null);
  const go = (d: number) => {
    const r = races[(idx + d + races.length) % races.length];
    if (r) selectRound(r.round, false);
  };

  // Keep the selected round centred in the thumbnail strip.
  useEffect(() => {
    const el = strip.current?.querySelector<HTMLElement>(`[data-round='${race?.round}']`);
    if (el && strip.current) strip.current.scrollTo({ left: el.offsetLeft - strip.current.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [race?.round]);

  // Arrow-key navigation while the section is on screen.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const sec = document.getElementById("circuits")?.getBoundingClientRect();
      if (!sec || sec.top > innerHeight / 2 || sec.bottom < innerHeight / 2) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  if (!race) return null;

  const info = CIRCUITS[race.Circuit.circuitId];
  const d = tracks[race.Circuit.circuitId];
  const status = raceStatus(race, races, now);
  const winner = data.winners[race.round];
  const sessions = weekendSessions(race);
  const df = info ? DOWNFORCE_LEVEL[info.downforce] : 0;

  const stats = info ? [
    { l: "Laps", v: String(info.laps) }, { l: "Length", v: info.length }, { l: "Turns", v: String(info.turns) },
    { l: "Race distance", v: `${(info.laps * parseFloat(info.length)).toFixed(1)} km` }, { l: "Lap record", v: info.record, s: info.recordBy }, { l: "First GP", v: String(info.firstGP), s: info.type },
  ] : [];

  return (
    <section id="circuits" className="relative overflow-hidden pb-24 pt-24">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionHeader kicker="Circuits" title="Track" accent="Explorer" sub="Real layouts · animated lap · sector split · use ← → keys" />

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="card relative overflow-hidden p-5 lg:col-span-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <Flag iso={countryIso(race.Circuit.Location.country)} className="h-7 w-10" />
                <div className="min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div key={race.round} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                      <div className="truncate text-xl font-black text-white sm:text-2xl">{race.Circuit.circuitName}</div>
                      <div className="truncate text-xs text-zinc-500">{race.raceName} · Round {race.round} · {race.Circuit.Location.locality}</div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <span suppressHydrationWarning className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-black tracking-wider ${status === "done" ? "bg-emerald-500/15 text-emerald-400" : status === "live" ? "bg-[var(--f1-red)] text-white" : status === "upcoming" ? "bg-white/5 text-zinc-400" : "bg-amber-400/15 text-amber-300"}`}>
                {status === "done" ? "✓ COMPLETED" : status === "live" ? "● LIVE" : status === "upcoming" ? "UPCOMING" : "NEXT UP"}
              </span>
            </div>

            <div className="relative mt-4 flex aspect-[4/3] items-center justify-center rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04),transparent_70%)] sm:aspect-[16/10]">
              <AnimatePresence mode="wait">
                <motion.div key={race.round} className="absolute inset-0 p-4 sm:p-8"
                  initial={{ opacity: 0, scale: 0.9, rotate: -3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                  {d ? <Track d={d} detailed className="h-full w-full" lapSeconds={info ? Math.max(8, info.turns * 0.6) : 10} /> : <TrackPlaceholder label="Layout not available yet" />}
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-2 left-2 text-[10px] font-black uppercase tracking-[0.3em] text-white/5 sm:text-6xl">{race.Circuit.Location.country}</div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-400">
              {SECTOR_COLORS.map((c, i) => <span key={c} className="flex items-center gap-1.5"><span className="h-1 w-5 rounded" style={{ background: c }} />Sector {i + 1}</span>)}
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_#e10600]" />Car on track</span>
              <span className="ml-auto text-zinc-600">Sector split is approximate</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={race.round} className="flex flex-col gap-4 lg:col-span-2"
              initial="hidden" animate="show" exit={{ opacity: 0 }} variants={{ show: { transition: { staggerChildren: 0.05 } } }}>
              {winner && (
                <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="card relative overflow-hidden p-4">
                  <div className="absolute inset-0" style={{ background: `linear-gradient(110deg, ${teamMeta({ constructorId: winner.constructorId, name: winner.team }).color}30, transparent 60%)` }} />
                  <div className="relative">
                    <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-400">🏆 {data.season} winner</div>
                    <div className="text-lg font-black text-white">{winner.name}</div>
                    <div className="text-xs text-zinc-400">{teamMeta({ constructorId: winner.constructorId, name: winner.team }).name}</div>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
                {stats.map(s => (
                  <motion.div key={s.l} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="card p-3.5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">{s.l}</div>
                    <div className="mt-0.5 text-lg font-black leading-tight text-white">{s.v}</div>
                    {s.s && <div className="truncate text-[11px] text-zinc-500">{s.s}</div>}
                  </motion.div>
                ))}
              </div>

              {info && (
                <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="card p-4">
                  <div className="mb-2 flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500"><span>Downforce</span><span className="text-white">{info.downforce}</span></div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <motion.div key={n} className="h-2 flex-1 rounded-full" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2 + n * 0.08 }}
                        style={{ background: n <= df ? `hsl(${10 + n * 35} 90% 55%)` : "rgba(255,255,255,0.06)", transformOrigin: "left" }} />
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="card p-4">
                <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Weekend schedule · your time</div>
                <ul className="space-y-1 text-sm" suppressHydrationWarning>
                  {sessions.map(s => (
                    <li key={s.key} className={`flex justify-between ${now > s.end ? "text-zinc-600" : "text-zinc-300"}`}>
                      <span className="font-semibold">{s.label}</span>
                      <span className="tabular-nums text-xs">{fmt(s.start, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <div className="mt-auto flex items-center gap-3">
                <button onClick={() => go(-1)} aria-label="Previous circuit" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-white transition-all hover:scale-110 hover:bg-[var(--f1-red)]">‹</button>
                <div className="flex-1 text-center text-sm font-bold text-zinc-500" suppressHydrationWarning>
                  {fmt(raceDate(race), { day: "numeric", month: "long", year: "numeric" })}<span className="mx-2 text-zinc-700">·</span>{idx + 1}/{races.length}
                </div>
                <button onClick={() => go(1)} aria-label="Next circuit" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl text-white transition-all hover:scale-110 hover:bg-[var(--f1-red)]">›</button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div ref={strip} className="no-scrollbar relative -mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-2">
          {races.map(r => {
            const t = tracks[r.Circuit.circuitId];
            const sel = r.round === race.round;
            return (
              <button key={r.round} data-round={r.round} onClick={() => selectRound(r.round, false)} title={r.raceName}
                className={`relative flex w-20 shrink-0 flex-col items-center gap-1 rounded-xl border p-2 transition-all ${sel ? "border-[var(--f1-red)] bg-[var(--f1-red)]/10" : "border-white/5 bg-white/[0.02] opacity-60 hover:opacity-100"}`}>
                <div className="h-10 w-full">{t ? <Track d={t} car={false} className="h-full w-full" color={sel ? "#e10600" : "#52525b"} /> : <div className="h-full" />}</div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-400"><Flag iso={countryIso(r.Circuit.Location.country)} className="h-2.5 w-3.5" />R{r.round}</div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

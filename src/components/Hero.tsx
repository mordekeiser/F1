"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { countryIso, fullName, liveSession, nextRace, roundsCompleted, teamMeta, weekendSessions, type Race } from "@/lib/f1";
import { useLive } from "./LiveData";
import { Avatar, Flag, Track } from "./ui";

function Digit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="card relative flex h-16 w-16 items-center justify-center overflow-hidden sm:h-20 sm:w-20">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={v} initial={{ y: "-60%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "60%", opacity: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-3xl font-black tabular-nums text-white sm:text-4xl">{v}</motion.span>
        </AnimatePresence>
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/40" />
      </div>
      <span className="mt-2 text-[10px] font-bold tracking-[0.25em] text-zinc-500">{label}</span>
    </div>
  );
}

function Countdown({ targetMs, onZero }: { targetMs: number; onZero: () => void }) {
  const [diff, setDiff] = useState<number | null>(null);
  useEffect(() => {
    let fired = false;
    const tick = () => {
      const d = targetMs - Date.now();
      setDiff(Math.max(0, d));
      if (d <= 0 && !fired) { fired = true; onZero(); }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs, onZero]);
  const d = diff ?? 0;
  return (
    <div className="flex gap-2 sm:gap-3" suppressHydrationWarning>
      <Digit value={Math.floor(d / 86400000)} label="DAYS" />
      <Digit value={Math.floor((d % 86400000) / 3600000)} label="HRS" />
      <Digit value={Math.floor((d % 3600000) / 60000)} label="MIN" />
      <Digit value={Math.floor((d % 60000) / 1000)} label="SEC" />
    </div>
  );
}

function WeekendCard({ race }: { race: Race }) {
  const { tracks, now, fmt } = useLive();
  const sessions = weekendSessions(race);
  const d = tracks[race.Circuit.circuitId];
  return (
    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.7 }} className="card w-full max-w-md p-5 text-left">
      <div className="flex items-center gap-3">
        <Flag iso={countryIso(race.Circuit.Location.country)} className="h-6 w-9" />
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Round {race.round} · Race weekend</div>
          <div className="truncate text-lg font-black text-white">{race.raceName}</div>
        </div>
      </div>
      <div className="mt-4 flex gap-4">
        <div className="h-28 w-28 shrink-0">{d && <Track d={d} className="h-full w-full" lapSeconds={7} />}</div>
        <ul className="flex-1 space-y-1.5 text-sm" suppressHydrationWarning>
          {sessions.map(s => {
            const isLive = now >= s.start && now <= s.end, isDone = now > s.end;
            return (
              <li key={s.key} className={`flex items-center justify-between gap-2 ${isDone ? "text-zinc-600 line-through decoration-zinc-700" : "text-zinc-300"}`}>
                <span className="flex items-center gap-1.5 font-semibold">{isLive && <span className="live-dot" />}{s.label}</span>
                <span className="tabular-nums text-xs text-zinc-500">{fmt(s.start, { weekday: "short", hour: "2-digit", minute: "2-digit" })}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="mt-3 text-right text-[10px] uppercase tracking-widest text-zinc-600">Times shown in your timezone</div>
    </motion.div>
  );
}

export default function Hero() {
  const { data, now, refresh } = useLive();
  const next = nextRace(data.schedule, now);
  const live = liveSession(data.schedule, now);
  const done = roundsCompleted(data.schedule, now);
  const [p1, p2] = data.drivers;
  const leaderColor = p1 ? (data.media[p1.Driver.driverId]?.color ?? teamMeta(p1.Constructors[0]).color) : "#e10600";
  const target = next ? (weekendSessions(next).find(s => s.end > now) ?? weekendSessions(next).at(-1)!) : null;
  const seasonOver = !next && data.schedule.length > 0;

  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pb-16 pt-28">
      <div className="bg-grid absolute inset-0" />
      <motion.div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(225,6,0,0.25), transparent)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      {[22, 41, 63, 78].map((top, i) => <div key={i} className="speed-line" style={{ top: `${top}%`, animationDelay: `${i * 0.9}s`, opacity: 0.25 + i * 0.12 }} />)}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 text-center">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className={`mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${live ? "border-[var(--f1-red)] bg-[var(--f1-red)]/20" : "border-[var(--f1-red)]/30 bg-[var(--f1-red)]/10"}`}>
          <span className="live-dot" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/90">
            {live ? `Live now · ${live.session.label} · ${live.race.raceName}` : `${data.season} World Championship · Live data`}
          </span>
        </motion.div>

        <h1 className="text-[clamp(56px,13vw,150px)] font-black italic leading-[0.85] tracking-tighter text-white">
          {"F1".split("").map((c, i) => (
            <motion.span key={i} className="inline-block" initial={{ opacity: 0, y: 80, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>{c}</motion.span>
          ))}
          {"NEXUS".split("").map((c, i) => (
            <motion.span key={i} className="text-gradient inline-block pr-[0.02em]" initial={{ opacity: 0, y: 80, rotate: -6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 0.12 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>{c}</motion.span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.7 }} className="mb-12 mt-5 text-sm font-semibold uppercase tracking-[0.4em] text-zinc-400 sm:text-base">
          The live Formula 1 hub
        </motion.p>

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }} className="flex flex-col items-center gap-6 lg:items-start">
            {target && next ? (
              <>
                <div className="text-sm font-bold uppercase tracking-[0.25em] text-zinc-400" suppressHydrationWarning>
                  {live ? "Session ends in" : `${target.label} starts in`}
                </div>
                <Countdown targetMs={(live ? live.session.end : target.start).getTime()} onZero={refresh} />
              </>
            ) : seasonOver ? (
              <div className="text-2xl font-black text-white">Season complete 🏁</div>
            ) : null}

            <div className="grid w-full max-w-md grid-cols-3 gap-3">
              <div className="card col-span-3 flex items-center gap-4 p-4 text-left sm:col-span-2">
                {p1 && <Avatar driver={p1.Driver} color={leaderColor} size={56} />}
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Championship leader</div>
                  <div className="truncate text-lg font-black text-white">{p1 ? fullName(p1.Driver) : "—"}</div>
                  <div className="text-xs text-zinc-400">
                    <span className="font-bold" style={{ color: leaderColor }}>{p1?.points ?? 0} pts</span>
                    {p2 && <> · +{Number(p1.points) - Number(p2.points)} over {p2.Driver.familyName}</>}
                  </div>
                </div>
              </div>
              <div className="card col-span-3 flex flex-col justify-center p-4 sm:col-span-1">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Rounds</div>
                <div className="text-2xl font-black text-white" suppressHydrationWarning>{done}<span className="text-zinc-600">/{data.schedule.length}</span></div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                  <motion.div className="h-full bg-[var(--f1-red)]" initial={{ width: 0 }} animate={{ width: `${(done / Math.max(1, data.schedule.length)) * 100}%` }} transition={{ delay: 1, duration: 1.2 }} />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center lg:justify-end">{next && <WeekendCard race={next} />}</div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-12 flex flex-wrap justify-center gap-3">
          <a href="#standings" className="group relative overflow-hidden rounded-xl bg-[var(--f1-red)] px-7 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105">
            <span className="relative z-10">Live standings</span><span className="shimmer absolute inset-0" />
          </a>
          <a href="#circuits" className="rounded-xl border border-white/10 bg-white/5 px-7 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:scale-105 hover:bg-white/10">Explore circuits</a>
        </motion.div>
      </div>

      <motion.a href="#schedule" aria-label="Scroll down" className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500" animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
      </motion.a>
    </section>
  );
}

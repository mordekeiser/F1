"use client";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { countryIso, fullName, liveSession, nextRace, raceDate, roundsCompleted, teamMeta, weekendSessions, type Race } from "@/lib/f1";
import { useLive } from "./LiveData";
import { Avatar, Flag, Track } from "./ui";
import WinnersTicker from "./WinnersTicker";

/* ---------- countdown ---------- */

function Digit({ value, label }: { value: number; label: string }) {
  const v = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] sm:h-16 sm:w-16">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={v} initial={{ y: "-60%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "60%", opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }}
            className="text-2xl font-black tabular-nums text-white sm:text-3xl">{v}</motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-1.5 text-[9px] font-bold tracking-[0.25em] text-zinc-500">{label}</span>
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
    <div className="flex gap-2">
      <Digit value={Math.floor(d / 86400000)} label="DAYS" />
      <Digit value={Math.floor((d % 86400000) / 3600000)} label="HRS" />
      <Digit value={Math.floor((d % 3600000) / 60000)} label="MIN" />
      <Digit value={Math.floor((d % 60000) / 1000)} label="SEC" />
    </div>
  );
}

/* ---------- module card shell ---------- */

const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } } };

function Module({ href, kicker, title, className = "", children }: { href: string; kicker: string; title: string; className?: string; children: React.ReactNode }) {
  return (
    <motion.div variants={item} className={className}>
      <Link href={href} className="card group relative flex h-full flex-col overflow-hidden p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_60px_-20px_rgba(225,6,0,0.35)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(225,6,0,0.12),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative mb-4 flex items-start justify-between">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--f1-red)]">{kicker}</div>
            <h2 className="mt-0.5 text-xl font-black text-white">{title}</h2>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all duration-300 group-hover:border-[var(--f1-red)] group-hover:bg-[var(--f1-red)] group-hover:text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-300 group-hover:translate-x-0.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </div>
        <div className="relative flex-1">{children}</div>
      </Link>
    </motion.div>
  );
}

/* ---------- dashboard ---------- */

export default function Dashboard() {
  const { data, tracks, now, fmt, refresh } = useLive();
  const next = nextRace(data.schedule, now);
  const live = liveSession(data.schedule, now);
  const done = roundsCompleted(data.schedule, now);
  const sessions = next ? weekendSessions(next) : [];
  const target = sessions.find(s => s.end > now);
  const colorOf = (driverId: string, c?: { constructorId: string; name: string }) => data.media[driverId]?.color ?? teamMeta(c).color;
  const upcoming: Race[] = data.schedule.filter(r => raceDate(r) > now).slice(0, 3);
  const podium = data.lastRace?.Results?.slice(0, 3) ?? [];
  const nextTrack = next ? tracks[next.Circuit.circuitId] : undefined;

  return (
    <div className="relative">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[520px]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side, rgba(225,6,0,0.18), transparent)" }} />

      {/* Header */}
      <section className="relative mx-auto max-w-7xl px-5 pb-8 pt-28">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_1fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 ${live ? "border-[var(--f1-red)] bg-[var(--f1-red)]/20" : "border-white/10 bg-white/[0.03]"}`}>
              <span className="live-dot" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                {live ? `Live · ${live.session.label} · ${live.race.raceName}` : `${data.season} season · Round ${done} of ${data.schedule.length}`}
              </span>
            </div>
            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
              Formula 1,<br /><span className="text-gradient">live and in one place.</span>
            </h1>
            <p className="mt-4 max-w-md text-zinc-400">Standings, results and the full calendar update on their own. Pick a module below to dive in.</p>
          </motion.div>

          {next && target ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }} className="card p-5">
              <div className="flex items-center gap-3">
                <Flag iso={countryIso(next.Circuit.Location.country)} className="h-6 w-9" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">Round {next.round} · Up next</div>
                  <div className="truncate text-lg font-black text-white">{next.raceName}</div>
                </div>
                <div className="hidden h-14 w-14 shrink-0 sm:block">{nextTrack && <Track d={nextTrack} car className="h-full w-full" lapSeconds={7} />}</div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="mb-2 text-xs font-semibold text-zinc-400">{live ? `${live.session.label} ends in` : `${target.label} starts in`}</div>
                  <Countdown targetMs={(live ? live.session.end : target.start).getTime()} onZero={refresh} />
                </div>
                <ul className="min-w-[180px] flex-1 space-y-1 text-xs">
                  {sessions.map(s => {
                    const isLive = now >= s.start && now <= s.end, past = now > s.end;
                    return (
                      <li key={s.key} className={`flex justify-between gap-3 ${past ? "text-zinc-600 line-through" : "text-zinc-300"}`}>
                        <span className="flex items-center gap-1.5 font-semibold">{isLive && <span className="live-dot" />}{s.label}</span>
                        <span className="tabular-nums text-zinc-500">{fmt(s.start, { weekday: "short", hour: "2-digit", minute: "2-digit" })}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          ) : (
            <div className="card p-6 text-center text-xl font-black text-white">Season complete 🏁</div>
          )}
        </div>
      </section>

      <WinnersTicker />

      {/* Modules */}
      <motion.section initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } } }}
        className="relative mx-auto grid max-w-7xl auto-rows-[minmax(0,auto)] gap-4 px-5 py-10 md:grid-cols-2 lg:grid-cols-3">

        <Module href="/standings" kicker="Championship" title="Standings" className="lg:row-span-2">
          <ol className="space-y-2.5">
            {data.drivers.slice(0, 6).map(s => {
              const c = colorOf(s.Driver.driverId, s.Constructors[0]);
              return (
                <li key={s.Driver.driverId} className="flex items-center gap-3">
                  <span className="w-4 text-center text-xs font-black text-zinc-500">{s.position}</span>
                  <Avatar driver={s.Driver} color={c} size={34} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-white">{s.Driver.familyName.toUpperCase()}</div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/5">
                      <motion.div className="h-full rounded-full" style={{ background: c }} initial={{ width: 0 }} animate={{ width: `${(Number(s.points) / (Number(data.drivers[0].points) || 1)) * 100}%` }} transition={{ delay: 0.5, duration: 1 }} />
                    </div>
                  </div>
                  <span className="w-10 text-right text-sm font-black tabular-nums text-white">{s.points}</span>
                </li>
              );
            })}
          </ol>
          <div className="mt-5 border-t border-white/5 pt-4">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Constructors</div>
            {data.constructors.slice(0, 3).map(c => {
              const t = teamMeta(c.Constructor);
              return (
                <div key={c.Constructor.constructorId} className="flex items-center justify-between py-1 text-sm">
                  <span className="flex items-center gap-2 text-zinc-300"><span className="h-3 w-1 rounded" style={{ background: t.color }} />{t.name}</span>
                  <span className="font-bold tabular-nums text-white">{c.points}</span>
                </div>
              );
            })}
          </div>
        </Module>

        <Module href="/calendar" kicker={`${done} of ${data.schedule.length} complete`} title="Calendar">
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/5">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-[var(--f1-red)] to-orange-400" initial={{ width: 0 }} animate={{ width: `${(done / Math.max(1, data.schedule.length)) * 100}%` }} transition={{ delay: 0.5, duration: 1.2 }} />
          </div>
          <ul className="space-y-2">
            {upcoming.map((r, i) => (
              <li key={r.round} className={`flex items-center gap-3 rounded-lg px-2 py-1.5 ${i === 0 ? "bg-white/[0.04]" : ""}`}>
                <div className="w-9 text-center leading-none">
                  <div className="text-lg font-black text-white">{fmt(raceDate(r), { day: "2-digit" })}</div>
                  <div className="text-[9px] font-bold uppercase text-zinc-500">{fmt(raceDate(r), { month: "short" })}</div>
                </div>
                <Flag iso={countryIso(r.Circuit.Location.country)} className="h-3.5 w-5" />
                <span className="truncate text-sm font-semibold text-zinc-200">{r.raceName.replace(" Grand Prix", " GP")}</span>
              </li>
            ))}
            {!upcoming.length && <li className="text-sm text-zinc-500">No races left this season.</li>}
          </ul>
        </Module>

        <Module href="/circuits" kicker={next ? next.Circuit.Location.locality : "Track explorer"} title="Circuits">
          <div className="flex h-44 items-center justify-center">
            {nextTrack ? <Track d={nextTrack} detailed className="h-full w-full" lapSeconds={9} /> : <span className="text-sm text-zinc-500">Explore every layout</span>}
          </div>
          {next && <div className="mt-2 truncate text-center text-xs text-zinc-500">{next.Circuit.circuitName}</div>}
        </Module>

        <Module href="/results" kicker={data.lastRace ? data.lastRace.raceName : "Latest"} title="Last race">
          <div className="grid grid-cols-3 items-end gap-2">
            {[1, 0, 2].map(i => {
              const r = podium[i];
              if (!r) return <div key={i} />;
              const c = colorOf(r.Driver.driverId, r.Constructor);
              return (
                <div key={i} className="flex flex-col items-center">
                  <Avatar driver={r.Driver} color={c} size={i === 0 ? 64 : 50} className={i === 0 ? "ring-2 ring-yellow-400/50" : ""} />
                  <div className="mt-1.5 max-w-full truncate text-xs font-black uppercase text-white">{r.Driver.familyName}</div>
                  <div className={`mt-1.5 flex w-full items-start justify-center rounded-t-md pt-1 text-xs font-black ${i === 0 ? "h-12" : i === 1 ? "h-9" : "h-6"}`} style={{ background: `linear-gradient(180deg, ${c}55, ${c}10)` }}>{i + 1}</div>
                </div>
              );
            })}
          </div>
        </Module>

        <Module href="/drivers" kicker={`${data.drivers.filter(d => d.Driver.permanentNumber).length} on the grid`} title="Drivers">
          <div className="flex flex-wrap gap-1.5">
            {data.drivers.filter(d => d.Driver.permanentNumber).slice(0, 14).map((s, i) => (
              <motion.div key={s.Driver.driverId} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + i * 0.03 }} title={fullName(s.Driver)}>
                <Avatar driver={s.Driver} color={colorOf(s.Driver.driverId, s.Constructors[0])} size={40} className="transition-transform hover:scale-110" />
              </motion.div>
            ))}
          </div>
          {p1Line(data)}
        </Module>

        <Module href="/teams" kicker={`${data.constructors.length} constructors`} title="Teams" className="md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-11">
            {data.constructors.map(c => {
              const t = teamMeta(c.Constructor);
              return t.logo ? (
                <div key={c.Constructor.constructorId} title={t.name} className="flex aspect-square items-center justify-center rounded-xl bg-white p-1.5 transition-transform group-hover:scale-[1.03]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.logo} alt={t.name} className="h-full w-full object-contain" />
                </div>
              ) : null;
            })}
          </div>
        </Module>
      </motion.section>
    </div>
  );
}

function p1Line(data: ReturnType<typeof useLive>["data"]) {
  const [a, b] = data.drivers;
  if (!a || !b) return null;
  return <div className="mt-4 text-xs text-zinc-500"><span className="font-bold text-white">{a.Driver.familyName}</span> leads by {Number(a.points) - Number(b.points)} pts</div>;
}

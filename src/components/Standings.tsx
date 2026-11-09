"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { fullName, nationalityIso, teamMeta } from "@/lib/f1";
import { useLive } from "./LiveData";
import { Avatar, CountUp, Flag, SectionHeader } from "./ui";

const medal = (p: string) =>
  p === "1" ? "bg-gradient-to-br from-yellow-300 to-amber-500 text-black" : p === "2" ? "bg-gradient-to-br from-zinc-100 to-zinc-400 text-black" : p === "3" ? "bg-gradient-to-br from-amber-500 to-amber-800 text-white" : "bg-white/5 text-zinc-400";

function Delta({ v }: { v?: number }) {
  return (
    <AnimatePresence>
      {v ? <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="ml-2 rounded bg-emerald-500/15 px-1.5 text-xs font-bold text-emerald-400">+{v}</motion.span> : null}
    </AnimatePresence>
  );
}

export default function Standings() {
  const { data, deltas } = useLive();
  const [tab, setTab] = useState<"drivers" | "constructors">("drivers");
  const maxD = Number(data.drivers[0]?.points ?? 1) || 1;
  const maxC = Number(data.constructors[0]?.points ?? 1) || 1;
  const leaderPts = Number(data.drivers[0]?.points ?? 0);

  return (
    <section id="standings" className="relative pb-24 pt-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[var(--f1-red)]/[0.03] to-transparent" />
      <div className="relative mx-auto max-w-5xl px-5">
        <SectionHeader kicker="Standings" title="World" accent="Standings"
          sub={<>Updates automatically after every session · positions animate when they change</>}
          right={
            <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1 text-sm font-bold">
              {(["drivers", "constructors"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} className={`relative rounded-full px-5 py-2 capitalize ${tab === t ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}>
                  {tab === t && <motion.span layoutId="stand-pill" className="absolute inset-0 rounded-full bg-[var(--f1-red)]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                  <span className="relative">{t}</span>
                </button>
              ))}
            </div>
          } />

        <AnimatePresence mode="wait">
          {tab === "drivers" ? (
            <motion.ol key="d" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-2">
              {data.drivers.map((s, i) => {
                const team = teamMeta(s.Constructors[0]);
                const color = data.media[s.Driver.driverId]?.color ?? team.color;
                const pts = Number(s.points);
                return (
                  <motion.li layout key={s.Driver.driverId} transition={{ layout: { type: "spring", stiffness: 300, damping: 30 } }}
                    initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="card card-hover group relative overflow-hidden px-4 py-3" style={{ ["--c" as string]: color }}>
                    <div className="absolute inset-y-0 left-0 w-1" style={{ background: color }} />
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `linear-gradient(90deg, ${color}1f, transparent 60%)` }} />
                    <div className="relative flex items-center gap-3 sm:gap-4">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-black ${medal(s.position)}`}>{s.position}</span>
                      <Avatar driver={s.Driver} color={color} size={44} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Flag iso={nationalityIso(s.Driver.nationality)} className="h-3 w-[18px]" title={s.Driver.nationality} />
                          <span className="truncate font-bold text-white"><span className="hidden text-zinc-400 sm:inline">{s.Driver.givenName} </span>{s.Driver.familyName.toUpperCase()}</span>
                          {s.position === "1" && <span className="rounded bg-[var(--f1-red)]/20 px-1.5 py-0.5 text-[9px] font-black tracking-wider text-[var(--f1-red)]">LEADER</span>}
                        </div>
                        <div className="mt-1.5 flex items-center gap-3">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                            <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}aa, ${color})` }}
                              initial={{ width: 0 }} whileInView={{ width: `${(pts / maxD) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.1, delay: Math.min(i, 10) * 0.04, ease: "easeOut" }} />
                          </div>
                          <span className="hidden w-28 truncate text-xs text-zinc-500 sm:block">{team.name}</span>
                        </div>
                      </div>
                      <div className="w-20 text-right">
                        <div className="text-xl font-black text-white"><CountUp value={pts} /><Delta v={deltas[s.Driver.driverId]} /></div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{i === 0 ? `${s.wins} wins` : `-${leaderPts - pts}`}</div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ol>
          ) : (
            <motion.ol key="c" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              {data.constructors.map((s, i) => {
                const team = teamMeta(s.Constructor);
                const drivers = data.drivers.filter(d => d.Constructors[0]?.constructorId === s.Constructor.constructorId).slice(0, 2);
                const color = (drivers[0] && data.media[drivers[0].Driver.driverId]?.color) || team.color;
                const pts = Number(s.points);
                return (
                  <motion.li layout key={s.Constructor.constructorId} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="card card-hover group relative overflow-hidden p-4">
                    <div className="absolute inset-0 opacity-60" style={{ background: `linear-gradient(100deg, ${color}26, transparent 45%)` }} />
                    <div className="relative flex items-center gap-4">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black ${medal(s.position)}`}>{s.position}</span>
                      {team.logo && (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white p-1.5 transition-transform group-hover:rotate-[-4deg] group-hover:scale-110">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={team.logo} alt={team.name} className="h-full w-full object-contain" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-lg font-black text-white">{team.name}</div>
                        <div className="mt-1 flex -space-x-2">
                          {drivers.map(d => <Avatar key={d.Driver.driverId} driver={d.Driver} color={color} size={26} className="ring-2 ring-[var(--bg)]" />)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-white"><CountUp value={pts} /><Delta v={deltas[`c:${s.Constructor.constructorId}`]} /></div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{s.wins} wins</div>
                      </div>
                    </div>
                    <div className="relative mt-3 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} whileInView={{ width: `${(pts / maxC) * 100}%` }} viewport={{ once: true }} transition={{ duration: 1.3, delay: i * 0.05 }} />
                    </div>
                  </motion.li>
                );
              })}
            </motion.ol>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

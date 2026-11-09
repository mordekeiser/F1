"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { fullName, nationalityIso, teamMeta, type DriverStanding } from "@/lib/f1";
import { useLive } from "./LiveData";
import { Avatar, Flag, SectionHeader } from "./ui";

function age(dob?: string) {
  if (!dob) return null;
  const b = new Date(dob), n = new Date();
  return n.getFullYear() - b.getFullYear() - (n < new Date(n.getFullYear(), b.getMonth(), b.getDate()) ? 1 : 0);
}

function Headshot({ s, color, className = "" }: { s: DriverStanding; color: string; className?: string }) {
  const { data } = useLive();
  const src = data.media[s.Driver.driverId]?.headshot;
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={fullName(s.Driver)} loading="lazy" onError={() => setFailed(true)} className={`object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] ${className}`} />
  ) : (
    <div className={`flex items-end justify-center ${className}`}><Avatar driver={s.Driver} color={color} size={96} className="mb-4" /></div>
  );
}

export default function DriversGrid() {
  const { data } = useLive();
  const [selected, setSelected] = useState<DriverStanding | null>(null);
  // Only drivers who have actually raced (hides one-off entries without a car number).
  const drivers = data.drivers.filter(d => d.Driver.permanentNumber);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [selected]);

  const colorOf = (s: DriverStanding) => data.media[s.Driver.driverId]?.color ?? teamMeta(s.Constructors[0]).color;

  return (
    <section id="drivers" className="relative py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader kicker="The grid" title={data.season} accent="Drivers" sub="Tap a driver for their profile · line-ups follow the live standings" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {drivers.map((s, i) => {
            const color = colorOf(s);
            const team = teamMeta(s.Constructors[0]);
            return (
              <motion.button key={s.Driver.driverId} layoutId={`driver-${s.Driver.driverId}`} onClick={() => setSelected(s)}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ delay: (i % 5) * 0.05 }}
                whileHover={{ y: -8 }} className="group relative h-72 overflow-hidden rounded-2xl border border-white/5 text-left"
                style={{ background: `linear-gradient(160deg, ${color}55 0%, ${color}14 45%, #0e0e11 80%)` }}>
                <div className="absolute -right-2 top-1 text-[110px] font-black italic leading-none text-white/[0.07] transition-all duration-500 group-hover:text-white/[0.14]">{s.Driver.permanentNumber}</div>
                <div className="absolute left-4 top-4 flex items-center gap-2">
                  <span className="rounded-md bg-black/40 px-2 py-0.5 text-xs font-black text-white backdrop-blur">P{s.position}</span>
                  <Flag iso={nationalityIso(s.Driver.nationality)} className="h-3.5 w-5" />
                </div>
                <Headshot s={s} color={color} className="absolute inset-x-0 bottom-14 mx-auto h-48 w-full transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-4 pt-10">
                  <div className="text-xs font-semibold text-zinc-400">{s.Driver.givenName}</div>
                  <div className="truncate text-lg font-black uppercase leading-tight text-white">{s.Driver.familyName}</div>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 truncate text-zinc-400"><span className="h-2.5 w-0.5 rounded" style={{ background: color }} />{team.name}</span>
                    <span className="font-black text-white">{s.points}<span className="ml-0.5 font-semibold text-zinc-500">pts</span></span>
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: color }} />
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && (() => {
          const color = colorOf(selected);
          const team = teamMeta(selected.Constructors[0]);
          const leader = Number(data.drivers[0]?.points ?? 1) || 1;
          const teammate = data.drivers.find(d => d !== selected && d.Constructors[0]?.constructorId === selected.Constructors[0]?.constructorId);
          const podiums = Object.values(data.winners).filter(w => w.driverId === selected.Driver.driverId).length;
          return (
            <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}>
              <motion.div layoutId={`driver-${selected.Driver.driverId}`} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={fullName(selected.Driver)}
                className="relative grid w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0e0e11] sm:grid-cols-2"
                style={{ backgroundImage: `linear-gradient(140deg, ${color}40, transparent 55%)` }}>
                <button onClick={() => setSelected(null)} aria-label="Close" className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-[var(--f1-red)]">✕</button>
                <div className="relative h-64 sm:h-auto">
                  <div className="absolute left-5 top-3 text-[150px] font-black italic leading-none text-white/[0.08]">{selected.Driver.permanentNumber}</div>
                  <Headshot s={selected} color={color} className="absolute inset-0 h-full w-full pt-6" />
                </div>
                <motion.div className="p-6 sm:p-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                  <div className="flex items-center gap-2 text-sm text-zinc-400"><Flag iso={nationalityIso(selected.Driver.nationality)} className="h-4 w-6" />{selected.Driver.nationality}</div>
                  <h3 className="mt-2 text-3xl font-black leading-none text-white">{selected.Driver.givenName}<br /><span className="uppercase" style={{ color }}>{selected.Driver.familyName}</span></h3>
                  <div className="mt-2 text-sm text-zinc-400">{team.name} · #{selected.Driver.permanentNumber}</div>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {[{ l: "Position", v: `P${selected.position}` }, { l: "Points", v: selected.points }, { l: "Wins", v: selected.wins }].map(x => (
                      <div key={x.l} className="rounded-xl bg-white/5 p-3 text-center"><div className="text-xl font-black text-white">{x.v}</div><div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{x.l}</div></div>
                    ))}
                  </div>
                  <div className="mt-5">
                    <div className="mb-1 flex justify-between text-xs text-zinc-500"><span>Points vs leader</span><span>{Math.round((Number(selected.points) / leader) * 100)}%</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/5"><motion.div className="h-full rounded-full" style={{ background: color }} initial={{ width: 0 }} animate={{ width: `${(Number(selected.points) / leader) * 100}%` }} transition={{ delay: 0.3, duration: 0.9 }} /></div>
                  </div>
                  <dl className="mt-5 space-y-2 text-sm">
                    {selected.Driver.dateOfBirth && <div className="flex justify-between"><dt className="text-zinc-500">Age</dt><dd className="text-white">{age(selected.Driver.dateOfBirth)}</dd></div>}
                    {teammate && <div className="flex justify-between"><dt className="text-zinc-500">Teammate</dt><dd className="text-white">{fullName(teammate.Driver)} ({teammate.points} pts)</dd></div>}
                    <div className="flex justify-between"><dt className="text-zinc-500">GP wins this season</dt><dd className="text-white">{podiums}</dd></div>
                    <div className="flex justify-between"><dt className="text-zinc-500">Engine</dt><dd className="text-white">{team.engine}</dd></div>
                  </dl>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </section>
  );
}

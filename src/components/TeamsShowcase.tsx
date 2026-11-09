"use client";
import { motion } from "framer-motion";
import { teamMeta } from "@/lib/f1";
import { useLive } from "./LiveData";
import { Avatar, SectionHeader } from "./ui";

export default function TeamsShowcase() {
  const { data } = useLive();
  return (
    <section id="teams" className="relative pb-24 pt-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionHeader kicker="Teams" title={data.season} accent="Teams" sub={`${data.constructors.length} teams · ordered by championship position`} />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {data.constructors.map((c, i) => {
            const team = teamMeta(c.Constructor);
            const drivers = data.drivers.filter(d => d.Constructors[0]?.constructorId === c.Constructor.constructorId);
            const color = (drivers[0] && data.media[drivers[0].Driver.driverId]?.color) || team.color;
            return (
              <motion.div key={c.Constructor.constructorId} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % 3) * 0.08 }}
                whileHover={{ y: -6 }} className="card group relative overflow-hidden">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-60" style={{ background: color }} />
                <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
                <div className="relative p-6">
                  <div className="flex items-center gap-4">
                    {team.logo && (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white p-2 shadow-lg transition-transform duration-500 group-hover:rotate-[-6deg] group-hover:scale-110">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={team.logo} alt={team.name} className="h-full w-full object-contain" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-xl font-black text-white">{team.name}</h3>
                      <div className="text-xs text-zinc-500">P{c.position} · {c.points} pts · {c.wins} wins</div>
                    </div>
                    <div className="text-5xl font-black italic text-white/[0.06]">{c.position}</div>
                  </div>
                  <dl className="mt-5 grid grid-cols-3 gap-2 text-xs">
                    {[{ l: "Base", v: team.base }, { l: "Principal", v: team.principal }, { l: "Power unit", v: team.engine }].map(x => (
                      <div key={x.l} className="rounded-lg bg-white/[0.03] p-2"><dt className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">{x.l}</dt><dd className="mt-0.5 font-semibold leading-tight text-zinc-200">{x.v}</dd></div>
                    ))}
                  </dl>
                  <div className="mt-4 space-y-2">
                    {drivers.map(d => (
                      <div key={d.Driver.driverId} className="flex items-center gap-3 rounded-xl bg-white/[0.03] p-2 pr-3">
                        <Avatar driver={d.Driver} color={color} size={36} />
                        <div className="min-w-0 flex-1 truncate text-sm font-bold text-white">{d.Driver.givenName} <span className="uppercase">{d.Driver.familyName}</span></div>
                        <span className="text-xs font-bold text-zinc-400">{d.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

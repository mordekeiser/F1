"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { liveSession } from "@/lib/f1";
import { useLive } from "./LiveData";

const links = [
  { label: "Home", id: "home" }, { label: "Calendar", id: "schedule" }, { label: "Standings", id: "standings" },
  { label: "Circuits", id: "circuits" }, { label: "Drivers", id: "drivers" }, { label: "Teams", id: "teams" }, { label: "Results", id: "results" },
];

export default function Navbar() {
  const { data, now, syncing, lastSync, refresh } = useLive();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const live = liveSession(data.schedule, now);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(l => { const el = document.getElementById(l.id); if (el) io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-white/5 bg-black/70 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <a href="#home" className="group flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-[var(--f1-red)] text-sm font-black italic text-white">
            F1<span className="shimmer absolute inset-0" />
          </span>
          <span className="text-lg font-black tracking-tight text-white">NEXUS</span>
          <span className="mt-0.5 text-xs font-semibold text-zinc-500">{data.season}</span>
        </a>

        <div className="hidden items-center gap-0.5 rounded-full border border-white/5 bg-white/[0.03] p-1 lg:flex">
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} className={`relative rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${active === l.id ? "text-white" : "text-zinc-400 hover:text-white"}`}>
              {active === l.id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{l.label}</span>
            </a>
          ))}
        </div>

        <button onClick={refresh} title="Refresh now"
          className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors sm:flex ${live ? "border-[var(--f1-red)]/50 bg-[var(--f1-red)]/15 text-white" : "border-white/10 bg-white/[0.03] text-zinc-400 hover:text-white"}`}>
          <span className={live ? "live-dot" : `h-2 w-2 rounded-full ${syncing ? "animate-pulse bg-amber-400" : "bg-emerald-400"}`} />
          <span suppressHydrationWarning>
            {live ? `LIVE · ${live.session.label}` : syncing ? "Syncing…" : lastSync ? `Synced ${lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Live data"}
          </span>
        </button>

        <button onClick={() => setOpen(!open)} className="p-2 text-white lg:hidden" aria-label="Menu" aria-expanded={open}>
          <div className={`mb-1 h-0.5 w-5 bg-white transition-all ${open ? "translate-y-1.5 rotate-45" : ""}`} />
          <div className={`mb-1 h-0.5 w-5 bg-white transition-all ${open ? "opacity-0" : ""}`} />
          <div className={`h-0.5 w-5 bg-white transition-all ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
        </button>
      </div>
      <motion.div style={{ scaleX: progress }} className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-[var(--f1-red)] to-orange-400" />
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5 bg-black/95 backdrop-blur-xl lg:hidden">
            {links.map((l, i) => (
              <motion.a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}
                className={`block border-b border-white/5 px-6 py-3.5 text-sm font-semibold ${active === l.id ? "text-white" : "text-zinc-400"}`}>{l.label}</motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

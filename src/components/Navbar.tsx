"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { liveSession } from "@/lib/f1";
import { useLive } from "./LiveData";

export const MODULES = [
  { label: "Standings", href: "/standings" },
  { label: "Calendar", href: "/calendar" },
  { label: "Circuits", href: "/circuits" },
  { label: "Drivers", href: "/drivers" },
  { label: "Teams", href: "/teams" },
  { label: "Results", href: "/results" },
];

export default function Navbar() {
  const { data, now, syncing, lastSync, refresh } = useLive();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const live = liveSession(data.schedule, now);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled || open ? "border-b border-white/5 bg-black/75 backdrop-blur-xl" : "bg-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Link href="/" className="group flex items-center gap-2">
          <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-[var(--f1-red)] text-sm font-black italic text-white transition-transform group-hover:scale-105">
            F1<span className="shimmer absolute inset-0" />
          </span>
          <span className="text-lg font-black tracking-tight text-white">NEXUS</span>
          <span className="mt-0.5 text-xs font-semibold text-zinc-500">{data.season}</span>
        </Link>

        <div className="hidden items-center gap-0.5 rounded-full border border-white/5 bg-white/[0.03] p-1 lg:flex">
          {MODULES.map(l => (
            <Link key={l.href} href={l.href} className={`relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${isActive(l.href) ? "text-white" : "text-zinc-400 hover:text-white"}`}>
              {isActive(l.href) && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/10" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
              <span className="relative">{l.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
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
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5 lg:hidden">
            <Link href="/" className={`block border-b border-white/5 px-6 py-3.5 text-sm font-semibold ${pathname === "/" ? "text-white" : "text-zinc-400"}`}>Dashboard</Link>
            {MODULES.map((l, i) => (
              <motion.div key={l.href} initial={{ x: -16, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <Link href={l.href} className={`flex items-center justify-between border-b border-white/5 px-6 py-3.5 text-sm font-semibold ${isActive(l.href) ? "text-white" : "text-zinc-400"}`}>
                  {l.label}{isActive(l.href) && <span className="h-1.5 w-1.5 rounded-full bg-[var(--f1-red)]" />}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { MotionConfig } from "framer-motion";
import { liveSession, nextRace, type Snapshot } from "@/lib/f1";

interface LiveCtx {
  data: Snapshot;
  tracks: Record<string, string>;
  now: Date;
  syncing: boolean;
  lastSync: Date | null;
  /** Points gained per driverId / constructorId since the previous poll (for "+X" flashes). */
  deltas: Record<string, number>;
  selectedRound: string | null;
  selectRound: (round: string, scroll?: boolean) => void;
  refresh: () => void;
  /** Locale date formatting that is stable during hydration (UTC/en-GB on the server and first paint, then the viewer's own locale & timezone). */
  fmt: (d: Date, opts: Intl.DateTimeFormatOptions) => string;
}
const Ctx = createContext<LiveCtx | null>(null);
export const useLive = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLive must be used inside <LiveDataProvider>");
  return c;
};

const NORMAL_MS = 60_000;
const LIVE_MS = 15_000;

function pointsMap(s: Snapshot) {
  const m: Record<string, number> = {};
  for (const d of s.drivers) m[d.Driver.driverId] = Number(d.points);
  for (const c of s.constructors) m[`c:${c.Constructor.constructorId}`] = Number(c.points);
  return m;
}

export default function LiveDataProvider({ initial, tracks, children }: { initial: Snapshot; tracks: Record<string, string>; children: React.ReactNode }) {
  const [data, setData] = useState(initial);
  const [now, setNow] = useState(() => new Date(initial.updatedAt));
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [deltas, setDeltas] = useState<Record<string, number>>({});
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const dataRef = useRef(data);
  dataRef.current = data;

  const refresh = useCallback(async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/f1", { cache: "no-store" });
      if (!res.ok) return;
      const next: Snapshot = await res.json();
      if (!next.drivers?.length && !next.schedule?.length) return;
      const before = pointsMap(dataRef.current), after = pointsMap(next);
      const diff: Record<string, number> = {};
      for (const k in after) if (before[k] !== undefined && after[k] > before[k]) diff[k] = after[k] - before[k];
      if (Object.keys(diff).length) { setDeltas(diff); setTimeout(() => setDeltas({}), 8000); }
      setData(next);
      setLastSync(new Date());
    } catch { /* keep showing last data */ } finally { setSyncing(false); }
  }, []);

  // Clock: keeps race statuses (live / next / done) flipping on their own.
  useEffect(() => { setHydrated(true); setNow(new Date()); setLastSync(new Date()); const id = setInterval(() => setNow(new Date()), 15_000); return () => clearInterval(id); }, []);

  const isLive = useMemo(() => !!liveSession(data.schedule, now), [data.schedule, now]);
  useEffect(() => {
    const id = setInterval(refresh, isLive ? LIVE_MS : NORMAL_MS);
    const onVisible = () => document.visibilityState === "visible" && refresh();
    document.addEventListener("visibilitychange", onVisible);
    return () => { clearInterval(id); document.removeEventListener("visibilitychange", onVisible); };
  }, [refresh, isLive]);

  // Default the circuit explorer to the next race (or the last one once the season ends).
  const defaultRound = nextRace(data.schedule, now)?.round ?? data.schedule.at(-1)?.round ?? null;

  const selectRound = useCallback((round: string, scroll = true) => {
    setSelectedRound(round);
    if (scroll) document.getElementById("circuits")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const fmt = useCallback((d: Date, opts: Intl.DateTimeFormatOptions) =>
    hydrated ? d.toLocaleString([], opts) : d.toLocaleString("en-GB", { ...opts, timeZone: "UTC" }), [hydrated]);

  const value: LiveCtx = { data, tracks, now, syncing, lastSync, deltas, selectedRound: selectedRound ?? defaultRound, selectRound, refresh, fmt };
  return <MotionConfig reducedMotion="user"><Ctx.Provider value={value}>{children}</Ctx.Provider></MotionConfig>;
}

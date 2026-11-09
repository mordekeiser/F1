"use client";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { flagUrl, initials, type Driver } from "@/lib/f1";
import { useLive } from "./LiveData";

/* Driver headshot with team-colour backdrop and initials fallback. */
export function Avatar({ driver, color, size = 48, className = "" }: { driver: Driver; color: string; size?: number; className?: string }) {
  const { data } = useLive();
  const src = data.media[driver.driverId]?.headshot;
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size, background: `radial-gradient(circle at 50% 30%, ${color}66, ${color}14 70%)`, boxShadow: `inset 0 0 0 1.5px ${color}88` }}>
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`${driver.givenName} ${driver.familyName}`} loading="lazy" onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover object-top" />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center font-black text-white/90" style={{ fontSize: size * 0.34 }}>{initials(driver)}</span>
      )}
    </div>
  );
}

export function Flag({ iso, className = "h-4 w-6", title }: { iso: string | null; className?: string; title?: string }) {
  const src = flagUrl(iso);
  if (!src) return <span className={`inline-block rounded-sm bg-zinc-700 ${className}`} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={title ?? iso ?? ""} title={title} loading="lazy" className={`inline-block rounded-[3px] object-cover shadow-sm ring-1 ring-white/10 ${className}`} />;
}

export function SectionHeader({ kicker, title, accent, sub, right }: { kicker: string; title: string; accent: string; sub?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-semibold text-zinc-500">
          <Link href="/" className="transition-colors hover:text-white">Dashboard</Link>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">{kicker}</span>
        </nav>
        <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{title} <span className="text-gradient">{accent}</span></h2>
        {sub && <div className="mt-2 text-sm text-zinc-500">{sub}</div>}
      </motion.div>
      {right}
    </div>
  );
}

/* Counts up to a number when scrolled into view. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [shown, setShown] = useState(value);
  const prev = useRef(0);
  useEffect(() => {
    if (!inView) return;
    const from = prev.current, to = value, start = performance.now(), dur = 900;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(step); else prev.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);
  return <span ref={ref} className={`tabular-nums ${className ?? ""}`}>{shown}</span>;
}

export const SECTOR_COLORS = ["#ff2d55", "#ffcc00", "#2fd2ff"];

/* Track renderer: auto-fits the path, draws it in, colours three sectors and laps a glowing car around it. */
export function Track({ d, color = "#e10600", detailed = false, car = true, className = "", lapSeconds = 9 }:
  { d: string; color?: string; detailed?: boolean; car?: boolean; className?: string; lapSeconds?: number }) {
  const ref = useRef<SVGPathElement>(null);
  const [vb, setVb] = useState("0 0 500 500");
  const [sw, setSw] = useState(8);
  useLayoutEffect(() => {
    const p = ref.current;
    if (!p) return;
    const b = p.getBBox();
    const size = Math.max(b.width, b.height);
    const pad = size * 0.08;
    setVb(`${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`);
    setSw(size / (detailed ? 60 : 32));
  }, [d, detailed]);
  const id = `t${Math.abs([...d.slice(0, 40)].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7))}`;

  return (
    <svg viewBox={vb} className={className} preserveAspectRatio="xMidYMid meet" aria-hidden>
      <defs>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={sw * 0.9} result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* soft outer glow + asphalt */}
      <path d={d} fill="none" stroke={color} strokeOpacity={0.18} strokeWidth={sw * 3.2} strokeLinecap="round" strokeLinejoin="round" />
      <path ref={ref} d={d} fill="none" stroke="#1d1d22" strokeWidth={sw * 1.9} strokeLinecap="round" strokeLinejoin="round" />
      <motion.path d={d} fill="none" stroke="#f4f4f5" strokeWidth={sw * 0.55} strokeLinecap="round" strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.4 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }}
        transition={{ duration: detailed ? 1.8 : 1.2, ease: "easeInOut" }} />
      {detailed && (
        <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 0.95 }} viewport={{ once: true }} transition={{ delay: 1.7, duration: 0.6 }}>
          {SECTOR_COLORS.map((c, i) => (
            <path key={c} d={d} fill="none" stroke={c} strokeWidth={sw * 0.55} strokeLinecap="butt" pathLength={100}
              strokeDasharray={`${i === 2 ? 33.4 : 33.3} 100`} strokeDashoffset={-i * 33.3} />
          ))}
        </motion.g>
      )}
      {car && (
        <g filter={`url(#${id}-glow)`}>
          {[0, 0.12, 0.24].map((lag, i) => (
            <circle key={i} r={sw * (0.95 - i * 0.25)} fill={i === 0 ? "#fff" : color} opacity={1 - i * 0.3}>
              <animateMotion dur={`${lapSeconds}s`} begin={`-${lag}s`} repeatCount="indefinite" path={d} rotate="auto" />
            </circle>
          ))}
        </g>
      )}
    </svg>
  );
}

export function TrackPlaceholder({ label = "Layout coming soon" }: { label?: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-zinc-600">
      <svg viewBox="0 0 100 60" className="w-24 opacity-40"><path d="M10 40 Q10 10 40 12 T90 25 Q95 50 60 48 T10 40Z" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="6 5" /></svg>
      <span className="text-xs uppercase tracking-widest">{label}</span>
    </div>
  );
}

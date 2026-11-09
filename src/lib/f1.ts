// Shared, client-safe types and helpers for F1 data.

export interface Driver {
  driverId: string; permanentNumber?: string; code?: string;
  givenName: string; familyName: string; dateOfBirth?: string; nationality?: string;
}
export interface Constructor { constructorId: string; name: string; nationality?: string }
export interface DriverStanding { position: string; points: string; wins: string; Driver: Driver; Constructors: Constructor[] }
export interface ConstructorStanding { position: string; points: string; wins: string; Constructor: Constructor }
export interface SessionTime { date: string; time?: string }
export interface RaceResult {
  position: string; points: string; status: string; grid?: string; laps?: string;
  Driver: Driver; Constructor: Constructor;
  Time?: { time: string };
  FastestLap?: { rank: string; Time: { time: string } };
}
export interface Race {
  season: string; round: string; raceName: string; date: string; time?: string;
  Circuit: { circuitId: string; circuitName: string; Location: { country: string; locality: string } };
  FirstPractice?: SessionTime; SecondPractice?: SessionTime; ThirdPractice?: SessionTime;
  SprintQualifying?: SessionTime; Sprint?: SessionTime; Qualifying?: SessionTime;
  Results?: RaceResult[];
}
export interface DriverMedia { headshot: string | null; color: string | null; acronym: string | null }
export interface Winner { name: string; driverId: string; team: string; constructorId: string }

export interface Snapshot {
  updatedAt: string;
  season: string;
  drivers: DriverStanding[];
  constructors: ConstructorStanding[];
  schedule: Race[];
  lastRace: Race | null;
  winners: Record<string, Winner>;      // keyed by round
  media: Record<string, DriverMedia>;    // keyed by driverId
}

/* ---------------- Teams ---------------- */

export interface TeamMeta { name: string; color: string; logo: string; base: string; principal: string; engine: string }
export const TEAMS: Record<string, TeamMeta> = {
  mercedes:     { name: "Mercedes",       color: "#00D7B6", logo: "/teams/mercedes.png", base: "Brackley, UK",        principal: "Toto Wolff",        engine: "Mercedes" },
  ferrari:      { name: "Ferrari",        color: "#ED1131", logo: "/teams/ferrari.png",  base: "Maranello, Italy",    principal: "Frédéric Vasseur",  engine: "Ferrari" },
  red_bull:     { name: "Red Bull Racing",color: "#4781D7", logo: "/teams/redbull.png",  base: "Milton Keynes, UK",   principal: "Laurent Mekies",    engine: "Red Bull Ford" },
  mclaren:      { name: "McLaren",        color: "#F47600", logo: "/teams/mclaren.png",  base: "Woking, UK",          principal: "Andrea Stella",     engine: "Mercedes" },
  rb:           { name: "Racing Bulls",   color: "#6C98FF", logo: "/teams/rb.png",       base: "Faenza, Italy",       principal: "Alan Permane",      engine: "Red Bull Ford" },
  alpine:       { name: "Alpine",         color: "#00A1E8", logo: "/teams/alpine.png",   base: "Enstone, UK",         principal: "Flavio Briatore",   engine: "Mercedes" },
  haas:         { name: "Haas",           color: "#9C9FA2", logo: "/teams/haas.png",     base: "Kannapolis, USA",     principal: "Ayao Komatsu",      engine: "Ferrari" },
  audi:         { name: "Audi",           color: "#F50537", logo: "/teams/audi.png",     base: "Hinwil, Switzerland", principal: "Jonathan Wheatley", engine: "Audi" },
  williams:     { name: "Williams",       color: "#1868DB", logo: "/teams/williams.png", base: "Grove, UK",           principal: "James Vowles",      engine: "Mercedes" },
  aston_martin: { name: "Aston Martin",   color: "#229971", logo: "/teams/aston.png",    base: "Silverstone, UK",     principal: "Adrian Newey",      engine: "Honda" },
  cadillac:     { name: "Cadillac",       color: "#909090", logo: "/teams/cadillac.png", base: "Indiana, USA",        principal: "Graeme Lowdon",     engine: "Ferrari" },
};
export function teamMeta(c?: Constructor): TeamMeta {
  if (!c) return { name: "—", color: "#888", logo: "", base: "—", principal: "—", engine: "—" };
  return TEAMS[c.constructorId] ?? { name: c.name, color: "#888", logo: "", base: "—", principal: "—", engine: "—" };
}

/* ---------------- Flags ---------------- */

const COUNTRY_ISO: Record<string, string> = {
  Australia: "au", China: "cn", Japan: "jp", Bahrain: "bh", "Saudi Arabia": "sa", USA: "us", "United States": "us",
  Canada: "ca", Monaco: "mc", Spain: "es", Austria: "at", UK: "gb", "Great Britain": "gb", "United Kingdom": "gb",
  Belgium: "be", Hungary: "hu", Netherlands: "nl", Italy: "it", Azerbaijan: "az", Singapore: "sg", Mexico: "mx",
  Brazil: "br", UAE: "ae", "Abu Dhabi": "ae", Qatar: "qa", Malaysia: "my", Portugal: "pt", Turkey: "tr", France: "fr", Germany: "de",
};
const NATIONALITY_ISO: Record<string, string> = {
  Italian: "it", British: "gb", Monegasque: "mc", Dutch: "nl", Australian: "au", Spanish: "es", French: "fr",
  Mexican: "mx", Canadian: "ca", Finnish: "fi", German: "de", Thai: "th", Argentine: "ar", Argentinian: "ar",
  "New Zealander": "nz", Brazilian: "br", American: "us", Japanese: "jp", Danish: "dk", Chinese: "cn", Swiss: "ch", Belgian: "be",
};
export const countryIso = (c?: string) => (c && COUNTRY_ISO[c]) || null;
export const nationalityIso = (n?: string) => (n && NATIONALITY_ISO[n]) || null;
export const flagUrl = (iso: string | null, w = 80) => (iso ? `https://flagcdn.com/w${w}/${iso}.png` : null);

/* ---------------- Sessions / time ---------------- */

export const sessionDate = (s: SessionTime) => new Date(`${s.date}T${s.time ?? "12:00:00Z"}`);
export const raceDate = (r: Race) => sessionDate({ date: r.date, time: r.time });

export interface WeekendSession { key: string; label: string; start: Date; end: Date }
const SESSION_DEFS: Array<[keyof Race, string, number]> = [
  ["FirstPractice", "Practice 1", 60], ["SecondPractice", "Practice 2", 60], ["ThirdPractice", "Practice 3", 60],
  ["SprintQualifying", "Sprint Qualifying", 45], ["Sprint", "Sprint", 60], ["Qualifying", "Qualifying", 60],
];
export function weekendSessions(r: Race): WeekendSession[] {
  const list: WeekendSession[] = [];
  for (const [k, label, mins] of SESSION_DEFS) {
    const s = r[k] as SessionTime | undefined;
    if (s?.date) { const start = sessionDate(s); list.push({ key: k, label, start, end: new Date(start.getTime() + mins * 60000) }); }
  }
  const start = raceDate(r);
  list.push({ key: "Race", label: "Race", start, end: new Date(start.getTime() + 120 * 60000) });
  return list.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export type RaceStatus = "done" | "live" | "weekend" | "next" | "upcoming";
export function raceStatus(r: Race, races: Race[], now: Date): RaceStatus {
  const sessions = weekendSessions(r);
  const end = sessions[sessions.length - 1].end;
  if (now > end) return "done";
  if (sessions.some(s => now >= s.start && now <= s.end)) return "live";
  if (now >= new Date(sessions[0].start.getTime() - 86400000)) return "weekend";
  return nextRace(races, now)?.round === r.round ? "next" : "upcoming";
}
export function nextRace(races: Race[], now: Date): Race | null {
  return races.find(r => { const s = weekendSessions(r); return s[s.length - 1].end > now; }) ?? null;
}
export function liveSession(races: Race[], now: Date): { race: Race; session: WeekendSession } | null {
  for (const race of races) for (const session of weekendSessions(race))
    if (now >= session.start && now <= session.end) return { race, session };
  return null;
}
export const roundsCompleted = (races: Race[], now: Date) => races.filter(r => raceStatus(r, races, now) === "done").length;

export const fullName = (d: Driver) => `${d.givenName} ${d.familyName}`;
export const initials = (d: Driver) => `${d.givenName[0] ?? ""}${d.familyName[0] ?? ""}`;

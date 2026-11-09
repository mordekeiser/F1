import type { ConstructorStanding, DriverMedia, DriverStanding, Race, Snapshot, Winner } from "./f1";

const JOLPICA = "https://api.jolpi.ca/ergast/f1";
const OPENF1 = "https://api.openf1.org/v1";

// Last good values per source, so a flaky upstream never blanks the site.
const lastGood: Partial<Record<string, unknown>> = {};

async function getJson<T>(key: string, url: string, revalidate: number, pick: (j: any) => T): Promise<T | undefined> {
  try {
    const res = await fetch(url, { next: { revalidate }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`${res.status}`);
    const value = pick(await res.json());
    lastGood[key] = value;
    return value;
  } catch {
    return lastGood[key] as T | undefined;
  }
}

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function buildMedia(drivers: DriverStanding[], of1: any[]): Record<string, DriverMedia> {
  const media: Record<string, DriverMedia> = {};
  for (const { Driver: d } of drivers) {
    const m =
      of1.find(o => d.permanentNumber && String(o.driver_number) === d.permanentNumber) ??
      of1.find(o => d.code && o.name_acronym === d.code) ??
      of1.find(o => o.last_name && norm(o.last_name) === norm(d.familyName));
    // Use the higher-resolution variant of the F1 headshot when available.
    const headshot = m?.headshot_url ? String(m.headshot_url).replace("/1col/", "/4col/") : null;
    media[d.driverId] = { headshot, color: m?.team_colour ? `#${m.team_colour}` : null, acronym: m?.name_acronym ?? d.code ?? null };
  }
  return media;
}

export async function getSnapshot(): Promise<Snapshot> {
  const [drivers, constructors, schedule, lastRace, winners, of1] = await Promise.all([
    getJson<DriverStanding[]>("drivers", `${JOLPICA}/current/driverstandings.json`, 120,
      j => j.MRData.StandingsTable.StandingsLists[0]?.DriverStandings ?? []),
    getJson<ConstructorStanding[]>("constructors", `${JOLPICA}/current/constructorstandings.json`, 120,
      j => j.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings ?? []),
    getJson<Race[]>("schedule", `${JOLPICA}/current.json`, 3600, j => j.MRData.RaceTable.Races ?? []),
    getJson<Race | null>("lastRace", `${JOLPICA}/current/last/results.json`, 120, j => j.MRData.RaceTable.Races[0] ?? null),
    getJson<Record<string, Winner>>("winners", `${JOLPICA}/current/results/1.json?limit=100`, 120, j => {
      const out: Record<string, Winner> = {};
      for (const r of j.MRData.RaceTable.Races as Race[]) {
        const w = r.Results?.[0];
        if (w) out[r.round] = { name: `${w.Driver.givenName} ${w.Driver.familyName}`, driverId: w.Driver.driverId, team: w.Constructor.name, constructorId: w.Constructor.constructorId };
      }
      return out;
    }),
    getJson<any[]>("openf1", `${OPENF1}/drivers?session_key=latest`, 3600, j => (Array.isArray(j) ? j : [])),
  ]);

  const d = drivers ?? [];
  const media = buildMedia(d, of1 ?? []);

  // Drivers missing from the latest session (reserves, injured, one-offs): look up their
  // most recent OpenF1 entry by acronym. Cached for a day, so this only costs a few calls.
  await Promise.all(d.filter(s => !media[s.Driver.driverId].headshot && s.Driver.code).map(async s => {
    const rows = await getJson<any[]>(`of1:${s.Driver.code}`, `${OPENF1}/drivers?name_acronym=${s.Driver.code}`, 86400, j => (Array.isArray(j) ? j : []));
    const hit = rows?.filter(r => r.headshot_url).at(-1);
    if (hit) media[s.Driver.driverId] = {
      headshot: String(hit.headshot_url).replace("/1col/", "/4col/"),
      color: media[s.Driver.driverId].color ?? null,
      acronym: s.Driver.code ?? null,
    };
  }));

  return {
    updatedAt: new Date().toISOString(),
    season: schedule?.[0]?.season ?? String(new Date().getFullYear()),
    drivers: d,
    constructors: constructors ?? [],
    schedule: schedule ?? [],
    lastRace: lastRace ?? null,
    winners: winners ?? {},
    media,
  };
}

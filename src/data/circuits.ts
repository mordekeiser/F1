// Static circuit facts, keyed by the Jolpica `circuitId` so they attach automatically
// to whatever the live calendar contains. `svg` is the file in /public/circuits.

export type Downforce = "Low" | "Medium-Low" | "Medium" | "Medium-High" | "High";
export interface CircuitInfo {
  svg: string | null; laps: number; length: string; turns: number;
  record: string; recordBy: string; type: "Permanent" | "Street" | "Hybrid"; firstGP: number; downforce: Downforce;
}

export const CIRCUITS: Record<string, CircuitInfo> = {
  albert_park:   { svg: "albert_park", laps: 58, length: "5.278 km", turns: 14, record: "1:19.813", recordBy: "Leclerc (2024)",    type: "Hybrid",    firstGP: 1996, downforce: "Medium" },
  shanghai:      { svg: "shanghai",    laps: 56, length: "5.451 km", turns: 16, record: "1:32.238", recordBy: "Schumacher (2004)", type: "Permanent", firstGP: 2004, downforce: "Medium" },
  suzuka:        { svg: "suzuka",      laps: 53, length: "5.807 km", turns: 18, record: "1:30.965", recordBy: "Antonelli (2025)",  type: "Permanent", firstGP: 1987, downforce: "High" },
  bahrain:       { svg: "bahrain",     laps: 57, length: "5.412 km", turns: 15, record: "1:31.447", recordBy: "de la Rosa (2005)", type: "Permanent", firstGP: 2004, downforce: "Medium-High" },
  jeddah:        { svg: "jeddah",      laps: 50, length: "6.174 km", turns: 27, record: "1:30.734", recordBy: "Hamilton (2021)",   type: "Street",    firstGP: 2021, downforce: "Low" },
  miami:         { svg: "miami",       laps: 57, length: "5.412 km", turns: 19, record: "1:29.708", recordBy: "Verstappen (2023)", type: "Street",    firstGP: 2022, downforce: "Medium" },
  villeneuve:    { svg: "montreal",    laps: 70, length: "4.361 km", turns: 14, record: "1:13.078", recordBy: "Bottas (2019)",     type: "Hybrid",    firstGP: 1978, downforce: "Low" },
  monaco:        { svg: "monaco",      laps: 78, length: "3.337 km", turns: 19, record: "1:12.909", recordBy: "Hamilton (2021)",   type: "Street",    firstGP: 1950, downforce: "High" },
  catalunya:     { svg: "barcelona",   laps: 66, length: "4.657 km", turns: 14, record: "1:16.330", recordBy: "Verstappen (2023)", type: "Permanent", firstGP: 1991, downforce: "Medium-High" },
  red_bull_ring: { svg: "austria",     laps: 71, length: "4.318 km", turns: 10, record: "1:05.619", recordBy: "Sainz (2020)",      type: "Permanent", firstGP: 1970, downforce: "Medium-Low" },
  silverstone:   { svg: "silverstone", laps: 52, length: "5.891 km", turns: 18, record: "1:27.097", recordBy: "Verstappen (2020)", type: "Permanent", firstGP: 1950, downforce: "Medium-High" },
  spa:           { svg: "spa",         laps: 44, length: "7.004 km", turns: 19, record: "1:44.701", recordBy: "Pérez (2024)",      type: "Permanent", firstGP: 1950, downforce: "Low" },
  hungaroring:   { svg: "hungary",     laps: 70, length: "4.381 km", turns: 14, record: "1:16.627", recordBy: "Hamilton (2020)",   type: "Permanent", firstGP: 1986, downforce: "High" },
  zandvoort:     { svg: "zandvoort",   laps: 72, length: "4.259 km", turns: 14, record: "1:11.097", recordBy: "Hamilton (2021)",   type: "Permanent", firstGP: 1952, downforce: "High" },
  monza:         { svg: "monza",       laps: 53, length: "5.793 km", turns: 11, record: "1:20.901", recordBy: "Norris (2025)",     type: "Permanent", firstGP: 1950, downforce: "Low" },
  madring:       { svg: "madrid",      laps: 57, length: "5.474 km", turns: 22, record: "—",        recordBy: "New for 2026",      type: "Hybrid",    firstGP: 2026, downforce: "Medium" },
  baku:          { svg: "baku",        laps: 51, length: "6.003 km", turns: 20, record: "1:43.009", recordBy: "Leclerc (2019)",    type: "Street",    firstGP: 2016, downforce: "Low" },
  sepang:        { svg: null,          laps: 56, length: "5.543 km", turns: 15, record: "1:34.223", recordBy: "Montoya (2004)",    type: "Permanent", firstGP: 1999, downforce: "Medium-High" },
  marina_bay:    { svg: "singapore",   laps: 62, length: "4.940 km", turns: 19, record: "1:33.808", recordBy: "Hamilton (2025)",   type: "Street",    firstGP: 2008, downforce: "High" },
  americas:      { svg: "cota",        laps: 56, length: "5.513 km", turns: 20, record: "1:36.169", recordBy: "Leclerc (2019)",    type: "Permanent", firstGP: 2012, downforce: "Medium-High" },
  rodriguez:     { svg: "mexico",      laps: 71, length: "4.304 km", turns: 17, record: "1:17.774", recordBy: "Bottas (2021)",     type: "Permanent", firstGP: 1963, downforce: "High" },
  interlagos:    { svg: "brazil",      laps: 71, length: "4.309 km", turns: 15, record: "1:10.540", recordBy: "Bottas (2018)",     type: "Permanent", firstGP: 1973, downforce: "Medium" },
  vegas:         { svg: "las_vegas",   laps: 50, length: "6.201 km", turns: 17, record: "1:34.876", recordBy: "Norris (2024)",     type: "Street",    firstGP: 2023, downforce: "Low" },
  losail:        { svg: "qatar",       laps: 57, length: "5.419 km", turns: 16, record: "1:22.384", recordBy: "Norris (2024)",     type: "Permanent", firstGP: 2021, downforce: "Medium-High" },
  yas_marina:    { svg: "abu_dhabi",   laps: 58, length: "5.281 km", turns: 16, record: "1:25.637", recordBy: "Magnussen (2024)",  type: "Permanent", firstGP: 2009, downforce: "Medium" },
};

export const DOWNFORCE_LEVEL: Record<Downforce, number> = { Low: 1, "Medium-Low": 2, Medium: 3, "Medium-High": 4, High: 5 };

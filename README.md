# F1 Nexus

A fully automated, live Formula 1 website — Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion.

Nothing season-specific is hard-coded: the calendar, standings, results, race winners, driver line-ups,
driver photos and team colours all come from live APIs, so the site keeps itself up to date every race weekend.

## Features
- **Live everything** — one `/api/f1` snapshot (standings, calendar, last race, every race winner, driver headshots).
  The browser re-polls every 60 s, every 15 s during a live session, and instantly when you return to the tab.
- **Live session detection** — knows when FP / Sprint / Qualifying / Race is running and shows a LIVE banner + session countdown.
- **Hero** — countdown to the next session, full weekend timetable in your own timezone, championship leader, season progress.
- **Race calendar** — cards with track maps, statuses (finished / this weekend / live / next), sprint badges and winners.
- **Standings** — drivers & constructors with photos; rows animate to their new position when the order changes, and "+pts" flashes after each race.
- **Track explorer** — real circuit layouts that draw themselves, colour-coded sectors and an animated car lapping the track.
- **Drivers** — photo cards with expandable profiles; **Teams** — live line-ups per constructor; **Last race** — animated podium, fastest lap, biggest climber, full classification.

## Setup
```bash
npm install
npm run dev
```

## Deploy
Push to GitHub and import into Vercel. The page regenerates every 2 minutes (ISR) and the client polls for fresher data.

## Credits
- Results & standings: [Jolpica F1 API](https://api.jolpi.ca)
- Driver photos & team colours: [OpenF1](https://openf1.org)
- Circuit layouts: [f1-circuits-svg](https://github.com/julesr0y/f1-circuits-svg) (CC-BY-4.0)

Unofficial fan project — not affiliated with Formula 1 or the FIA.

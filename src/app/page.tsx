import { SpeedInsights } from "@vercel/speed-insights/next";
import LiveDataProvider from "@/components/LiveData";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WinnersTicker from "@/components/WinnersTicker";
import RaceSchedule from "@/components/RaceSchedule";
import Standings from "@/components/Standings";
import CircuitsExplorer from "@/components/CircuitsExplorer";
import DriversGrid from "@/components/DriversGrid";
import TeamsShowcase from "@/components/TeamsShowcase";
import LastRaceResults from "@/components/LastRaceResults";
import Footer from "@/components/Footer";
import { getSnapshot } from "@/lib/snapshot";
import { getTrackPaths } from "@/lib/tracks";

// Page is regenerated in the background every 2 minutes; the client also polls /api/f1.
export const revalidate = 120;

export default async function Home() {
  const snapshot = await getSnapshot();
  return (
    <LiveDataProvider initial={snapshot} tracks={getTrackPaths()}>
      <Navbar />
      <main>
        <Hero />
        <WinnersTicker />
        <RaceSchedule />
        <Standings />
        <CircuitsExplorer />
        <DriversGrid />
        <TeamsShowcase />
        <LastRaceResults />
      </main>
      <Footer />
      <SpeedInsights />
    </LiveDataProvider>
  );
}

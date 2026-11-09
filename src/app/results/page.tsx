import type { Metadata } from "next";
import LastRaceResults from "@/components/LastRaceResults";

export const metadata: Metadata = { title: "Race results" };

export default function Page() {
  return <LastRaceResults />;
}

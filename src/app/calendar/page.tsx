import type { Metadata } from "next";
import RaceSchedule from "@/components/RaceSchedule";

export const metadata: Metadata = { title: "Calendar" };

export default function Page() {
  return <RaceSchedule />;
}

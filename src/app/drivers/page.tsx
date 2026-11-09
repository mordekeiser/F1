import type { Metadata } from "next";
import DriversGrid from "@/components/DriversGrid";

export const metadata: Metadata = { title: "Drivers" };

export default function Page() {
  return <DriversGrid />;
}

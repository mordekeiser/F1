import type { Metadata } from "next";
import Standings from "@/components/Standings";

export const metadata: Metadata = { title: "Standings" };

export default function Page() {
  return <Standings />;
}

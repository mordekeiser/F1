import type { Metadata } from "next";
import TeamsShowcase from "@/components/TeamsShowcase";

export const metadata: Metadata = { title: "Teams" };

export default function Page() {
  return <TeamsShowcase />;
}

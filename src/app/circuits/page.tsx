import type { Metadata } from "next";
import CircuitsExplorer from "@/components/CircuitsExplorer";

export const metadata: Metadata = { title: "Circuits" };

export default function Page() {
  return <CircuitsExplorer />;
}

import type { Metadata, Viewport } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";

const titillium = Titillium_Web({ subsets: ["latin"], weight: ["400", "600", "700", "900"], variable: "--font-titillium", display: "swap" });

export const metadata: Metadata = {
  title: "F1 Nexus — Live Formula 1 World Championship",
  description: "Live F1 standings, race calendar, animated circuit maps, drivers and teams — updated automatically all season.",
};
export const viewport: Viewport = { themeColor: "#08080a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={titillium.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}

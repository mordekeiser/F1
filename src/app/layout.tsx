import type { Metadata, Viewport } from "next";
import { Titillium_Web } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LiveDataProvider from "@/components/LiveData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSnapshot } from "@/lib/snapshot";
import { getTrackPaths } from "@/lib/tracks";
import "./globals.css";

const titillium = Titillium_Web({ subsets: ["latin"], weight: ["400", "600", "700", "900"], variable: "--font-titillium", display: "swap" });

export const metadata: Metadata = {
  title: { default: "F1 Nexus — Live Formula 1", template: "%s · F1 Nexus" },
  description: "Live F1 standings, race calendar, animated circuit maps, drivers and teams — updated automatically all season.",
};
export const viewport: Viewport = { themeColor: "#08080a" };

// Pages regenerate in the background every 2 minutes; the client also polls /api/f1.
export const revalidate = 120;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const snapshot = await getSnapshot();
  return (
    <html lang="en" className={titillium.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <LiveDataProvider initial={snapshot} tracks={getTrackPaths()}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LiveDataProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

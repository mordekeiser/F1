import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DriverStandings from "@/components/DriverStandings";
import ConstructorStandings from "@/components/ConstructorStandings";
import TeamsShowcase from "@/components/TeamsShowcase";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <DriverStandings />
      <ConstructorStandings />
      <TeamsShowcase />
    </>
  );
}
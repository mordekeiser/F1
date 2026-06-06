"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

interface Constructor {
  position: string;
  points: string;
  Constructor: {
    name: string;
  };
}

const teamColors: Record<string, string> = {
  McLaren: "#FF8000",
  Ferrari: "#DC0000",
  Mercedes: "#00D2BE",
  "Red Bull": "#1E41FF",
  Williams: "#005AFF",

  "Haas F1 Team": "#B6BABD",
  "Alpine F1 Team": "#0090FF",
  "Aston Martin": "#006F62",
  Audi: "#00E701",
  "RB F1 Team": "#6692FF",
  "Cadillac Racing": "#585253"
};
const teamLogos: Record<string, string> = {
  "McLaren": "/teams/mclaren.png",
  "Ferrari": "/teams/ferrari.png",
  "Mercedes": "/teams/mercedes.png",
  "Red Bull": "/teams/redbull.png",
  "Williams": "/teams/williams.png",

  "Haas F1 Team": "/teams/haas.png",
  "Alpine F1 Team": "/teams/alpine.png",
  "Aston Martin": "/teams/aston.png",
  "Audi": "/teams/audi.png",
  "RB F1 Team": "/teams/rb.png",
  "Cadillac Racing": "/teams/cadillac.png",
};
export default function ConstructorStandings() {
  const [constructors, setConstructors] = useState<Constructor[]>([]);
  const [maxPoints, setMaxPoints] = useState(1);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const res = await fetch(
          "https://api.jolpi.ca/ergast/f1/current/constructorstandings.json"
        );

        const data = await res.json();

        const standings =
          data.MRData.StandingsTable.StandingsLists[0]
            .ConstructorStandings;

        setConstructors(standings);
        setMaxPoints(Number(standings[0].points));
      } catch (error) {
        console.error(error);
      }
    }

    fetchStandings();
  }, []);

  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-5xl font-bold mb-12 text-red-600">
          Constructor Championship
        </h2>

        <div className="space-y-6">

          {constructors.map((team) => {

            const color =
              teamColors[team.Constructor.name] || "#ffffff";

            const percentage =
              (Number(team.points) / maxPoints) * 100;

            return (
              <motion.div
                key={team.position}
                whileHover={{
                  scale: 1.02,
                  y: -5,
                }}
                transition={{
                  type: "spring",
                  stiffness: 250,
                }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 cursor-pointer"
                style={{
                  boxShadow: `0 0 0px ${color}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    `0 0 25px ${color}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    `0 0 0px ${color}`;
                }}
              >
                <div className="flex justify-between items-center mb-4">

                  <div className="flex items-center gap-4">

                    <Image
  src={
    teamLogos[team.Constructor.name] ||
    "/teams/mclaren.png"
  }
  alt={team.Constructor.name}
  width={40}
  height={40}
  className="object-contain"
/>

                    <div>
                      <div className="text-xl font-semibold">
                        #{team.position}{" "}
                        {team.Constructor.name}
                      </div>
                    </div>

                  </div>

                  <div
                    className="font-bold text-xl"
                    style={{ color }}
                  >
                    <CountUp
                      end={Number(team.points)}
                      duration={2}
                    />
                    {" "}pts
                  </div>

                </div>

                <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${percentage}%`,
                    }}
                    transition={{
                      duration: 1.5,
                    }}
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: color,
                    }}
                  />

                </div>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
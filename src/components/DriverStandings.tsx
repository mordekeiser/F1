"use client";

import { useEffect, useState } from "react";

interface Driver {
  position: string;
  points: string;
  Driver: {
    givenName: string;
    familyName: string;
  };
}

export default function DriverStandings() {
  const [drivers, setDrivers] = useState<Driver[]>([]);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const res = await fetch(
          "https://api.jolpi.ca/ergast/f1/current/driverstandings.json"
        );

        const data = await res.json();

        const standings =
          data.MRData.StandingsTable.StandingsLists[0]
            .DriverStandings;

        setDrivers(standings);
      } catch (err) {
        console.error(err);
      }
    }

    fetchStandings();
  }, []);

  return (
    <section className="bg-zinc-950 text-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-4xl font-bold mb-8 text-red-600">
          Driver Championship
        </h2>

        <div className="space-y-4">
          {drivers.slice(0, 10).map((driver) => (
            <div
              key={driver.position}
              className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between"
            >
              <div>
                #{driver.position}{" "}
                {driver.Driver.givenName}{" "}
                {driver.Driver.familyName}
              </div>

              <div>{driver.points} pts</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
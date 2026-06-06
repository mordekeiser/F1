"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { teams } from "@/data/teams";

export default function TeamsShowcase() {
  return (
    <section className="bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-5xl font-bold text-red-600 mb-12">
          Formula 1 Teams
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {teams.map((team) => (
            <motion.div
              key={team.name}
              whileHover={{
                scale: 1.03,
                y: -6,
              }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
              style={{
                boxShadow: `0 0 20px ${team.color}30`,
              }}
            >
              <div className="flex items-center gap-4 mb-4">

                <Image
                  src={team.logo}
                  alt={team.name}
                  width={60}
                  height={60}
                  className="object-contain"
                />

                <div>
                  <h3 className="text-2xl font-bold">
                    {team.name}
                  </h3>

                  {team.comingSoon && (
                    <span
                      className="text-sm px-2 py-1 rounded"
                      style={{
                        backgroundColor: team.color,
                      }}
                    >
                      2026 Entry
                    </span>
                  )}
                </div>

              </div>

              <div className="space-y-2 text-gray-300">
                <p>📍 {team.base}</p>
                <p>👤 {team.principal}</p>
              </div>

              <div
                className="h-2 rounded-full mt-6"
                style={{
                  backgroundColor: team.color,
                }}
              />
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="h-screen bg-black text-white flex flex-col justify-center items-center">
      <motion.h1
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-7xl font-bold"
      >
        F1 NEXUS
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 text-xl text-gray-400"
      >
        Formula One Analytics Platform
      </motion.p>

      <button className="mt-10 px-8 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition">
        Explore Season
      </button>
    </section>
  );
}
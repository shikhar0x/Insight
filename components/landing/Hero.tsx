"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  ShieldCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";

// Same curve used across Features.tsx, HowItWorks.tsx and FAQSection.tsx —
// kept identical so the whole page decelerates the same way.
const EASE = [0.16, 1, 0.3, 1] as const;

// Same gentle, well-damped spring used for hover lifts/scales elsewhere.
const HOVER_SPRING = { type: "spring", stiffness: 260, damping: 24, mass: 0.9 } as const;

export default function Hero() {
  return (
    <section
        id="home"
        className="relative overflow-hidden px-6 py-16"
    >


      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-20 px-6 pt-40 pb-12 lg:flex-row">

        {/* LEFT */}

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-xl"
        >
          <motion.div
            whileHover={{ scale: 1.03, transition: HOVER_SPRING }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 backdrop-blur-xl"
          >
            <Sparkles size={16} />
            Explainable AI for Smarter Investing
          </motion.div>

          <h1 className="text-5xl font-black leading-tight md:text-7xl">
            Understand
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}
              Stocks
            </span>
            <br />
            Not Just Numbers.
          </h1>

          <p className="mt-8 text-lg leading-8 text-slate-400">
            Insight transforms annual reports, financial statements,
            technical indicators and market data into explainable AI
            reasoning that anyone can understand.
          </p>

          <div className="mt-10 flex flex-wrap gap-5 mb-6">

            <motion.button
              whileHover={{ scale: 1.05, transition: HOVER_SPRING }}
              whileTap={{ scale: 0.97, transition: { duration: 0.15, ease: EASE } }}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold shadow-lg shadow-cyan-500/30"
            >
              Get Started
              <ArrowRight size={18} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, transition: HOVER_SPRING }}
              whileTap={{ scale: 0.97, transition: { duration: 0.15, ease: EASE } }}
              className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 backdrop-blur-xl transition-colors duration-300 ease-out hover:bg-white/10"
            >
              Watch Demo
            </motion.button>

          </div>
        </motion.div>

        {/* RIGHT */}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative w-full max-w-xl"
        >

          {/* Dashboard Card */}

          <motion.div
            whileHover={{ y: -6, transition: HOVER_SPRING }}
            className="w-full rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl shadow-2xl transition-colors duration-500 ease-out hover:border-cyan-400/30"
          >

            <div className="mb-8 flex items-center justify-between">

              <div>
                <p className="text-sm text-slate-400">
                  AI Investment Score
                </p>

                <h2 className="mt-2 text-5xl font-bold text-cyan-400">
                  87
                </h2>
              </div>

              <motion.div
                whileHover={{ rotate: 8, transition: { duration: 0.4, ease: EASE } }}
              >
                <TrendingUp
                  size={48}
                  className="text-cyan-400"
                />
              </motion.div>

            </div>

            <div className="space-y-5">

              <GlassMetric
                icon={<BrainCircuit size={22} />}
                title="Fundamental Score"
                score="92 / 100"
              />

              <GlassMetric
                icon={<TrendingUp size={22} />}
                title="Technical Score"
                score="81 / 100"
              />

              <GlassMetric
                icon={<ShieldCheck size={22} />}
                title="Risk Score"
                score="26 / 100"
              />

            </div>

          </motion.div>

          {/* Floating Card */}

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [-5, 5],
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.5, ease: EASE },
              scale: { duration: 0.8, delay: 0.5, ease: EASE },
              y: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: 1.3,
              },
            }}
            className="absolute -left-49 top-12 hidden transform-gpu rounded-3xl border border-cyan-400/20 bg-cyan-500/10 p-5 backdrop-blur-xl will-change-transform lg:block"
          >
            <div className="select-none antialiased">
                <p className="text-sm text-slate-300">
                AI Recommendation
            </p>

            <h3 className="mt-2 text-xl font-bold text-green-400">
              BUY
            </h3>

            <p className="mt-2 text-xs text-slate-400">
              Revenue growth remains strong
            </p>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  );
}

function GlassMetric({
  icon,
  title,
  score,
}: {
  icon: React.ReactNode;
  title: string;
  score: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 4, transition: HOVER_SPRING }}
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl transition-colors duration-300 ease-out hover:border-cyan-400/20"
    >

      <div className="flex items-center gap-4">

        <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
          {icon}
        </div>

        <div>

          <p className="text-sm text-slate-400">
            {title}
          </p>

          <h3 className="font-semibold">
            {score}
          </h3>

        </div>

      </div>

    </motion.div>
  );
}
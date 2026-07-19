"use client";

import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, Percent } from "lucide-react";
import type { PortfolioSummary } from "@/lib/portfolioData";

const EASE = [0.16, 1, 0.3, 1] as const;
const HOVER_SPRING = { type: "spring", stiffness: 260, damping: 24, mass: 0.9 } as const;

function formatCurrency(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatPnL(amount: number): string {
  const prefix = amount >= 0 ? "+" : "";
  return `${prefix}₹${Math.abs(amount).toLocaleString("en-IN")}`;
}

interface PortfolioStatsProps {
  data: PortfolioSummary;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  isPositive: boolean;
  icon: React.ElementType;
  index: number;
  accentColor: string;
}

function StatCard({ title, value, subtitle, isPositive, icon: Icon, index, accentColor }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: HOVER_SPRING,
      }}
      className="
        group
        relative
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-white/5
        p-6
        backdrop-blur-3xl
        transition-colors
        duration-500
        ease-out
        transform-gpu
        will-change-transform
        hover:border-cyan-400/40
      "
    >
      {/* Hover Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
        <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />
      </div>

      <div className="relative flex items-center justify-between text-slate-400">
        <span className="text-sm font-medium text-slate-300">{title}</span>
        <motion.div
          whileHover={{ rotate: 8 }}
          transition={{ duration: 0.4, ease: EASE }}
          className={`rounded-xl p-2 ${accentColor}`}
        >
          <Icon className="h-5 w-5" />
        </motion.div>
      </div>

      <div className="relative mt-4 text-3xl font-extrabold text-white">{value}</div>

      <div
        className={`relative mt-2 text-xs font-semibold ${
          isPositive ? "text-emerald-400" : "text-red-400"
        }`}
      >
        {subtitle}
      </div>

      {/* Bottom Accent */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-cyan-400 to-blue-500"
      />
    </motion.div>
  );
}

export default function PortfolioStats({ data }: PortfolioStatsProps) {
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Portfolio Value"
        value={formatCurrency(data.totalValue)}
        subtitle="Across all holdings"
        isPositive={true}
        icon={IndianRupee}
        index={0}
        accentColor="bg-cyan-500/10 text-cyan-400"
      />
      <StatCard
        title="Today's Gain / Loss"
        value={formatPnL(data.todayPnL)}
        subtitle={data.todayPnL >= 0 ? "Market performing well" : "Market downturn"}
        isPositive={data.todayPnL >= 0}
        icon={TrendingUp}
        index={1}
        accentColor="bg-emerald-500/10 text-emerald-400"
      />
      <StatCard
        title="Overall Return"
        value={`${data.totalReturn >= 0 ? "+" : ""}${data.totalReturn}%`}
        subtitle={data.totalReturn >= 0 ? "Outperforming Nifty 50" : "Underperforming benchmark"}
        isPositive={data.totalReturn >= 0}
        icon={Percent}
        index={2}
        accentColor="bg-blue-500/10 text-blue-400"
      />
    </div>
  );
}

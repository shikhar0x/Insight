"use client";

import { motion } from "framer-motion";
import { Plus, Eye, TrendingUp, TrendingDown } from "lucide-react";
import type { Holding } from "@/lib/portfolioData";

const EASE = [0.16, 1, 0.3, 1] as const;
const HOVER_SPRING = { type: "spring", stiffness: 260, damping: 24, mass: 0.9 } as const;

function formatPrice(price: number): string {
  return `₹${price.toLocaleString("en-IN")}`;
}

function calcPnL(holding: Holding): { amount: number; percent: number } {
  const amount = (holding.current - holding.avg) * holding.qty;
  const percent = ((holding.current - holding.avg) / holding.avg) * 100;
  return { amount, percent };
}

interface HoldingsTableProps {
  holdings: Holding[];
  onViewStock?: (symbol: string) => void;
}

export default function HoldingsTable({ holdings, onViewStock }: HoldingsTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
      className="
        group
        relative
        mt-8
        overflow-hidden
        rounded-[32px]
        border
        border-white/10
        bg-white/5
        backdrop-blur-3xl
        shadow-2xl
        transition-colors
        duration-500
        ease-out
        hover:border-cyan-400/40
      "
    >
      {/* Hover Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
        <div className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[100px]" />
      </div>

      {/* Table Header */}
      <div className="relative flex items-center justify-between border-b border-white/10 px-8 py-5">
        <div>
          <h3 className="text-lg font-bold text-white">Holdings</h3>
          <p className="mt-0.5 text-xs text-slate-400">{holdings.length} stocks in your portfolio</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, transition: HOVER_SPRING }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          Add Stock
        </motion.button>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-slate-500">
              <th className="px-8 py-4 font-semibold">Stock</th>
              <th className="px-4 py-4 font-semibold text-right">Qty</th>
              <th className="px-4 py-4 font-semibold text-right">Avg Price</th>
              <th className="px-4 py-4 font-semibold text-right">Current</th>
              <th className="px-4 py-4 font-semibold text-right">P&L</th>
              <th className="px-8 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding, i) => {
              const pnl = calcPnL(holding);
              const isPositive = pnl.amount >= 0;

              return (
                <motion.tr
                  key={holding.symbol}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.06, ease: EASE }}
                  className="group/row border-b border-white/5 transition-colors duration-300 hover:bg-white/[0.04]"
                >
                  {/* Stock */}
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold ${
                        isPositive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {holding.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-white">{holding.symbol}</div>
                        <div className="text-xs text-slate-500">{holding.name}</div>
                      </div>
                    </div>
                  </td>

                  {/* Qty */}
                  <td className="px-4 py-4 text-right font-medium text-slate-300">
                    {holding.qty}
                  </td>

                  {/* Avg Price */}
                  <td className="px-4 py-4 text-right font-medium text-slate-400">
                    {formatPrice(holding.avg)}
                  </td>

                  {/* Current */}
                  <td className="px-4 py-4 text-right font-semibold text-white">
                    {formatPrice(holding.current)}
                  </td>

                  {/* P&L */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {isPositive ? (
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                      )}
                      <div>
                        <div className={`font-semibold ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                          {isPositive ? "+" : ""}₹{Math.abs(pnl.amount).toLocaleString("en-IN")}
                        </div>
                        <div className={`text-[10px] ${isPositive ? "text-emerald-400/70" : "text-red-400/70"}`}>
                          {isPositive ? "+" : ""}{pnl.percent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-8 py-4 text-right">
                    <motion.button
                      onClick={() => onViewStock?.(holding.symbol)}
                      whileHover={{ scale: 1.06, transition: HOVER_SPRING }}
                      whileTap={{ scale: 0.94 }}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/30 hover:bg-white/10 hover:text-white"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </motion.button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
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

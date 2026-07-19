"use client";

import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { companyDataMap } from "@/lib/companyData";

const HOVER_SPRING = { type: "spring", stiffness: 260, damping: 24, mass: 0.9 } as const;

interface CompanySearchProps {
  onSearch: (symbol: string) => void;
  onBack?: () => void;
}

export default function CompanySearch({ onSearch, onBack }: CompanySearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = Object.values(companyDataMap).filter(
    (c) =>
      c.symbol.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="relative z-30 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Search Input Container */}
      <div className="relative flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search company (e.g. TCS, INFY, HDFCBANK)..."
            className="w-full rounded-2xl border border-white/10 bg-black/40 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition focus:border-cyan-400/50"
          />
        </div>

        {/* Suggestions dropdown */}
        <AnimatePresence>
          {isFocused && (query.length > 0 || suggestions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 right-0 mt-2 rounded-2xl border border-white/10 bg-[#0c1322] p-2 shadow-2xl backdrop-blur-2xl"
            >
              {suggestions.length > 0 ? (
                suggestions.map((s) => (
                  <button
                    key={s.symbol}
                    onClick={() => {
                      onSearch(s.symbol);
                      setQuery("");
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-white/5"
                  >
                    <div>
                      <div className="font-bold text-white text-sm">{s.symbol}</div>
                      <div className="text-xs text-slate-400">{s.name}</div>
                    </div>
                    <span className="text-xs font-semibold text-cyan-400">{s.sector}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-xs text-slate-500">
                  No matches found. Try TCS, INFY, HDFCBANK, or RELIANCE
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center gap-2">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.05, transition: HOVER_SPRING }}
          whileTap={{ scale: 0.95 }}
          title="Back"
          aria-label="Back to Dashboard"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 backdrop-blur-xl transition hover:border-cyan-400/30 hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, transition: HOVER_SPRING }}
          whileTap={{ scale: 0.95 }}
          disabled
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/[0.02] text-slate-600 backdrop-blur-xl cursor-not-allowed opacity-50"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";
import type { Preset } from "./types";

const HOVER_SPRING = { type: "spring", stiffness: 260, damping: 24, mass: 0.9 } as const;

export const PRESETS: Preset[] = [
  {
    id: "growth",
    name: "Growth",
    description: "High revenue, EPS growth & returns",
    filters: [
      { metricId: "revenueGrowth", operator: ">", value: 15 },
      { metricId: "epsGrowth", operator: ">", value: 15 },
      { metricId: "roe", operator: ">", value: 18 },
    ],
  },
  {
    id: "value",
    name: "Value",
    description: "Low P/E & low leverage",
    filters: [
      { metricId: "pe", operator: "<", value: 20 },
      { metricId: "debtEquity", operator: "<", value: 0.5 },
    ],
  },
  {
    id: "momentum",
    name: "Momentum",
    description: "Supercharged growth with high AI convictions",
    filters: [
      { metricId: "revenueGrowth", operator: ">", value: 25 },
      { metricId: "aiScore", operator: ">", value: 80 },
    ],
  },
  {
    id: "dividend",
    name: "Dividend",
    description: "Attractive P/E margins & high return index",
    filters: [
      { metricId: "pe", operator: "<", value: 15 },
      { metricId: "roe", operator: ">", value: 15 },
    ],
  },
  {
    id: "quality",
    name: "Quality",
    description: "Exceptional ROE metrics with minimal debt load",
    filters: [
      { metricId: "roe", operator: ">", value: 25 },
      { metricId: "debtEquity", operator: "<", value: 0.2 },
    ],
  },
  {
    id: "lowRisk",
    name: "Low Risk",
    description: "Safe leverage ratios & strong AI score security",
    filters: [
      { metricId: "debtEquity", operator: "<", value: 0.3 },
      { metricId: "aiScore", operator: ">", value: 75 },
    ],
  },
  {
    id: "largeCap",
    name: "Large Cap",
    description: "Filter by Large Cap blue chips",
    filters: [{ metricId: "marketCap", operator: "=", value: "Large Cap" }],
  },
  {
    id: "midCap",
    name: "Mid Cap",
    description: "Filter by Mid Cap high growth stocks",
    filters: [{ metricId: "marketCap", operator: "=", value: "Mid Cap" }],
  },
];

interface QuickPresetsProps {
  selectedPreset: string | null;
  onSelectPreset: (presetId: string) => void;
  customPresets?: string[];
  onDeletePreset?: (name: string) => void;
  onEditPreset?: (name: string) => void;
}

export default function QuickPresets({
  selectedPreset,
  onSelectPreset,
  customPresets = [],
  onDeletePreset,
  onEditPreset,
}: QuickPresetsProps) {
  const [hoveredCustom, setHoveredCustom] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Quick Presets */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Quick Presets
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {PRESETS.map((preset) => (
            <motion.button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id)}
              whileHover={{ scale: 1.05, transition: HOVER_SPRING }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-xl px-4 py-2 text-xs font-bold border transition-all duration-300 ${selectedPreset === preset.id
                  ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-500/10"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                }`}
            >
              {preset.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Custom Screens - using div instead of button to avoid nested buttons */}
      {customPresets.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Custom Screens
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {customPresets.map((name) => {
              const isSelected = selectedPreset === name;
              const isHovered = hoveredCustom === name;
              const showIcons = isSelected && isHovered;

              return (
                <div
                  key={name}
                  onMouseEnter={() => isSelected && setHoveredCustom(name)}
                  onMouseLeave={() => isSelected && setHoveredCustom(null)}
                >
                  <motion.div
                    onClick={() => onSelectPreset(name)}
                    whileHover={{ scale: 1.05, transition: HOVER_SPRING }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative rounded-xl px-4 py-2 text-xs font-bold border transition-colors duration-300 cursor-pointer ${isSelected
                        ? "border-cyan-400/40 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-500/10"
                        : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                      }`}
                  >
                    <span
                      className={`transition-opacity duration-200 ${showIcons ? "opacity-0" : "opacity-100"
                        }`}
                    >
                      {name}
                    </span>

                    <span
                      className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity duration-200 ${showIcons ? "opacity-100" : "opacity-0"
                        }`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditPreset?.(name);
                        }}
                        className="rounded-lg p-0.5 text-cyan-300 transition-colors hover:bg-cyan-500/20 hover:text-cyan-200"
                        title="Edit preset filters"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePreset?.(name);
                        }}
                        className="rounded-lg p-0.5 text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                        title="Delete preset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
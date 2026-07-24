"use client";

import { useState } from "react";
import { Trash2, Plus, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import type { Filter, FilterMetric, OperatorType } from "./types";
import AddFilterModal from "./AddFilterModal";

const HOVER_SPRING = { type: "spring", stiffness: 260, damping: 24, mass: 0.9 } as const;

export const AVAILABLE_METRICS: FilterMetric[] = [
  { id: "aiScore", name: "Overall Score", category: "AI Metrics", type: "number", placeholder: "e.g. 80" },
  { id: "fundamentalScore", name: "Fundamental Score", category: "AI Metrics", type: "number", placeholder: "e.g. 30" },
  { id: "technicalScore", name: "Technical Score", category: "AI Metrics", type: "number", placeholder: "e.g. 50" },
  { id: "riskScore", name: "Risk Score", category: "AI Metrics", type: "number", placeholder: "e.g. 90" },
  { id: "pe", name: "P/E Ratio", category: "Valuation", type: "number", placeholder: "e.g. 25" },
  { id: "roe", name: "ROE (%)", category: "Financial", type: "number", placeholder: "e.g. 15" },
  { id: "revenueGrowth", name: "Revenue Growth (%)", category: "Growth", type: "number", placeholder: "e.g. 10" },
  { id: "epsGrowth", name: "EPS Growth (%)", category: "Growth", type: "number", placeholder: "e.g. 12" },
  { id: "debtEquity", name: "Debt to Equity", category: "Risk", type: "number", placeholder: "e.g. 0.5" },
  { id: "marketCap", name: "Market Cap", category: "Financial", type: "select", placeholder: "Select market cap", options: ["Large Cap", "Mid Cap", "Small Cap"] },
  { id: "sector", name: "Sector", category: "Financial", type: "select", placeholder: "Select sector", options: ["IT Services", "Banking & Financials", "Conglomerate", "Automotive", "Electronics", "Financial Services", "Consumer Services", "Telecom", "Energy"] },
];

interface FilterBuilderProps {
  filters: Filter[];
  onAddFilter?: (metric: FilterMetric, operator: OperatorType, value: string | number) => void;
  onUpdateFilter: (id: string, updates: Partial<Filter>) => void;
  onRemoveFilter: (id: string) => void;
  onClearAll?: () => void;
}

const operatorSymbols: Record<OperatorType, string> = {
  ">": ">",
  "<": "<",
  "=": "=",
  ">=": "≥",
  "<=": "≤",
};

export default function FilterBuilder({
  filters,
  onAddFilter,
  onUpdateFilter,
  onRemoveFilter,
  onClearAll,
}: FilterBuilderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<Filter | null>(null);


  const handleAddClick = () => {
    setEditingFilter(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (filter: Filter) => {
    setEditingFilter(filter);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingFilter(null);
  };

  const handleModalSave = (metricId: string, operator: OperatorType, value: string | number) => {
    if (editingFilter) {
      onUpdateFilter(editingFilter.id, { metricId, operator, value });
    } else {
      const metric = AVAILABLE_METRICS.find(m => m.id === metricId);
      if (metric) {
        onAddFilter?.(metric, operator, value);
      }
    }
    handleModalClose();
  };

  const formatValue = (filter: Filter) => {
    const metric = AVAILABLE_METRICS.find(m => m.id === filter.metricId);
    if (metric?.type === "number") {
      return Number(filter.value).toFixed(metric.id === "debtEquity" ? 2 : 0);
    }
    return filter.value;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Active Filter Conditions
        </h3>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={onClearAll}
            disabled={filters.length === 0}
            whileHover={filters.length > 0 ? { scale: 1.04, transition: HOVER_SPRING } : {}}
            whileTap={filters.length > 0 ? { scale: 0.96 } : {}}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
              filters.length > 0
                ? "border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 cursor-pointer"
                : "border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed opacity-50"
            }`}
            title="Clear all active filters"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear All
          </motion.button>
          <motion.button
            onClick={handleAddClick}
            whileHover={{ scale: 1.04, transition: HOVER_SPRING }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-400/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300 transition hover:bg-cyan-500/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Filter
          </motion.button>
        </div>
      </div>

      {filters.length === 0 ? (
        <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
          No active filter rules. Click "+ Add Filter" or select a preset above.
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => {
            const metric = AVAILABLE_METRICS.find((m) => m.id === filter.metricId) || AVAILABLE_METRICS[0];
            const operator = filter.operator as OperatorType;
            const displayValue = formatValue(filter);

            return (
              <motion.div
                key={filter.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.03, transition: HOVER_SPRING }}
                className="group relative flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:border-cyan-400/30 hover:bg-white/10"
              >
                <button
                  onClick={() => handleEditClick(filter)}
                  className="flex items-center gap-1.5"
                >
                  <span className="text-slate-300">{metric.name}</span>
                  <span className="text-cyan-400">{operatorSymbols[operator]}</span>
                  <span className="text-white">{displayValue}</span>
                </button>

                <button
                  onClick={() => onRemoveFilter(filter.id)}
                  className="ml-1 rounded-full p-0.5 text-slate-400 opacity-0 transition hover:bg-white/10 hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      <AddFilterModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        editingFilter={editingFilter}
        availableMetrics={AVAILABLE_METRICS}
        activeMetricIds={filters.map(f => f.metricId)}
      />
    </div>
  );
}
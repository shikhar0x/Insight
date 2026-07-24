"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { FilterMetric, OperatorType, Filter } from "./types";
import CustomSelect from "./CustomSelect";

const OPERATOR_OPTIONS = [
  { value: ">", label: "Greater than (>)" },
  { value: "<", label: "Less than (<)" },
  { value: "=", label: "Equals (=)" },
  { value: ">=", label: "Greater or equal (>=)" },
  { value: "<=", label: "Less or equal (<=)" },
];

interface AddFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metricId: string, operator: OperatorType, value: string | number) => void;
  editingFilter?: Filter | null;
  availableMetrics?: FilterMetric[];
  activeMetricIds?: string[];
}

export default function AddFilterModal({
  isOpen,
  onClose,
  onSave,
  editingFilter,
  availableMetrics = [],
  activeMetricIds = [],
}: AddFilterModalProps) {
  const [search, setSearch] = useState("");
  const [selectedMetricId, setSelectedMetricId] = useState<string>("");
  const [operator, setOperator] = useState<OperatorType>(">");
  const [value, setValue] = useState<string | number>("");

  const isEditing = !!editingFilter;

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => {
    if (editingFilter) {
      setSelectedMetricId(editingFilter.metricId);
      setOperator(editingFilter.operator as OperatorType);
      setValue(editingFilter.value);
    } else {
      setSelectedMetricId("");
      setOperator(">");
      setValue("");
    }
  }, [editingFilter, isOpen]);

  const selectedMetric = availableMetrics.find(m => m.id === selectedMetricId);

  // Auto-set operator to "=" for select-type metrics
  useEffect(() => {
    if (selectedMetric?.type === "select") {
      setOperator("=");
    }
  }, [selectedMetricId, selectedMetric?.type]);

  // When adding a new filter, hide metrics that are already active
  const metricsToShow = isEditing
    ? availableMetrics
    : availableMetrics.filter(m => !activeMetricIds.includes(m.id));

  const filteredMetrics = metricsToShow.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMetricId) return;
    let finalValue = value;
    if (selectedMetric?.type === "number") {
      finalValue = parseFloat(String(value)) || 0;
    }
    onSave(selectedMetricId, operator, finalValue);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b1220] p-6 shadow-2xl backdrop-blur-3xl z-10"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="text-lg font-bold text-white">
                {isEditing ? "Edit Filter" : "Add Filter Condition"}
              </h3>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Metric
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search metrics..."
                    className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-10 pr-4 text-sm text-white outline-none focus:border-cyan-400/50"
                  />
                </div>
                <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                  {filteredMetrics.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMetricId(m.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                        selectedMetricId === m.id
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30"
                          : "text-slate-300 hover:bg-white/5"
                      }`}
                    >
                      {m.name} <span className="text-xs text-slate-500">({m.category})</span>
                    </button>
                  ))}
                  {filteredMetrics.length === 0 && (
                    <div className="text-sm text-slate-500 py-2">No metrics found</div>
                  )}
                </div>
              </div>

              {selectedMetric && selectedMetric.type === "select" ? (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Condition
                    </label>
                    <div className="rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-slate-400 font-medium">
                      equals (=)
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Value
                    </label>
                    <CustomSelect
                      value={String(value)}
                      onChange={(val) => {
                        setValue(val);
                        setOperator("=");
                      }}
                      options={selectedMetric.options || []}
                      placeholder={selectedMetric.placeholder || "Select a value"}
                    />
                  </div>
                </div>
              ) : selectedMetric ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Operator
                    </label>
                    <CustomSelect
                      value={operator}
                      onChange={(val) => setOperator(val as OperatorType)}
                      options={OPERATOR_OPTIONS}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Value
                    </label>
                    <input
                      type={selectedMetric.type === "number" ? "number" : "text"}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={selectedMetric.placeholder || "Enter value"}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
                      step="any"
                    />
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedMetricId}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditing ? "Update" : "Add"} Filter
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
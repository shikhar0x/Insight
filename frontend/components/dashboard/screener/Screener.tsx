"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import ScreenerHeader from "./ScreenerHeader";
import SearchBar from "./SearchBar";
import QuickPresets, { PRESETS } from "./QuickPresets";
import FilterBuilder from "./FilterBuilder";
import SaveScreenDialog from "./SaveScreenDialog";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import ResultsTable from "./ResultsTable";
import EmptyResults from "./EmptyResults";
import { screenerStocks } from "@/lib/screenerData";
import type { Filter, Stock, FilterMetric, OperatorType } from "./types";

interface ScreenerProps {
  onBack?: () => void;
  onViewStock?: (symbol: string) => void;
}

export default function Screener({ onBack, onViewStock }: ScreenerProps) {
  const [filters, setFilters] = useState<Filter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("aiScore");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [editingPresetName, setEditingPresetName] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [presetToDelete, setPresetToDelete] = useState<string | null>(null);

  const [savedScreens, setSavedScreens] = useState<{ name: string; filters: Filter[] }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("insight_saved_screener_presets");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const handleAddFilter = (metric: FilterMetric, operator: OperatorType, value: string | number) => {
    console.log('✅ handleAddFilter called with:', metric.name, operator, value);
    const newFilter: Filter = {
      id: Math.random().toString(36).substr(2, 9),
      metricId: metric.id,
      operator: operator,
      value: value,
    };
    setFilters((prev) => [...prev, newFilter]);
    setSelectedPreset(null);
    setEditingPresetName(null);
  };

  const handleUpdateFilter = (id: string, updates: Partial<Filter>) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    setSelectedPreset(null);
    setEditingPresetName(null);
  };

  const handleRemoveFilter = (id: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
    setSelectedPreset(null);
    setEditingPresetName(null);
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setFilters(preset.filters.map((f) => ({ ...f, id: Math.random().toString(36).substr(2, 9) })));
      setSelectedPreset(presetId);
      setEditingPresetName(null);
      return;
    }
    const saved = savedScreens.find((s) => s.name === presetId);
    if (saved) {
      setFilters(saved.filters.map((f) => ({ ...f, id: Math.random().toString(36).substr(2, 9) })));
      setSelectedPreset(presetId);
      setEditingPresetName(null);
    }
  };

  const handleResetFilters = () => {
    setFilters([]);
    setSelectedPreset(null);
    setSearchQuery("");
    setEditingPresetName(null);
  };

  const handleAIPrompt = (prompt: string) => {
    const lower = prompt.toLowerCase();
    const parsedFilters: Filter[] = [];
    if (lower.includes("it") || lower.includes("tech")) {
      parsedFilters.push({ id: "ai-sector", metricId: "sector", operator: "=", value: "IT Services" });
    }
    if (lower.includes("bank") || lower.includes("financial")) {
      parsedFilters.push({ id: "ai-sector", metricId: "sector", operator: "=", value: "Banking & Financials" });
    }
    if (lower.includes("undervalued") || lower.includes("low pe")) {
      parsedFilters.push({ id: "ai-pe", metricId: "pe", operator: "<", value: 25 });
    }
    if (lower.includes("high roe")) {
      parsedFilters.push({ id: "ai-roe", metricId: "roe", operator: ">", value: 18 });
    }
    if (lower.includes("growth")) {
      parsedFilters.push({ id: "ai-growth", metricId: "revenueGrowth", operator: ">", value: 12 });
    }
    if (lower.includes("low debt")) {
      parsedFilters.push({ id: "ai-debt", metricId: "debtEquity", operator: "<", value: 0.3 });
    }
    if (parsedFilters.length > 0) {
      setFilters(parsedFilters);
      setSelectedPreset(null);
      setEditingPresetName(null);
      toast.success("AI applied your criteria", { description: `Added ${parsedFilters.length} condition(s)` });
    } else {
      toast.info("AI couldn't extract criteria", { description: "Try: 'Find undervalued IT companies with high ROE'" });
    }
  };

  const handleSaveScreen = (name: string) => {
    if (editingPresetName) {
      const updated = savedScreens.map((s) =>
        s.name === editingPresetName ? { name, filters } : s
      );
      setSavedScreens(updated);
      localStorage.setItem("insight_saved_screener_presets", JSON.stringify(updated));
      setSelectedPreset(name);
      setEditingPresetName(null);
      toast.success(`Preset "${name}" updated`);
    } else {
      const updated = [...savedScreens, { name, filters }];
      setSavedScreens(updated);
      localStorage.setItem("insight_saved_screener_presets", JSON.stringify(updated));
      setSelectedPreset(name);
      toast.success(`Preset "${name}" saved`);
    }
  };

  const handleDeletePreset = (name: string) => {
    setPresetToDelete(name);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!presetToDelete) return;
    const updated = savedScreens.filter((s) => s.name !== presetToDelete);
    setSavedScreens(updated);
    localStorage.setItem("insight_saved_screener_presets", JSON.stringify(updated));
    if (selectedPreset === presetToDelete) setSelectedPreset(null);
    if (editingPresetName === presetToDelete) setEditingPresetName(null);
    setFilters([]);
    toast.success(`Preset "${presetToDelete}" deleted`);
    setPresetToDelete(null);
    setDeleteModalOpen(false);
  };

  const handleEditPreset = (name: string) => {
    const saved = savedScreens.find((s) => s.name === name);
    if (saved) {
      setFilters(saved.filters.map((f) => ({ ...f, id: Math.random().toString(36).substr(2, 9) })));
      setSelectedPreset(name);
      setEditingPresetName(name);
      setShowSaveDialog(true);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    else { setSortBy(column); setSortDirection("desc"); }
  };

  // 🔥 DEBUG: Log just before rendering
  console.log('🔍 Screener render: typeof handleAddFilter =', typeof handleAddFilter);

  const filteredStocks = (screenerStocks as Stock[]).filter((stock) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!stock.symbol.toLowerCase().includes(q) && !stock.name.toLowerCase().includes(q)) return false;
    }
    for (const filter of filters) {
      const metricValue = (stock as any)[filter.metricId];
      if (metricValue === undefined) continue;
      const filterVal = filter.value;
      if (typeof metricValue === "number") {
        const numVal = parseFloat(filterVal as string) || 0;
        switch (filter.operator) {
          case ">": if (metricValue <= numVal) return false; break;
          case "<": if (metricValue >= numVal) return false; break;
          case "=": if (metricValue !== numVal) return false; break;
          case ">=": if (metricValue < numVal) return false; break;
          case "<=": if (metricValue > numVal) return false; break;
        }
      } else {
        const sVal = String(filterVal).toLowerCase();
        const sMetric = String(metricValue).toLowerCase();
        if (filter.operator === "=" && !sMetric.includes(sVal)) return false;
      }
    }
    return true;
  });

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    const valA = (a as any)[sortBy];
    const valB = (b as any)[sortBy];
    if (valA === undefined || valB === undefined) return 0;
    if (typeof valA === "number" && typeof valB === "number") {
      return sortDirection === "asc" ? valA - valB : valB - valA;
    }
    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });

  return (
    <div className="relative min-h-screen px-6 pt-24 pb-20 text-white">
      <Toaster position="bottom-right" richColors />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[160px]" />
        <div className="absolute right-1/4 top-60 h-96 w-96 rounded-full bg-blue-600/10 blur-[160px]" />
      </div>
      <div className="mx-auto max-w-7xl px-8 space-y-8">
        <ScreenerHeader onBack={onBack} onSaveScreen={() => setShowSaveDialog(true)} />
        <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} onAIPrompt={handleAIPrompt} />
        <QuickPresets
          selectedPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
          customPresets={savedScreens.map((s) => s.name)}
          onDeletePreset={handleDeletePreset}
          onEditPreset={handleEditPreset}
        />
        <FilterBuilder
          filters={filters}
          onAddFilter={handleAddFilter}
          onUpdateFilter={handleUpdateFilter}
          onRemoveFilter={handleRemoveFilter}
        />
        {sortedStocks.length > 0 ? (
          <ResultsTable stocks={sortedStocks} onViewStock={onViewStock} sortBy={sortBy} sortDirection={sortDirection} onSort={handleSort} />
        ) : (
          <EmptyResults onReset={handleResetFilters} />
        )}
      </div>
      <SaveScreenDialog isOpen={showSaveDialog} onClose={() => { setShowSaveDialog(false); setEditingPresetName(null); }} onSave={handleSaveScreen} editingName={editingPresetName} />
      <DeleteConfirmationModal isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setPresetToDelete(null); }} onConfirm={confirmDelete} presetName={presetToDelete || ""} />
    </div>
  );
}
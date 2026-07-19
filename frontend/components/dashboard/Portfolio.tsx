"use client";

import PortfolioHeader from "./portfolio/PortfolioHeader";
import PortfolioStats from "./portfolio/PortfolioStats";
import HoldingsTable from "./portfolio/HoldingsTable";
import AllocationCard from "./portfolio/AllocationCard";
import { portfolio, holdings } from "@/lib/portfolioData";

interface PortfolioProps {
  onBack?: () => void;
  onViewStock?: (symbol: string) => void;
}

export default function Portfolio({ onBack, onViewStock }: PortfolioProps) {
  return (
    <div className="relative min-h-screen px-6 pt-24 pb-20 text-white">
      {/* Background Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[160px]" />
        <div className="absolute right-1/4 top-60 h-96 w-96 rounded-full bg-blue-600/10 blur-[160px]" />
      </div>

      <div className="mx-auto max-w-7xl px-8">
        <PortfolioHeader onBack={onBack} />
        <PortfolioStats data={portfolio} />
        <HoldingsTable holdings={holdings} onViewStock={onViewStock} />
        <AllocationCard />
      </div>
    </div>
  );
}

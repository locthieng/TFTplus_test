"use client";

import React from "react";
import { Search } from "lucide-react";
import { Trait, TeamCompTier } from "@/types/tft";
import { cn } from "@/utils/cn";

interface TeamCompFilterBarProps {
  traits: Trait[];
  selectedTrait: string | null;
  onSelectTrait: (traitId: string | null) => void;
  selectedTier: TeamCompTier | "ALL";
  onSelectTier: (tier: TeamCompTier | "ALL") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCompsCount: number;
}

export function TeamCompFilterBar({
  traits,
  selectedTrait,
  onSelectTrait,
  selectedTier,
  onSelectTier,
  searchQuery,
  onSearchChange,
  totalCompsCount,
}: TeamCompFilterBarProps) {
  const tiers: (TeamCompTier | "ALL")[] = ["ALL", "S", "A", "B"];

  return (
    <div className="w-full bg-[#101726] border border-[#1e2a3f] rounded-lg p-2.5 sm:p-3 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-md">
      {/* Left group: Trait Select & Tier Tabs */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Trait Dropdown Filter */}
        <div className="relative">
          <select
            value={selectedTrait || ""}
            onChange={(e) => onSelectTrait(e.target.value ? e.target.value : null)}
            className="bg-[#151f33] border border-[#24344d] rounded text-xs font-semibold text-slate-200 px-3 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="">All Traits ({traits.length})</option>
            {traits.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tier Tabs */}
        <div className="flex items-center bg-[#151f33] border border-[#24344d] rounded p-0.5 text-xs">
          {tiers.map((tier) => {
            const isSelected = selectedTier === tier;
            const tierColor =
              tier === "S"
                ? "text-amber-400"
                : tier === "A"
                ? "text-purple-400"
                : tier === "B"
                ? "text-blue-400"
                : "text-slate-300";

            return (
              <button
                key={tier}
                type="button"
                onClick={() => onSelectTier(tier)}
                className={cn(
                  "px-3 py-1 rounded font-bold transition-all cursor-pointer",
                  isSelected
                    ? "bg-amber-500 text-slate-950 shadow-xs"
                    : `${tierColor} hover:text-white hover:bg-[#1e2a42]`
                )}
              >
                {tier === "ALL" ? "All Tiers" : `Tier ${tier}`}
              </button>
            );
          })}
        </div>

        <span className="hidden lg:inline-block text-xs text-slate-400 font-medium pl-1">
          {totalCompsCount} {totalCompsCount === 1 ? "comp" : "comps"}
        </span>
      </div>

      {/* Right group: Search input */}
      <div className="relative min-w-[240px] sm:w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search comp, champion, trait..."
          className="w-full pl-9 pr-3 py-1.5 bg-[#151f33] border border-[#24344d] rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
        />
      </div>
    </div>
  );
}

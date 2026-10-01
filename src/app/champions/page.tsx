"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { MOCK_CHAMPIONS, MOCK_TRAITS } from "@/data/mockTftData";
import { CostTier } from "@/types/tft";
import { COST_COLORS } from "@/constants/tft";
import { SearchInput } from "@/components/common/SearchInput";
import { Users, Zap } from "lucide-react";
import { cn } from "@/utils/cn";

export default function ChampionsPage() {
  const [search, setSearch] = useState("");
  const [selectedCost, setSelectedCost] = useState<CostTier | null>(null);
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);

  const filteredChampions = useMemo(() => {
    return MOCK_CHAMPIONS.filter((c) => {
      if (selectedCost && c.cost !== selectedCost) return false;
      if (selectedTrait && !c.traits.includes(selectedTrait)) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    }).sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
  }, [search, selectedCost, selectedTrait]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-amber-400" />
            TFT Champions Database
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse champion abilities, base stats, mana pools, cost tiers, and synergistic traits.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search champion..."
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111722] border border-[#202a3c] rounded-xl p-3">
        {/* Cost filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCost(null)}
            className={cn(
              "px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer select-none transition-colors",
              selectedCost === null
                ? "bg-amber-500 text-slate-950 font-bold"
                : "bg-[#182130] text-slate-300 hover:bg-[#202c40]"
            )}
          >
            All Costs
          </button>
          {([1, 2, 3, 4, 5] as CostTier[]).map((cost) => {
            const costStyle = COST_COLORS[cost];
            const isSelected = selectedCost === cost;
            return (
              <button
                key={cost}
                type="button"
                onClick={() => setSelectedCost(isSelected ? null : cost)}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-bold border transition-colors select-none cursor-pointer",
                  isSelected
                    ? `${costStyle.bg} ${costStyle.text} border-amber-400`
                    : "bg-[#182130] border-[#222c3d] text-slate-400 hover:text-white"
                )}
              >
                ${cost}
              </button>
            );
          })}
        </div>

        {/* Trait filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full text-xs">
          <button
            type="button"
            onClick={() => setSelectedTrait(null)}
            className={cn(
              "px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer",
              selectedTrait === null
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            All Traits
          </button>
          {MOCK_TRAITS.map((tr) => (
            <button
              key={tr.id}
              type="button"
              onClick={() =>
                setSelectedTrait(selectedTrait === tr.id ? null : tr.id)
              }
              className={cn(
                "px-2 py-0.5 rounded text-[11px] font-medium border whitespace-nowrap transition-colors cursor-pointer",
                selectedTrait === tr.id
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-[#141b27] border-[#222c3d] text-slate-400 hover:text-slate-200"
              )}
            >
              {tr.name}
            </button>
          ))}
        </div>
      </div>

      {/* Champions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChampions.map((champ) => {
          const costStyle = COST_COLORS[champ.cost];

          return (
            <div
              key={champ.id}
              className="bg-[#121824] border border-[#222c3d] hover:border-[#384863] rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 transition-all hover:shadow-xl"
            >
              {/* Top: Portrait, Name, Cost, Traits */}
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-900 flex-shrink-0 relative",
                    costStyle.border
                  )}
                >
                  <Image
                    src={champ.imageUrl}
                    alt={champ.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  <div
                    className={cn(
                      "absolute bottom-0 right-0 px-1 py-0.2 text-[10px] font-black rounded-tl",
                      costStyle.bg,
                      costStyle.text
                    )}
                  >
                    ${champ.cost}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-100 truncate">
                      {champ.name}
                    </h2>
                    <span className={cn("text-xs font-bold", costStyle.text)}>
                      Cost {champ.cost}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {champ.traits.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#182333] border border-[#25354d] text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ability */}
              {champ.ability && (
                <div className="bg-[#151e2c] border border-[#233145] p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">
                      {champ.ability.name}
                    </span>
                    {champ.ability.mana && (
                      <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        {champ.ability.mana.starting}/{champ.ability.mana.total}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {champ.ability.description}
                  </p>
                </div>
              )}

              {/* Stats Footer */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1e2738]/60 text-center text-xs">
                <div className="bg-[#0f1520] p-1.5 rounded-lg border border-[#1b2536]">
                  <span className="text-[10px] text-slate-500 block">Health</span>
                  <span className="font-mono text-slate-300 text-xs font-semibold">
                    {champ.health?.[0] || 600}
                  </span>
                </div>
                <div className="bg-[#0f1520] p-1.5 rounded-lg border border-[#1b2536]">
                  <span className="text-[10px] text-slate-500 block">AD</span>
                  <span className="font-mono text-slate-300 text-xs font-semibold">
                    {champ.attackDamage?.[0] || 50}
                  </span>
                </div>
                <div className="bg-[#0f1520] p-1.5 rounded-lg border border-[#1b2536]">
                  <span className="text-[10px] text-slate-500 block">Armor</span>
                  <span className="font-mono text-slate-300 text-xs font-semibold">
                    {champ.armor || 30}
                  </span>
                </div>
                <div className="bg-[#0f1520] p-1.5 rounded-lg border border-[#1b2536]">
                  <span className="text-[10px] text-slate-500 block">Range</span>
                  <span className="font-mono text-slate-300 text-xs font-semibold">
                    {champ.range || 1}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

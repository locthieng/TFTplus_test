"use client";

import React, { useState } from "react";
import { MOCK_CHAMPIONS, MOCK_TRAITS } from "@/data/mockTftData";
import { ChampionAvatar } from "@/components/champion/ChampionAvatar";
import { SearchInput } from "@/components/common/SearchInput";
import { useBuilderStore } from "@/stores/useBuilderStore";
import { CostTier } from "@/types/tft";
import { COST_COLORS } from "@/constants/tft";
import { cn } from "@/utils/cn";

export function ChampionPicker() {
  const [search, setSearch] = useState("");
  const [selectedCost, setSelectedCost] = useState<CostTier | null>(null);
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);

  const addChampion = useBuilderStore((state) => state.addChampion);

  const filteredChampions = MOCK_CHAMPIONS.filter((c) => {
    if (selectedCost && c.cost !== selectedCost) return false;
    if (selectedTrait && !c.traits.includes(selectedTrait)) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const handleDragStart = (champId: string, e: React.DragEvent) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ fromPicker: true, championId: champId })
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="bg-[#111722] border border-[#202a3c] rounded-2xl p-4 sm:p-5 flex flex-col gap-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search champion..."
          containerClassName="sm:max-w-xs"
        />

        {/* Cost filters */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCost(null)}
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors select-none",
              selectedCost === null
                ? "bg-amber-500 text-slate-950 shadow"
                : "bg-[#182130] text-slate-300 hover:bg-[#202c40]"
            )}
          >
            All
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
                  "px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors border select-none",
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
      </div>

      {/* Trait quick pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedTrait(null)}
          className={cn(
            "px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors",
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
              "px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap border cursor-pointer transition-colors",
              selectedTrait === tr.id
                ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                : "bg-[#141b27] border-[#222c3d] text-slate-400 hover:text-slate-200"
            )}
          >
            {tr.name}
          </button>
        ))}
      </div>

      {/* Champion Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-10 gap-2 sm:gap-3 max-h-56 sm:max-h-72 overflow-y-auto pr-1">
        {filteredChampions.map((champ) => (
          <div
            key={champ.id}
            draggable
            onDragStart={(e) => handleDragStart(champ.id, e)}
            className="flex flex-col items-center cursor-grab active:cursor-grabbing"
          >
            <ChampionAvatar
              champion={champ}
              size="md"
              showName
              onClick={() => addChampion(champ.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

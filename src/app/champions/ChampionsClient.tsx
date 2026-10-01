"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Champion, Trait, CostTier } from "@/types/tft";
import { COST_COLORS } from "@/constants/tft";
import { SearchInput } from "@/components/common/SearchInput";
import { Users } from "lucide-react";
import { cn } from "@/utils/cn";

interface ChampionsClientProps {
  initialChampions: Champion[];
  initialTraits: Trait[];
}

export function ChampionsClient({
  initialChampions,
  initialTraits,
}: ChampionsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCost, setSelectedCost] = useState<CostTier | null>(null);
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);

  const filteredChampions = useMemo(() => {
    return initialChampions
      .filter((c) => {
        if (selectedCost && c.cost !== selectedCost) return false;
        if (selectedTrait && !c.traits.includes(selectedTrait.toLowerCase()))
          return false;
        if (search && !c.name.toLowerCase().includes(search.toLowerCase()))
          return false;
        return true;
      })
      .sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
  }, [initialChampions, search, selectedCost, selectedTrait]);

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            TFT Champions Database
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Set 18 Champions, costs, synergistic origins/classes, and combat stats.
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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111722] border border-[#202a3c] rounded-lg p-2.5">
        {/* Cost filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setSelectedCost(null)}
            className={cn(
              "px-2.5 py-1 rounded text-xs font-semibold cursor-pointer select-none transition-colors",
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
                  "px-2.5 py-1 rounded text-xs font-bold border transition-colors select-none cursor-pointer",
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

        {/* Trait filter selector */}
        {initialTraits.length > 0 && (
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
            {initialTraits.slice(0, 14).map((tr) => (
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
        )}
      </div>

      {/* Empty State */}
      {filteredChampions.length === 0 && (
        <div className="bg-[#121824] border border-[#222c3d] rounded-lg py-12 text-center text-slate-400 space-y-1">
          <p className="font-semibold text-slate-200 text-sm">No champions found.</p>
          <p className="text-xs text-slate-500">Try adjusting your cost or trait filters.</p>
        </div>
      )}

      {/* Dense Champions Grid */}
      {filteredChampions.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
          {filteredChampions.map((champ) => {
            const costStyle = COST_COLORS[champ.cost];

            return (
              <Link
                key={champ.id}
                href={`/champions/${champ.id}`}
                className="bg-[#111724] hover:bg-[#151e2f] border border-[#1e2a3f] hover:border-amber-400/50 rounded-md p-2.5 flex flex-col justify-between gap-2 transition-all hover:shadow-md group"
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "w-12 h-12 rounded border-2 overflow-hidden bg-slate-900 flex-shrink-0 relative shadow-xs",
                      costStyle.border
                    )}
                  >
                    <Image
                      src={champ.imageUrl}
                      alt={champ.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      unoptimized
                    />
                    <div
                      className={cn(
                        "absolute bottom-0 right-0 px-1 text-[9px] font-black rounded-tl",
                        costStyle.bg,
                        costStyle.text
                      )}
                    >
                      ${champ.cost}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors truncate">
                      {champ.name}
                    </h2>
                    <span className={cn("text-[10px] font-bold block", costStyle.text)}>
                      Cost {champ.cost}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {champ.traits.map((t) => (
                    <span
                      key={t}
                      className="text-[9px] font-semibold uppercase px-1.5 py-0.5 rounded bg-[#172233] border border-[#23334a] text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

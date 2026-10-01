"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { MOCK_TRAITS, MOCK_CHAMPIONS } from "@/data/mockTftData";
import { TRAIT_STYLE_CONFIG } from "@/constants/tft";
import { ChampionAvatar } from "@/components/champion/ChampionAvatar";
import { SearchInput } from "@/components/common/SearchInput";
import { Layers } from "lucide-react";
import { cn } from "@/utils/cn";

export default function TraitsPage() {
  const [search, setSearch] = useState("");

  const filteredTraits = useMemo(() => {
    return MOCK_TRAITS.filter((t) => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [search]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Layers className="w-7 h-7 text-cyan-400" />
            TFT Traits & Origins
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore active synergy thresholds, bonuses, and champions for all origins and classes.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search traits..."
          />
        </div>
      </div>

      {/* Traits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTraits.map((trait) => {
          // Find champions that have this trait
          const traitChampions = MOCK_CHAMPIONS.filter((c) =>
            c.traits.includes(trait.id)
          );

          return (
            <div
              key={trait.id}
              className="bg-[#121824] border border-[#222c3d] hover:border-[#34445e] rounded-2xl p-5 space-y-4 transition-all"
            >
              {/* Header: Icon, Name, Units count */}
              <div className="flex items-center justify-between border-b border-[#20293b] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#172233] border border-[#2b394f] p-1.5 flex items-center justify-center flex-shrink-0">
                    <Image
                      src={trait.iconUrl}
                      alt={trait.name}
                      width={28}
                      height={28}
                      className="w-full h-full object-contain filter drop-shadow"
                      unoptimized
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-100">
                      {trait.name}
                    </h2>
                    <span className="text-xs text-slate-400">
                      {traitChampions.length} Units Available
                    </span>
                  </div>
                </div>
              </div>

              {/* Trait Description */}
              <p className="text-xs text-slate-300 leading-relaxed">
                {trait.description}
              </p>

              {/* Breakpoints */}
              {trait.breakpoints && trait.breakpoints.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Breakpoints
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {trait.breakpoints.map((bp, idx) => {
                      const styleConfig =
                        TRAIT_STYLE_CONFIG[bp.style] || TRAIT_STYLE_CONFIG.bronze;
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs",
                            styleConfig.bg,
                            styleConfig.border,
                            styleConfig.text
                          )}
                        >
                          <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-black/40">
                            ({bp.minUnits})
                          </span>
                          <span className="text-[11px] font-medium">
                            {bp.description || `${bp.minUnits} Units`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Trait Champions */}
              {traitChampions.length > 0 && (
                <div className="pt-2 border-t border-[#1e2738]/60">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Champions
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {traitChampions.map((champ) => (
                      <ChampionAvatar
                        key={champ.id}
                        champion={champ}
                        size="sm"
                        showName
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

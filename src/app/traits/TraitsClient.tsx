"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trait, Champion } from "@/types/tft";
import { TRAIT_STYLE_CONFIG, COST_COLORS } from "@/constants/tft";
import { SearchInput } from "@/components/common/SearchInput";
import { Layers } from "lucide-react";
import { cn } from "@/utils/cn";

interface TraitsClientProps {
  initialTraits: Trait[];
  initialChampions: Champion[];
}

export function TraitsClient({
  initialTraits,
  initialChampions,
}: TraitsClientProps) {
  const [search, setSearch] = useState("");

  const filteredTraits = useMemo(() => {
    return initialTraits.filter((t) => {
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [initialTraits, search]);

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            TFT Origins & Classes
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active synergies, breakpoint thresholds, and associated Set 18 champions.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search origins or classes..."
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredTraits.length === 0 ? (
        <div className="py-12 text-center bg-[#111722] border border-[#202a3c] rounded-lg p-6">
          <p className="text-slate-200 font-semibold text-sm">No origins or classes found</p>
          <p className="text-slate-500 text-xs mt-1">
            Try adjusting your search criteria.
          </p>
        </div>
      ) : (
        /* Dense Traits Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredTraits.map((trait) => {
            const traitKey = trait.id.toLowerCase();
            const traitNameKey = trait.name.toLowerCase().replace(/\s+/g, "");

            // Find champions that have this trait
            const traitChampions = initialChampions.filter((c) =>
              c.traits.some(
                (t) =>
                  t.toLowerCase() === traitKey ||
                  t.toLowerCase() === traitNameKey ||
                  t.toLowerCase().replace(/\s+/g, "") === traitNameKey
              )
            );

            return (
              <div
                key={trait.id}
                className="bg-[#111724] border border-[#1e2a3f] hover:border-[#2b3a55] rounded-md p-3 flex flex-col justify-between gap-3 transition-colors shadow-xs"
              >
                <div className="space-y-2">
                  {/* Header: Icon, Name, Link */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-[#162133] border border-[#233148] p-1 flex items-center justify-center flex-shrink-0">
                        <Image
                          src={trait.iconUrl}
                          alt={trait.name}
                          width={20}
                          height={20}
                          className="w-full h-full object-contain filter drop-shadow"
                          unoptimized
                        />
                      </div>
                      <Link
                        href={`/traits/${trait.id}`}
                        className="font-bold text-sm text-slate-100 hover:text-amber-400 transition-colors"
                      >
                        {trait.name}
                      </Link>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400">
                      {traitChampions.length} {traitChampions.length === 1 ? "unit" : "units"}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-[11px] text-slate-300 line-clamp-3 leading-relaxed">
                    {trait.description}
                  </p>

                  {/* Breakpoint Pills */}
                  {trait.breakpoints && trait.breakpoints.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {trait.breakpoints.map((bp, i) => {
                        const styleCfg =
                          TRAIT_STYLE_CONFIG[bp.style] ||
                          TRAIT_STYLE_CONFIG.bronze;

                        return (
                          <span
                            key={i}
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-mono border font-semibold",
                              styleCfg.bg,
                              styleCfg.border,
                              styleCfg.text
                            )}
                          >
                            {bp.minUnits}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Champion miniature avatars */}
                {traitChampions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#1a2335]">
                    {traitChampions.map((champ) => {
                      const cost = (champ.cost || 1) as 1 | 2 | 3 | 4 | 5;
                      const costColor = COST_COLORS[cost] || COST_COLORS[1];

                      return (
                        <Link
                          key={champ.id}
                          href={`/champions/${champ.id}`}
                          className={cn(
                            "w-7 h-7 rounded border relative overflow-hidden bg-slate-900 group/c",
                            costColor.border
                          )}
                          title={`${champ.name} (${champ.cost}g)`}
                        >
                          <Image
                            src={champ.imageUrl}
                            alt={champ.name}
                            width={28}
                            height={28}
                            className="w-full h-full object-cover group-hover/c:scale-110 transition-transform"
                            unoptimized
                          />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

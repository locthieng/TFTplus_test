"use client";

import React, { useState, useMemo } from "react";
import { TeamCompRow } from "@/features/team-comps/components/TeamCompRow";
import { SearchInput } from "@/components/common/SearchInput";
import { TeamComp, Trait, Champion, Item, Augment, TeamCompTier } from "@/types/tft";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { Filter } from "lucide-react";
import { cn } from "@/utils/cn";

interface TeamCompsClientProps {
  initialComps: TeamComp[];
  initialTraits: Trait[];
  initialChampions: Champion[];
  initialItems: Item[];
  initialAugments?: Augment[];
}

export function TeamCompsClient({
  initialComps,
  initialTraits,
  initialChampions,
  initialItems,
  initialAugments = [],
}: TeamCompsClientProps) {
  const [selectedTier, setSelectedTier] = useState<TeamCompTier | null>(null);
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const championsById = useMemo(() => {
    const map = new Map<string, Champion>();
    for (const c of initialChampions) {
      map.set(c.id, c);
      map.set(c.id.toLowerCase(), c);
      if (c.apiName) map.set(c.apiName.toLowerCase(), c);
    }
    return map;
  }, [initialChampions]);

  const traitsById = useMemo(() => {
    const map = new Map<string, Trait>();
    for (const t of initialTraits) {
      map.set(t.id, t);
      map.set(t.id.toLowerCase(), t);
      map.set(t.name.toLowerCase(), t);
    }
    return map;
  }, [initialTraits]);

  const itemsById = useMemo(() => {
    const map = new Map<string, Item>();
    for (const i of initialItems) {
      map.set(i.id, i);
      map.set(i.id.toLowerCase(), i);
    }
    return map;
  }, [initialItems]);

  const augmentsById = useMemo(() => {
    const map = new Map<string, Augment>();
    for (const a of initialAugments) {
      map.set(a.id, a);
      map.set(a.id.toLowerCase(), a);
      map.set(a.name.toLowerCase(), a);
    }
    return map;
  }, [initialAugments]);

  const filteredComps = useMemo(() => {
    return initialComps.filter((comp) => {
      if (selectedTier && comp.tier !== selectedTier) return false;
      if (
        selectedTrait &&
        !comp.traits.some(
          (t) =>
            t.traitId.toLowerCase() === selectedTrait.toLowerCase() ||
            t.name.toLowerCase() === selectedTrait.toLowerCase()
        )
      ) {
        return false;
      }
      if (
        search &&
        !comp.name.toLowerCase().includes(search.toLowerCase()) &&
        !comp.champions.some((c) =>
          c.name.toLowerCase().includes(search.toLowerCase())
        )
      ) {
        return false;
      }
      return true;
    });
  }, [initialComps, selectedTier, selectedTrait, search]);

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#20293b] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
              TFT Meta Team Compositions
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
              Patch {TFT_RELEASE_CONFIG.patch}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Top performing tier list compositions, leveling curves, item priorities, and positioning guides.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search comps or champions..."
          />
        </div>
      </div>

      {/* Filter Bar: Tier & Trait */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111722] border border-[#202a3c] rounded-xl p-3">
        {/* Tier filter tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedTier(null)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none",
              selectedTier === null
                ? "bg-amber-500 text-slate-950 shadow"
                : "bg-[#182130] text-slate-300 hover:bg-[#202d42]"
            )}
          >
            All Tiers
          </button>
          {(["S", "A", "B"] as TeamCompTier[]).map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setSelectedTier(selectedTier === tier ? null : tier)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all border cursor-pointer select-none",
                selectedTier === tier
                  ? tier === "S"
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                    : tier === "A"
                    ? "bg-purple-500 text-white border-purple-400 shadow-md shadow-purple-500/20"
                    : "bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-500/20"
                  : "bg-[#182130] border-[#222c3d] text-slate-400 hover:text-white"
              )}
            >
              {tier}-Tier
            </button>
          ))}
        </div>

        {/* Trait selector */}
        {initialTraits.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <button
              type="button"
              onClick={() => setSelectedTrait(null)}
              className={cn(
                "px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer",
                selectedTrait === null
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              All
            </button>
            {initialTraits.slice(0, 12).map((tr) => (
              <button
                key={tr.id}
                type="button"
                onClick={() =>
                  setSelectedTrait(
                    selectedTrait === tr.id || selectedTrait === tr.name
                      ? null
                      : tr.name
                  )
                }
                className={cn(
                  "px-2 py-1 rounded text-[11px] font-medium border whitespace-nowrap transition-colors cursor-pointer",
                  selectedTrait === tr.id || selectedTrait === tr.name
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

      {/* Comps List */}
      {filteredComps.length === 0 ? (
        <div className="bg-[#121824] border border-[#20293b] rounded-2xl py-16 text-center text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300">
            {initialComps.length === 0
              ? `Meta comps for ${TFT_RELEASE_CONFIG.setName} are not available yet.`
              : "No team comps match your filters."}
          </p>
          <p className="text-xs text-slate-500">
            {initialComps.length === 0
              ? "Check back soon as top tier lists are added for the current patch."
              : "Try selecting a different tier or clearing your search."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredComps.map((comp) => (
            <TeamCompRow
              key={comp.id}
              comp={comp}
              championsById={championsById}
              traitsById={traitsById}
              itemsById={itemsById}
              augmentsById={augmentsById}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useMemo, useState } from "react";
import { TeamComp, Champion, Trait, Item, Augment, TeamCompTier } from "@/types/tft";
import { HomeHero } from "@/features/home/components/HomeHero";
import { TeamCompFilterBar } from "@/features/home/components/TeamCompFilterBar";
import { TeamCompRow } from "@/features/team-comps/components/TeamCompRow";

interface HomeClientProps {
  initialComps: TeamComp[];
  initialChampions: Champion[];
  initialTraits: Trait[];
  initialItems: Item[];
  initialAugments?: Augment[];
}

export function HomeClient({
  initialComps,
  initialChampions,
  initialTraits,
  initialItems,
  initialAugments = [],
}: HomeClientProps) {
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<TeamCompTier | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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
      // Tier filter
      if (selectedTier !== "ALL" && comp.tier !== selectedTier) {
        return false;
      }

      // Trait filter
      if (selectedTrait) {
        const hasTrait = comp.traits.some(
          (t) =>
            t.traitId.toLowerCase().replace(/\s+/g, "") ===
            selectedTrait.toLowerCase().replace(/\s+/g, "")
        );
        if (!hasTrait) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = comp.name.toLowerCase().includes(query);
        const matchesPlaystyle = comp.playstyle?.toLowerCase().includes(query);
        const matchesChamp = comp.champions.some((c) =>
          c.name.toLowerCase().includes(query)
        );
        const matchesTrait = comp.traits.some((t) =>
          t.name.toLowerCase().includes(query)
        );
        if (!matchesName && !matchesPlaystyle && !matchesChamp && !matchesTrait) {
          return false;
        }
      }

      return true;
    });
  }, [initialComps, selectedTier, selectedTrait, searchQuery]);

  return (
    <div className="flex-1 flex flex-col space-y-6 pb-16">
      {/* Set 18 Game Portal Hero with Dominant Player Search */}
      <HomeHero />

      {/* Main Content Area: Filter Bar + Meta Comps Table */}
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 space-y-4">
        {/* Filter Bar */}
        <TeamCompFilterBar
          traits={initialTraits}
          selectedTrait={selectedTrait}
          onSelectTrait={setSelectedTrait}
          selectedTier={selectedTier}
          onSelectTier={setSelectedTier}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCompsCount={filteredComps.length}
        />

        {/* Team Comps List */}
        {filteredComps.length === 0 ? (
          <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg p-10 text-center text-slate-400">
            <p className="text-sm font-semibold text-slate-300 mb-1">
              No meta team compositions found
            </p>
            <p className="text-xs text-slate-500">
              Try adjusting your trait filter, tier selection, or search query.
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
    </div>
  );
}

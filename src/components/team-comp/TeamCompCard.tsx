"use client";

import React from "react";
import Link from "next/link";
import { TeamComp, Champion, Item, Trait } from "@/types/tft";
import { COMP_TIER_COLORS } from "@/constants/tft";
import { ChampionAvatar } from "@/components/champion/ChampionAvatar";
import { TraitBadge } from "@/components/trait/TraitBadge";
import { ItemIcon } from "@/components/item/ItemIcon";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";

export interface TeamCompCardProps {
  comp: TeamComp;
  className?: string;
  championsById?: ReadonlyMap<string, Champion>;
  traitsById?: ReadonlyMap<string, Trait>;
  itemsById?: ReadonlyMap<string, Item>;
}

export function TeamCompCard({
  comp,
  className,
  championsById,
  traitsById,
  itemsById,
}: TeamCompCardProps) {
  const tierStyle = COMP_TIER_COLORS[comp.tier] || COMP_TIER_COLORS.B;

  // Resolve items for champions
  const getChampionItems = (itemIds?: string[]) => {
    if (!itemIds || itemIds.length === 0) return [];
    return itemIds
      .map((id) => {
        const found = itemsById?.get(id) || itemsById?.get(id.toLowerCase());
        if (found) return found;
        return {
          id,
          name: id.replace(/_/g, " "),
          imageUrl: "",
          type: "completed" as const,
          description: "",
        };
      })
      .filter((it): it is NonNullable<typeof it> => it !== undefined);
  };

  return (
    <div
      className={cn(
        "bg-[#131924] border border-[#222c3d] hover:border-[#3a4a66] rounded-xl p-4 sm:p-5 transition-all duration-200 hover:shadow-xl hover:shadow-black/40 group flex flex-col justify-between gap-4",
        className
      )}
    >
      {/* Top Header: Comp Name, Tier Badge, Playstyle/Difficulty */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-3">
          {/* Tier badge */}
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black shadow-md",
              tierStyle.badge
            )}
          >
            {comp.tier}
          </div>

          <div>
            <Link
              href={`/team-comps/${comp.id}`}
              className="text-base font-bold text-slate-100 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              {comp.name}
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-400" />
            </Link>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>Patch {comp.patch}</span>
              {comp.playstyle && (
                <>
                  <span>•</span>
                  <span className="text-amber-400/90 font-medium">
                    {comp.playstyle}
                  </span>
                </>
              )}
              {comp.difficulty && (
                <>
                  <span>•</span>
                  <span
                    className={cn(
                      "font-semibold",
                      comp.difficulty === "Easy"
                        ? "text-emerald-400"
                        : comp.difficulty === "Medium"
                        ? "text-sky-400"
                        : "text-rose-400"
                    )}
                  >
                    {comp.difficulty}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* View Details Link button */}
        <Link
          href={`/team-comps/${comp.id}`}
          className="text-xs font-semibold text-slate-400 hover:text-amber-400 px-3 py-1.5 rounded-lg bg-[#182130] hover:bg-[#202b3d] border border-[#2b394f] transition-all flex items-center gap-1 cursor-pointer"
        >
          View Guide
        </Link>
      </div>

      {/* Main Board Champions Row */}
      <div className="flex flex-wrap items-end gap-3 sm:gap-4 py-2 border-y border-[#1d2636]/60">
        {comp.champions.map((champUnit, idx) => {
          const resolvedChamp =
            championsById?.get(champUnit.championId) ||
            championsById?.get(champUnit.championId.toLowerCase());

          const champData: Champion = resolvedChamp || {
            id: champUnit.championId,
            apiName: champUnit.championId,
            name: champUnit.name,
            cost: champUnit.cost,
            imageUrl: champUnit.imageUrl || "",
            traits: [],
            health: [600, 1080, 1944],
            attackDamage: [50, 90, 162],
            attackSpeed: 0.7,
            armor: 30,
            magicResist: 30,
            range: 1,
          };

          const items = getChampionItems(champUnit.items);

          return (
            <div key={idx} className="flex flex-col items-center">
              <ChampionAvatar
                champion={champData}
                starLevel={champUnit.starLevel || 2}
                isCarry={champUnit.isCarry}
                isTank={champUnit.isTank}
                items={items}
                size="md"
                showName
              />
            </div>
          );
        })}
      </div>

      {/* Active Traits & Core Items Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Active traits */}
        <div className="flex flex-wrap items-center gap-1.5">
          {comp.traits.map((t, idx) => {
            const resolvedTrait =
              traitsById?.get(t.traitId) ||
              traitsById?.get(t.traitId.toLowerCase());

            const traitData: Trait = resolvedTrait || {
              id: t.traitId,
              apiName: t.traitId,
              name: t.name,
              iconUrl: t.iconUrl || "",
              description: "",
              breakpoints: [],
            };

            return (
              <TraitBadge
                key={idx}
                trait={traitData}
                count={t.count}
                style={t.style}
              />
            );
          })}
        </div>

        {/* Core Items preview */}
        {comp.recommendedItems.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-medium">Core:</span>
            <div className="flex items-center gap-1">
              {comp.recommendedItems.slice(0, 3).map((itemRef, idx) => {
                const resolvedItem =
                  itemsById?.get(itemRef.itemId) ||
                  itemsById?.get(itemRef.itemId.toLowerCase());

                const itemData: Item = resolvedItem || {
                  id: itemRef.itemId,
                  apiName: itemRef.itemId,
                  name: itemRef.itemId.replace(/_/g, " "),
                  imageUrl: "",
                  type: "completed",
                  description: "",
                };

                return <ItemIcon key={idx} item={itemData} size="sm" />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

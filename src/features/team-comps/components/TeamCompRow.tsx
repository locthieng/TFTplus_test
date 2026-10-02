"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ExternalLink, Wrench } from "lucide-react";
import { TeamComp, Champion, Item, Trait, Augment } from "@/types/tft";
import { COST_COLORS, COMP_TIER_COLORS } from "@/constants/tft";
import { encodeBuilderSnapshot } from "@/features/builder/share/builderShareCodec";
import { GameImage } from "@/components/common/GameImage";
import { cn } from "@/utils/cn";

export interface TeamCompRowProps {
  comp: TeamComp;
  championsById?: ReadonlyMap<string, Champion>;
  traitsById?: ReadonlyMap<string, Trait>;
  itemsById?: ReadonlyMap<string, Item>;
  augmentsById?: ReadonlyMap<string, Augment>;
}

export function TeamCompRow({
  comp,
  championsById,
  traitsById,
  itemsById,
  augmentsById,
}: TeamCompRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const tierStyle = COMP_TIER_COLORS[comp.tier] || COMP_TIER_COLORS.B;

  // Build snapshot for 1-click builder loading
  const builderSnapshotUrl = React.useMemo(() => {
    const boardUnits = comp.champions
      .filter((c) => c.position)
      .map((c) => ({
        championId: c.championId,
        x: c.position!.col,
        y: c.position!.row,
        starLevel: c.starLevel || 2,
        items: c.items || [],
      }));

    if (boardUnits.length === 0) return "/builder";
    const snapshot = encodeBuilderSnapshot(boardUnits);
    return `/builder?snapshot=${encodeURIComponent(snapshot)}`;
  }, [comp.champions]);

  return (
    <div className="w-full bg-[#101624] hover:bg-[#121929] border border-[#1d273a] hover:border-[#2b3a55] rounded-md transition-colors shadow-sm overflow-hidden text-xs">
      {/* Dense Row Header */}
      <div className="p-2.5 sm:p-3 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        {/* Left: Tier badge + Comp Name & Info */}
        <div className="flex items-center gap-2.5 min-w-[200px]">
          <div
            className={cn(
              "w-7 h-7 rounded flex items-center justify-center font-black text-xs shadow-xs select-none flex-shrink-0",
              tierStyle.badge
            )}
          >
            {comp.tier}
          </div>

          <div className="flex flex-col">
            <Link
              href={`/team-comps/${comp.id}`}
              className="font-bold text-sm text-slate-100 hover:text-amber-400 transition-colors line-clamp-1"
            >
              {comp.name}
            </Link>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              {comp.playstyle && (
                <span className="text-amber-400/90 font-medium">
                  {comp.playstyle}
                </span>
              )}
              {comp.difficulty && (
                <>
                  <span className="text-slate-600">•</span>
                  <span
                    className={
                      comp.difficulty === "Easy"
                        ? "text-emerald-400"
                        : comp.difficulty === "Medium"
                        ? "text-sky-400"
                        : "text-rose-400"
                    }
                  >
                    {comp.difficulty}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Center: Champions with Carry Items */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {comp.champions.map((champ) => {
            const resolvedChamp =
              championsById?.get(champ.championId) ||
              championsById?.get(champ.championId.toLowerCase());
            const cost = (resolvedChamp?.cost || champ.cost || 1) as 1 | 2 | 3 | 4 | 5;
            const costColor = COST_COLORS[cost] || COST_COLORS[1];
            const isCarry = champ.isCarry || comp.carryChampionIds?.includes(champ.championId);

            return (
              <div
                key={champ.championId}
                className="flex flex-col items-center group/champ relative"
              >
                {/* Champion portrait */}
                <div
                  className={cn(
                    "w-8 h-8 sm:w-9 sm:h-9 rounded relative overflow-hidden border-2 bg-slate-900 shadow-xs transition-transform group-hover/champ:scale-105",
                    costColor.border,
                    isCarry ? "ring-2 ring-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] z-10" : ""
                  )}
                  title={`${champ.name} (${cost} cost)${isCarry ? " • Main Carry" : ""}`}
                >
                  <GameImage
                    src={champ.imageUrl || resolvedChamp?.imageUrl || "/placeholder.png"}
                    alt={champ.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                  {/* Carry crown/star marker */}
                  {isCarry && (
                    <div className="absolute top-0 left-0 bg-amber-500 text-[8px] font-black text-slate-950 px-0.5 rounded-br uppercase leading-none shadow-xs">
                      ★
                    </div>
                  )}
                  {/* Star level */}
                  {champ.starLevel && champ.starLevel > 1 && (
                    <div className="absolute top-0 right-0 bg-black/80 px-0.5 rounded-bl text-[9px] font-black text-amber-400 leading-none">
                      {champ.starLevel}★
                    </div>
                  )}
                </div>

                {/* Equipped items preview under champion */}
                {champ.items && champ.items.length > 0 && (
                  <div className="flex items-center -space-x-1 mt-0.5">
                    {champ.items.slice(0, 3).map((itemId, idx) => {
                      const itemObj =
                        itemsById?.get(itemId) || itemsById?.get(itemId.toLowerCase());
                      return (
                        <div
                          key={idx}
                          className="w-3.5 h-3.5 rounded bg-black border border-slate-700 overflow-hidden relative shadow-xs"
                          title={itemObj?.name || itemId}
                        >
                          {itemObj?.imageUrl && (
                            <GameImage
                              src={itemObj.imageUrl}
                              alt={itemObj.name}
                              width={14}
                              height={14}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Active Traits */}
        <div className="hidden sm:flex flex-wrap items-center gap-1.5 max-w-xs">
          {comp.traits.slice(0, 5).map((tr) => {
            const resolvedTrait =
              traitsById?.get(tr.traitId) || traitsById?.get(tr.traitId.toLowerCase());
            return (
              <div
                key={tr.traitId}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#151f31] border border-[#233148] text-[11px] font-semibold text-slate-300"
                title={`${tr.name} (${tr.count})`}
              >
                {resolvedTrait?.iconUrl && (
                  <GameImage
                    src={resolvedTrait.iconUrl}
                    alt={tr.name}
                    width={14}
                    height={14}
                    className="w-3.5 h-3.5 object-contain"
                  />
                )}
                <span>{tr.count}</span>
              </div>
            );
          })}
        </div>

        {/* Action Buttons: Builder, Details & Accordion Toggle */}
        <div className="flex items-center gap-1.5 self-end lg:self-center">
          <Link
            href={builderSnapshotUrl}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#162135] hover:bg-[#1d2b45] text-amber-400 hover:text-amber-300 border border-[#243450] text-[11px] font-bold transition-colors"
            title="Open in Builder"
          >
            <Wrench className="w-3 h-3" />
            <span className="hidden xl:inline">Builder</span>
          </Link>

          <Link
            href={`/team-comps/${comp.id}`}
            className="flex items-center gap-1 px-2 py-1 rounded bg-[#162135] hover:bg-[#1d2b45] text-slate-200 hover:text-white border border-[#243450] text-[11px] font-bold transition-colors"
            title="Full Guide"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden xl:inline">Guide</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 rounded bg-[#162135] hover:bg-[#1d2b45] text-slate-300 hover:text-white border border-[#243450] transition-colors cursor-pointer"
            aria-label="Toggle details"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Drawer: Mini Board & Strategy Details */}
      {isExpanded && (
        <div className="border-t border-[#1d273a] bg-[#0c121e] p-3 sm:p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strategy / Game plan */}
            <div className="space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                Strategy & Progression
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                {comp.description}
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="bg-[#121927] border border-[#1e2a3f] p-2 rounded">
                  <div className="font-bold text-emerald-400 mb-0.5">Early</div>
                  <div className="text-slate-400 line-clamp-3">{comp.earlyGame || "Standard opener"}</div>
                </div>
                <div className="bg-[#121927] border border-[#1e2a3f] p-2 rounded">
                  <div className="font-bold text-sky-400 mb-0.5">Mid</div>
                  <div className="text-slate-400 line-clamp-3">{comp.midGame || "Stabilize board"}</div>
                </div>
                <div className="bg-[#121927] border border-[#1e2a3f] p-2 rounded">
                  <div className="font-bold text-purple-400 mb-0.5">Late</div>
                  <div className="text-slate-400 line-clamp-3">{comp.lateGame || "Cap with 5-costs"}</div>
                </div>
              </div>
            </div>

            {/* Positioning Board Preview (4 rows x 7 cols) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">
                  Positioning Board
                </h4>
                <Link
                  href={builderSnapshotUrl}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  Edit in Hex Builder →
                </Link>
              </div>

              <div className="bg-[#101624] border border-[#1e2a3f] rounded p-2 flex flex-col gap-1 items-center justify-center">
                {[0, 1, 2, 3].map((row) => (
                  <div
                    key={row}
                    className={cn(
                      "flex items-center gap-1 sm:gap-1.5",
                      row % 2 === 1 ? "pl-3 sm:pl-4" : ""
                    )}
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((col) => {
                      const placedChamp = comp.champions.find(
                        (c) => c.position?.row === row && c.position?.col === col
                      );
                      const resolvedChamp = placedChamp
                        ? championsById?.get(placedChamp.championId) ||
                          championsById?.get(placedChamp.championId.toLowerCase())
                        : null;
                      const cost = (resolvedChamp?.cost || placedChamp?.cost || 1) as 1 | 2 | 3 | 4 | 5;
                      const costColor = COST_COLORS[cost] || COST_COLORS[1];

                      return (
                        <div
                          key={col}
                          className={cn(
                            "w-6 h-6 sm:w-7 sm:h-7 rounded border flex items-center justify-center relative overflow-hidden",
                            placedChamp
                              ? `${costColor.border} bg-slate-900 shadow-xs`
                              : "border-[#1e2a3e]/60 bg-[#141b2a]/40"
                          )}
                          title={placedChamp?.name || `Cell (${row}, ${col})`}
                        >
                          {placedChamp && (
                            <GameImage
                              src={placedChamp.imageUrl || resolvedChamp?.imageUrl || "/placeholder.png"}
                              alt={placedChamp.name}
                              width={28}
                              height={28}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Augments bar */}
          {comp.augments && comp.augments.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#1a2335]">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Recommended Augments:</span>
              {comp.augments.map((augId, i) => {
                const augObj = augmentsById?.get(augId) || augmentsById?.get(augId.toLowerCase());
                return (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#151f33] border border-[#24344d] text-slate-300 text-[11px]"
                    title={augObj?.description || undefined}
                  >
                    {augObj?.iconUrl && (
                      <GameImage
                        src={augObj.iconUrl}
                        alt={augObj.name}
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 object-contain rounded-xs"
                      />
                    )}
                    <span className="font-medium text-slate-200">{augObj?.name || augId}</span>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

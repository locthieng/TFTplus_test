"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useBuilderStore } from "@/stores/useBuilderStore";
import { useBuilderData } from "@/features/builder/context/BuilderDataContext";
import { COST_COLORS } from "@/constants/tft";
import { ItemType } from "@/types/tft";
import { X, Trash2, Star } from "lucide-react";
import { cn } from "@/utils/cn";
import { BUILDER_EQUIPPABLE_TABS } from "@/features/builder/rules/builderItemRules";

export function ItemAssigner() {
  const {
    board,
    selectedHex,
    clearSelection,
    addItemToChampion,
    removeItemFromChampion,
    setStarLevel,
    removeChampion,
  } = useBuilderStore();

  const { championsById, itemsById, items } = useBuilderData();
  const [activeTab, setActiveTab] = useState<ItemType>("completed");

  const champOnHex = useMemo(() => {
    if (!selectedHex) return null;
    return (
      board.find((c) => c.x === selectedHex.x && c.y === selectedHex.y) || null
    );
  }, [board, selectedHex]);

  const champData = useMemo(() => {
    if (!champOnHex) return null;
    return (
      championsById.get(champOnHex.championId) ||
      championsById.get(champOnHex.championId.toLowerCase()) ||
      null
    );
  }, [champOnHex, championsById]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => item.type === activeTab);
  }, [items, activeTab]);

  if (!selectedHex || !champOnHex || !champData) return null;

  const costStyle = COST_COLORS[champData.cost] || COST_COLORS[1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-0">
      <div className="bg-[#121824] border border-[#27344a] rounded-2xl p-5 max-w-lg w-full shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#232f42] pb-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-12 h-12 rounded-lg border-2 overflow-hidden bg-slate-900 flex-shrink-0",
                costStyle.border
              )}
            >
              <Image
                src={champData.imageUrl}
                alt={champData.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-slate-100">
                  {champData.name}
                </span>
                <span className={cn("text-xs font-bold", costStyle.text)}>
                  ${champData.cost}
                </span>
              </div>
              <div className="flex gap-1 text-[11px] text-slate-400 capitalize">
                {champData.traits.join(" • ")}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={clearSelection}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Star Level Control */}
        <div className="flex items-center justify-between bg-[#161f2e] p-3 rounded-xl border border-[#232f42]">
          <span className="text-xs font-semibold text-slate-300">Star Level</span>
          <div className="flex items-center gap-1.5">
            {([1, 2, 3] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setStarLevel(selectedHex.x, selectedHex.y, lvl)}
                className={cn(
                  "flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                  champOnHex.starLevel === lvl
                    ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                    : "bg-[#101520] border-slate-700/80 text-slate-400 hover:text-white"
                )}
              >
                <span>{lvl}</span>
                <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Equipped Items (Up to 3) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Equipped Items ({champOnHex.items.length}/3)
            </span>
            <span className="text-[11px] text-slate-500">
              Click an equipped item to unequip
            </span>
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, slotIdx) => {
              const itemId = champOnHex.items[slotIdx];
              const itemData = itemId
                ? itemsById.get(itemId) || itemsById.get(itemId.toLowerCase())
                : null;

              return (
                <div
                  key={slotIdx}
                  onClick={() => {
                    if (itemId) {
                      removeItemFromChampion(selectedHex.x, selectedHex.y, slotIdx);
                    }
                  }}
                  className={cn(
                    "w-12 h-12 rounded-lg border flex items-center justify-center transition-all select-none p-1",
                    itemData
                      ? "border-amber-400/60 bg-slate-900 cursor-pointer hover:border-rose-500 hover:scale-105"
                      : "border-dashed border-slate-700 bg-[#0d121a] text-slate-600"
                  )}
                  title={
                    itemData ? `Click to remove ${itemData.name}` : "Empty Item Slot"
                  }
                >
                  {itemData ? (
                    <Image
                      src={itemData.imageUrl}
                      alt={itemData.name}
                      width={44}
                      height={44}
                      className="w-full h-full object-contain rounded-md"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xs font-mono">{slotIdx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Tabs for Equippable Items */}
        <div className="space-y-2 pt-2 border-t border-[#232f42]">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {BUILDER_EQUIPPABLE_TABS.map((tab) => (
              <button
                key={tab.type}
                type="button"
                onClick={() => setActiveTab(tab.type)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors select-none cursor-pointer whitespace-nowrap",
                  activeTab === tab.type
                    ? "bg-amber-500 text-slate-950 font-bold border-amber-400"
                    : "bg-[#141b27] border-[#222c3d] text-slate-400 hover:text-slate-200"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items Palette */}
          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-44 overflow-y-auto pr-1">
            {filteredItems.map((item) => {
              const canAdd = champOnHex.items.length < 3;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={!canAdd}
                  onClick={() => {
                    if (canAdd) {
                      addItemToChampion(selectedHex.x, selectedHex.y, item.id);
                    }
                  }}
                  className={cn(
                    "w-10 h-10 rounded-lg border overflow-hidden transition-all p-0.5",
                    canAdd
                      ? "border-[#2b394e] hover:border-amber-400 hover:scale-105 bg-slate-900 cursor-pointer"
                      : "opacity-40 border-slate-800 cursor-not-allowed"
                  )}
                  title={item.name}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions footer */}
        <div className="flex items-center justify-between pt-3 border-t border-[#232f42]">
          <button
            type="button"
            onClick={() => {
              removeChampion(selectedHex.x, selectedHex.y);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600/80 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove Unit
          </button>

          <button
            type="button"
            onClick={clearSelection}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

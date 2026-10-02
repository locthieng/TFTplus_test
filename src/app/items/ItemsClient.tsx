"use client";

import React, { useState, useMemo } from "react";
import { Item, ItemType } from "@/types/tft";
import { SearchInput } from "@/components/common/SearchInput";
import { GameImage } from "@/components/common/GameImage";
import { Swords } from "lucide-react";
import { cn } from "@/utils/cn";

const ITEM_TYPES: { type: ItemType; label: string }[] = [
  { type: "completed", label: "Completed Items" },
  { type: "component", label: "Components" },
  { type: "radiant", label: "Radiant" },
  { type: "artifact", label: "Artifacts" },
  { type: "support", label: "Support" },
  { type: "emblem", label: "Emblems" },
];

interface ItemsClientProps {
  initialItems: Item[];
}

export function ItemsClient({ initialItems }: ItemsClientProps) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      if (selectedType && item.type !== selectedType) return false;
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [initialItems, search, selectedType]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Swords className="w-7 h-7 text-amber-400" />
            TFT Items & Recipes
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse offensive, defensive, and utility items with stats, passives, and synergy effects.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search items..."
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedType(null)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors select-none",
            selectedType === null
              ? "bg-amber-500 text-slate-950 font-bold"
              : "bg-[#182130] text-slate-300 hover:bg-[#202c40]"
          )}
        >
          All Items ({initialItems.length})
        </button>
        {ITEM_TYPES.map((tab) => {
          const count = initialItems.filter((i) => i.type === tab.type).length;
          return (
            <button
              key={tab.type}
              type="button"
              onClick={() =>
                setSelectedType(selectedType === tab.type ? null : tab.type)
              }
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors select-none whitespace-nowrap cursor-pointer flex items-center gap-1.5",
                selectedType === tab.type
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-[#141b27] border-[#222c3d] text-slate-400 hover:text-slate-200"
              )}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center bg-[#111722] border border-[#202a3c] rounded-2xl p-8">
          <Swords className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-300 font-semibold text-lg">No items found</p>
          <p className="text-slate-500 text-sm mt-1">
            Try adjusting your search or category filters.
          </p>
          {(search || selectedType) && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedType(null);
              }}
              className="mt-4 px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#121824] border border-[#222c3d] hover:border-[#384a66] rounded-2xl p-4 sm:p-5 flex items-start gap-4 transition-all hover:shadow-xl"
            >
              <div className="w-14 h-14 rounded-xl border border-[#2b394f] overflow-hidden bg-slate-900 flex-shrink-0 p-1">
                <GameImage
                  src={item.imageUrl}
                  alt={item.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-bold text-slate-100 truncate">
                    {item.name}
                  </h2>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#192333] text-amber-400 border border-[#283950] flex-shrink-0">
                    {item.type}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {item.effects && (
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-mono text-cyan-400">
                    {Object.entries(item.effects).map(([k, v]) => (
                      <span key={k}>
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

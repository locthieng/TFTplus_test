"use client";

import React, { useState, useMemo } from "react";
import { Search, Sparkles, ShieldCheck, Coins } from "lucide-react";
import { WISPS_DATA } from "@/features/wisps/data/wispsData";
import { WISP_SOURCE_METADATA } from "@/features/wisps/data/wispSourceMetadata";
import { WispCategory } from "@/features/wisps/types/wisp";
import { GameImage } from "@/components/common/GameImage";
import { cn } from "@/utils/cn";

const WISP_CATEGORIES: { id: "all" | WispCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "champion", label: "Champion" },
  { id: "combat", label: "Combat" },
  { id: "shop", label: "Shop" },
  { id: "gold-xp", label: "Gold / XP" },
  { id: "risky", label: "Risky" },
  { id: "item", label: "Item" },
  { id: "misc", label: "Misc" },
];

export default function WispsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | WispCategory>("all");

  const filteredWisps = useMemo(() => {
    return WISPS_DATA.filter((w) => {
      if (selectedCategory !== "all" && w.category !== selectedCategory) {
        return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        w.name.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q)
      );
    });
  }, [search, selectedCategory]);

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              TFT Set 18 Wisps Catalog
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Verified Set 18
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enchanted Wilds shop mechanics, tactical charms, and unique round effects ({WISPS_DATA.length} available in Patch {WISP_SOURCE_METADATA.patch}).
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wisps by name or effect..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#151f33] border border-[#24344d] rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pb-1">
        {WISP_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "px-3 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer",
              selectedCategory === cat.id
                ? "bg-amber-400/20 border-amber-400/60 text-amber-300 font-bold"
                : "bg-[#111724] border-[#1d273a] text-slate-400 hover:text-slate-200 hover:bg-[#162033]"
            )}
          >
            {cat.label}
          </button>
        ))}
        <span className="text-[11px] text-slate-500 ml-auto">
          Showing <span className="text-slate-300 font-mono font-bold">{filteredWisps.length}</span> of {WISPS_DATA.length}
        </span>
      </div>

      {/* Table view */}
      <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d131f] border-b border-[#1c2738] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4 w-64">Wisp</th>
                <th className="py-2.5 px-4 w-28 text-center">Category</th>
                <th className="py-2.5 px-4 w-24 text-center">Cost</th>
                <th className="py-2.5 px-4">Tactical Effect / Description</th>
                <th className="py-2.5 px-4 w-28 text-center">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182233]">
              {filteredWisps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                    No wisps found matching your query.
                  </td>
                </tr>
              ) : (
                filteredWisps.map((wisp) => (
                  <tr key={wisp.id} className="hover:bg-[#141c2c] transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-900 border border-[#233148] flex items-center justify-center flex-shrink-0 text-amber-400 font-bold shadow-xs overflow-hidden">
                          {wisp.iconUrl ? (
                            <GameImage
                              src={wisp.iconUrl}
                              alt={wisp.name}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-bold text-white text-xs block">
                          {wisp.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[#172233] border border-[#24344d] text-slate-300 capitalize">
                        {wisp.category || "Mechanic"}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      {wisp.cost != null ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          <Coins className="w-2.5 h-2.5" />
                          {wisp.cost}g
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 text-xs leading-relaxed">
                      {wisp.description}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#172233] border border-[#24344d] text-cyan-300">
                        Set {wisp.setId}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

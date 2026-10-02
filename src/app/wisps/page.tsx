"use client";

import React, { useState, useMemo } from "react";
import { Search, Sparkles } from "lucide-react";
import { WISPS_DATA } from "@/features/wisps/data/wispsData";
import { GameImage } from "@/components/common/GameImage";
import { cn } from "@/utils/cn";

export default function WispsPage() {
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  const filteredWisps = useMemo(() => {
    return WISPS_DATA.filter((w) => {
      if (selectedTier && w.tier !== selectedTier) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !w.name.toLowerCase().includes(q) &&
          !w.description.toLowerCase().includes(q) &&
          !(w.origin && w.origin.toLowerCase().includes(q))
        ) {
          return false;
        }
      }
      return true;
    });
  }, [search, selectedTier]);

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            TFT Wisps & Spirits Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tactician companion spirits, environmental wisps, and cosmetic tier models.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search wisps..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#151f33] border border-[#24344d] rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-1.5 bg-[#111722] border border-[#202a3c] rounded-lg p-2 text-xs">
        <button
          type="button"
          onClick={() => setSelectedTier(null)}
          className={cn(
            "px-2.5 py-1 rounded font-bold transition-colors cursor-pointer",
            selectedTier === null
              ? "bg-amber-500 text-slate-950"
              : "text-slate-300 hover:bg-[#182338]"
          )}
        >
          All Tiers
        </button>
        {[1, 2, 3].map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => setSelectedTier(selectedTier === tier ? null : tier)}
            className={cn(
              "px-2.5 py-1 rounded font-bold border transition-colors cursor-pointer",
              selectedTier === tier
                ? "bg-amber-500 text-slate-950 border-amber-400"
                : "border-[#24344d] text-slate-400 hover:text-white"
            )}
          >
            Tier {tier}
          </button>
        ))}
      </div>

      {/* Table view */}
      <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d131f] border-b border-[#1c2738] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4 w-64">Wisp Spirit</th>
                <th className="py-2.5 px-4 w-32">Origin</th>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4 w-28 text-center">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182233]">
              {filteredWisps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-slate-500 text-xs">
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
                    <td className="py-2.5 px-4 text-slate-300 font-medium text-xs">
                      {wisp.origin || "Convergence"}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 text-xs leading-relaxed">
                      {wisp.description}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#172233] border border-[#24344d] text-amber-300">
                        Tier {wisp.tier}
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

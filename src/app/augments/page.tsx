"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { MOCK_AUGMENTS } from "@/data/mockTftData";
import { AugmentTier } from "@/types/tft";
import { SearchInput } from "@/components/common/SearchInput";
import { Shield } from "lucide-react";
import { cn } from "@/utils/cn";

export default function AugmentsPage() {
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<AugmentTier | null>(null);

  const filteredAugments = useMemo(() => {
    return MOCK_AUGMENTS.filter((aug) => {
      if (selectedTier && aug.tier !== selectedTier) return false;
      if (search && !aug.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [search, selectedTier]);

  const tierColors: Record<
    AugmentTier,
    { badge: string; border: string; glow: string }
  > = {
    silver: {
      badge: "bg-slate-500/20 text-slate-300 border-slate-500/40",
      border: "hover:border-slate-400",
      glow: "shadow-slate-500/10",
    },
    gold: {
      badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      border: "hover:border-amber-400",
      glow: "shadow-amber-500/10",
    },
    prismatic: {
      badge:
        "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-400/40",
      border: "hover:border-cyan-400",
      glow: "shadow-cyan-500/10",
    },
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Shield className="w-7 h-7 text-amber-400" />
            TFT Augments Database
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore Silver, Gold, and Prismatic augments that enhance your tactics and gameplay.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search augments..."
          />
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          type="button"
          onClick={() => setSelectedTier(null)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors select-none",
            selectedTier === null
              ? "bg-amber-500 text-slate-950 font-bold"
              : "bg-[#182130] text-slate-300 hover:bg-[#202c40]"
          )}
        >
          All Tiers
        </button>
        {(["silver", "gold", "prismatic"] as AugmentTier[]).map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => setSelectedTier(selectedTier === tier ? null : tier)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors select-none capitalize cursor-pointer",
              selectedTier === tier
                ? tierColors[tier].badge
                : "bg-[#141b27] border-[#222c3d] text-slate-400 hover:text-slate-200"
            )}
          >
            {tier}
          </button>
        ))}
      </div>

      {/* Augments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAugments.map((aug) => {
          const config = tierColors[aug.tier];

          return (
            <div
              key={aug.id}
              className={cn(
                "bg-[#121824] border border-[#222c3d] rounded-2xl p-4 sm:p-5 flex items-start gap-4 transition-all hover:shadow-xl",
                config.border
              )}
            >
              <div className="w-14 h-14 rounded-xl border border-[#2b394f] overflow-hidden bg-slate-900 flex-shrink-0">
                <Image
                  src={aug.iconUrl}
                  alt={aug.name}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-100 truncate">
                    {aug.name}
                  </h2>
                  <span
                    className={cn(
                      "text-[10px] uppercase font-mono px-2 py-0.5 rounded-md border",
                      config.badge
                    )}
                  >
                    {aug.tier}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {aug.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Augment } from "@/types/tft";
import {
  AugmentNumericTier,
  AUGMENT_NUMERIC_TIERS,
  filterAugmentsByNumericTier,
} from "../categories/augmentTierMapper";
import { cn } from "@/utils/cn";

interface AugmentsTableViewProps {
  initialAugments: Augment[];
  activeTier?: AugmentNumericTier;
}

export function AugmentsTableView({
  initialAugments,
  activeTier = "1",
}: AugmentsTableViewProps) {
  const [selectedTier, setSelectedTier] =
    useState<AugmentNumericTier>(activeTier);
  const [search, setSearch] = useState("");

  const tierAugments = useMemo(() => {
    return filterAugmentsByNumericTier(initialAugments, selectedTier);
  }, [initialAugments, selectedTier]);

  const filteredAugments = useMemo(() => {
    if (!search.trim()) return tierAugments;
    const query = search.toLowerCase();
    return tierAugments.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
    );
  }, [tierAugments, search]);

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            TFT Augments Database
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Silver (Tier 1), Gold (Tier 2), and Prismatic (Tier 3) Hextech enhancements.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search augments or effects..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#151f33] border border-[#24344d] rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Tier Switcher Bar */}
      <div className="flex items-center gap-1 overflow-x-auto bg-[#101726] border border-[#1e2a3f] rounded-lg p-1">
        {AUGMENT_NUMERIC_TIERS.map((tierDef) => {
          const isSelected = selectedTier === tierDef.id;
          return (
            <Link
              key={tierDef.id}
              href={tierDef.href}
              onClick={() => {
                setSelectedTier(tierDef.id);
              }}
              className={cn(
                "px-3.5 py-1.5 rounded text-xs font-bold transition-all select-none whitespace-nowrap",
                isSelected
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-[#182338]"
              )}
            >
              {tierDef.label}
            </Link>
          );
        })}
      </div>

      {/* Table view */}
      <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d131f] border-b border-[#1c2738] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4 w-64">Augment</th>
                <th className="py-2.5 px-4">Bonus / Effect</th>
                <th className="py-2.5 px-4 w-32 text-center">Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182233]">
              {filteredAugments.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-500 text-xs">
                    No augments found matching the current tier or search.
                  </td>
                </tr>
              ) : (
                filteredAugments.map((aug) => {
                  const tierColor =
                    aug.tier === "silver"
                      ? "text-slate-300 bg-slate-800/80 border-slate-700"
                      : aug.tier === "gold"
                      ? "text-amber-300 bg-amber-950/40 border-amber-800/60"
                      : "text-purple-300 bg-purple-950/40 border-purple-800/60";

                  return (
                    <tr
                      key={aug.id}
                      className="hover:bg-[#141c2c] transition-colors"
                    >
                      {/* Col 1: Augment icon + name */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-slate-900 border border-[#233148] overflow-hidden flex-shrink-0 relative shadow-xs">
                            <Image
                              src={aug.iconUrl || "/placeholder.png"}
                              alt={aug.name}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">
                              {aug.name}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Col 2: Bonus & Description */}
                      <td className="py-2.5 px-4 text-slate-300 text-xs leading-relaxed max-w-xl">
                        {aug.description}
                      </td>

                      {/* Col 3: Tier Badge */}
                      <td className="py-2.5 px-4 text-center">
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border",
                            tierColor
                          )}
                        >
                          {aug.tier}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

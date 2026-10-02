"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Heart, Sparkles, ChevronRight } from "lucide-react";
import { PET_SPECIES_DATA } from "@/features/pets/data/petsData";
import { PET_SOURCE_METADATA } from "@/features/pets/data/petSourceMetadata";
import { GameImage } from "@/components/common/GameImage";

export default function PetPage() {
  const [search, setSearch] = useState("");

  const filteredSpecies = useMemo(() => {
    if (!search.trim()) return PET_SPECIES_DATA;
    const q = search.toLowerCase().trim();
    return PET_SPECIES_DATA.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.variants.some((v) => v.name.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            TFT Little Legends & Tacticians
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Official companion species catalog ({PET_SPECIES_DATA.length} species,{" "}
            {PET_SPECIES_DATA.reduce((sum, s) => sum + s.variants.length, 0)} skin variants indexed from{" "}
            {PET_SOURCE_METADATA.sourceName}).
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search species or skin variant..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#151f33] border border-[#24344d] rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Species Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredSpecies.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-[#101624] border border-[#1e2a3f] rounded-lg">
            No tactician species found matching your query.
          </div>
        ) : (
          filteredSpecies.map((species) => (
            <Link
              key={species.id}
              href={`/pet/${species.id}`}
              className="bg-[#111724] border border-[#1e2a3f] hover:border-amber-400/50 hover:bg-[#151f31] rounded-lg p-3 flex flex-col items-center text-center gap-2.5 transition-all shadow-xs group"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-900 border border-[#233148] group-hover:border-amber-400/60 overflow-hidden relative shadow-xs flex-shrink-0 transition-colors">
                <GameImage
                  src={species.imageUrl}
                  alt={species.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="w-full min-w-0">
                <h3 className="font-bold text-white text-xs truncate group-hover:text-amber-300 transition-colors">
                  {species.name}
                </h3>
                <div className="flex items-center justify-center gap-1 mt-1 text-[10px] text-slate-400">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{species.variants.length} Variants</span>
                </div>
              </div>

              <div className="w-full pt-2 border-t border-[#1a2335] flex items-center justify-center text-[10px] font-semibold text-slate-400 group-hover:text-amber-400 transition-colors">
                <span>View Variants</span>
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

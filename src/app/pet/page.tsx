"use client";

import React, { useState, useMemo } from "react";
import { Search, Heart } from "lucide-react";
import { PETS_DATA } from "@/features/pets/data/petsData";
import { PetRarity } from "@/features/pets/types/pet";
import { cn } from "@/utils/cn";

export default function PetPage() {
  const [search, setSearch] = useState("");
  const [selectedRarity, setSelectedRarity] = useState<PetRarity | null>(null);

  const rarities: PetRarity[] = ["Rare", "Epic", "Legendary", "Mythic"];

  const filteredPets = useMemo(() => {
    return PETS_DATA.filter((p) => {
      if (selectedRarity && p.rarity !== selectedRarity) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.species.toLowerCase().includes(q) &&
          !p.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [search, selectedRarity]);

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" />
            TFT Little Legends & Tactician Pets
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tactician companions, Little Legend species, and rarity tiers.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pets or species..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#151f33] border border-[#24344d] rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Rarity filter */}
      <div className="flex items-center gap-1.5 bg-[#111722] border border-[#202a3c] rounded-lg p-2 text-xs">
        <button
          type="button"
          onClick={() => setSelectedRarity(null)}
          className={cn(
            "px-2.5 py-1 rounded font-bold transition-colors cursor-pointer",
            selectedRarity === null
              ? "bg-amber-500 text-slate-950"
              : "text-slate-300 hover:bg-[#182338]"
          )}
        >
          All Rarities
        </button>
        {rarities.map((r) => {
          const isSelected = selectedRarity === r;
          return (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRarity(isSelected ? null : r)}
              className={cn(
                "px-2.5 py-1 rounded font-bold border transition-colors cursor-pointer",
                isSelected
                  ? "bg-amber-500 text-slate-950 border-amber-400"
                  : "border-[#24344d] text-slate-400 hover:text-white"
              )}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* Dense Pet Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredPets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-[#101624] border border-[#1e2a3f] rounded-lg">
            No tactician pets found.
          </div>
        ) : (
          filteredPets.map((pet) => {
            const rarityStyle =
              pet.rarity === "Rare"
                ? "text-blue-400 border-blue-500/40 bg-blue-950/20"
                : pet.rarity === "Epic"
                ? "text-purple-400 border-purple-500/40 bg-purple-950/20"
                : pet.rarity === "Legendary"
                ? "text-amber-400 border-amber-500/40 bg-amber-950/20"
                : "text-rose-400 border-rose-500/40 bg-rose-950/20";

            return (
              <div
                key={pet.id}
                className="bg-[#111724] border border-[#1e2a3f] hover:border-[#2b3a55] rounded-md p-3 flex flex-col justify-between gap-3 transition-colors shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-white text-xs block">
                        {pet.name}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        {pet.species}
                      </span>
                    </div>

                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider",
                        rarityStyle
                      )}
                    >
                      {pet.rarity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {pet.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1a2335] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Little Legend</span>
                  <span className="text-amber-400 font-semibold">TFT Tactician</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

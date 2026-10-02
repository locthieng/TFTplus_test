import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";
import { PET_SPECIES_DATA } from "@/features/pets/data/petsData";
import { PET_SOURCE_METADATA } from "@/features/pets/data/petSourceMetadata";
import { GameImage } from "@/components/common/GameImage";

interface SpeciesPageProps {
  params: Promise<{
    speciesId: string;
  }>;
}

export async function generateStaticParams() {
  return PET_SPECIES_DATA.map((s) => ({
    speciesId: s.id,
  }));
}

export default async function SpeciesDetailPage({ params }: SpeciesPageProps) {
  const { speciesId } = await params;
  const species = PET_SPECIES_DATA.find((s) => s.id === speciesId);

  if (!species) {
    notFound();
  }

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/pet"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Species
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-[#111724] border border-[#1e2a3f] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 shadow-sm">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900 border-2 border-amber-500/50 overflow-hidden relative shadow-md flex-shrink-0">
          <GameImage
            src={species.imageUrl}
            alt={species.name}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {species.name}
            </h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Catalog
            </span>
          </div>

          <p className="text-xs text-slate-400">
            {species.variants.length} unique skin variants indexed from{" "}
            <span className="text-slate-300 font-medium">{PET_SOURCE_METADATA.sourceName}</span>.
          </p>
        </div>
      </div>

      {/* Variants Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Skin Variants ({species.variants.length})
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {species.variants.map((variant) => {
            const rarityStyle =
              variant.rarity === "Mythic"
                ? "text-rose-400 border-rose-500/40 bg-rose-950/20"
                : variant.rarity === "Legendary"
                ? "text-amber-400 border-amber-500/40 bg-amber-950/20"
                : variant.rarity === "Epic"
                ? "text-purple-400 border-purple-500/40 bg-purple-950/20"
                : "text-blue-400 border-blue-500/40 bg-blue-950/20";

            return (
              <div
                key={variant.id}
                className="bg-[#111724] border border-[#1e2a3f] rounded-lg p-3 flex flex-col items-center text-center gap-2 shadow-xs hover:border-[#283852] transition-colors"
              >
                <div className="w-20 h-20 rounded bg-slate-900 border border-[#233148] overflow-hidden relative shadow-xs flex-shrink-0">
                  <GameImage
                    src={variant.imageUrl}
                    alt={variant.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="w-full min-w-0">
                  <span className="font-bold text-white text-xs block truncate" title={variant.name}>
                    {variant.name}
                  </span>
                </div>

                {variant.rarity && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${rarityStyle}`}
                  >
                    {variant.rarity}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

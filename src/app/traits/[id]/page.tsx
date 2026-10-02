import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tftService } from "@/services/tft";
import { TRAIT_STYLE_CONFIG } from "@/constants/tft";
import { ChampionAvatar } from "@/components/champion/ChampionAvatar";
import { GameImage } from "@/components/common/GameImage";
import { ArrowLeft, Layers, Hammer, Users } from "lucide-react";
import { cn } from "@/utils/cn";
import { encodeBuilderSnapshot } from "@/features/builder/share/builderShareCodec";

export async function generateStaticParams() {
  const traits = await tftService.getTraits();
  return traits.map((t) => ({ id: t.id }));
}

export default async function TraitDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trait = await tftService.getTraitById(id);

  if (!trait) {
    notFound();
  }

  const allChampions = await tftService.getChampions();
  const traitKey = trait.id.toLowerCase();
  const traitNameKey = trait.name.toLowerCase().replace(/\s+/g, "");

  const traitChampions = allChampions.filter((c) =>
    c.traits.some(
      (t) =>
        t.toLowerCase() === traitKey ||
        t.toLowerCase() === traitNameKey ||
        t.toLowerCase() === trait.name.toLowerCase()
    )
  );

  // Generate a starter builder snapshot placing these champions on the board
  const starterBoard = traitChampions.slice(0, 10).map((champ, idx) => ({
    championId: champ.id,
    x: idx % 7,
    y: Math.floor(idx / 7),
    starLevel: 2 as const,
    items: [] as string[],
  }));
  const builderSnapshot = encodeBuilderSnapshot(starterBoard);

  return (
    <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/traits"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Traits
        </Link>
      </div>

      {/* Main Trait Header Card */}
      <div className="bg-[#121824] border border-[#222c3d] rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[#20293b]">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#172233] border border-[#2b394f] p-3 flex items-center justify-center flex-shrink-0 shadow-lg">
              <GameImage
                src={trait.iconUrl}
                alt={trait.name}
                width={56}
                height={56}
                className="w-full h-full object-contain filter drop-shadow"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
                  {trait.name}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                  {traitChampions.length} Champions
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400">
                Explore breakpoint bonuses and available units for this synergy.
              </p>
            </div>
          </div>

          {traitChampions.length > 0 && (
            <div>
              <Link
                href={`/builder?snapshot=${builderSnapshot}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-cyan-500/20"
              >
                <Hammer className="w-4 h-4" />
                Build with {trait.name}
              </Link>
            </div>
          )}
        </div>

        {/* Trait Description */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Synergy Effect
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-[#161f2e] border border-[#232f42] rounded-xl p-4">
            {trait.description}
          </p>
        </div>

        {/* Breakpoints */}
        {trait.breakpoints && trait.breakpoints.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Activation Thresholds
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {trait.breakpoints.map((bp, idx) => {
                const styleConfig =
                  TRAIT_STYLE_CONFIG[bp.style] || TRAIT_STYLE_CONFIG.bronze;
                return (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center gap-3 p-3.5 rounded-xl border text-xs transition-all",
                      styleConfig.bg,
                      styleConfig.border,
                      styleConfig.text
                    )}
                  >
                    <div className="w-9 h-9 rounded-lg bg-black/40 flex items-center justify-center font-mono font-bold text-sm flex-shrink-0">
                      {bp.minUnits}
                    </div>
                    <div>
                      <span className="font-bold block capitalize">
                        {bp.style} Tier ({bp.minUnits} Units)
                      </span>
                      <span className="text-[11px] opacity-90 font-medium">
                        {bp.description || `${bp.minUnits} Units activate this tier`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Champions Having This Trait */}
        <div className="space-y-3 pt-4 border-t border-[#20293b]">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Associated Champions ({traitChampions.length})
          </h2>

          {traitChampions.length === 0 ? (
            <p className="text-xs text-slate-500 italic">
              No playable champions currently belong to this trait.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {traitChampions.map((champ) => (
                <Link
                  key={champ.id}
                  href={`/champions/${champ.id}`}
                  className="bg-[#151c28] border border-[#20293b] hover:border-amber-400/50 rounded-xl p-3 flex flex-col items-center gap-2 text-center group transition-all"
                >
                  <ChampionAvatar champion={champ} size="lg" />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors truncate max-w-full">
                    {champ.name}
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    ${champ.cost} Cost
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

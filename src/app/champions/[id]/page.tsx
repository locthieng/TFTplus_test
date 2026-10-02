import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { tftService } from "@/services/tft";
import { GameImage } from "@/components/common/GameImage";
import { COST_COLORS, TRAIT_STYLE_CONFIG } from "@/constants/tft";
import {
  ArrowLeft,
  Heart,
  Sword,
  Zap,
  Shield,
  Eye,
  Hammer,
  Sparkles,
  Flame,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { encodeBuilderSnapshot } from "@/features/builder/share/builderShareCodec";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { TeamCompRow } from "@/features/team-comps/components/TeamCompRow";
import { Champion, Trait, Item } from "@/types/tft";

export async function generateStaticParams() {
  const champions = await tftService.getChampions();
  return champions.map((c) => ({ id: c.id }));
}

export default async function ChampionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const champion = await tftService.getChampionById(id);

  if (!champion) {
    notFound();
  }

  const [allTraits, allComps, allChampions, allItems] = await Promise.all([
    tftService.getTraits(),
    tftService.getTeamComps({ setId: TFT_RELEASE_CONFIG.setId }),
    tftService.getChampions(),
    tftService.getItems(),
  ]);

  const champTraits = allTraits.filter((tr) =>
    champion.traits.some(
      (t) =>
        t.toLowerCase() === tr.id.toLowerCase() ||
        t.toLowerCase() === tr.name.toLowerCase() ||
        t.toLowerCase() === tr.name.toLowerCase().replace(/\s+/g, "")
    )
  );

  const relatedComps = allComps.filter((c) =>
    c.champions.some((ch) => ch.championId === champion.id)
  );

  const championsById = new Map<string, Champion>(
    allChampions.map((c) => [c.id, c])
  );
  const traitsById = new Map<string, Trait>(
    allTraits.map((t) => [t.id, t])
  );
  const itemsById = new Map<string, Item>(
    allItems.map((i) => [i.id, i])
  );

  const costStyle = COST_COLORS[champion.cost] || COST_COLORS[1];

  // Encode builder snapshot to load this champion onto board
  const builderSnapshot = encodeBuilderSnapshot([
    {
      championId: champion.id,
      x: 3,
      y: 2,
      starLevel: 2,
      items: [],
    },
  ]);

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/champions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Champions
        </Link>
      </div>

      {/* Main Champion Card */}
      <div className="bg-[#101624] border border-[#1d273a] rounded-lg p-5 sm:p-6 space-y-6 shadow-md">
        {/* Top Info: Avatar, Name, Cost, Traits, Builder CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-[#1c2738]">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded border-2 overflow-hidden bg-slate-900 flex-shrink-0 shadow-md relative",
                costStyle.border
              )}
            >
              <GameImage
                src={champion.imageUrl}
                alt={champion.name}
                width={80}
                height={80}
                className="w-full h-full object-cover scale-105"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  {champion.name}
                </h1>
                <span
                  className={cn(
                    "text-xs font-bold px-2 py-0.5 rounded border",
                    costStyle.bg,
                    costStyle.text,
                    costStyle.border
                  )}
                >
                  ${champion.cost} Cost
                </span>
              </div>

              {/* Synergies */}
              <div className="flex flex-wrap gap-1.5">
                {champTraits.map((trait) => (
                  <Link
                    key={trait.id}
                    href={`/traits/${trait.id}`}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#162133] border border-[#24354e] hover:border-amber-400/50 text-[11px] font-semibold text-slate-300 transition-colors"
                  >
                    <div className="w-3.5 h-3.5 relative flex-shrink-0">
                      <GameImage
                        src={trait.iconUrl}
                        alt={trait.name}
                        width={14}
                        height={14}
                        className="w-full h-full object-contain filter drop-shadow"
                      />
                    </div>
                    <span>{trait.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Link
              href={`/builder?snapshot=${builderSnapshot}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-xs font-bold transition-all shadow-xs"
            >
              <Hammer className="w-3.5 h-3.5" />
              Open in Team Builder
            </Link>
          </div>
        </div>

        {/* Ability Section */}
        {champion.ability && (
          <div className="bg-[#141b2a] border border-[#1f2b3e] rounded p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">
                  {champion.ability.name}
                </h2>
              </div>

              {champion.ability.mana && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-0.5 rounded border border-cyan-800/40">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>
                    {champion.ability.mana.starting} / {champion.ability.mana.total} Mana
                  </span>
                </div>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {champion.ability.description}
            </p>
          </div>
        )}

        {/* Base Combat Stats Panel */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Base Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {/* Health */}
            <div className="bg-[#131b28] border border-[#1e2a3c] rounded p-2.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span className="font-semibold">Health</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-200">
                {champion.health?.length ? champion.health.join(" / ") : "—"}
              </div>
            </div>

            {/* Attack Damage */}
            <div className="bg-[#131b28] border border-[#1e2a3c] rounded p-2.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] text-orange-400">
                <Sword className="w-3.5 h-3.5" />
                <span className="font-semibold">AD</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-200">
                {champion.attackDamage?.length ? champion.attackDamage.join(" / ") : "—"}
              </div>
            </div>

            {/* Attack Speed */}
            <div className="bg-[#131b28] border border-[#1e2a3c] rounded p-2.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] text-amber-400">
                <Zap className="w-3.5 h-3.5" />
                <span className="font-semibold">AS</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-200">
                {champion.attackSpeed != null ? champion.attackSpeed.toFixed(2) : "—"}
              </div>
            </div>

            {/* Armor */}
            <div className="bg-[#131b28] border border-[#1e2a3c] rounded p-2.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] text-yellow-500">
                <Shield className="w-3.5 h-3.5" />
                <span className="font-semibold">Armor</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-200">
                {champion.armor != null ? champion.armor : "—"}
              </div>
            </div>

            {/* Magic Resist */}
            <div className="bg-[#131b28] border border-[#1e2a3c] rounded p-2.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] text-cyan-400">
                <Shield className="w-3.5 h-3.5" />
                <span className="font-semibold">MR</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-200">
                {champion.magicResist != null ? champion.magicResist : "—"}
              </div>
            </div>

            {/* Range */}
            <div className="bg-[#131b28] border border-[#1e2a3c] rounded p-2.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                <Eye className="w-3.5 h-3.5" />
                <span className="font-semibold">Range</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-200">
                {champion.range != null ? `${champion.range} Hex${champion.range > 1 ? "es" : ""}` : "—"}
              </div>
            </div>

            {/* Crit Chance */}
            <div className="bg-[#131b28] border border-[#1e2a3c] rounded p-2.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] text-purple-400">
                <Flame className="w-3.5 h-3.5" />
                <span className="font-semibold">Crit %</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-200">
                {champion.critChance != null ? `${champion.critChance}%` : "—"}
              </div>
            </div>

            {/* Crit Damage */}
            <div className="bg-[#131b28] border border-[#1e2a3c] rounded p-2.5 space-y-0.5">
              <div className="flex items-center gap-1 text-[11px] text-pink-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-semibold">Crit DMG</span>
              </div>
              <div className="font-mono text-xs font-bold text-slate-200">
                {champion.critDamage != null ? `${champion.critDamage}%` : "—"}
              </div>
            </div>
          </div>
        </div>

        {/* Traits Breakdowns */}
        {champTraits.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-[#1c2738]">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Synergies & Breakpoints
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {champTraits.map((trait) => (
                <div
                  key={trait.id}
                  className="bg-[#131b28] border border-[#1e2a3c] rounded p-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#172233] border border-[#233148] p-0.5 flex items-center justify-center flex-shrink-0">
                      <GameImage
                        src={trait.iconUrl}
                        alt={trait.name}
                        width={20}
                        height={20}
                        className="w-full h-full object-contain filter drop-shadow"
                      />
                    </div>
                    <Link
                      href={`/traits/${trait.id}`}
                      className="text-xs font-bold text-white hover:text-amber-400 transition-colors"
                    >
                      {trait.name}
                    </Link>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {trait.description}
                  </p>

                  {trait.breakpoints && trait.breakpoints.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {trait.breakpoints.map((bp, i) => {
                        const styleCfg =
                          TRAIT_STYLE_CONFIG[bp.style] ||
                          TRAIT_STYLE_CONFIG.bronze;
                        return (
                          <span
                            key={i}
                            className={cn(
                              "px-1.5 py-0.5 rounded text-[10px] font-mono border font-semibold",
                              styleCfg.bg,
                              styleCfg.border,
                              styleCfg.text
                            )}
                          >
                            ({bp.minUnits}) {bp.description || `${bp.minUnits} Units`}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meta Comps featuring this champion */}
        {relatedComps.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-[#1c2738]">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Meta Comps Featuring {champion.name} ({relatedComps.length})
            </h2>
            <div className="space-y-2">
              {relatedComps.map((comp) => (
                <TeamCompRow
                  key={comp.id}
                  comp={comp}
                  championsById={championsById}
                  traitsById={traitsById}
                  itemsById={itemsById}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

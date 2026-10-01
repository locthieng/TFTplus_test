import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { tftService } from "@/services/tft";
import { Champion, Trait, Item, Augment } from "@/types/tft";
import { COMP_TIER_COLORS, COST_COLORS } from "@/constants/tft";
import { ChampionAvatar } from "@/components/champion/ChampionAvatar";
import { TraitBadge } from "@/components/trait/TraitBadge";
import { ArrowLeft, Swords, Shield, Sparkles, BookOpen, Clock } from "lucide-react";
import { cn } from "@/utils/cn";
import { encodeBuilderSnapshot } from "@/features/builder/share/builderShareCodec";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";

export async function generateStaticParams() {
  const comps = await tftService.getTeamComps({
    setId: TFT_RELEASE_CONFIG.setId,
  });
  return comps.map((c) => ({ id: c.id }));
}

export default async function TeamCompDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const comp = await tftService.getTeamCompById(id);

  if (!comp || comp.setId !== TFT_RELEASE_CONFIG.setId) {
    notFound();
  }

  const [allChampions, allTraits, allItems, allAugments] = await Promise.all([
    tftService.getChampions(),
    tftService.getTraits(),
    tftService.getItems(),
    tftService.getAugments(),
  ]);

  const championsById = new Map<string, Champion>();
  for (const c of allChampions) {
    championsById.set(c.id, c);
    championsById.set(c.id.toLowerCase(), c);
  }

  const traitsById = new Map<string, Trait>();
  for (const t of allTraits) {
    traitsById.set(t.id, t);
    traitsById.set(t.id.toLowerCase(), t);
    traitsById.set(t.name.toLowerCase(), t);
  }

  const itemsById = new Map<string, Item>();
  for (const i of allItems) {
    itemsById.set(i.id, i);
    itemsById.set(i.id.toLowerCase(), i);
  }

  const augmentsById = new Map<string, Augment>();
  for (const a of allAugments) {
    augmentsById.set(a.id, a);
    augmentsById.set(a.id.toLowerCase(), a);
  }

  const tierStyle = COMP_TIER_COLORS[comp.tier] || COMP_TIER_COLORS.B;

  // Helper to resolve items
  const getChampionItems = (itemIds?: string[]) => {
    if (!itemIds || itemIds.length === 0) return [];
    return itemIds
      .map((itId) => {
        const found = itemsById.get(itId) || itemsById.get(itId.toLowerCase());
        if (found) return found;
        return {
          id: itId,
          name: itId.replace(/_/g, " "),
          imageUrl: "",
          type: "completed" as const,
          description: "",
        };
      })
      .filter((it): it is NonNullable<typeof it> => it !== undefined);
  };

  const snapshotParam = encodeBuilderSnapshot(
    comp.champions.map((ch, idx) => ({
      championId: ch.championId,
      x: ch.position?.col ?? idx % 7,
      y: ch.position?.row ?? Math.floor(idx / 7),
      starLevel: ch.starLevel ?? 2,
      items: ch.items ?? [],
    }))
  );

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/team-comps"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all Team Compositions
        </Link>
      </div>

      {/* Header Banner */}
      <div className="bg-[#121824] border border-[#222c3d] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-3 z-10">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center text-lg font-black shadow-lg",
                tierStyle.badge
              )}
            >
              {comp.tier}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
                {comp.name}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Patch {comp.patch}</span>
                <span>•</span>
                <span>Set {comp.setId}</span>
                {comp.playstyle && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400 font-semibold">
                      {comp.playstyle}
                    </span>
                  </>
                )}
                {comp.difficulty && (
                  <>
                    <span>•</span>
                    <span className="font-semibold text-slate-300">
                      Difficulty: {comp.difficulty}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {comp.description && (
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {comp.description}
            </p>
          )}
        </div>

        {/* Link to Open in Builder */}
        <div className="z-10 flex items-center gap-3">
          <Link
            href={`/builder?snapshot=${snapshotParam}`}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Open in Team Builder
          </Link>
        </div>
      </div>

      {/* Main Grid: Positioning Board & Core Synergies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Positioning Board (2 cols) */}
        <div className="lg:col-span-2 bg-[#101622] border border-[#202a3c] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#202a3c] pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Optimal Board Positioning
            </h2>
            <span className="text-xs text-slate-500">Frontline Top • Carries Back</span>
          </div>

          {/* Hex Preview Board */}
          <div className="flex flex-col items-center -space-y-3 sm:-space-y-4 py-6 bg-[#0a0d14] rounded-xl border border-[#1a2333]">
            {Array.from({ length: 4 }).map((_, rIdx) => {
              const isOddRow = rIdx % 2 !== 0;
              return (
                <div
                  key={rIdx}
                  className={`flex items-center space-x-1 sm:space-x-2 ${
                    isOddRow ? "ml-8 sm:ml-10" : ""
                  }`}
                >
                  {Array.from({ length: 7 }).map((_, cIdx) => {
                    const champUnit = comp.champions.find(
                      (c) => c.position?.row === rIdx && c.position?.col === cIdx
                    );
                    const champData = champUnit
                      ? championsById.get(champUnit.championId) ||
                        championsById.get(champUnit.championId.toLowerCase()) || {
                          id: champUnit.championId,
                          apiName: champUnit.championId,
                          name: champUnit.name,
                          cost: champUnit.cost,
                          imageUrl: champUnit.imageUrl || "",
                          traits: [],
                          health: [600, 1080, 1944],
                          attackDamage: [50, 90, 162],
                          attackSpeed: 0.7,
                          armor: 30,
                          magicResist: 30,
                          range: 1,
                        }
                      : null;

                    const costStyle = champData
                      ? COST_COLORS[champData.cost] || COST_COLORS[1]
                      : null;

                    return (
                      <div
                        key={cIdx}
                        className="w-14 h-16 sm:w-16 sm:h-18 clip-hexagon p-0.5 flex items-center justify-center transition-all"
                        style={{
                          backgroundColor: champData
                            ? costStyle?.border.replace("border-", "#") || "#3b82f6"
                            : "#182130",
                        }}
                      >
                        <div className="w-full h-full clip-hexagon bg-slate-900 flex items-center justify-center relative overflow-hidden">
                          {champData ? (
                            <Image
                              src={champData.imageUrl}
                              alt={champData.name}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover scale-110"
                              unoptimized
                            />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-slate-800" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Units breakdown */}
          <div className="pt-2">
            <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              Champions in this Comp
            </h3>
            <div className="flex flex-wrap gap-4">
              {comp.champions.map((champUnit, idx) => {
                const champData =
                  championsById.get(champUnit.championId) ||
                  championsById.get(champUnit.championId.toLowerCase()) || {
                    id: champUnit.championId,
                    apiName: champUnit.championId,
                    name: champUnit.name,
                    cost: champUnit.cost,
                    imageUrl: champUnit.imageUrl || "",
                    traits: [],
                    health: [600, 1080, 1944],
                    attackDamage: [50, 90, 162],
                    attackSpeed: 0.7,
                    armor: 30,
                    magicResist: 30,
                    range: 1,
                  };

                const items = getChampionItems(champUnit.items);

                return (
                  <ChampionAvatar
                    key={idx}
                    champion={champData}
                    starLevel={champUnit.starLevel || 2}
                    isCarry={champUnit.isCarry}
                    isTank={champUnit.isTank}
                    items={items}
                    size="md"
                    showName
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Traits & Augments Panel (1 col) */}
        <div className="space-y-6">
          {/* Active Traits */}
          <div className="bg-[#101622] border border-[#202a3c] rounded-2xl p-5 space-y-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-[#202a3c] pb-3">
              <Swords className="w-4 h-4 text-cyan-400" />
              Synergies
            </h2>
            <div className="flex flex-col gap-2">
              {comp.traits.map((t, idx) => {
                const traitData =
                  traitsById.get(t.traitId) ||
                  traitsById.get(t.traitId.toLowerCase()) || {
                    id: t.traitId,
                    apiName: t.traitId,
                    name: t.name,
                    iconUrl: t.iconUrl || "",
                    description: "",
                    breakpoints: [],
                  };

                return (
                  <div key={idx} className="flex items-center justify-between">
                    <TraitBadge
                      trait={traitData}
                      count={t.count}
                      style={t.style}
                    />
                    <span className="text-xs text-slate-400">
                      Tier {t.style}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recommended Augments */}
          {comp.augments && comp.augments.length > 0 && (
            <div className="bg-[#101622] border border-[#202a3c] rounded-2xl p-5 space-y-3">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2 border-b border-[#202a3c] pb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Recommended Augments
              </h2>
              <div className="space-y-2">
                {comp.augments.map((augId, idx) => {
                  const augData =
                    augmentsById.get(augId) ||
                    augmentsById.get(augId.toLowerCase()) || {
                      id: augId,
                      apiName: augId,
                      name: augId.replace(/_/g, " "),
                      tier: "gold" as const,
                      iconUrl:
                        "https://raw.communitydragon.org/latest/game/assets/ux/tft/championsplashes/tft_hextech_augment.png",
                      description: "",
                    };

                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-2 rounded-xl bg-[#141b27] border border-[#202a3c]"
                    >
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 bg-slate-900 border border-slate-700">
                        <Image
                          src={augData.iconUrl}
                          alt={augData.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-amber-300">
                          {augData.name}
                        </span>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          {augData.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leveling & Strategy Guide */}
      <div className="bg-[#101622] border border-[#202a3c] rounded-2xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-[#202a3c] pb-3">
          <BookOpen className="w-5 h-5 text-amber-400" />
          Gameplay & Leveling Strategy
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Early Game */}
          <div className="p-4 rounded-xl bg-[#141c29] border border-[#222e42] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Stage 2 — Early Game
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {comp.earlyGame || "Focus on economy, saving up to 50 gold. Build flexible frontline items."}
            </p>
          </div>

          {/* Mid Game */}
          <div className="p-4 rounded-xl bg-[#141c29] border border-[#222e42] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Stage 3 & 4 — Mid Game
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {comp.midGame || "Level up on standard intervals (Level 6 at 3-2, Level 7 at 4-1). Stabilize board."}
            </p>
          </div>

          {/* Late Game */}
          <div className="p-4 rounded-xl bg-[#141c29] border border-[#222e42] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Stage 5+ — Late Game & Cap
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {comp.lateGame || "Push Level 8 and 9 to hit your 2-star 4-costs and 5-costs. Position carries safely."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

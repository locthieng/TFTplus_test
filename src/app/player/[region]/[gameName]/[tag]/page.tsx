import React from "react";
import Link from "next/link";
import { MOCK_CHAMPIONS, MOCK_ITEMS, MOCK_TRAITS } from "@/data/mockTftData";
import { ChampionAvatar } from "@/components/champion/ChampionAvatar";
import { TraitBadge } from "@/components/trait/TraitBadge";
import { Trophy, ArrowLeft, Clock } from "lucide-react";
import { cn } from "@/utils/cn";

interface MockMatchUnit {
  championId: string;
  starLevel: 1 | 2 | 3;
  items: string[];
  isCarry?: boolean;
  isTank?: boolean;
}

interface MockMatch {
  matchId: string;
  placement: number;
  duration: string;
  date: string;
  level: number;
  goldLeft: number;
  augments: string[];
  traits: { traitId: string; count: number; style: "bronze" | "silver" | "gold" | "prismatic" }[];
  units: MockMatchUnit[];
}

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ region: string; gameName: string; tag: string }>;
}) {
  const { region, gameName, tag } = await params;
  const decodedGameName = decodeURIComponent(gameName);
  const decodedTag = decodeURIComponent(tag);

  // Mock match history for this player
  const mockMatches: MockMatch[] = [
    {
      matchId: "VN2_12345678",
      placement: 1,
      duration: "34:12",
      date: "2 hours ago",
      level: 9,
      goldLeft: 12,
      augments: ["prismatic_ticket", "two_healthy"],
      traits: [
        { traitId: "enforcer", count: 6, style: "gold" as const },
        { traitId: "sniper", count: 2, style: "bronze" as const },
        { traitId: "pitfighter", count: 2, style: "bronze" as const },
      ],
      units: [
        { championId: "caitlyn", starLevel: 2 as const, items: ["infinity_edge", "last_whisper", "spear_of_shojin"], isCarry: true },
        { championId: "vi", starLevel: 2 as const, items: ["warmogs_armor", "bramble_vest"], isTank: true },
        { championId: "sevika", starLevel: 2 as const, items: ["bloodthirster"] },
        { championId: "vander", starLevel: 2 as const, items: [] },
        { championId: "loris", starLevel: 2 as const, items: ["sunfire_cape"] },
        { championId: "maddie", starLevel: 2 as const, items: [] },
      ],
    },
    {
      matchId: "VN2_12345679",
      placement: 2,
      duration: "32:45",
      date: "5 hours ago",
      level: 8,
      goldLeft: 4,
      augments: ["two_healthy", "component_buffet"],
      traits: [
        { traitId: "family", count: 4, style: "silver" as const },
        { traitId: "watcher", count: 2, style: "bronze" as const },
        { traitId: "pitfighter", count: 2, style: "bronze" as const },
      ],
      units: [
        { championId: "powder", starLevel: 3 as const, items: ["spear_of_shojin", "jeweled_gauntlet"], isCarry: true },
        { championId: "vander", starLevel: 3 as const, items: ["warmogs_armor", "dragons_claw"], isTank: true },
        { championId: "violet", starLevel: 3 as const, items: [] },
        { championId: "ekko", starLevel: 2 as const, items: [] },
      ],
    },
    {
      matchId: "VN2_12345680",
      placement: 5,
      duration: "27:10",
      date: "Yesterday",
      level: 7,
      goldLeft: 0,
      augments: ["component_buffet"],
      traits: [
        { traitId: "chembaron", count: 4, style: "silver" as const },
        { traitId: "dominator", count: 2, style: "bronze" as const },
      ],
      units: [
        { championId: "silco", starLevel: 1 as const, items: ["spear_of_shojin"], isCarry: true },
        { championId: "sevika", starLevel: 1 as const, items: [] },
      ],
    },
  ];

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/leaderboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Leaderboard
        </Link>
      </div>

      {/* Player Header Banner */}
      <div className="bg-[#121824] border border-[#222c3d] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 p-1 flex items-center justify-center shadow-xl shadow-amber-500/10">
            <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-3xl font-black text-amber-400">
              {decodedGameName.slice(0, 1).toUpperCase()}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
                {decodedGameName}
              </h1>
              <span className="text-sm font-semibold text-slate-400 font-mono">
                #{decodedTag}
              </span>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                {region.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Teamfight Tactics Set 13 • Ranked TFT Solo/Duo
            </p>
          </div>
        </div>

        {/* Rank & Stats Cards */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-[#172130] border border-[#27364d] p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Tier / LP
            </span>
            <span className="text-sm sm:text-base font-extrabold text-amber-400 block mt-0.5">
              Challenger
            </span>
            <span className="text-xs font-mono text-slate-300">1,520 LP</span>
          </div>

          <div className="bg-[#172130] border border-[#27364d] p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Top 4 Rate
            </span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400 block mt-0.5">
              64.8%
            </span>
            <span className="text-xs font-mono text-slate-400">265 / 410</span>
          </div>

          <div className="bg-[#172130] border border-[#27364d] p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Win Rate
            </span>
            <span className="text-sm sm:text-base font-extrabold text-sky-400 block mt-0.5">
              22.1%
            </span>
            <span className="text-xs font-mono text-slate-400">91 Wins</span>
          </div>
        </div>
      </div>

      {/* Match History */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Recent Matches
        </h2>

        <div className="space-y-3">
          {mockMatches.map((m) => {
            const isTop1 = m.placement === 1;
            const isTop4 = m.placement <= 4;

            return (
              <div
                key={m.matchId}
                className={cn(
                  "p-4 sm:p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all",
                  isTop1
                    ? "bg-gradient-to-r from-amber-950/20 via-[#131a26] to-[#121824] border-amber-500/40"
                    : isTop4
                    ? "bg-gradient-to-r from-blue-950/20 via-[#131a26] to-[#121824] border-blue-500/30"
                    : "bg-[#121824] border-[#222c3d]"
                )}
              >
                {/* Placement badge & match info */}
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black shadow-md",
                      isTop1
                        ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 shadow-amber-500/20"
                        : isTop4
                        ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-blue-500/20"
                        : "bg-slate-700 text-slate-300"
                    )}
                  >
                    #{m.placement}
                  </div>

                  <div>
                    <span
                      className={cn(
                        "text-xs font-extrabold uppercase",
                        isTop1
                          ? "text-amber-400"
                          : isTop4
                          ? "text-sky-400"
                          : "text-slate-400"
                      )}
                    >
                      {isTop1 ? "Victory" : isTop4 ? "Top 4" : "Defeat"}
                    </span>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {m.duration}
                      </span>
                      <span>•</span>
                      <span>Level {m.level}</span>
                      <span>•</span>
                      <span>{m.date}</span>
                    </div>
                  </div>
                </div>

                {/* Champions Played */}
                <div className="flex flex-wrap items-center gap-2 py-1">
                  {m.units.map((unit, uIdx) => {
                    const champData = MOCK_CHAMPIONS.find(
                      (c) => c.id === unit.championId
                    );
                    if (!champData) return null;
                    const items = (unit.items || [])
                      .map((id) => MOCK_ITEMS.find((it) => it.id === id))
                      .filter((it): it is NonNullable<typeof it> => !!it);

                    return (
                      <ChampionAvatar
                        key={uIdx}
                        champion={champData}
                        starLevel={unit.starLevel}
                        isCarry={unit.isCarry}
                        isTank={unit.isTank}
                        items={items}
                        size="sm"
                      />
                    );
                  })}
                </div>

                {/* Traits & Augments */}
                <div className="flex flex-wrap items-center gap-2">
                  {m.traits.map((t, tIdx) => {
                    const traitData = MOCK_TRAITS.find(
                      (tr) => tr.id === t.traitId
                    );
                    if (!traitData) return null;
                    return (
                      <TraitBadge
                        key={tIdx}
                        trait={traitData}
                        count={t.count}
                        style={t.style}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

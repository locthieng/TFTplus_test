"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trophy, Globe } from "lucide-react";
import { SearchInput } from "@/components/common/SearchInput";
import { cn } from "@/utils/cn";

interface LeaderboardEntry {
  rank: number;
  gameName: string;
  tagLine: string;
  tier: "Challenger" | "Grandmaster" | "Master";
  lp: number;
  winRate: number;
  top4Rate: number;
  games: number;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, gameName: "YBY1", tagLine: "VN2", tier: "Challenger", lp: 1650, winRate: 24.5, top4Rate: 68.2, games: 320 },
  { rank: 2, gameName: "Em Chè", tagLine: "DDT", tier: "Challenger", lp: 1520, winRate: 22.1, top4Rate: 64.8, games: 410 },
  { rank: 3, gameName: "GD Feed", tagLine: "VN1", tier: "Challenger", lp: 1480, winRate: 21.0, top4Rate: 62.5, games: 290 },
  { rank: 4, gameName: "DVG Midfeed", tagLine: "6868", tier: "Challenger", lp: 1410, winRate: 20.4, top4Rate: 61.0, games: 380 },
  { rank: 5, gameName: "K3soju", tagLine: "NA1", tier: "Challenger", lp: 1395, winRate: 19.8, top4Rate: 59.5, games: 540 },
  { rank: 6, gameName: "Dishsoap", tagLine: "NA1", tier: "Challenger", lp: 1350, winRate: 23.0, top4Rate: 65.0, games: 310 },
  { rank: 7, gameName: "Setsuko", tagLine: "NA1", tier: "Challenger", lp: 1310, winRate: 21.5, top4Rate: 60.2, games: 490 },
  { rank: 8, gameName: "Bebe872", tagLine: "KR1", tier: "Challenger", lp: 1285, winRate: 22.8, top4Rate: 63.4, games: 340 },
];

export default function LeaderboardPage() {
  const [selectedRegion, setSelectedRegion] = useState("VN");
  const [search, setSearch] = useState("");

  const regions = ["VN", "NA", "EUW", "KR"];

  const filteredLeaderboard = MOCK_LEADERBOARD.filter((entry) => {
    if (search && !entry.gameName.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#20293b] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            <Trophy className="w-7 h-7 text-amber-400" />
            TFT Challenger Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time Challenger & Grandmaster rankings, LP standings, win rates, and top 4 stats.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="w-full sm:w-56">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Filter player..."
            />
          </div>
          {/* Region selector */}
          <div className="flex items-center gap-1.5 bg-[#121824] border border-[#202a3c] p-1 rounded-xl">
          <Globe className="w-4 h-4 text-slate-400 ml-2" />
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none",
                selectedRegion === region
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {region}
            </button>
          ))}
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#121824] border border-[#222c3d] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0f1520] text-slate-400 uppercase text-[11px] font-semibold border-b border-[#202a3c]">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                <th className="py-3.5 px-4">Player</th>
                <th className="py-3.5 px-4">Tier</th>
                <th className="py-3.5 px-4 text-right">LP</th>
                <th className="py-3.5 px-4 text-center">Top 4 Rate</th>
                <th className="py-3.5 px-4 text-center">Win Rate</th>
                <th className="py-3.5 px-4 text-right">Games</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e2738]/60">
              {filteredLeaderboard.map((entry) => {
                const isTop1 = entry.rank === 1;
                const isTop2 = entry.rank === 2;
                const isTop3 = entry.rank === 3;

                return (
                  <tr
                    key={entry.rank}
                    className="hover:bg-[#16202e] transition-colors"
                  >
                    <td className="py-3 px-4 text-center font-bold">
                      {isTop1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          1
                        </span>
                      ) : isTop2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-300/20 text-slate-200 border border-slate-300/40">
                          2
                        </span>
                      ) : isTop3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-700/20 text-amber-500 border border-amber-700/40">
                          3
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono">
                          #{entry.rank}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-100">
                      <Link
                        href={`/player/${selectedRegion.toLowerCase()}/${entry.gameName}/${entry.tagLine}`}
                        className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                      >
                        <span>{entry.gameName}</span>
                        <span className="text-slate-500 font-normal text-[11px]">
                          #{entry.tagLine}
                        </span>
                      </Link>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        {entry.tier}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-300">
                      {entry.lp.toLocaleString()} LP
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-semibold text-emerald-400">
                      {entry.top4Rate}%
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-semibold text-sky-400">
                      {entry.winRate}%
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-slate-400">
                      {entry.games}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

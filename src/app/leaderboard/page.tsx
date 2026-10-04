import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Trophy, Globe, ShieldAlert, ArrowRight } from "lucide-react";
import { PlatformRegion } from "@/types/region";
import { FEATURE_FLAGS } from "@/config/featureFlags";
import { defaultLeaderboardService, LeaderboardEntry } from "@/features/riot/leaderboard/LeaderboardService";
import { cn } from "@/utils/cn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TFT Challenger Leaderboard | TFTPlus",
  description: "Current TFT Challenger rankings, LP standings, and match statistics.",
};

const SUPPORTED_LEADERBOARD_REGIONS: { id: PlatformRegion; label: string }[] = [
  { id: "vn", label: "VN" },
  { id: "na", label: "NA" },
  { id: "euw", label: "EUW" },
  { id: "kr", label: "KR" },
];

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string }>;
}) {
  const { region } = await searchParams;
  const currentRegion: PlatformRegion =
    region && ["vn", "na", "euw", "kr"].includes(region.toLowerCase())
      ? (region.toLowerCase() as PlatformRegion)
      : "vn";

  // Check feature flag
  if (!FEATURE_FLAGS.liveLeaderboard) {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-16 space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Live TFT Leaderboard is Currently Disabled
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Live Challenger & Grandmaster rankings are disabled pending official Riot Games API production authorization. Mock standings have been completely decommissioned.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/team-comps"
            className="px-4 py-2 rounded-lg bg-[#141b2a] border border-[#212c3f] hover:bg-[#1c2738] text-slate-300 font-semibold text-xs transition-colors"
          >
            Browse Meta Comps
          </Link>
        </div>
      </div>
    );
  }

  // Fetch live leaderboard
  let entries: LeaderboardEntry[] = [];
  let fetchError: string | null = null;

  try {
    entries = await defaultLeaderboardService.getChallengerLeaderboard(currentRegion, 25);
  } catch (err: unknown) {
    fetchError = err instanceof Error ? err.message : "Failed to load live leaderboard data";
  }

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
            Current Challenger standings and verified LP rankings ({currentRegion.toUpperCase()}).
          </p>
        </div>

        {/* Region Selector */}
        <div className="flex items-center gap-1.5 bg-[#121824] border border-[#202a3c] p-1 rounded-xl self-start md:self-auto">
          <Globe className="w-4 h-4 text-slate-400 ml-2" />
          {SUPPORTED_LEADERBOARD_REGIONS.map((r) => (
            <Link
              key={r.id}
              href={`/leaderboard?region=${r.id}`}
              className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer select-none",
                currentRegion === r.id
                  ? "bg-amber-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              )}
            >
              {r.label}
            </Link>
          ))}
        </div>
      </div>

      {fetchError ? (
        <div className="bg-[#121824] border border-rose-500/30 rounded-xl p-8 text-center space-y-2">
          <div className="text-rose-400 font-bold text-sm">Failed to load leaderboard</div>
          <div className="text-slate-400 text-xs">{fetchError}</div>
        </div>
      ) : (
        <div className="bg-[#101624] border border-[#1d273a] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b101c] border-b border-[#1b2537] text-slate-400 uppercase font-bold tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-16 text-center">Rank</th>
                  <th className="py-3 px-4">Player (Riot ID)</th>
                  <th className="py-3 px-4 w-32">Tier</th>
                  <th className="py-3 px-4 w-28 text-right">LP</th>
                  <th className="py-3 px-4 w-24 text-right">Wins</th>
                  <th className="py-3 px-4 w-24 text-right">Losses</th>
                  <th className="py-3 px-4 w-28 text-right">Total Games</th>
                  <th className="py-3 px-4 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#172133]">
                {entries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      No Challenger players found for this region.
                    </td>
                  </tr>
                ) : (
                  entries.map((entry) => {
                    const isTop1 = entry.rank === 1;
                    const isTop3 = entry.rank <= 3;

                    return (
                      <tr
                        key={`${entry.rank}-${entry.gameName}`}
                        className="hover:bg-[#141b2a] transition-colors"
                      >
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black",
                              isTop1
                                ? "bg-amber-400 text-slate-950 shadow-sm"
                                : isTop3
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "text-slate-400 font-mono"
                            )}
                          >
                            {entry.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {entry.accountResolved && entry.gameName && entry.tagLine ? (
                            <Link
                              href={`/player/${currentRegion}/${encodeURIComponent(
                                entry.gameName
                              )}/${encodeURIComponent(entry.tagLine)}`}
                              className="font-bold text-slate-100 hover:text-amber-400 transition-colors inline-flex items-center gap-1.5"
                            >
                              <span>{entry.gameName}</span>
                              <span className="text-slate-500 font-mono text-[11px]">
                                #{entry.tagLine}
                              </span>
                            </Link>
                          ) : (
                            <span className="text-slate-500 italic text-xs">
                              Riot ID unavailable
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {entry.tier}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                          {entry.leaguePoints.toLocaleString()} LP
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-emerald-400 font-semibold">
                          {entry.wins}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-400 font-semibold">
                          {entry.losses}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-white font-bold">
                          {entry.games}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {entry.accountResolved && entry.gameName && entry.tagLine && (
                            <Link
                              href={`/player/${currentRegion}/${encodeURIComponent(
                                entry.gameName
                              )}/${encodeURIComponent(entry.tagLine)}`}
                              className="p-1 rounded text-slate-500 hover:text-amber-400 transition-colors inline-block"
                              title="View Player Profile"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

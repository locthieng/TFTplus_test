import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Trophy, ArrowLeft, Clock, AlertCircle, ShieldAlert, Sparkles, UserX } from "lucide-react";
import { PlatformRegion } from "@/types/region";
import { FEATURE_FLAGS } from "@/config/featureFlags";
import { defaultPlayerProfileService, PlayerProfile } from "@/features/riot/player/PlayerProfileService";
import { defaultTftStaticResolver } from "@/features/riot/mappers/TftStaticResolver";
import { RiotApiError } from "@/features/riot/client/RiotApiError";
import { GameImage } from "@/components/common/GameImage";
import { cn } from "@/utils/cn";
import { getQueueName } from "@/features/riot/matches/tftMatch.types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ region: string; gameName: string; tag: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gameName, tag } = await params;
  const decodedGameName = decodeURIComponent(gameName);
  const decodedTag = decodeURIComponent(tag);

  return {
    title: `${decodedGameName}#${decodedTag} - TFT Player Profile | TFTPlus`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default async function PlayerProfilePage({ params }: PageProps) {
  const { region, gameName, tag } = await params;
  const decodedGameName = decodeURIComponent(gameName);
  const decodedTag = decodeURIComponent(tag);
  const normRegion = region.toLowerCase() as PlatformRegion;

  // 1. Check feature flag
  if (!FEATURE_FLAGS.livePlayerData) {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-16 space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Live Riot Player Data is Currently Disabled
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Live player profiles and real match histories are disabled pending Riot API production verification. Static datasets (Champions, Items, Traits, Augments, Team Comps) remain fully active.
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

  // 2. Fetch live data with safe error handling
  let profile: PlayerProfile | null = null;
  let errorState: { title: string; message: string; isNotFound?: boolean } | null = null;

  try {
    profile = await defaultPlayerProfileService.getPlayerProfile(
      normRegion,
      decodedGameName,
      decodedTag
    );
  } catch (err: unknown) {
    if (err instanceof RiotApiError) {
      if (err.code === "NOT_FOUND") {
        errorState = {
          title: "Player Not Found",
          message: `Could not locate account "${decodedGameName}#${decodedTag}" in region ${normRegion.toUpperCase()}. Please check spelling and region.`,
          isNotFound: true,
        };
      } else if (err.code === "RATE_LIMITED") {
        errorState = {
          title: "Rate Limit Exceeded",
          message: `Riot API rate limit reached. Please wait ${err.retryAfterSeconds ?? 1} seconds and refresh.`,
        };
      } else if (err.code === "UNAUTHORIZED" || err.code === "FORBIDDEN") {
        errorState = {
          title: "Riot API Access Error",
          message: "Server Riot API key is missing or expired. Please check environment configuration.",
        };
      } else {
        errorState = {
          title: "Riot Service Unavailable",
          message: "Riot Games servers are currently not responding. Please try again shortly.",
        };
      }
    } else {
      errorState = {
        title: "Unexpected Error",
        message: err instanceof Error ? err.message : "Failed to load player profile.",
      };
    }
  }

  if (errorState || !profile) {
    return (
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-16 space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          {errorState?.isNotFound ? <UserX className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">{errorState?.title}</h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">{errorState?.message}</p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#141b2a] border border-[#212c3f] hover:bg-[#1c2738] text-slate-300 font-semibold text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const { rank, recentMatches, recentStats, warnings } = profile;

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Search
        </Link>
      </div>

      {/* Partial Data Warnings */}
      {warnings && warnings.messages.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-200">Partial Data Warning</div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-300">
              {warnings.messages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Player Header Banner */}
      <div className="bg-[#121824] border border-[#222c3d] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 p-1 flex items-center justify-center shadow-xl shadow-amber-500/10 flex-shrink-0">
            <div className="w-full h-full rounded-xl bg-slate-900 flex items-center justify-center text-3xl font-black text-amber-400">
              {decodedGameName.slice(0, 1).toUpperCase()}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
                {profile.account.gameName}
              </h1>
              <span className="text-sm font-semibold text-slate-400 font-mono">
                #{profile.account.tagLine}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 uppercase font-semibold">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {normRegion.toUpperCase()}
              </span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">Verified Live Profile</span>
            </div>
          </div>
        </div>

        {/* Live Rank Info */}
        <div className="flex items-center gap-6 bg-[#0e1422] border border-[#1b2537] p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">TFT Rank</div>
              <div className="text-base font-extrabold text-white">
                {rank ? `${rank.tier} ${rank.rank ?? ""}`.trim() : "Unranked"}
              </div>
              <div className="text-xs font-mono text-amber-400 font-bold">
                {rank ? `${rank.leaguePoints} LP` : "0 LP"}
              </div>
            </div>
          </div>

          {rank && (
            <div className="border-l border-[#20293b] pl-6 text-xs text-slate-400 space-y-0.5">
              <div>Total Games: <span className="font-bold text-white">{rank.games}</span></div>
              <div>Wins: <span className="font-bold text-emerald-400">{rank.wins}</span></div>
              <div>Losses: <span className="font-bold text-slate-300">{rank.losses}</span></div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Matches Metrics Card */}
      {recentStats.gamesCount > 0 && (
        <div className="bg-[#121824] border border-[#20293b] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Recent Matches Summary ({recentStats.gamesCount} Games)
            </h2>
            <span className="text-[11px] text-slate-500">Live Riot Match Data</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0e1422] border border-[#1b2537] rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Avg Placement</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                #{recentStats.averagePlacement}
              </span>
            </div>
            <div className="bg-[#0e1422] border border-[#1b2537] rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Top 4 Rate</span>
              <span className="text-xl font-black text-emerald-400 font-mono">
                {recentStats.top4Rate}%
              </span>
              <span className="text-[10px] text-slate-500">({recentStats.top4Count} / {recentStats.gamesCount})</span>
            </div>
            <div className="bg-[#0e1422] border border-[#1b2537] rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">1st Place Rate</span>
              <span className="text-xl font-black text-cyan-400 font-mono">
                {recentStats.firstPlaceRate}%
              </span>
              <span className="text-[10px] text-slate-500">({recentStats.firstPlaceCount} / {recentStats.gamesCount})</span>
            </div>
            <div className="bg-[#0e1422] border border-[#1b2537] rounded-lg p-3">
              <span className="text-[11px] text-slate-400 block">Matches Analyzed</span>
              <span className="text-xl font-black text-white font-mono">
                {recentStats.gamesCount}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Match History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#20293b] pb-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Recent TFT Matches
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {recentMatches.length} Matches Loaded
            {warnings?.failedMatchCount ? ` (${warnings.failedMatchCount} unavailable)` : ""}
          </span>
        </div>

        {recentMatches.length === 0 ? (
          <div className="bg-[#121824] border border-[#20293b] rounded-xl p-12 text-center text-slate-500 text-sm">
            No recent TFT matches found for this summoner.
          </div>
        ) : (
          <div className="space-y-3">
            {recentMatches.map((m) => {
              const isTop1 = m.placement === 1;
              const isTop4 = m.placement <= 4;

              return (
                <div
                  key={m.matchId}
                  className={cn(
                    "bg-[#101624] border rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors",
                    isTop1
                      ? "border-amber-500/40 bg-amber-950/10"
                      : isTop4
                      ? "border-emerald-500/30"
                      : "border-[#1e2a3f]"
                  )}
                >
                  {/* Left: Placement & Meta */}
                  <div className="flex items-center gap-4 min-w-[180px]">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0",
                        isTop1
                          ? "bg-amber-400 text-slate-950"
                          : isTop4
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      )}
                    >
                      #{m.placement}
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#141b2a] border border-[#212c3f] text-amber-400">
                          {getQueueName(m.queueId)}
                        </span>
                        <span className="font-bold text-slate-200">
                          {isTop1 ? "Victory" : isTop4 ? "Top 4" : "Defeat"}
                        </span>
                      </div>
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <span>{formatDuration(m.gameLengthSeconds)}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(m.gameDatetime)}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Lvl {m.level} • {m.goldLeft}g
                      </div>
                    </div>
                  </div>

                  {/* Middle: Units & Items */}
                  <div className="flex-1 flex flex-wrap items-center gap-2">
                    {m.units.map((u, uIdx) => {
                      const champ = defaultTftStaticResolver.resolveChampion(u.championApiName);
                      return (
                        <div key={`${u.championApiName}-${uIdx}`} className="flex flex-col items-center">
                          {/* Stars */}
                          <div className="text-[9px] text-amber-400 font-bold leading-none mb-0.5">
                            {"★".repeat(u.starLevel)}
                          </div>
                          {/* Avatar */}
                          <div className="relative w-10 h-10 rounded-md bg-slate-900 border border-[#253248] overflow-hidden">
                            {champ.entity?.imageUrl ? (
                              <GameImage
                                src={champ.entity.imageUrl}
                                alt={champ.displayName}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-400">
                                {champ.displayName.slice(0, 2)}
                              </div>
                            )}
                          </div>
                          {/* Items */}
                          {u.itemApiNames.length > 0 && (
                            <div className="flex items-center -space-x-1 mt-1">
                              {u.itemApiNames.map((itName, itIdx) => {
                                const item = defaultTftStaticResolver.resolveItem(itName);
                                return (
                                  <div
                                    key={itIdx}
                                    className="w-3.5 h-3.5 rounded bg-slate-950 border border-slate-700 overflow-hidden"
                                    title={item.displayName}
                                  >
                                    {item.entity?.imageUrl ? (
                                      <GameImage
                                        src={item.entity.imageUrl}
                                        alt={item.displayName}
                                        width={14}
                                        height={14}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-slate-800" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Right: Traits & Link */}
                  <div className="flex flex-col md:items-end justify-between gap-2 min-w-[150px]">
                    {m.traits.length > 0 && (
                      <div className="flex flex-wrap gap-1 md:justify-end">
                        {m.traits.slice(0, 4).map((t, tIdx) => {
                          const trait = defaultTftStaticResolver.resolveTrait(t.traitApiName);
                          return (
                            <span
                              key={tIdx}
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#141b2a] border border-[#212c3f] text-slate-300"
                            >
                              {trait.displayName} {t.numUnits}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <Link
                      href={`/match/${normRegion}/${m.matchId}?player=${encodeURIComponent(profile.account.puuid)}`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#141b2a] border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-950/20 text-cyan-400 hover:text-cyan-300 font-bold text-xs transition-colors group mt-1 shadow-xs"
                    >
                      <span>View Match</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

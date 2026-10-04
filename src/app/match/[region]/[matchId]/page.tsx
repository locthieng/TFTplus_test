import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Trophy,
  ArrowLeft,
  Clock,
  AlertCircle,
  ShieldAlert,
  Swords,
  Coins,
  Sparkles,
} from "lucide-react";
import { FEATURE_FLAGS } from "@/config/featureFlags";
import { defaultTftMatchService } from "@/features/riot/matches/TftMatchService";
import { DetailedMatch } from "@/features/riot/matches/tftMatch.types";
import { defaultTftStaticResolver } from "@/features/riot/mappers/TftStaticResolver";
import { RiotApiError } from "@/features/riot/client/RiotApiError";
import { GameImage } from "@/components/common/GameImage";
import { cn } from "@/utils/cn";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ region: string; matchId: string }>;
  searchParams: Promise<{ puuid?: string; player?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region, matchId } = await params;
  const decodedMatchId = decodeURIComponent(matchId);

  return {
    title: `Match ${decodedMatchId} (${region.toUpperCase()}) - TFT Match Details | TFTPlus`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs.toString().padStart(2, "0")}s`;
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

export default async function MatchDetailPage({ params, searchParams }: PageProps) {
  const { region, matchId } = await params;
  const { puuid: puuidParam, player: playerParam } = await searchParams;
  const selectedPuuid = (playerParam || puuidParam)?.trim().toLowerCase();
  const decodedMatchId = decodeURIComponent(matchId);
  const normRegion = region.toLowerCase();

  // 1. Feature Flag Check
  if (!FEATURE_FLAGS.livePlayerData) {
    return (
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-16 space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Live Riot Match Data is Currently Disabled
          </h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Live match details and telemetry are currently restricted pending Riot API production verification.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#141b2a] border border-[#212c3f] hover:bg-[#1c2738] text-slate-300 font-semibold text-xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // 2. Fetch Match Details
  let match: DetailedMatch | null = null;
  let errorState: { title: string; message: string } | null = null;

  try {
    match = await defaultTftMatchService.getDetailedMatch(normRegion, decodedMatchId);
  } catch (err: unknown) {
    if (err instanceof RiotApiError) {
      if (err.code === "NOT_FOUND") {
        errorState = {
          title: "Match Not Found",
          message: `Match "${decodedMatchId}" was not found in region ${normRegion.toUpperCase()}.`,
        };
      } else if (err.code === "RATE_LIMITED") {
        errorState = {
          title: "Rate Limit Exceeded",
          message: `Riot API rate limit reached. Please wait ${err.retryAfterSeconds ?? 1} seconds and try again.`,
        };
      } else {
        errorState = {
          title: "Riot Service Unavailable",
          message: "Failed to load match details from Riot Games servers.",
        };
      }
    } else {
      errorState = {
        title: "Unexpected Error",
        message: err instanceof Error ? err.message : "Failed to load match detail.",
      };
    }
  }

  if (errorState || !match) {
    return (
      <div className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-16 space-y-6 text-center">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-8 h-8" />
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
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Search
        </Link>
        <span className="text-xs text-slate-500 font-mono">
          ID: {match.matchId}
        </span>
      </div>

      {/* Match Overview Banner */}
      <div className="bg-[#121824] border border-[#222c3d] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/40 text-amber-400">
              {match.queueName}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              {normRegion.toUpperCase()}
            </span>
            {match.tftSetNumber && (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#141b2a] border border-[#212c3f] text-cyan-400">
                Set {match.tftSetNumber}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Swords className="w-6 h-6 text-amber-400" />
            TFT Match Report
          </h1>
        </div>

        <div className="flex items-center gap-6 bg-[#0e1422] border border-[#1b2537] p-4 rounded-xl text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Duration
            </span>
            <span className="font-mono font-bold text-white text-sm">
              {formatDuration(match.gameLengthSeconds)}
            </span>
          </div>

          <div className="border-l border-[#20293b] pl-6 space-y-1">
            <span className="text-slate-400 block">Played</span>
            <span className="font-mono text-slate-200">
              {formatRelativeTime(match.gameDatetime)}
            </span>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#20293b] pb-2">
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            Lobby Standings & Team Comps (8 Participants)
          </h2>
          <span className="text-xs text-slate-500">
            Sorted by Placement
          </span>
        </div>

        <div className="space-y-3">
          {match.participants.map((p) => {
            const isTop1 = p.placement === 1;
            const isTop4 = p.placement <= 4;
            const isSelected = selectedPuuid && p.puuid.toLowerCase() === selectedPuuid;

            return (
              <div
                key={p.puuid}
                className={cn(
                  "bg-[#101624] border rounded-xl p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 transition-colors",
                  isSelected
                    ? "border-amber-500 bg-amber-950/20 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/40"
                    : isTop1
                    ? "border-amber-500/40 bg-amber-950/10"
                    : isTop4
                    ? "border-emerald-500/30"
                    : "border-[#1e2a3f]"
                )}
              >
                {/* Placement + Player Identity */}
                <div className="flex items-center gap-4 min-w-[240px]">
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
                    #{p.placement}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {p.accountResolved && p.gameName && p.tagLine ? (
                        <Link
                          href={`/player/${normRegion}/${encodeURIComponent(p.gameName)}/${encodeURIComponent(p.tagLine)}`}
                          className="font-bold text-white hover:text-amber-400 transition-colors text-sm"
                        >
                          {p.gameName}
                          <span className="text-slate-400 font-mono text-xs">
                            #{p.tagLine}
                          </span>
                        </Link>
                      ) : (
                        <span className="text-slate-500 italic text-xs">
                          Riot ID unavailable
                        </span>
                      )}

                      {isSelected && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                          Selected
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span className="font-mono">Lvl {p.level}</span>
                      <span>•</span>
                      <span className="font-mono flex items-center gap-0.5 text-amber-400">
                        <Coins className="w-3 h-3 inline" />
                        {p.goldLeft}g
                      </span>
                      {p.lastRound != null && (
                        <>
                          <span>•</span>
                          <span className="font-mono">Rnd {p.lastRound}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Augments */}
                {p.augments.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap xl:min-w-[140px]">
                    {p.augments.map((augId, aIdx) => {
                      const aug = defaultTftStaticResolver.resolveAugment(augId);
                      return (
                        <div
                          key={aIdx}
                          className="relative w-8 h-8 rounded-lg bg-slate-900 border border-[#253248] p-1 flex items-center justify-center overflow-hidden"
                          title={aug.displayName}
                        >
                          {aug.entity?.iconUrl ? (
                            <GameImage
                              src={aug.entity.iconUrl}
                              alt={aug.displayName}
                              width={24}
                              height={24}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <Sparkles className="w-4 h-4 text-amber-400" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Champions & Items */}
                <div className="flex-1 flex flex-wrap items-center gap-2">
                  {p.units.map((u, uIdx) => {
                    const champ = defaultTftStaticResolver.resolveChampion(u.characterId);
                    return (
                      <div key={`${u.characterId}-${uIdx}`} className="flex flex-col items-center">
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
                        {u.itemNames.length > 0 && (
                          <div className="flex items-center -space-x-1 mt-1">
                            {u.itemNames.map((itName, itIdx) => {
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

                {/* Traits */}
                {p.traits.length > 0 && (
                  <div className="flex flex-wrap xl:flex-col xl:items-end gap-1 min-w-[130px]">
                    <div className="flex flex-wrap gap-1 xl:justify-end">
                      {p.traits
                        .filter((t) => t.numUnits > 0)
                        .slice(0, 5)
                        .map((t, tIdx) => {
                          const trait = defaultTftStaticResolver.resolveTrait(t.name);
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
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

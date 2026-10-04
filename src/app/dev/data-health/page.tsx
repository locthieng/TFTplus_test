import React from "react";
import { tftService } from "@/services/tft";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { WISPS_DATA } from "@/features/wisps/data/wispsData";
import { PET_SPECIES_DATA } from "@/features/pets/data/petsData";
import { HEX_CORES_DATA } from "@/features/hex-cores/data/hexCoresData";
import { computeSystemDataHealth } from "@/features/data-health/datasetHealth";
import { computeRiotHealthDiagnostics } from "@/features/data-health/riotHealth";
import { CheckCircle2, AlertTriangle, Activity, ShieldCheck, Database, Layers, Radio, HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DataHealthPage() {
  const [champions, traits, items, augments, teamComps] = await Promise.all([
    tftService.getChampions(),
    tftService.getTraits(),
    tftService.getItems(),
    tftService.getAugments(),
    tftService.getTeamComps({ setId: TFT_RELEASE_CONFIG.setId }),
  ]);

  const healthReport = computeSystemDataHealth({
    champions,
    traits,
    items,
    augments,
    teamComps,
    wisps: WISPS_DATA,
    petSpecies: PET_SPECIES_DATA,
    hexCores: HEX_CORES_DATA,
  });

  const riotHealth = computeRiotHealthDiagnostics();

  const { overallStatus, datasets, championStats, brokenReferences } = healthReport;
  const {
    brokenChampions: brokenChampionRefs,
    brokenItems: brokenItemRefs,
    brokenTraits: brokenTraitRefs,
    brokenAugments: brokenAugmentRefs,
  } = brokenReferences;
  const { total: totalChamps, hp: hpCoverage, ad: adCoverage, armor: armorCoverage, mr: mrCoverage, as: asCoverage, mana: manaCoverage, crit: critCoverage } = championStats;

  const statusBadgeStyle =
    overallStatus === "healthy"
      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
      : overallStatus === "warning"
      ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
      : "bg-rose-500/15 border-rose-500/40 text-rose-400";

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="border-b border-[#20293b] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            TFTPlus Data Health & Provenance Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal diagnostics tracking dataset metrics, source provenance, relational bindings, and stat coverage.
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider self-start sm:self-auto ${statusBadgeStyle}`}
        >
          System {overallStatus}
        </span>
      </div>

      {/* Dataset Health & Verification Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          Dataset Provenance & Multi-Dimensional Health
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {datasets.map((d) => (
            <div
              key={d.name}
              className="bg-[#111724] border border-[#1e2a3f] rounded-lg p-3.5 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{d.name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${
                    d.verificationStatus === "verified"
                      ? "text-emerald-400 bg-emerald-950/30 border-emerald-500/40"
                      : d.verificationStatus === "curated"
                      ? "text-cyan-400 bg-cyan-950/30 border-cyan-500/40"
                      : "text-amber-400 bg-amber-950/30 border-amber-500/40"
                  }`}
                >
                  {d.verificationStatus}
                </span>
              </div>

              <div className="font-mono text-base font-black text-slate-100">
                {d.itemCountLabel || `${d.itemCount} items`}
              </div>

              <div className="pt-2 border-t border-[#1a2335] text-[11px] space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Integrity:</span>
                  <span
                    className={
                      d.integrityStatus === "healthy"
                        ? "text-emerald-400 font-semibold uppercase text-[10px]"
                        : d.integrityStatus === "warning"
                        ? "text-amber-400 font-semibold uppercase text-[10px]"
                        : "text-rose-400 font-semibold uppercase text-[10px]"
                    }
                  >
                    {d.integrityStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Coverage:</span>
                  <span className="text-slate-300 font-mono text-[10px]">
                    {d.coverage ? `${d.coverage.current}/${d.coverage.expected} (${d.coverage.percentage}%)` : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Champion Stat Coverage Breakdown */}
      <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Champion Domain Stat Coverage (Truthful Audit)
          </h2>
          <span className="text-[11px] text-slate-400">
            Total Units: <span className="text-white font-mono font-bold">{totalChamps}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div className="bg-[#141b2a] border border-[#1f2b3e] rounded p-2.5 space-y-1">
            <span className="text-[11px] font-semibold text-rose-400 block">HP Coverage</span>
            <span className="font-mono text-sm font-bold text-white">
              {hpCoverage} / {totalChamps}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {Math.round((hpCoverage / totalChamps) * 100)}% verified
            </span>
          </div>

          <div className="bg-[#141b2a] border border-[#1f2b3e] rounded p-2.5 space-y-1">
            <span className="text-[11px] font-semibold text-orange-400 block">AD Coverage</span>
            <span className="font-mono text-sm font-bold text-white">
              {adCoverage} / {totalChamps}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {Math.round((adCoverage / totalChamps) * 100)}% verified
            </span>
          </div>

          <div className="bg-[#141b2a] border border-[#1f2b3e] rounded p-2.5 space-y-1">
            <span className="text-[11px] font-semibold text-yellow-500 block">Armor Coverage</span>
            <span className="font-mono text-sm font-bold text-white">
              {armorCoverage} / {totalChamps}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {Math.round((armorCoverage / totalChamps) * 100)}% verified
            </span>
          </div>

          <div className="bg-[#141b2a] border border-[#1f2b3e] rounded p-2.5 space-y-1">
            <span className="text-[11px] font-semibold text-cyan-400 block">MR Coverage</span>
            <span className="font-mono text-sm font-bold text-white">
              {mrCoverage} / {totalChamps}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {Math.round((mrCoverage / totalChamps) * 100)}% verified
            </span>
          </div>

          <div className="bg-[#141b2a] border border-[#1f2b3e] rounded p-2.5 space-y-1">
            <span className="text-[11px] font-semibold text-amber-400 block">AS Coverage</span>
            <span className="font-mono text-sm font-bold text-white">
              {asCoverage} / {totalChamps}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {Math.round((asCoverage / totalChamps) * 100)}% verified
            </span>
          </div>

          <div className="bg-[#141b2a] border border-[#1f2b3e] rounded p-2.5 space-y-1">
            <span className="text-[11px] font-semibold text-blue-400 block">Mana Coverage</span>
            <span className="font-mono text-sm font-bold text-white">
              {manaCoverage} / {totalChamps}
            </span>
            <span className="text-[10px] text-slate-500 block">
              {Math.round((manaCoverage / totalChamps) * 100)}% verified
            </span>
          </div>

          <div className="bg-[#141b2a] border border-[#1f2b3e] rounded p-2.5 space-y-1">
            <span className="text-[11px] font-semibold text-purple-400 block">Crit Coverage</span>
            <span className="font-mono text-sm font-bold text-white">
              {critCoverage} / {totalChamps}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Truthful (unfabricated)
            </span>
          </div>
        </div>
      </div>

      {/* Relational Integrity Checklist */}
      <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg p-5 space-y-3">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Relational Integrity Checks
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2 p-3 rounded bg-[#141b2a] border border-[#1f2b3e]">
            {brokenChampionRefs === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold text-slate-200 block">Champion References</span>
              <span className="text-[11px] text-slate-400">
                {brokenChampionRefs === 0 ? "0 broken references" : `${brokenChampionRefs} broken!`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded bg-[#141b2a] border border-[#1f2b3e]">
            {brokenItemRefs === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold text-slate-200 block">Item References</span>
              <span className="text-[11px] text-slate-400">
                {brokenItemRefs === 0 ? "0 broken references" : `${brokenItemRefs} broken!`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded bg-[#141b2a] border border-[#1f2b3e]">
            {brokenTraitRefs === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold text-slate-200 block">Trait References</span>
              <span className="text-[11px] text-slate-400">
                {brokenTraitRefs === 0 ? "0 broken references" : `${brokenTraitRefs} broken!`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded bg-[#141b2a] border border-[#1f2b3e]">
            {brokenAugmentRefs === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <div>
              <span className="font-bold text-slate-200 block">Augment References</span>
              <span className="text-[11px] text-slate-400">
                {brokenAugmentRefs === 0 ? "0 broken references" : `${brokenAugmentRefs} broken!`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Riot API & Live Pipeline Diagnostics */}
      <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            Live Riot Services & Stabilization Gate
          </h3>
          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-[#233148] text-slate-400 bg-[#121927]">
            Server Diagnostics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded bg-[#141b2a] border border-[#1f2b3e] space-y-1">
            <span className="text-slate-400 text-[11px] block">Live Player Data Flag</span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  riotHealth.livePlayerFeature ? "bg-emerald-400" : "bg-slate-500"
                }`}
              />
              <span className="font-bold text-white">
                {riotHealth.livePlayerFeature ? "ENABLED" : "DISABLED"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#141b2a] border border-[#1f2b3e] space-y-1">
            <span className="text-slate-400 text-[11px] block">Live Leaderboard Flag</span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  riotHealth.liveLeaderboardFeature ? "bg-emerald-400" : "bg-slate-500"
                }`}
              />
              <span className="font-bold text-white">
                {riotHealth.liveLeaderboardFeature ? "ENABLED" : "DISABLED"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#141b2a] border border-[#1f2b3e] space-y-1">
            <span className="text-slate-400 text-[11px] block">Riot API Key Status</span>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  riotHealth.apiKeyConfigured ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span className="font-bold text-white">
                {riotHealth.apiKeyConfigured ? "CONFIGURED (SECRET)" : "NOT SET"}
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#141b2a] border border-[#1f2b3e] space-y-1">
            <span className="text-slate-400 text-[11px] block">Cache Architecture</span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">{riotHealth.cacheType}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                  riotHealth.productionCacheStatus === "Ready"
                    ? "text-emerald-400 bg-emerald-950/30 border-emerald-500/40"
                    : "text-amber-400 bg-amber-950/30 border-amber-500/40"
                }`}
              >
                {riotHealth.productionCacheStatus === "Ready" ? "Prod Ready" : "Dev Fallback"}
              </span>
            </div>
          </div>
        </div>

        {/* Services Status Sub-Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-[#1a2335] pt-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 block uppercase">Account Service</span>
            <span className="font-semibold text-slate-200">{riotHealth.accountServiceStatus}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 block uppercase">Rank Service</span>
            <span className="font-semibold text-slate-200">{riotHealth.rankServiceStatus}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 block uppercase">Match Service</span>
            <span className="font-semibold text-slate-200">{riotHealth.matchServiceStatus}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 block uppercase">Leaderboard Service</span>
            <span className="font-semibold text-slate-200">{riotHealth.leaderboardServiceStatus}</span>
          </div>
        </div>
      </div>

      {/* Unresolved Static Entity Misses Audit (Tasks 10, 11) */}
      <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            Static Data Entity Resolution Misses (Live Drift Monitor)
          </h3>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
              riotHealth.unresolvedMetrics.totalUnresolved === 0
                ? "text-emerald-400 bg-emerald-950/30 border-emerald-500/40"
                : "text-rose-400 bg-rose-950/30 border-rose-500/40"
            }`}
          >
            {riotHealth.unresolvedMetrics.totalUnresolved === 0
              ? "0 Misses (Clean)"
              : `${riotHealth.unresolvedMetrics.totalUnresolved} Unresolved`}
          </span>
        </div>

        <p className="text-xs text-slate-400">
          Tracks unknown entity IDs encountered during live match resolving (e.g., when Riot match servers update to a newer patch before static data is re-imported).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded bg-[#141b2a] border border-[#1f2b3e] space-y-1">
            <span className="text-slate-400 text-[11px] block">Unknown Champions</span>
            <span className="font-mono text-base font-bold text-white">
              {riotHealth.unresolvedMetrics.champions.length}
            </span>
            {riotHealth.unresolvedMetrics.champions.length > 0 && (
              <div className="text-[10px] text-rose-400 font-mono truncate">
                {riotHealth.unresolvedMetrics.champions.join(", ")}
              </div>
            )}
          </div>

          <div className="p-3 rounded bg-[#141b2a] border border-[#1f2b3e] space-y-1">
            <span className="text-slate-400 text-[11px] block">Unknown Items</span>
            <span className="font-mono text-base font-bold text-white">
              {riotHealth.unresolvedMetrics.items.length}
            </span>
            {riotHealth.unresolvedMetrics.items.length > 0 && (
              <div className="text-[10px] text-rose-400 font-mono truncate">
                {riotHealth.unresolvedMetrics.items.join(", ")}
              </div>
            )}
          </div>

          <div className="p-3 rounded bg-[#141b2a] border border-[#1f2b3e] space-y-1">
            <span className="text-slate-400 text-[11px] block">Unknown Traits</span>
            <span className="font-mono text-base font-bold text-white">
              {riotHealth.unresolvedMetrics.traits.length}
            </span>
            {riotHealth.unresolvedMetrics.traits.length > 0 && (
              <div className="text-[10px] text-rose-400 font-mono truncate">
                {riotHealth.unresolvedMetrics.traits.join(", ")}
              </div>
            )}
          </div>

          <div className="p-3 rounded bg-[#141b2a] border border-[#1f2b3e] space-y-1">
            <span className="text-slate-400 text-[11px] block">Unknown Augments</span>
            <span className="font-mono text-base font-bold text-white">
              {riotHealth.unresolvedMetrics.augments.length}
            </span>
            {riotHealth.unresolvedMetrics.augments.length > 0 && (
              <div className="text-[10px] text-rose-400 font-mono truncate">
                {riotHealth.unresolvedMetrics.augments.join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

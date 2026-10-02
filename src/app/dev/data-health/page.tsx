import React from "react";
import { tftService } from "@/services/tft";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { WISPS_DATA } from "@/features/wisps/data/wispsData";
import { PETS_DATA } from "@/features/pets/data/petsData";
import { HEX_CORES_DATA } from "@/features/hex-cores/data/hexCoresData";
import { CheckCircle2, AlertTriangle, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DataHealthPage() {
  const [champions, traits, items, augments, teamComps] = await Promise.all([
    tftService.getChampions(),
    tftService.getTraits(),
    tftService.getItems(),
    tftService.getAugments(),
    tftService.getTeamComps({ setId: TFT_RELEASE_CONFIG.setId }),
  ]);

  const champMap = new Map(champions.map((c) => [c.id, c]));
  const itemMap = new Map(items.map((i) => [i.id, i]));
  const traitMap = new Map(
    traits.map((t) => [t.id.toLowerCase().replace(/\s+/g, ""), t])
  );
  const augmentMap = new Map(augments.map((a) => [a.id.toLowerCase(), a]));

  // Check team comp integrity
  let brokenChampionRefs = 0;
  let brokenItemRefs = 0;
  let brokenTraitRefs = 0;
  let brokenAugmentRefs = 0;

  for (const comp of teamComps) {
    for (const c of comp.champions) {
      if (!champMap.has(c.championId)) brokenChampionRefs++;
      if (c.items) {
        for (const it of c.items) {
          if (!itemMap.has(it)) brokenItemRefs++;
        }
      }
    }
    for (const t of comp.traits) {
      const norm = t.traitId.toLowerCase().replace(/\s+/g, "");
      if (!traitMap.has(norm)) brokenTraitRefs++;
    }
    if (comp.augments) {
      for (const augId of comp.augments) {
        if (!augmentMap.has(augId.toLowerCase())) brokenAugmentRefs++;
      }
    }
  }

  const hasCriticalErrors =
    brokenChampionRefs > 0 ||
    brokenItemRefs > 0 ||
    brokenTraitRefs > 0 ||
    brokenAugmentRefs > 0 ||
    champions.length === 0 ||
    items.length === 0;

  const hasWarnings =
    champions.length < 70 ||
    traits.length < 30 ||
    items.length < 150 ||
    augments.length < 300 ||
    teamComps.length < 10;

  const systemStatus: "Healthy" | "Warning" | "Critical" = hasCriticalErrors
    ? "Critical"
    : hasWarnings
    ? "Warning"
    : "Healthy";

  const statusBadgeStyle =
    systemStatus === "Healthy"
      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
      : systemStatus === "Warning"
      ? "bg-amber-500/15 border-amber-500/40 text-amber-400"
      : "bg-rose-500/15 border-rose-500/40 text-rose-400";

  const healthMetrics = [
    { label: "Set ID", value: TFT_RELEASE_CONFIG.setId, status: "ok" },
    { label: "Active Patch", value: TFT_RELEASE_CONFIG.patch, status: "ok" },
    { label: "Set 18 Champions", value: champions.length, status: champions.length >= 70 ? "ok" : "warn" },
    { label: "Set 18 Traits", value: traits.length, status: traits.length >= 30 ? "ok" : "warn" },
    { label: "Set 18 Items", value: items.length, status: items.length >= 150 ? "ok" : "warn" },
    { label: "Set 18 Augments", value: augments.length, status: augments.length >= 300 ? "ok" : "warn" },
    { label: "Set 18 Team Comps", value: teamComps.length, status: teamComps.length >= 10 ? "ok" : "warn" },
    { label: "Wisps Catalog", value: WISPS_DATA.length, status: WISPS_DATA.length > 0 ? "ok" : "warn" },
    { label: "Pets Catalog", value: PETS_DATA.length, status: PETS_DATA.length > 0 ? "ok" : "warn" },
    { label: "Hex Cores Catalog", value: HEX_CORES_DATA.length, status: HEX_CORES_DATA.length > 0 ? "ok" : "warn" },
  ];

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="border-b border-[#20293b] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" />
            TFTPlus Data Health & Coverage Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal diagnostics verifying static dataset metrics, relational bindings, and asset coverage.
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded border text-xs font-bold uppercase tracking-wider ${statusBadgeStyle}`}
        >
          System {systemStatus}
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {healthMetrics.map((m) => (
          <div
            key={m.label}
            className="bg-[#111724] border border-[#1e2a3f] rounded-lg p-3 space-y-1 shadow-xs"
          >
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              {m.label}
            </div>
            <div className="text-lg font-black font-mono text-white">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Integrity Checklist */}
      <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg p-5 space-y-3">
        <h3 className="font-bold text-white text-xs uppercase tracking-wider">
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
    </div>
  );
}

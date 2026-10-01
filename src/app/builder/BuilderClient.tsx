"use client";

import React, { useEffect, useState, useMemo, useRef, useTransition } from "react";
import { HexBoard } from "@/components/builder/HexBoard";
import { ChampionPicker } from "@/components/builder/ChampionPicker";
import { ActiveTraitsPanel } from "@/components/builder/ActiveTraitsPanel";
import { ItemAssigner } from "@/components/builder/ItemAssigner";
import { BuilderMetaPanel } from "@/components/builder/BuilderMetaPanel";
import { useBuilderStore } from "@/stores/useBuilderStore";
import {
  BuilderDataProvider,
  useBuilderData,
} from "@/features/builder/context/BuilderDataContext";
import { Button } from "@/components/common/Button";
import { Share2, RotateCcw, Check } from "lucide-react";
import { encodeBuilderSnapshot } from "@/features/builder/share/builderShareCodec";
import { validateBuilderSnapshotDomain } from "@/features/builder/validation/builderSnapshotValidator";
import { resolveInitialBuilderBoard } from "@/features/builder/init/builderInitLogic";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { Champion, Trait, Item, TeamComp } from "@/types/tft";

interface BuilderClientProps {
  initialChampions: Champion[];
  initialTraits: Trait[];
  initialItems: Item[];
  initialTeamComps: TeamComp[];
}

function BuilderContent() {
  const { board, clearBoard, loadSnapshot } = useBuilderStore();
  const { teamComps, championsById, itemsById } = useBuilderData();
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();
  const initializedRef = useRef(false);

  // Memoize current set presets
  const currentSetComps = useMemo(
    () => teamComps.filter((c) => c.setId === TFT_RELEASE_CONFIG.setId),
    [teamComps]
  );

  // One-time initialization on mount (snapshot or current set preset fallback)
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const snapshotParam = params.get("snapshot");
      const initialBoard = resolveInitialBuilderBoard({
        urlSnapshot: snapshotParam,
        currentSetComps,
        championsById,
        itemsById,
      });

      if (initialBoard.length > 0) {
        loadSnapshot(initialBoard);
      }
    }
  }, [currentSetComps, championsById, itemsById, loadSnapshot]);

  const handleShareLink = () => {
    if (board.length === 0) return;
    try {
      const encoded = encodeBuilderSnapshot(board);
      const url = `${window.location.origin}/builder?snapshot=${encoded}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleLoadSampleComp = (compId: string) => {
    const comp = currentSetComps.find((c) => c.id === compId);
    if (!comp) return;

    startTransition(() => {
      const rawBoard = comp.champions.map((ch, idx) => ({
        championId: ch.championId,
        x: ch.position?.col ?? idx % 7,
        y: ch.position?.row ?? Math.floor(idx / 7),
        starLevel: ch.starLevel ?? 2,
        items: ch.items ?? [],
      }));
      const validated = validateBuilderSnapshotDomain({
        snapshot: rawBoard,
        championsById,
        itemsById,
      });
      loadSnapshot(validated.board);
    });
  };

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            Team Builder & Trait Simulator
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Construct compositions on the interactive hex board, simulate synergies, equip items, and save builds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sample Comp Presets */}
          {currentSetComps.length > 0 && (
            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 mr-2">
              <span>Preset:</span>
              {currentSetComps.slice(0, 4).map((comp) => (
                <button
                  key={comp.id}
                  type="button"
                  onClick={() => handleLoadSampleComp(comp.id)}
                  className="px-2 py-1 rounded bg-[#16202e] hover:bg-[#202d42] border border-[#2b394f] text-[11px] text-slate-300 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {comp.name.split(" ")[1] || comp.name.slice(0, 10)}
                </button>
              ))}
            </div>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={clearBoard}
            className="gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleShareLink}
            disabled={board.length === 0}
            className="gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950" />
                Copied URL!
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                Share Build
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Grid: Board & Synergies side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Board on Left / Center (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <HexBoard />
          <BuilderMetaPanel />
          <ChampionPicker />
        </div>

        {/* Synergies on Right (1 col) */}
        <div className="lg:col-span-1">
          <ActiveTraitsPanel />
        </div>
      </div>

      {/* Item Assigner Modal */}
      <ItemAssigner />
    </div>
  );
}

export function BuilderClient({
  initialChampions,
  initialTraits,
  initialItems,
  initialTeamComps,
}: BuilderClientProps) {
  return (
    <BuilderDataProvider
      champions={initialChampions}
      traits={initialTraits}
      items={initialItems}
      teamComps={initialTeamComps}
    >
      <BuilderContent />
    </BuilderDataProvider>
  );
}

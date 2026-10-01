"use client";

import React, { useEffect, useState, useTransition } from "react";
import { HexBoard } from "@/components/builder/HexBoard";
import { ChampionPicker } from "@/components/builder/ChampionPicker";
import { ActiveTraitsPanel } from "@/components/builder/ActiveTraitsPanel";
import { ItemAssigner } from "@/components/builder/ItemAssigner";
import { useBuilderStore } from "@/stores/useBuilderStore";
import { Button } from "@/components/common/Button";
import { Share2, RotateCcw, Check } from "lucide-react";
import { MOCK_TEAM_COMPS } from "@/data/mockTftData";

export default function BuilderPage() {
  const { board, clearBoard, loadSnapshot } = useBuilderStore();
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  // Load URL snapshot if present on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const snapshot = params.get("snapshot");
      if (snapshot) {
        try {
          const decoded = JSON.parse(atob(snapshot));
          if (Array.isArray(decoded)) {
            loadSnapshot(decoded);
            return;
          }
        } catch {
          // ignore parsing error
        }
      }

      // Default load first comp if board is empty
      if (useBuilderStore.getState().board.length === 0 && MOCK_TEAM_COMPS.length > 0) {
        const defaultComp = MOCK_TEAM_COMPS[0];
        const defaultBoard = defaultComp.champions.map((ch, idx) => ({
          championId: ch.championId,
          x: ch.position?.col ?? idx % 7,
          y: ch.position?.row ?? Math.floor(idx / 7),
          starLevel: ch.starLevel ?? 2,
          items: ch.items ?? [],
        }));
        loadSnapshot(defaultBoard);
      }
    }
  }, [loadSnapshot]);

  const handleShareLink = () => {
    if (board.length === 0) return;
    try {
      const encoded = btoa(JSON.stringify(board));
      const url = `${window.location.origin}/builder?snapshot=${encoded}`;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleLoadSampleComp = (compId: string) => {
    const comp = MOCK_TEAM_COMPS.find((c) => c.id === compId);
    if (!comp) return;

    startTransition(() => {
      const newBoard = comp.champions.map((ch, idx) => ({
        championId: ch.championId,
        x: ch.position?.col ?? idx % 7,
        y: ch.position?.row ?? Math.floor(idx / 7),
        starLevel: ch.starLevel ?? 2,
        items: ch.items ?? [],
      }));
      loadSnapshot(newBoard);
    });
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
            Team Builder & Trait Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Construct compositions on the interactive hex board, simulate synergies, equip items, and share builds.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sample Comp Presets */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 mr-2">
            <span>Preset:</span>
            {MOCK_TEAM_COMPS.map((comp) => (
              <button
                key={comp.id}
                type="button"
                onClick={() => handleLoadSampleComp(comp.id)}
                className="px-2 py-1 rounded bg-[#16202e] hover:bg-[#202d42] border border-[#2b394f] text-[11px] text-slate-300 hover:text-amber-400 transition-colors"
              >
                {comp.name.split(" ")[1] || comp.name.slice(0, 8)}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={clearBoard}
            className="gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleShareLink}
            disabled={board.length === 0}
            className="gap-1.5"
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Board on Left / Center (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <HexBoard />
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

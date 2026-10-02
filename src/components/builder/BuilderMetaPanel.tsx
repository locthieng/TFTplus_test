"use client";

import React, { useState } from "react";
import { Plus, X, Crown, BookmarkCheck, Trash2, AlertTriangle } from "lucide-react";
import { useBuilderStore } from "@/stores/useBuilderStore";
import {
  useBuilderMetaStore,
  saveLocalBuild,
  deleteLocalBuild,
  getLocalSavedBuilds,
  validateSavedBuildVersion,
  SavedBuild,
} from "@/features/builder/meta/builderMetaStore";
import { HEX_CORES_DATA } from "@/features/hex-cores/data/hexCoresData";
import { HexCoreTier } from "@/features/hex-cores/types/hexCore";
import { useBuilderData } from "@/features/builder/context/BuilderDataContext";
import { GameImage } from "@/components/common/GameImage";
import { COST_COLORS } from "@/constants/tft";
import { cn } from "@/utils/cn";

export function BuilderMetaPanel() {
  const { board, loadSnapshot } = useBuilderStore();
  const { championsById } = useBuilderData();
  const {
    carryChampionId,
    heroHexCoreId,
    priorityHexCoreIds,
    alternativeHexCoreIds,
    setCarryChampion,
    setHeroHexCore,
    togglePriorityHexCore,
    toggleAlternativeHexCore,
    setMeta,
  } = useBuilderMetaStore();

  const [pickerTier, setPickerTier] = useState<HexCoreTier | null>(null);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [buildName, setBuildName] = useState("");
  const [savedBuilds, setSavedBuilds] = useState<SavedBuild[]>([]);
  const [showSavedList, setShowSavedList] = useState(false);
  const [versionWarning, setVersionWarning] = useState<string | null>(null);

  // Refresh saved builds on open
  const handleOpenSaveModal = () => {
    setSavedBuilds(getLocalSavedBuilds());
    setSaveModalOpen(true);
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    saveLocalBuild(buildName, board, {
      carryChampionId,
      heroHexCoreId,
      priorityHexCoreIds,
      alternativeHexCoreIds,
    });
    setSavedBuilds(getLocalSavedBuilds());
    setBuildName("");
    setSaveModalOpen(false);
  };

  const handleLoadBuild = (build: SavedBuild) => {
    const val = validateSavedBuildVersion(build);
    if (!val.isCompatible) {
      setVersionWarning(val.warning || null);
    } else {
      setVersionWarning(null);
    }
    loadSnapshot(build.board);
    setMeta(build.meta);
    setShowSavedList(false);
  };

  const handleDeleteBuild = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteLocalBuild(id);
    setSavedBuilds(updated);
  };

  // Find placed champions on board
  const boardChamps = Array.from(
    new Set(board.map((u) => u.championId))
  ).map((id) => championsById.get(id) || championsById.get(id.toLowerCase()));

  // Active hex cores
  const heroCore = HEX_CORES_DATA.find((c) => c.id === heroHexCoreId);
  const priorityCores = HEX_CORES_DATA.filter((c) =>
    priorityHexCoreIds.includes(c.id)
  );
  const altCores = HEX_CORES_DATA.filter((c) =>
    alternativeHexCoreIds.includes(c.id)
  );

  return (
    <div className="bg-[#111724] border border-[#1e2a3f] rounded-lg p-3 sm:p-4 space-y-4 shadow-sm text-xs">
      {/* Top action row: Save Build & Saved Builds count */}
      <div className="flex items-center justify-between border-b border-[#1c2738] pb-2.5">
        <h3 className="font-extrabold text-white uppercase tracking-wider text-xs flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          Tactical Augmentation & Core
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-800/60 text-amber-300 font-normal">
            Tactical Preset
          </span>
        </h3>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSavedBuilds(getLocalSavedBuilds());
              setShowSavedList((prev) => !prev);
            }}
            className="px-2.5 py-1 bg-[#162133] hover:bg-[#1c2b42] text-slate-300 hover:text-white rounded border border-[#23334d] text-[11px] font-semibold transition-colors cursor-pointer"
          >
            My Saved Builds ({getLocalSavedBuilds().length})
          </button>
          <button
            type="button"
            onClick={handleOpenSaveModal}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-[11px] transition-colors cursor-pointer"
          >
            Save Build
          </button>
        </div>
      </div>

      {/* Cross-set Version Warning */}
      {versionWarning && (
        <div className="flex items-center justify-between p-2.5 rounded bg-amber-950/40 border border-amber-600/50 text-amber-200 text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{versionWarning}</span>
          </div>
          <button
            type="button"
            onClick={() => setVersionWarning(null)}
            className="text-amber-400 hover:text-white text-xs font-bold ml-2 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Saved builds accordion drop */}
      {showSavedList && (
        <div className="bg-[#0e1420] border border-[#22314a] rounded p-3 space-y-2">
          <div className="flex items-center justify-between text-slate-400 font-bold text-[11px]">
            <span>SAVED BUILDS (LOCAL STORAGE)</span>
            <button
              type="button"
              onClick={() => setShowSavedList(false)}
              className="text-slate-500 hover:text-white cursor-pointer"
            >
              Close
            </button>
          </div>
          {savedBuilds.length === 0 ? (
            <p className="text-slate-500 text-xs py-2">No saved builds found.</p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {savedBuilds.map((b) => (
                <div
                  key={b.id}
                  onClick={() => handleLoadBuild(b)}
                  className="flex items-center justify-between p-2 rounded bg-[#131b28] hover:bg-[#182335] border border-[#1e2a3c] transition-colors cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-white text-xs block">{b.name}</span>
                    <span className="text-[10px] text-slate-500">
                      {b.board.length} units • Set {b.setId ?? "18"} • {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteBuild(b.id, e)}
                    className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Primary Carry Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-slate-400">
          <span className="font-bold text-[11px] uppercase tracking-wider text-slate-300">
            Primary Carry Champion
          </span>
          <span className="text-[10px] text-slate-500">
            Select from units on your board
          </span>
        </div>

        {boardChamps.length === 0 ? (
          <p className="text-slate-500 text-xs py-1">
            Place champions onto the board above to select your primary carry.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {boardChamps.map((champ) => {
              if (!champ) return null;
              const isCarry = carryChampionId === champ.id;
              const cost = champ.cost as 1 | 2 | 3 | 4 | 5;
              const costColor = COST_COLORS[cost] || COST_COLORS[1];

              return (
                <button
                  key={champ.id}
                  type="button"
                  onClick={() => setCarryChampion(isCarry ? undefined : champ.id)}
                  className={cn(
                    "w-9 h-9 rounded border-2 relative overflow-hidden bg-slate-900 transition-all cursor-pointer shadow-xs",
                    costColor.border,
                    isCarry
                      ? "ring-2 ring-amber-400 scale-105"
                      : "opacity-75 hover:opacity-100"
                  )}
                  title={`Set ${champ.name} as carry`}
                >
                  <GameImage
                    src={champ.imageUrl}
                    alt={champ.name}
                    width={36}
                    height={36}
                    className="w-full h-full object-cover"
                  />
                  {isCarry && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 p-0.5 rounded-bl">
                      <Crown className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Hex Core Grid: Hero, Priority (3), Alternative (3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-[#1a2335]">
        {/* 1. Hero Hex Core */}
        <div className="space-y-1.5">
          <span className="font-bold text-[11px] text-amber-400 uppercase tracking-wider block">
            Hero Hex Core
          </span>
          <div className="flex items-center gap-2">
            {heroCore ? (
              <div className="flex items-center gap-2 p-1.5 bg-[#151f31] border border-amber-500/40 rounded flex-1 relative group">
                <div className="w-7 h-7 rounded bg-amber-950/60 border border-amber-500/50 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                  <GameImage
                    src={heroCore.iconUrl}
                    alt={heroCore.name}
                    width={28}
                    height={28}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-white text-xs block truncate">
                    {heroCore.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setHeroHexCore(undefined)}
                  className="p-1 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPickerTier("hero")}
                className="w-full py-2.5 px-3 rounded border border-dashed border-[#28374f] hover:border-amber-400 text-slate-400 hover:text-amber-300 bg-[#131b29] flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Select Hero Core
              </button>
            )}
          </div>
        </div>

        {/* 2. Priority Hex Cores (up to 3) */}
        <div className="space-y-1.5">
          <span className="font-bold text-[11px] text-purple-400 uppercase tracking-wider block">
            Priority Hex Cores ({priorityCores.length}/3)
          </span>
          <div className="flex items-center gap-1.5">
            {priorityCores.map((core) => (
              <div
                key={core.id}
                className="w-8 h-8 rounded bg-[#151f31] border border-purple-500/40 relative overflow-hidden group shadow-xs"
                title={core.name}
              >
                <GameImage
                  src={core.iconUrl}
                  alt={core.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => togglePriorityHexCore(core.id)}
                  className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {priorityCores.length < 3 && (
              <button
                type="button"
                onClick={() => setPickerTier("priority")}
                className="w-8 h-8 rounded border border-dashed border-[#28374f] hover:border-purple-400 text-slate-400 hover:text-purple-300 bg-[#131b29] flex items-center justify-center transition-colors cursor-pointer"
                title="Add Priority Hex Core"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 3. Alternative Hex Cores (up to 3) */}
        <div className="space-y-1.5">
          <span className="font-bold text-[11px] text-blue-400 uppercase tracking-wider block">
            Alternative Hex Cores ({altCores.length}/3)
          </span>
          <div className="flex items-center gap-1.5">
            {altCores.map((core) => (
              <div
                key={core.id}
                className="w-8 h-8 rounded bg-[#151f31] border border-blue-500/40 relative overflow-hidden group shadow-xs"
                title={core.name}
              >
                <GameImage
                  src={core.iconUrl}
                  alt={core.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => toggleAlternativeHexCore(core.id)}
                  className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {altCores.length < 3 && (
              <button
                type="button"
                onClick={() => setPickerTier("alternative")}
                className="w-8 h-8 rounded border border-dashed border-[#28374f] hover:border-blue-400 text-slate-400 hover:text-blue-300 bg-[#131b29] flex items-center justify-center transition-colors cursor-pointer"
                title="Add Alternative Hex Core"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hex Core Selection Modal */}
      {pickerTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#121926] border border-[#233149] rounded-lg w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1c2738] pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Select {pickerTier === "hero" ? "Hero" : pickerTier === "priority" ? "Priority" : "Alternative"} Hex Core
              </h3>
              <button
                type="button"
                onClick={() => setPickerTier(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {HEX_CORES_DATA.filter((c) => c.tier === pickerTier).map((core) => {
                const isSelected =
                  pickerTier === "hero"
                    ? heroHexCoreId === core.id
                    : pickerTier === "priority"
                    ? priorityHexCoreIds.includes(core.id)
                    : alternativeHexCoreIds.includes(core.id);

                return (
                  <div
                    key={core.id}
                    onClick={() => {
                      if (pickerTier === "hero") {
                        setHeroHexCore(core.id);
                      } else if (pickerTier === "priority") {
                        togglePriorityHexCore(core.id);
                      } else {
                        toggleAlternativeHexCore(core.id);
                      }
                      setPickerTier(null);
                    }}
                    className={cn(
                      "flex items-start gap-3 p-2.5 rounded border transition-colors cursor-pointer",
                      isSelected
                        ? "bg-[#182338] border-amber-400/80"
                        : "bg-[#141c2b] border-[#202c40] hover:border-[#2f405c]"
                    )}
                  >
                    <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <GameImage
                        src={core.iconUrl}
                        alt={core.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-white text-xs block mb-0.5">
                        {core.name}
                      </span>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {core.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Save Build Modal */}
      {saveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveCurrent}
            className="bg-[#121926] border border-[#233149] rounded-lg w-full max-w-sm p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#1c2738] pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
                Save Custom Build
              </h3>
              <button
                type="button"
                onClick={() => setSaveModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Build Name
              </label>
              <input
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="e.g. My Fast 8 Aphelios"
                autoFocus
                className="w-full px-3 py-1.5 rounded bg-[#151f33] border border-[#25364e] text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSaveModalOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useBuilderStore } from "@/stores/useBuilderStore";
import { BUILDER_CONFIG } from "@/config/builderConfig";
import { HexCell } from "./HexCell";

export function HexBoard() {
  const {
    board,
    selectedHex,
    selectHex,
    removeChampion,
    moveChampion,
    setStarLevel,
  } = useBuilderStore();

  const [draggedCoord, setDraggedCoord] = useState<{ x: number; y: number } | null>(
    null
  );

  const handleDragStart = (x: number, y: number, e: React.DragEvent) => {
    setDraggedCoord({ x, y });
    e.dataTransfer.setData("text/plain", JSON.stringify({ x, y }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (toX: number, toY: number, e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("text/plain");
      if (!data) return;

      const parsed = JSON.parse(data);

      // Dropped from Champion Picker
      if (parsed.fromPicker && parsed.championId) {
        useBuilderStore.getState().addChampion(parsed.championId, toX, toY);
        return;
      }

      // Moved from another hex on the board
      if (parsed.x !== undefined && parsed.y !== undefined) {
        moveChampion(parsed.x, parsed.y, toX, toY);
      }
    } catch {
      // Fallback
      if (draggedCoord) {
        moveChampion(draggedCoord.x, draggedCoord.y, toX, toY);
      }
    } finally {
      setDraggedCoord(null);
    }
  };

  const cycleStars = (x: number, y: number) => {
    const champ = board.find((c) => c.x === x && c.y === y);
    if (!champ) return;
    const nextStar = champ.starLevel === 1 ? 2 : champ.starLevel === 2 ? 3 : 1;
    setStarLevel(x, y, nextStar as 1 | 2 | 3);
  };

  return (
    <div className="relative p-4 sm:p-8 bg-[#0b0f17] border border-[#1f283a] rounded-2xl shadow-2xl flex flex-col items-center justify-center overflow-x-auto min-h-[380px]">
      {/* Board title & unit count */}
      <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-[#1f283a]/60 text-xs text-slate-400">
        <span className="font-semibold text-slate-300">Tactician&apos;s Board</span>
        <span className="font-mono bg-[#161f2e] px-2 py-0.5 rounded border border-slate-700/60">
          Units: <strong className="text-amber-400">{board.length}</strong> / {BUILDER_CONFIG.defaultMaxUnits}
        </span>
      </div>

      {/* Hex Grid: rows x columns from config */}
      <div className="flex flex-col items-center -space-y-3 sm:-space-y-4 py-2">
        {Array.from({ length: BUILDER_CONFIG.rows }).map((_, rowIdx) => {
          // Odd rows are offset by half a cell
          const isOddRow = rowIdx % 2 !== 0;

          return (
            <div
              key={rowIdx}
              className={`flex items-center space-x-1 sm:space-x-2 ${
                isOddRow ? "ml-8 sm:ml-10" : ""
              }`}
            >
              {Array.from({ length: BUILDER_CONFIG.columns }).map((_, colIdx) => {
                const champOnHex = board.find(
                  (c) => c.x === colIdx && c.y === rowIdx
                );
                const isSelected =
                  selectedHex?.x === colIdx && selectedHex?.y === rowIdx;

                return (
                  <HexCell
                    key={`${colIdx}-${rowIdx}`}
                    x={colIdx}
                    y={rowIdx}
                    champion={champOnHex}
                    isSelected={isSelected}
                    onClick={() => selectHex(colIdx, rowIdx)}
                    onRemove={() => removeChampion(colIdx, rowIdx)}
                    onCycleStars={() => cycleStars(colIdx, rowIdx)}
                    onDragStart={(e) => handleDragStart(colIdx, rowIdx, e)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(colIdx, rowIdx, e)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-4 text-[11px] text-slate-500 text-center">
        Tip: Drag units on the board to reposition • Click unit to cycle 1★ / 2★ / 3★ • Hover to remove
      </div>
    </div>
  );
}

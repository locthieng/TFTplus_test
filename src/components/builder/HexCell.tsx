"use client";

import React from "react";
import { BoardChampion } from "@/types/tft";
import { useBuilderData } from "@/features/builder/context/BuilderDataContext";
import { COST_COLORS } from "@/constants/tft";
import { GameImage } from "@/components/common/GameImage";
import { Star, X, Plus } from "lucide-react";
import { cn } from "@/utils/cn";

export interface HexCellProps {
  x: number;
  y: number;
  champion?: BoardChampion;
  isSelected?: boolean;
  onClick: () => void;
  onRemove?: () => void;
  onCycleStars?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export function HexCell({
  x,
  y,
  champion,
  isSelected,
  onClick,
  onRemove,
  onCycleStars,
  onDragStart,
  onDragOver,
  onDrop,
}: HexCellProps) {
  const { championsById, itemsById } = useBuilderData();

  const champData = champion
    ? championsById.get(champion.championId) ||
      championsById.get(champion.championId.toLowerCase())
    : undefined;

  const costStyle = champData ? COST_COLORS[champData.cost] || COST_COLORS[1] : null;

  return (
    <div
      data-x={x}
      data-y={y}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={cn(
        "relative w-14 h-16 sm:w-18 sm:h-20 flex items-center justify-center cursor-pointer transition-all duration-150 select-none group",
        isSelected && "scale-105 z-20"
      )}
    >
      {/* Outer Hexagon outline / background */}
      <div
        className={cn(
          "w-full h-full clip-hexagon flex items-center justify-center p-0.5 transition-all duration-200",
          champData
            ? costStyle?.border.replace("border-", "bg-")
            : "bg-[#1f2838]/70 hover:bg-[#2c3950]/80",
          isSelected && "bg-amber-400 drop-shadow-[0_0_8px_#f59e0b]"
        )}
      >
        <div
          draggable={!!champData}
          onDragStart={onDragStart}
          className={cn(
            "w-[calc(100%-4px)] h-[calc(100%-4px)] clip-hexagon relative flex items-center justify-center overflow-hidden",
            champData ? "bg-slate-900" : "bg-[#111722] hover:bg-[#161f2e]"
          )}
        >
          {champData ? (
            <>
              <GameImage
                src={champData.imageUrl}
                alt={champData.name}
                width={72}
                height={72}
                className="w-full h-full object-cover scale-110 pointer-events-none"
              />

              {/* Star level banner */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onCycleStars?.();
                }}
                className="absolute top-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-slate-950/80 px-1 py-0.5 rounded-full z-10 hover:bg-slate-900"
                title="Click to cycle stars"
              >
                {Array.from({ length: champion?.starLevel || 2 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "w-2.5 h-2.5 fill-current",
                      champion?.starLevel === 3
                        ? "text-amber-300 drop-shadow-[0_0_4px_#f59e0b]"
                        : "text-slate-300"
                    )}
                  />
                ))}
              </div>

              {/* Champion items on bottom of hex */}
              {champion && champion.items.length > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-10">
                  {champion.items.map((itemId, idx) => {
                    const itemData =
                      itemsById.get(itemId) || itemsById.get(itemId.toLowerCase());
                    if (!itemData) return null;
                    return (
                      <div
                        key={idx}
                        className="w-3.5 h-3.5 rounded-sm border border-slate-700 bg-slate-900 overflow-hidden"
                      >
                        <GameImage
                          src={itemData.imageUrl}
                          alt={itemData.name}
                          width={14}
                          height={14}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Remove button on hover */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove?.();
                }}
                className="absolute -top-1 -right-1 z-30 p-1 bg-rose-600 hover:bg-rose-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                title="Remove unit"
              >
                <X className="w-3 h-3" />
              </button>
            </>
          ) : (
            <Plus className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors opacity-40 group-hover:opacity-100" />
          )}
        </div>
      </div>
    </div>
  );
}

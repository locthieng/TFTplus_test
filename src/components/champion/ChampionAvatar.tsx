"use client";

import React from "react";
import { Champion } from "@/types/tft";
import { COST_COLORS } from "@/constants/tft";
import { Tooltip } from "@/components/common/Tooltip";
import { GameImage } from "@/components/common/GameImage";
import { cn } from "@/utils/cn";
import { Star, Shield, Flame } from "lucide-react";

export interface ChampionAvatarProps {
  champion: Champion;
  size?: "sm" | "md" | "lg" | "xl";
  starLevel?: 1 | 2 | 3;
  isCarry?: boolean;
  isTank?: boolean;
  items?: { id: string; name: string; imageUrl: string }[];
  showName?: boolean;
  showCost?: boolean;
  showTooltip?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ChampionAvatar({
  champion,
  size = "md",
  starLevel,
  isCarry,
  isTank,
  items = [],
  showName = false,
  showCost = true,
  showTooltip = true,
  className,
  onClick,
}: ChampionAvatarProps) {
  const sizeMap = {
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const imageSizes = {
    sm: 36,
    md: 48,
    lg: 64,
    xl: 80,
  };

  const costStyle = COST_COLORS[champion.cost] || COST_COLORS[1];

  const avatarElement = (
    <div
      onClick={onClick}
      className={cn(
        "flex flex-col items-center select-none group",
        onClick && "cursor-pointer"
      )}
    >
      <div className="relative">
        {/* Star Level */}
        {starLevel && starLevel > 1 && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 flex items-center gap-0.5">
            {Array.from({ length: starLevel }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3 fill-current",
                  starLevel === 3 ? "text-amber-300 drop-shadow-[0_0_4px_#f59e0b]" : "text-slate-300"
                )}
              />
            ))}
          </div>
        )}

        {/* Champion Image container */}
        <div
          className={cn(
            "relative rounded-lg overflow-hidden border-2 bg-slate-900 transition-all duration-200",
            sizeMap[size],
            costStyle.border,
            onClick && "group-hover:scale-105 group-hover:shadow-lg",
            starLevel === 3 && "border-amber-400 shadow-md shadow-amber-400/30",
            className
          )}
        >
          <GameImage
            src={champion.imageUrl}
            alt={champion.name}
            width={imageSizes[size]}
            height={imageSizes[size]}
            className="w-full h-full object-cover"
          />

          {/* Role badge (Carry / Tank) */}
          {isCarry && (
            <div className="absolute top-0.5 right-0.5 p-0.5 rounded bg-amber-500/90 text-slate-950 shadow-sm">
              <Flame className="w-2.5 h-2.5 fill-current" />
            </div>
          )}
          {isTank && !isCarry && (
            <div className="absolute top-0.5 right-0.5 p-0.5 rounded bg-sky-500/90 text-white shadow-sm">
              <Shield className="w-2.5 h-2.5 fill-current" />
            </div>
          )}

          {/* Cost badge */}
          {showCost && (
            <div
              className={cn(
                "absolute bottom-0 right-0 px-1 py-0.2 text-[9px] font-extrabold rounded-tl leading-tight",
                costStyle.bg,
                costStyle.text
              )}
            >
              ${champion.cost}
            </div>
          )}
        </div>

        {/* Attached Items */}
        {items.length > 0 && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-10">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="w-4 h-4 rounded border border-slate-700 bg-slate-900 overflow-hidden shadow"
                title={item.name}
              >
                <GameImage
                  src={item.imageUrl}
                  alt={item.name}
                  width={16}
                  height={16}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {showName && (
        <span
          className={cn(
            "mt-1 text-[11px] font-medium truncate max-w-[64px] text-center",
            costStyle.text
          )}
        >
          {champion.name}
        </span>
      )}
    </div>
  );

  if (!showTooltip) return avatarElement;

  const tooltipContent = (
    <div className="space-y-1.5 min-w-[180px]">
      <div className="flex items-center justify-between border-b border-slate-700 pb-1">
        <span className={cn("font-bold text-sm", costStyle.text)}>
          {champion.name}
        </span>
        <span className="font-semibold text-xs text-amber-400">
          ${champion.cost} Gold
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {champion.traits.map((t) => (
          <span
            key={t}
            className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700"
          >
            {t}
          </span>
        ))}
      </div>

      {champion.ability && (
        <div className="pt-1 text-slate-300">
          <p className="font-semibold text-[11px] text-amber-300">
            {champion.ability.name}
          </p>
          <p className="text-[10px] leading-relaxed text-slate-400">
            {champion.ability.description}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top">
      {avatarElement}
    </Tooltip>
  );
}

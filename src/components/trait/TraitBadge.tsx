"use client";

import React from "react";
import { Trait, TraitTierStyle } from "@/types/tft";
import { TRAIT_STYLE_CONFIG } from "@/constants/tft";
import { Tooltip } from "@/components/common/Tooltip";
import { GameImage } from "@/components/common/GameImage";
import { cn } from "@/utils/cn";

export interface TraitBadgeProps {
  trait: Trait;
  count: number;
  style?: TraitTierStyle;
  showTooltip?: boolean;
  className?: string;
  onClick?: () => void;
}

export function TraitBadge({
  trait,
  count,
  style = "bronze",
  showTooltip = true,
  className,
  onClick,
}: TraitBadgeProps) {
  const config = TRAIT_STYLE_CONFIG[style] || TRAIT_STYLE_CONFIG.bronze;

  const element = (
    <div
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-xs font-semibold select-none transition-all",
        config.bg,
        config.border,
        config.text,
        onClick && "cursor-pointer hover:brightness-110",
        className
      )}
    >
      <div className="w-4 h-4 relative flex items-center justify-center">
        <GameImage
          src={trait.iconUrl}
          alt={trait.name}
          width={16}
          height={16}
          className="w-full h-full object-contain filter drop-shadow"
        />
      </div>
      <span>{count}</span>
      <span className="font-normal text-[11px] opacity-90 hidden sm:inline">
        {trait.name}
      </span>
    </div>
  );

  if (!showTooltip) return element;

  const tooltipContent = (
    <div className="space-y-1.5 min-w-[200px]">
      <div className="flex items-center gap-2 border-b border-slate-700/80 pb-1">
        <div className="w-5 h-5 relative">
          <GameImage
            src={trait.iconUrl}
            alt={trait.name}
            width={20}
            height={20}
            className="w-full h-full object-contain"
          />
        </div>
        <span className="font-bold text-xs text-amber-300">{trait.name}</span>
      </div>

      <p className="text-[11px] leading-relaxed text-slate-300">
        {trait.description}
      </p>

      {trait.breakpoints && trait.breakpoints.length > 0 && (
        <div className="pt-1 space-y-1">
          {trait.breakpoints.map((bp, idx) => {
            const isReached = count >= bp.minUnits;
            return (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-1.5 text-[10px] py-0.5 px-1.5 rounded",
                  isReached
                    ? "bg-amber-400/20 text-amber-200 font-bold border border-amber-400/30"
                    : "text-slate-400 opacity-70"
                )}
              >
                <span className="font-mono">({bp.minUnits})</span>
                <span>{bp.description || `${bp.minUnits} units`}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <Tooltip content={tooltipContent} position="top">
      {element}
    </Tooltip>
  );
}

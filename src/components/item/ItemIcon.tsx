"use client";

import React from "react";
import { Item } from "@/types/tft";
import { Tooltip } from "@/components/common/Tooltip";
import { GameImage } from "@/components/common/GameImage";
import { cn } from "@/utils/cn";

export interface ItemIconProps {
  item: Item;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  className?: string;
  onClick?: () => void;
}

export function ItemIcon({
  item,
  size = "md",
  showTooltip = true,
  className,
  onClick,
}: ItemIconProps) {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const imageSizes = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  const element = (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-md overflow-hidden border border-[#2e3d56] bg-slate-900 flex-shrink-0 cursor-pointer hover:border-amber-400 hover:scale-105 transition-all select-none",
        sizeMap[size],
        className
      )}
    >
      <GameImage
        src={item.imageUrl}
        alt={item.name}
        width={imageSizes[size]}
        height={imageSizes[size]}
        className="w-full h-full object-cover"
      />
    </div>
  );

  if (!showTooltip) return element;

  const tooltipContent = (
    <div className="space-y-1 min-w-[200px] max-w-[260px]">
      <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
        <span className="font-bold text-xs text-amber-300">{item.name}</span>
        <span className="text-[10px] text-slate-400 uppercase">{item.type}</span>
      </div>
      <p className="text-[11px] leading-relaxed text-slate-300">
        {item.description}
      </p>
      {item.effects && (
        <div className="pt-1 flex flex-wrap gap-2 text-[10px] text-cyan-300 font-mono">
          {Object.entries(item.effects).map(([k, v]) => (
            <span key={k}>
              {k}: {v}
            </span>
          ))}
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

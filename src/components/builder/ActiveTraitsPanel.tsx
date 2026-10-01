"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import { useBuilderStore } from "@/stores/useBuilderStore";
import { calculateBoardTraits } from "@/utils/traitCalculator";
import { TRAIT_STYLE_CONFIG } from "@/constants/tft";
import { cn } from "@/utils/cn";

export function ActiveTraitsPanel() {
  const board = useBuilderStore((state) => state.board);

  const calculatedTraits = useMemo(() => {
    return calculateBoardTraits(board);
  }, [board]);

  const activeTraits = calculatedTraits.filter((t) => t.isActive);
  const inactiveTraits = calculatedTraits.filter((t) => !t.isActive);

  return (
    <div className="bg-[#111722] border border-[#202a3c] rounded-2xl p-4 flex flex-col gap-3 min-w-[260px]">
      <div className="flex items-center justify-between border-b border-[#202a3c] pb-2 text-xs">
        <span className="font-bold text-slate-200">Synergies</span>
        <span className="text-slate-400 font-mono">
          {activeTraits.length} Active
        </span>
      </div>

      {calculatedTraits.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500">
          No champions on board yet. Click or drag champions above to calculate synergies.
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {/* Active Synergies */}
          {activeTraits.map(({ trait, count, activeBreakpoint }) => {
            const style = activeBreakpoint?.style || "bronze";
            const config = TRAIT_STYLE_CONFIG[style];

            return (
              <div
                key={trait.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg border transition-all",
                  config.bg,
                  config.border
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 relative flex-shrink-0">
                    <Image
                      src={trait.iconUrl}
                      alt={trait.name}
                      width={20}
                      height={20}
                      className="w-full h-full object-contain filter drop-shadow"
                      unoptimized
                    />
                  </div>
                  <span className={cn("text-xs font-bold", config.text)}>
                    {trait.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono font-semibold">
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded",
                      config.text,
                      "bg-black/30"
                    )}
                  >
                    {count}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400">
                    <span>
                      / {activeBreakpoint?.minUnits}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Inactive synergies with units towards next breakpoint */}
          {inactiveTraits.length > 0 && (
            <div className="pt-2 border-t border-[#1d2738]/60 space-y-1.5">
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                Inactive ({inactiveTraits.length})
              </span>
              {inactiveTraits.map(({ trait, count }) => {
                const nextBp = trait.breakpoints[0];
                return (
                  <div
                    key={trait.id}
                    className="flex items-center justify-between p-1.5 rounded-lg bg-[#141d2b]/50 border border-slate-800/60 text-slate-400 text-xs"
                  >
                    <div className="flex items-center gap-2 opacity-70">
                      <div className="w-4 h-4 relative flex-shrink-0">
                        <Image
                          src={trait.iconUrl}
                          alt={trait.name}
                          width={16}
                          height={16}
                          className="w-full h-full object-contain grayscale"
                          unoptimized
                        />
                      </div>
                      <span className="text-[11px] font-medium">
                        {trait.name}
                      </span>
                    </div>

                    <span className="font-mono text-[11px] text-slate-500">
                      {count} / {nextBp ? nextBp.minUnits : "?"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

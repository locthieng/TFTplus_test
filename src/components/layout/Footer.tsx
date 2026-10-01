import React from "react";
import Link from "next/link";
import { CURRENT_PATCH, CURRENT_SET } from "@/constants/tft";

export function Footer() {
  return (
    <footer className="border-t border-[#1e2638] bg-[#090c12] text-slate-400 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-xs">
                T
              </div>
              <span className="font-bold text-slate-200 text-sm">
                TFT COMPANION
              </span>
              <span className="text-xs text-amber-400 font-mono px-1.5 py-0.5 bg-amber-400/10 rounded border border-amber-400/20">
                Set {CURRENT_SET} • Patch {CURRENT_PATCH}
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md text-center md:text-left">
              Independent Teamfight Tactics analytics, meta team compositions, and team builder tool.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <Link href="/team-comps" className="hover:text-amber-400 transition-colors">
              Meta Comps
            </Link>
            <Link href="/builder" className="hover:text-amber-400 transition-colors">
              Team Builder
            </Link>
            <Link href="/champions" className="hover:text-amber-400 transition-colors">
              Champions
            </Link>
            <Link href="/items" className="hover:text-amber-400 transition-colors">
              Items
            </Link>
            <Link href="/traits" className="hover:text-amber-400 transition-colors">
              Traits
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#192130] text-[11px] text-slate-600 text-center">
          TFT Companion isn’t endorsed by Riot Games and doesn’t reflect the views or opinions of Riot Games or anyone officially involved in producing or managing League of Legends or Teamfight Tactics.
        </div>
      </div>
    </footer>
  );
}

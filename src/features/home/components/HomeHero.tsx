"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PlayerSearch } from "@/components/player/PlayerSearch";
import { RiotLoginPlaceholder } from "./RiotLoginPlaceholder";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#1c2738] bg-[#0c121e]">
      {/* Background radial gradient layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.12),rgba(12,18,30,0))]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0e17]/80 to-[#0a0e17]" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 relative z-10 py-12 sm:py-16 text-center flex flex-col items-center">
        {/* Set Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-400/10 border border-amber-400/25 text-xs font-bold text-amber-400 mb-4 tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {TFT_RELEASE_CONFIG.setName} • Patch {TFT_RELEASE_CONFIG.patch}
          </span>
        </div>

        {/* Set Identity Typography */}
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-2">
          Teamfight Tactics
        </h1>
        <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-amber-400/90 mb-8">
          Top Meta Compositions, Dynamic Tier Lists & Board Builder
        </p>

        {/* Dominant Player Search */}
        <div className="w-full max-w-2xl mx-auto mb-3">
          <PlayerSearch variant="hero" />
        </div>

        {/* Popular searches */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-4">
          <span className="text-slate-500">Popular:</span>
          <Link
            href="/player/vn/Em%20Chè/DDT"
            className="text-slate-300 hover:text-amber-400 transition-colors"
          >
            Em Chè#DDT
          </Link>
          <span className="text-slate-600">•</span>
          <Link
            href="/player/kr/Hide%20on%20bush/KR1"
            className="text-slate-300 hover:text-amber-400 transition-colors"
          >
            Hide on bush#KR1
          </Link>
          <span className="text-slate-600">•</span>
          <Link
            href="/player/na/Dishsoap/NA1"
            className="text-slate-300 hover:text-amber-400 transition-colors"
          >
            Dishsoap#NA1
          </Link>
        </div>

        {/* Riot Login Placeholder */}
        <RiotLoginPlaceholder />
      </div>
    </section>
  );
}

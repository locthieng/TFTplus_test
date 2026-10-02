"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { PlayerSearch } from "@/components/player/PlayerSearch";
import { RiotLoginPlaceholder } from "./RiotLoginPlaceholder";
import { HomeHeroBackground } from "./HomeHeroBackground";
import { TFT_RELEASE_CONFIG, PROJECT_TARGET_RELEASE } from "@/config/tftConfig";

export function HomeHero() {
  return (
    <section className="relative overflow-hidden border-b border-[#1c2738] min-h-[440px] md:min-h-[500px] flex items-center justify-center">
      {/* Background artwork and atmospheric gradients */}
      <HomeHeroBackground />

      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 relative z-10 py-12 md:py-16 text-center flex flex-col items-center">
        {/* Set Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-bold text-amber-400 mb-3 tracking-widest uppercase shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            SET {TFT_RELEASE_CONFIG.setId} • {TFT_RELEASE_CONFIG.setName.toUpperCase()} • PATCH {PROJECT_TARGET_RELEASE.patch}
          </span>
        </div>

        {/* Set Identity Typography */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase mb-2 drop-shadow-md">
          Teamfight Tactics
        </h1>
        <p className="text-xs sm:text-sm font-bold tracking-widest uppercase text-amber-400/90 mb-8 max-w-xl">
          Curated Meta Compositions, Tier Lists & Tactical Builder
        </p>

        {/* Dominant Player Search */}
        <div className="w-full max-w-2xl mx-auto mb-3">
          <PlayerSearch variant="hero" />
        </div>

        {/* Popular searches */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400 mb-3">
          <span className="text-slate-500 font-medium">Popular:</span>
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

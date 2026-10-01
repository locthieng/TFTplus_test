"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Wrench,
  Users,
  Trophy,
  Search,
  ArrowRight,
  Flame,
} from "lucide-react";
import { TeamCompCard } from "@/components/team-comp/TeamCompCard";
import { MOCK_TEAM_COMPS } from "@/data/mockTftData";
import { CURRENT_PATCH, CURRENT_SET } from "@/constants/tft";
import { Button } from "@/components/common/Button";

export default function HomePage() {
  const router = useRouter();
  const [searchRiotId, setSearchRiotId] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRiotId.trim()) return;
    const cleaned = searchRiotId.trim();
    if (cleaned.includes("#")) {
      const [name, tag] = cleaned.split("#");
      router.push(`/player/vn/${encodeURIComponent(name)}/${encodeURIComponent(tag)}`);
    } else {
      router.push(`/player/vn/${encodeURIComponent(cleaned)}/VN2`);
    }
  };

  return (
    <div className="flex-1 flex flex-col space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[#1f283a] bg-gradient-to-b from-[#101622] via-[#0c1017] to-[#090c10] py-16 sm:py-24">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Set {CURRENT_SET} Into the Arcane • Patch {CURRENT_PATCH} Live</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Master the Convergence with{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
              TFT Companion
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The next-generation Teamfight Tactics companion platform. High-tier meta compositions, interactive hex team builder, dynamic trait simulator, and player statistics.
          </p>

          {/* Riot ID Search bar */}
          <div className="max-w-xl mx-auto pt-4">
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#131a26]/90 border border-[#2b394f] shadow-2xl focus-within:border-amber-400/80 focus-within:ring-2 focus-within:ring-amber-400/20 transition-all"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchRiotId}
                  onChange={(e) => setSearchRiotId(e.target.value)}
                  placeholder="Enter Riot ID (e.g. Faker#KR1 or Em Chè#DDT)"
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-sm sm:text-base text-slate-100 placeholder:text-slate-500 focus:outline-none"
                />
              </div>
              <Button type="submit" variant="primary" size="md" className="rounded-xl px-5">
                Search
              </Button>
            </form>
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-2">
              <span>Popular searches:</span>
              <button
                type="button"
                onClick={() => setSearchRiotId("Em Chè#DDT")}
                className="text-amber-400 hover:underline"
              >
                Em Chè#DDT
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchRiotId("YBY1#VN2")}
                className="text-amber-400 hover:underline"
              >
                YBY1#VN2
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setSearchRiotId("Dishsoap#NA1")}
                className="text-amber-400 hover:underline"
              >
                Dishsoap#NA1
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/team-comps"
            className="p-5 rounded-2xl bg-[#121824] border border-[#222c3d] hover:border-amber-400/60 hover:bg-[#16202e] transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-100 group-hover:text-amber-400 transition-colors block">
                Meta Compositions
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Tier lists, carry items & positioning guides
              </p>
            </div>
          </Link>

          <Link
            href="/builder"
            className="p-5 rounded-2xl bg-[#121824] border border-[#222c3d] hover:border-cyan-400/60 hover:bg-[#16202e] transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition-transform">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-100 group-hover:text-cyan-400 transition-colors block">
                Team Builder
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Hexagon board simulator & trait calculator
              </p>
            </div>
          </Link>

          <Link
            href="/champions"
            className="p-5 rounded-2xl bg-[#121824] border border-[#222c3d] hover:border-purple-400/60 hover:bg-[#16202e] transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-100 group-hover:text-purple-400 transition-colors block">
                Champions
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Detailed base stats, abilities & mana
              </p>
            </div>
          </Link>

          <Link
            href="/leaderboard"
            className="p-5 rounded-2xl bg-[#121824] border border-[#222c3d] hover:border-emerald-400/60 hover:bg-[#16202e] transition-all group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors block">
                Leaderboard
              </span>
              <p className="text-xs text-slate-400 mt-1">
                Top Challenger rankings by server
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Meta Comps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-6">
        <div className="flex items-center justify-between border-b border-[#1f283a] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-400" />
              S-Tier Meta Compositions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Highest win-rate and top-4 compositions for the current patch.
            </p>
          </div>

          <Link
            href="/team-comps"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View All Comps</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {MOCK_TEAM_COMPS.map((comp) => (
            <TeamCompCard key={comp.id} comp={comp} />
          ))}
        </div>
      </section>

      {/* Team Builder CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#141b27] via-[#101622] to-[#141b27] border border-[#232f42] p-8 sm:p-12 overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl z-10">
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full border border-cyan-400/20">
              Interactive Tool
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              Build, Theorycraft & Share Your Comps
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Place units on our 28-hex battlefield, test trait breakpoints in real-time, equip items, and generate a shareable URL to send to your friends or stream audience.
            </p>
            <div className="pt-2">
              <Link href="/builder">
                <Button variant="accent" size="md" className="gap-2">
                  <Wrench className="w-4 h-4" />
                  Launch Team Builder
                </Button>
              </Link>
            </div>
          </div>

          {/* Hex Preview Graphic */}
          <div className="flex flex-col items-center -space-y-3 opacity-90 scale-90 sm:scale-100 pointer-events-none select-none">
            <div className="flex space-x-2">
              <div className="w-12 h-14 clip-hexagon bg-amber-400/30 p-0.5">
                <div className="w-full h-full clip-hexagon bg-slate-900" />
              </div>
              <div className="w-12 h-14 clip-hexagon bg-cyan-400/30 p-0.5">
                <div className="w-full h-full clip-hexagon bg-slate-900" />
              </div>
              <div className="w-12 h-14 clip-hexagon bg-purple-400/30 p-0.5">
                <div className="w-full h-full clip-hexagon bg-slate-900" />
              </div>
            </div>
            <div className="flex space-x-2 ml-6">
              <div className="w-12 h-14 clip-hexagon bg-emerald-400/30 p-0.5">
                <div className="w-full h-full clip-hexagon bg-slate-900" />
              </div>
              <div className="w-12 h-14 clip-hexagon bg-amber-400/30 p-0.5">
                <div className="w-full h-full clip-hexagon bg-slate-900" />
              </div>
              <div className="w-12 h-14 clip-hexagon bg-rose-400/30 p-0.5">
                <div className="w-full h-full clip-hexagon bg-slate-900" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

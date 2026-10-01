"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Globe } from "lucide-react";
import { PlatformRegion, SUPPORTED_REGIONS } from "@/types/region";
import { cn } from "@/utils/cn";

export interface PlayerSearchProps {
  variant?: "hero" | "compact";
  className?: string;
  defaultRegion?: PlatformRegion;
}

export function PlayerSearch({
  variant = "compact",
  className,
  defaultRegion = "vn",
}: PlayerSearchProps) {
  const router = useRouter();
  const [region, setRegion] = useState<PlatformRegion>(defaultRegion);
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    let gameName = trimmed;
    const currentRegionConfig =
      SUPPORTED_REGIONS.find((r) => r.id === region) || SUPPORTED_REGIONS[0];
    let tagLine = currentRegionConfig.tagDefault;

    if (trimmed.includes("#")) {
      const parts = trimmed.split("#");
      gameName = parts[0].trim();
      tagLine = parts[1].trim() || tagLine;
    }

    if (!gameName) return;

    router.push(
      `/player/${region}/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
    );
  };

  if (variant === "hero") {
    return (
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex flex-col sm:flex-row items-center gap-1.5 p-1.5 rounded-lg bg-[#0e1422]/95 border border-[#1f2b40] shadow-xl focus-within:border-amber-400/80 focus-within:ring-1 focus-within:ring-amber-400/30 transition-all w-full",
          className
        )}
      >
        {/* Region select */}
        <div className="flex items-center gap-1.5 px-2.5 py-2 bg-[#131b2a] rounded border border-[#212c3f] w-full sm:w-auto">
          <Globe className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as PlatformRegion)}
            className="bg-transparent text-xs font-bold text-slate-200 uppercase focus:outline-none cursor-pointer"
          >
            {SUPPORTED_REGIONS.map((r) => (
              <option key={r.id} value={r.id} className="bg-[#131a26] text-slate-200">
                {r.id.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Input */}
        <div className="relative flex-1 flex items-center w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Riot ID (e.g. Faker#KR1 or Em Chè#DDT)"
            className="w-full pl-9 pr-3 py-2 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        {/* Search button */}
        <button
          type="submit"
          className="w-full sm:w-auto px-5 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
        >
          SEARCH
        </button>
      </form>
    );
  }

  // Compact variant for Navbar
  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-center gap-1.5 bg-[#121824] border border-[#232f42] rounded-lg p-1 transition-all focus-within:border-amber-400",
        className
      )}
    >
      <select
        value={region}
        onChange={(e) => setRegion(e.target.value as PlatformRegion)}
        className="bg-transparent text-[11px] font-bold text-slate-400 uppercase px-1 focus:outline-none cursor-pointer"
      >
        {SUPPORTED_REGIONS.map((r) => (
          <option key={r.id} value={r.id} className="bg-[#121824] text-slate-200">
            {r.id.toUpperCase()}
          </option>
        ))}
      </select>

      <div className="h-4 w-[1px] bg-[#232f42]" />

      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Riot ID (Name#Tag)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-40 lg:w-48 pl-2 pr-6 py-1 bg-transparent text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-1 text-slate-400 hover:text-amber-400 p-0.5 cursor-pointer"
          aria-label="Search"
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
}

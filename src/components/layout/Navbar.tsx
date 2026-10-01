"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Sparkles,
  Layers,
  Wrench,
  Users,
  Shield,
  Swords,
  Trophy,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { CURRENT_PATCH } from "@/constants/tft";

const NAV_ITEMS = [
  { name: "Team Comps", href: "/team-comps", icon: Sparkles },
  { name: "Builder", href: "/builder", icon: Wrench },
  { name: "Champions", href: "/champions", icon: Users },
  { name: "Traits", href: "/traits", icon: Layers },
  { name: "Items", href: "/items", icon: Swords },
  { name: "Augments", href: "/augments", icon: Shield },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Handle "GameName#TAG" search format
    const cleaned = searchQuery.trim();
    if (cleaned.includes("#")) {
      const [gameName, tag] = cleaned.split("#");
      router.push(`/player/vn/${encodeURIComponent(gameName)}/${encodeURIComponent(tag)}`);
    } else {
      router.push(`/player/vn/${encodeURIComponent(cleaned)}/VN2`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#20293a] bg-[#0c1017]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Patch */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-slate-950 text-xl tracking-tighter">T</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-wide bg-gradient-to-r from-amber-300 via-amber-100 to-white bg-clip-text text-transparent">
                  TFT COMPANION
                </span>
                <span className="text-[10px] text-amber-500/80 font-semibold tracking-widest uppercase -mt-1">
                  Meta & Tools
                </span>
              </div>
            </Link>

            <span className="hidden xl:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-md">
              Patch {CURRENT_PATCH}
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/10"
                      : "text-slate-300 hover:text-white hover:bg-[#1a2333]"
                  )}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Quick Player Search */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Riot ID (e.g. Faker#KR1)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 lg:w-60 pl-8 pr-3 py-1.5 bg-[#121824] border border-[#232f42] rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:w-68 transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#1a2333] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#20293a] bg-[#0c1017] px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <input
              type="text"
              placeholder="Search Riot ID (GameName#Tag)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#121824] border border-[#232f42] rounded-lg text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </form>

          <div className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium",
                    isActive
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      : "text-slate-300 hover:text-white hover:bg-[#1a2333]"
                  )}
                >
                  <Icon className="w-4 h-4 opacity-80" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

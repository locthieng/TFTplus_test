"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Globe, User, X } from "lucide-react";
import { CURRENT_PATCH } from "@/constants/tft";

interface UtilityHeaderProps {
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
}

export function UtilityHeader({ onToggleMobileMenu, mobileMenuOpen }: UtilityHeaderProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentLang, setCurrentLang] = useState<"EN" | "VN">("EN");

  return (
    <>
      <div className="w-full bg-[#0a0e17] border-b border-[#1c2638] text-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 flex items-center justify-between h-11">
          {/* Logo & Patch Badge */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-sm shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <span className="font-black text-slate-950 text-sm tracking-tighter">T+</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-extrabold text-sm tracking-wider text-white">
                  TFT<span className="text-amber-400">PLUS</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] text-amber-500/70 font-semibold uppercase tracking-widest">
                  PORTAL
                </span>
              </div>
            </Link>

            <span className="inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded">
              Set 18 • Patch {CURRENT_PATCH}
            </span>
          </div>

          {/* Right utility actions: Language & Login */}
          <div className="flex items-center gap-2.5">
            {/* Language toggle */}
            <div className="relative flex items-center bg-[#131b2a] border border-[#212c40] rounded px-2 py-1 text-slate-300 hover:text-white transition-colors">
              <Globe className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              <button
                type="button"
                onClick={() => setCurrentLang(currentLang === "EN" ? "VN" : "EN")}
                className="font-medium text-[11px] hover:text-amber-400 transition-colors cursor-pointer"
                title="Switch Language"
              >
                {currentLang}
              </button>
            </div>

            {/* Login button */}
            <button
              type="button"
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded transition-colors shadow-sm cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-slate-950" />
              <span>LOGIN</span>
            </button>

            {/* Mobile menu trigger */}
            {onToggleMobileMenu && (
              <button
                type="button"
                onClick={onToggleMobileMenu}
                className="lg:hidden p-1.5 rounded bg-[#131b2a] border border-[#212c40] text-slate-300 hover:text-white"
                aria-label="Toggle navigation"
              >
                <div className="w-4 h-3.5 flex flex-col justify-between">
                  <span className={`h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
                  <span className={`h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
                  <span className={`h-0.5 w-full bg-current transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
                </div>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mock Riot Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#121926] border border-[#233149] rounded-lg w-full max-w-sm p-6 shadow-2xl relative text-slate-200">
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-3">
                <span className="font-black text-red-500 text-lg">R</span>
              </div>
              <h3 className="text-base font-bold text-white mb-1">Riot Games Sign In</h3>
              <p className="text-xs text-slate-400 mb-5">
                Riot ID OAuth integration is coming in the next Live Data phase. You will be able to sync match history, favorite comps, and custom boards.
              </p>

              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded border border-slate-700 transition-colors cursor-pointer"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

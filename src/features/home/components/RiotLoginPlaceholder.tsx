"use client";

import React, { useState } from "react";
import { ShieldCheck, X } from "lucide-react";

export function RiotLoginPlaceholder() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-400">
        <span className="hidden sm:inline-block">Sync rank, match records, and personal builds:</span>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#141b2a] hover:bg-[#1a2336] text-slate-200 hover:text-white border border-[#233148] hover:border-amber-400/40 rounded text-xs font-semibold transition-all cursor-pointer shadow-xs"
        >
          <span className="w-4 h-4 rounded bg-red-600 flex items-center justify-center text-[10px] font-black text-white">
            R
          </span>
          <span>Sign in with Riot ID</span>
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#121926] border border-[#233149] rounded-lg w-full max-w-sm p-6 shadow-2xl relative text-slate-200">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Riot Sign-In Coming Soon</h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Live Riot Games OAuth integration will unlock automated match history sync, personal tier graphs, and cloud board saves in the next phase.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

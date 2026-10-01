import { CostTier, TeamCompTier, TraitTierStyle } from "@/types/tft";

export const CURRENT_SET = "13";
export const CURRENT_PATCH = "14.24";

export const COST_COLORS: Record<CostTier, { text: string; bg: string; border: string; glow: string }> = {
  1: {
    text: "text-slate-300",
    bg: "bg-slate-700/80",
    border: "border-slate-500",
    glow: "shadow-slate-500/20",
  },
  2: {
    text: "text-emerald-400",
    bg: "bg-emerald-950/80",
    border: "border-emerald-600",
    glow: "shadow-emerald-500/20",
  },
  3: {
    text: "text-sky-400",
    bg: "bg-sky-950/80",
    border: "border-sky-500",
    glow: "shadow-sky-500/20",
  },
  4: {
    text: "text-purple-400",
    bg: "bg-purple-950/80",
    border: "border-purple-500",
    glow: "shadow-purple-500/20",
  },
  5: {
    text: "text-amber-300",
    bg: "bg-amber-950/80",
    border: "border-amber-400",
    glow: "shadow-amber-400/30",
  },
  6: {
    text: "text-rose-400",
    bg: "bg-rose-950/80",
    border: "border-rose-500",
    glow: "shadow-rose-500/30",
  },
};

export const COMP_TIER_COLORS: Record<TeamCompTier, { badge: string; text: string; bg: string }> = {
  S: {
    badge: "bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-extrabold shadow-amber-500/40",
    text: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/30",
  },
  A: {
    badge: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold shadow-purple-500/40",
    text: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/30",
  },
  B: {
    badge: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold shadow-blue-500/40",
    text: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/30",
  },
  C: {
    badge: "bg-slate-600 text-slate-200 font-bold",
    text: "text-slate-400",
    bg: "bg-slate-700/20 border-slate-600/30",
  },
};

export const TRAIT_STYLE_CONFIG: Record<
  TraitTierStyle,
  { label: string; bg: string; text: string; border: string; hexagonBg: string }
> = {
  bronze: {
    label: "Bronze",
    bg: "bg-amber-900/60",
    text: "text-amber-200",
    border: "border-amber-700",
    hexagonBg: "bg-[#794628]",
  },
  silver: {
    label: "Silver",
    bg: "bg-slate-600/60",
    text: "text-slate-100",
    border: "border-slate-400",
    hexagonBg: "bg-[#8a9ba8]",
  },
  gold: {
    label: "Gold",
    bg: "bg-yellow-700/60",
    text: "text-amber-100",
    border: "border-yellow-400",
    hexagonBg: "bg-[#c89b3c]",
  },
  prismatic: {
    label: "Prismatic",
    bg: "bg-gradient-to-r from-cyan-900/80 to-purple-900/80",
    text: "text-cyan-200",
    border: "border-cyan-400",
    hexagonBg: "bg-gradient-to-tr from-cyan-400 via-indigo-400 to-pink-400",
  },
};

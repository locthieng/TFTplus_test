import { create } from "zustand";
import { BoardChampion } from "@/types/tft";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";

export interface BuilderMeta {
  carryChampionId?: string;
  heroHexCoreId?: string;
  priorityHexCoreIds: string[];
  alternativeHexCoreIds: string[];
}

export interface SavedBuild {
  id: string;
  name: string;
  createdAt: string;
  setId?: string;
  patch?: string;
  board: BoardChampion[];
  meta: BuilderMeta;
}

const STORAGE_KEY = "tftplus_saved_builds";

export function getLocalSavedBuilds(): SavedBuild[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalBuild(
  name: string,
  board: BoardChampion[],
  meta: BuilderMeta,
  setId: string = TFT_RELEASE_CONFIG.setId,
  patch: string = TFT_RELEASE_CONFIG.patch
): SavedBuild {
  const current = getLocalSavedBuilds();
  const newBuild: SavedBuild = {
    id: `build_${Date.now()}`,
    name: name.trim() || `My Build #${current.length + 1}`,
    createdAt: new Date().toISOString(),
    setId,
    patch,
    board,
    meta,
  };
  const updated = [newBuild, ...current];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
  return newBuild;
}

export function validateSavedBuildVersion(
  build: SavedBuild,
  currentSetId: string = TFT_RELEASE_CONFIG.setId
): { isCompatible: boolean; warning?: string } {
  if (build.setId && build.setId !== currentSetId) {
    return {
      isCompatible: false,
      warning: `This build was saved for Set ${build.setId}. Current active set is Set ${currentSetId}. Champions or synergies may not align.`,
    };
  }
  return { isCompatible: true };
}

export function deleteLocalBuild(id: string): SavedBuild[] {
  const current = getLocalSavedBuilds();
  const updated = current.filter((b) => b.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
  return updated;
}

interface BuilderMetaStore extends BuilderMeta {
  setCarryChampion: (id?: string) => void;
  setHeroHexCore: (id?: string) => void;
  togglePriorityHexCore: (id: string) => void;
  toggleAlternativeHexCore: (id: string) => void;
  setMeta: (meta: Partial<BuilderMeta>) => void;
  resetMeta: () => void;
}

export const useBuilderMetaStore = create<BuilderMetaStore>((set) => ({
  carryChampionId: undefined,
  heroHexCoreId: undefined,
  priorityHexCoreIds: [],
  alternativeHexCoreIds: [],

  setCarryChampion: (id) => set({ carryChampionId: id }),
  setHeroHexCore: (id) => set({ heroHexCoreId: id }),

  togglePriorityHexCore: (id) =>
    set((state) => {
      const exists = state.priorityHexCoreIds.includes(id);
      if (exists) {
        return {
          priorityHexCoreIds: state.priorityHexCoreIds.filter((x) => x !== id),
        };
      }
      if (state.priorityHexCoreIds.length >= 3) return state;
      return { priorityHexCoreIds: [...state.priorityHexCoreIds, id] };
    }),

  toggleAlternativeHexCore: (id) =>
    set((state) => {
      const exists = state.alternativeHexCoreIds.includes(id);
      if (exists) {
        return {
          alternativeHexCoreIds: state.alternativeHexCoreIds.filter(
            (x) => x !== id
          ),
        };
      }
      if (state.alternativeHexCoreIds.length >= 3) return state;
      return { alternativeHexCoreIds: [...state.alternativeHexCoreIds, id] };
    }),

  setMeta: (meta) => set((state) => ({ ...state, ...meta })),

  resetMeta: () =>
    set({
      carryChampionId: undefined,
      heroHexCoreId: undefined,
      priorityHexCoreIds: [],
      alternativeHexCoreIds: [],
    }),
}));

import { create } from "zustand";
import { BoardChampion } from "@/types/tft";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";

export interface BuilderMeta {
  carryChampionId?: string;
  heroHexCoreId?: string;
  priorityHexCoreIds: string[];
  alternativeHexCoreIds: string[];
}

export const BUILDER_SAVE_SCHEMA_VERSION = 1;

export interface SavedBuild {
  id: string;
  name: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  setId?: string;
  patch?: string;
  board: BoardChampion[];
  meta: BuilderMeta;
}

const STORAGE_KEY = "tftplus_saved_builds";

export function migrateSavedBuild(raw: unknown): SavedBuild {
  if (!raw || typeof raw !== "object") {
    throw new Error("Invalid saved build payload");
  }

  const record = raw as Record<string, unknown>;
  const rawMeta = (record.meta && typeof record.meta === "object"
    ? record.meta
    : {}) as Record<string, unknown>;

  const version = typeof record.version === "number" ? record.version : 0;
  const createdAt =
    typeof record.createdAt === "string" ? record.createdAt : new Date().toISOString();
  const updatedAt =
    typeof record.updatedAt === "string" ? record.updatedAt : createdAt;

  const id = typeof record.id === "string" ? record.id : `build_${Date.now()}`;
  const name =
    typeof record.name === "string" ? record.name : "Untitled Build";
  const setId =
    typeof record.setId === "string" ? record.setId : TFT_RELEASE_CONFIG.setId;
  const patch =
    typeof record.patch === "string" ? record.patch : TFT_RELEASE_CONFIG.patch;
  const board = Array.isArray(record.board) ? (record.board as BoardChampion[]) : [];

  const meta: BuilderMeta = {
    carryChampionId:
      typeof rawMeta.carryChampionId === "string"
        ? rawMeta.carryChampionId
        : undefined,
    heroHexCoreId:
      typeof rawMeta.heroHexCoreId === "string"
        ? rawMeta.heroHexCoreId
        : undefined,
    priorityHexCoreIds: Array.isArray(rawMeta.priorityHexCoreIds)
      ? (rawMeta.priorityHexCoreIds as string[])
      : [],
    alternativeHexCoreIds: Array.isArray(rawMeta.alternativeHexCoreIds)
      ? (rawMeta.alternativeHexCoreIds as string[])
      : [],
  };

  return {
    id,
    name,
    version: version === 0 ? BUILDER_SAVE_SCHEMA_VERSION : version,
    createdAt,
    updatedAt,
    setId,
    patch,
    board,
    meta,
  };
}

export function getLocalSavedBuilds(): SavedBuild[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((item) => migrateSavedBuild(item));
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
  const now = new Date().toISOString();
  const newBuild: SavedBuild = {
    id: `build_${Date.now()}`,
    name: name.trim() || `My Build #${current.length + 1}`,
    version: BUILDER_SAVE_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
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

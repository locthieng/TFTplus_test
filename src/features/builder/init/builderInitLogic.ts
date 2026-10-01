import { BoardChampion, Champion, Item, TeamComp } from "@/types/tft";
import { decodeBuilderSnapshot } from "../share/builderShareCodec";
import { validateBuilderSnapshotDomain } from "../validation/builderSnapshotValidator";

export interface ResolveInitialBoardInput {
  urlSnapshot?: string | null;
  currentSetComps: TeamComp[];
  championsById: ReadonlyMap<string, Champion>;
  itemsById: ReadonlyMap<string, Item>;
}

/**
 * Pure function to resolve the initial board champions for the Builder:
 * 1. Checks URL snapshot; if valid domain data, uses it.
 * 2. If no valid snapshot, falls back to the first current-set preset if available.
 * 3. Otherwise leaves the board clean and empty.
 */
export function resolveInitialBuilderBoard(
  input: ResolveInitialBoardInput
): BoardChampion[] {
  const { urlSnapshot, currentSetComps, championsById, itemsById } = input;

  // 1. Try URL snapshot
  if (urlSnapshot) {
    const decoded = decodeBuilderSnapshot(urlSnapshot);
    if (decoded && decoded.length > 0) {
      const validated = validateBuilderSnapshotDomain({
        snapshot: decoded,
        championsById,
        itemsById,
      });
      if (validated.board.length > 0) {
        return validated.board;
      }
    }
  }

  // 2. Try current set preset fallback
  if (currentSetComps.length > 0) {
    const defaultComp = currentSetComps[0];
    const rawBoard = defaultComp.champions.map((ch, idx) => ({
      championId: ch.championId,
      x: ch.position?.col ?? idx % 7,
      y: ch.position?.row ?? Math.floor(idx / 7),
      starLevel: ch.starLevel ?? 2,
      items: ch.items ?? [],
    }));
    const validated = validateBuilderSnapshotDomain({
      snapshot: rawBoard,
      championsById,
      itemsById,
    });
    if (validated.board.length > 0) {
      return validated.board;
    }
  }

  // 3. Clean empty board
  return [];
}

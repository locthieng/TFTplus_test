import { create } from "zustand";
import { BoardChampion } from "@/types/tft";
import { BUILDER_CONFIG } from "@/config/builderConfig";

interface BuilderState {
  board: BoardChampion[];
  selectedHex: { x: number; y: number } | null;
  addChampion: (championId: string, x?: number, y?: number) => void;
  removeChampion: (x: number, y: number) => void;
  moveChampion: (fromX: number, fromY: number, toX: number, toY: number) => void;
  setStarLevel: (x: number, y: number, starLevel: 1 | 2 | 3) => void;
  cycleStarLevel: (x: number, y: number) => void;
  addItemToChampion: (x: number, y: number, itemId: string) => void;
  removeItemFromChampion: (x: number, y: number, itemIndex: number) => void;
  clearBoard: () => void;
  loadSnapshot: (champions: BoardChampion[]) => void;
  selectHex: (x: number, y: number) => void;
  clearSelection: () => void;
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  board: [],
  selectedHex: null,

  addChampion: (championId: string, x?: number, y?: number) => {
    const { board } = get();

    // If specific hex coordinate provided
    if (x !== undefined && y !== undefined) {
      if (
        x < 0 ||
        x >= BUILDER_CONFIG.columns ||
        y < 0 ||
        y >= BUILDER_CONFIG.rows
      ) {
        return;
      }

      const existingIdx = board.findIndex((c) => c.x === x && c.y === y);
      if (existingIdx !== -1) {
        // Replace champion on hex
        const updated = [...board];
        updated[existingIdx] = {
          championId,
          x,
          y,
          starLevel: 2,
          items: [],
        };
        set({ board: updated });
        return;
      }

      // Check max units capacity
      if (board.length >= BUILDER_CONFIG.defaultMaxUnits) {
        return;
      }

      set({
        board: [...board, { championId, x, y, starLevel: 2, items: [] }],
      });
      return;
    }

    // Check max units capacity
    if (board.length >= BUILDER_CONFIG.defaultMaxUnits) {
      return;
    }

    // Find the first empty hex (scanning rows x cols)
    for (let r = 0; r < BUILDER_CONFIG.rows; r++) {
      for (let c = 0; c < BUILDER_CONFIG.columns; c++) {
        const isOccupied = board.some((ch) => ch.x === c && ch.y === r);
        if (!isOccupied) {
          set({
            board: [...board, { championId, x: c, y: r, starLevel: 2, items: [] }],
          });
          return;
        }
      }
    }
  },

  removeChampion: (x: number, y: number) => {
    set((state) => ({
      board: state.board.filter((c) => !(c.x === x && c.y === y)),
      selectedHex:
        state.selectedHex?.x === x && state.selectedHex?.y === y
          ? null
          : state.selectedHex,
    }));
  },

  moveChampion: (fromX: number, fromY: number, toX: number, toY: number) => {
    // Check destination bounds
    if (
      toX < 0 ||
      toX >= BUILDER_CONFIG.columns ||
      toY < 0 ||
      toY >= BUILDER_CONFIG.rows
    ) {
      return;
    }

    const { board } = get();
    const sourceChamp = board.find((c) => c.x === fromX && c.y === fromY);
    if (!sourceChamp) return;

    const targetChamp = board.find((c) => c.x === toX && c.y === toY);

    if (targetChamp) {
      // Swap positions
      const updated = board.map((c) => {
        if (c.x === fromX && c.y === fromY) {
          return { ...c, x: toX, y: toY };
        }
        if (c.x === toX && c.y === toY) {
          return { ...c, x: fromX, y: fromY };
        }
        return c;
      });
      set({ board: updated });
    } else {
      // Move to empty hex
      const updated = board.map((c) =>
        c.x === fromX && c.y === fromY ? { ...c, x: toX, y: toY } : c
      );
      set({ board: updated });
    }
  },

  setStarLevel: (x: number, y: number, starLevel: 1 | 2 | 3) => {
    set((state) => ({
      board: state.board.map((c) =>
        c.x === x && c.y === y ? { ...c, starLevel } : c
      ),
    }));
  },

  cycleStarLevel: (x: number, y: number) => {
    set((state) => ({
      board: state.board.map((c) => {
        if (c.x === x && c.y === y) {
          const next = ((c.starLevel % 3) + 1) as 1 | 2 | 3;
          return { ...c, starLevel: next };
        }
        return c;
      }),
    }));
  },

  addItemToChampion: (x: number, y: number, itemId: string) => {
    set((state) => ({
      board: state.board.map((c) => {
        if (
          c.x === x &&
          c.y === y &&
          c.items.length < BUILDER_CONFIG.maxItemsPerChampion
        ) {
          return { ...c, items: [...c.items, itemId] };
        }
        return c;
      }),
    }));
  },

  removeItemFromChampion: (x: number, y: number, itemIndex: number) => {
    set((state) => ({
      board: state.board.map((c) => {
        if (c.x === x && c.y === y) {
          const updatedItems = [...c.items];
          updatedItems.splice(itemIndex, 1);
          return { ...c, items: updatedItems };
        }
        return c;
      }),
    }));
  },

  clearBoard: () => set({ board: [], selectedHex: null }),

  loadSnapshot: (champions: BoardChampion[]) => {
    const seenCoords = new Set<string>();
    const validChampions: BoardChampion[] = [];

    for (const c of champions) {
      if (validChampions.length >= BUILDER_CONFIG.maxUnits) break;
      if (
        c.x < 0 ||
        c.x >= BUILDER_CONFIG.columns ||
        c.y < 0 ||
        c.y >= BUILDER_CONFIG.rows
      ) {
        continue;
      }
      const key = `${c.x}:${c.y}`;
      if (seenCoords.has(key)) continue;
      seenCoords.add(key);

      validChampions.push({
        championId: c.championId,
        x: c.x,
        y: c.y,
        starLevel: c.starLevel || 2,
        items: (c.items || []).slice(0, BUILDER_CONFIG.maxItemsPerChampion),
      });
    }

    set({ board: validChampions, selectedHex: null });
  },

  selectHex: (x: number, y: number) => set({ selectedHex: { x, y } }),

  clearSelection: () => set({ selectedHex: null }),
}));

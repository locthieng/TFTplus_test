import { create } from "zustand";
import { BoardChampion } from "@/types/tft";

interface BuilderState {
  board: BoardChampion[];
  selectedHex: { x: number; y: number } | null;
  addChampion: (championId: string, x?: number, y?: number) => void;
  removeChampion: (x: number, y: number) => void;
  moveChampion: (fromX: number, fromY: number, toX: number, toY: number) => void;
  setStarLevel: (x: number, y: number, starLevel: 1 | 2 | 3) => void;
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

      set({
        board: [...board, { championId, x, y, starLevel: 2, items: [] }],
      });
      return;
    }

    // Find the first empty hex (scanning 4 rows x 7 cols)
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 7; c++) {
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

  addItemToChampion: (x: number, y: number, itemId: string) => {
    set((state) => ({
      board: state.board.map((c) => {
        if (c.x === x && c.y === y && c.items.length < 3) {
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

  loadSnapshot: (champions: BoardChampion[]) =>
    set({ board: champions, selectedHex: null }),

  selectHex: (x: number, y: number) => set({ selectedHex: { x, y } }),

  clearSelection: () => set({ selectedHex: null }),
}));

import { describe, it, expect, beforeEach } from "vitest";
import { useBuilderStore } from "./useBuilderStore";
import { BUILDER_CONFIG } from "@/config/builderConfig";

describe("useBuilderStore", () => {
  beforeEach(() => {
    useBuilderStore.getState().clearBoard();
    useBuilderStore.getState().clearSelection();
  });

  it("enforces max board units limit (10 units)", () => {
    const store = useBuilderStore.getState();

    // Add 10 champions
    for (let i = 0; i < BUILDER_CONFIG.maxUnits; i++) {
      store.addChampion(`champ_${i}`);
    }

    expect(useBuilderStore.getState().board.length).toBe(10);

    // Attempting to add an 11th champion must be rejected
    store.addChampion("champ_11");
    expect(useBuilderStore.getState().board.length).toBe(10);
  });

  it("enforces max 3 items per champion", () => {
    const store = useBuilderStore.getState();
    store.addChampion("caitlyn", 0, 0);

    expect(useBuilderStore.getState().board.length).toBe(1);

    // Add 3 items
    store.addItemToChampion(0, 0, "infinity_edge");
    store.addItemToChampion(0, 0, "last_whisper");
    store.addItemToChampion(0, 0, "spear_of_shojin");

    const champ = useBuilderStore.getState().board.find((c) => c.x === 0 && c.y === 0);
    expect(champ?.items.length).toBe(3);

    // Attempt to add 4th item should be rejected
    store.addItemToChampion(0, 0, "deathblade");
    const updatedChamp = useBuilderStore.getState().board.find((c) => c.x === 0 && c.y === 0);
    expect(updatedChamp?.items.length).toBe(3);
    expect(updatedChamp?.items).not.toContain("deathblade");
  });

  it("removes an equipped item by slot index", () => {
    const store = useBuilderStore.getState();
    store.addChampion("caitlyn", 0, 0);
    store.addItemToChampion(0, 0, "infinity_edge");
    store.addItemToChampion(0, 0, "last_whisper");

    store.removeItemFromChampion(0, 0, 0);
    const champ = useBuilderStore.getState().board.find((c) => c.x === 0 && c.y === 0);
    expect(champ?.items).toEqual(["last_whisper"]);
  });

  it("moves and swaps units correctly", () => {
    const store = useBuilderStore.getState();
    store.addChampion("vi", 1, 1);
    store.addChampion("caitlyn", 2, 2);

    // Move vi to empty cell (3, 3)
    store.moveChampion(1, 1, 3, 3);
    expect(useBuilderStore.getState().board.find((c) => c.championId === "vi")?.x).toBe(3);
    expect(useBuilderStore.getState().board.find((c) => c.championId === "vi")?.y).toBe(3);

    // Swap vi (3, 3) with caitlyn (2, 2)
    store.moveChampion(3, 3, 2, 2);
    expect(useBuilderStore.getState().board.find((c) => c.championId === "vi")?.x).toBe(2);
    expect(useBuilderStore.getState().board.find((c) => c.championId === "vi")?.y).toBe(2);
    expect(useBuilderStore.getState().board.find((c) => c.championId === "caitlyn")?.x).toBe(3);
    expect(useBuilderStore.getState().board.find((c) => c.championId === "caitlyn")?.y).toBe(3);
  });

  it("cycles star level properly (1 -> 2 -> 3 -> 1)", () => {
    const store = useBuilderStore.getState();
    store.addChampion("caitlyn", 0, 0); // starts at 2
    expect(useBuilderStore.getState().board[0].starLevel).toBe(2);

    store.cycleStarLevel(0, 0);
    expect(useBuilderStore.getState().board[0].starLevel).toBe(3);

    store.cycleStarLevel(0, 0);
    expect(useBuilderStore.getState().board[0].starLevel).toBe(1);

    store.cycleStarLevel(0, 0);
    expect(useBuilderStore.getState().board[0].starLevel).toBe(2);
  });

  it("rejects placement outside board dimensions (4 rows x 7 cols)", () => {
    const store = useBuilderStore.getState();
    store.addChampion("vi", 8, 5); // out of bounds

    expect(useBuilderStore.getState().board.length).toBe(0);
  });
});

import { describe, it, expect } from "vitest";
import {
  migrateSavedBuild,
  BUILDER_SAVE_SCHEMA_VERSION,
  SavedBuild,
} from "./builderMetaStore";

describe("Saved Build Migration Tests", () => {
  it("migrates unversioned legacy build (v0) to v1 with required schema version and timestamps", () => {
    const legacyBuild = {
      id: "build_12345",
      name: "Old Void Comp",
      createdAt: "2026-09-01T12:00:00.000Z",
      board: [
        { championId: "da_18_akali_ad", x: 2, y: 3, starLevel: 2, items: [] },
      ],
      meta: {
        carryChampionId: "da_18_akali_ad",
        priorityHexCoreIds: ["p1"],
        alternativeHexCoreIds: [],
      },
    };

    const migrated = migrateSavedBuild(legacyBuild);
    expect(migrated.version).toBe(BUILDER_SAVE_SCHEMA_VERSION);
    expect(migrated.id).toBe("build_12345");
    expect(migrated.name).toBe("Old Void Comp");
    expect(migrated.createdAt).toBe("2026-09-01T12:00:00.000Z");
    expect(migrated.updatedAt).toBe("2026-09-01T12:00:00.000Z");
    expect(migrated.board.length).toBe(1);
    expect(migrated.meta.carryChampionId).toBe("da_18_akali_ad");
  });

  it("preserves v1 builds with existing versions and updated timestamps", () => {
    const v1Build: SavedBuild = {
      id: "build_v1",
      name: "Modern Build",
      version: 1,
      createdAt: "2026-10-01T10:00:00.000Z",
      updatedAt: "2026-10-02T08:00:00.000Z",
      setId: "18",
      patch: "18.3",
      board: [],
      meta: {
        priorityHexCoreIds: [],
        alternativeHexCoreIds: [],
      },
    };

    const result = migrateSavedBuild(v1Build);
    expect(result.version).toBe(1);
    expect(result.updatedAt).toBe("2026-10-02T08:00:00.000Z");
    expect(result.setId).toBe("18");
  });

  it("throws on invalid or null payloads", () => {
    expect(() => migrateSavedBuild(null)).toThrow("Invalid saved build payload");
    expect(() => migrateSavedBuild(undefined)).toThrow("Invalid saved build payload");
    expect(() => migrateSavedBuild("string")).toThrow("Invalid saved build payload");
  });
});

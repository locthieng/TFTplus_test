import { describe, it, expect } from "vitest";
import { mapRawMatchToPlayerSummary } from "./tftMatchMapper";
import matchDetailFixture from "../__fixtures__/matchDetail.json";
import { RawMatchDto, getQueueName } from "./tftMatch.types";

describe("tftMatchMapper", () => {
  it("maps participant detail into PlayerMatchSummary accurately", () => {
    const summary = mapRawMatchToPlayerSummary(
      matchDetailFixture as unknown as RawMatchDto,
      "mock-puuid-faker-kr1"
    );

    expect(summary).toBeDefined();
    expect(summary?.matchId).toBe("KR_7123456781");
    expect(summary?.placement).toBe(1);
    expect(summary?.level).toBe(9);
    expect(summary?.goldLeft).toBe(14);
    expect(summary?.units.length).toBe(2);
    expect(summary?.units[0].championApiName).toBe("TFT18_Ahri");
    expect(summary?.units[0].starLevel).toBe(2);
    expect(summary?.units[0].itemApiNames).toContain("TFT_Item_InfinityEdge");
    expect(summary?.traits.length).toBe(2);
  });

  it("returns null if PUUID is not part of the match", () => {
    const summary = mapRawMatchToPlayerSummary(
      matchDetailFixture as unknown as RawMatchDto,
      "unknown-puuid"
    );
    expect(summary).toBeNull();
  });

  describe("getQueueName", () => {
    it("maps recognized queue IDs to user-friendly names", () => {
      expect(getQueueName(1100)).toBe("Ranked TFT");
      expect(getQueueName(1090)).toBe("Normal TFT");
      expect(getQueueName(1130)).toBe("Hyper Roll");
      expect(getQueueName(1160)).toBe("Double Up");
      expect(getQueueName(1170)).toBe("Fortune's Favor");
    });

    it("handles fallback and unknown queue IDs", () => {
      expect(getQueueName(undefined)).toBe("Standard TFT");
      expect(getQueueName(9999)).toBe("Queue 9999");
    });
  });
});

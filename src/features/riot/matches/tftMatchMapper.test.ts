import { describe, it, expect } from "vitest";
import { mapRawMatchToPlayerSummary } from "./tftMatchMapper";
import matchDetailFixture from "../__fixtures__/matchDetail.json";
import { RawMatchDto } from "./tftMatch.types";

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
});

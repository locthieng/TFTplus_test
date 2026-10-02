export interface TeamCompSourceMetadata {
  sourceName: string;
  sourceUrl?: string;
  patch: string;
  setId: string;
  verifiedAt: string;
  curationType: "curated" | "statistical";
}

export const TEAM_COMP_SOURCE_METADATA: TeamCompSourceMetadata = {
  sourceName: "TFTPlus Verified Set 18 Meta Lineups",
  patch: "18.3",
  setId: "18",
  verifiedAt: "2026-10-02T09:40:00.000Z",
  curationType: "curated",
};

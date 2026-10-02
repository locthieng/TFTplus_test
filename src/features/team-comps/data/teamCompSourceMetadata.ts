import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { DataSourceMetadata } from "@/types/dataSourceMetadata";

export interface TeamCompSourceMetadata extends DataSourceMetadata {
  curationType: "curated" | "statistical";
}

export const TEAM_COMP_SOURCE_METADATA: TeamCompSourceMetadata = {
  sourceName: "Curated Set 18 Meta Compositions",
  patch: TFT_RELEASE_CONFIG.patch,
  setId: TFT_RELEASE_CONFIG.setId,
  verifiedAt: "2026-10-02T09:40:00.000Z",
  curationType: "curated",
  verificationStatus: "curated",
  sourceNotes:
    "Composition data curated from current Set 18 game data and verified against project static datasets.",
};

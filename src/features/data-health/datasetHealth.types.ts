export type HealthStatus = "healthy" | "warning" | "critical";

export type VerificationStatus = "verified" | "curated" | "unverified";

export interface DatasetHealth {
  name: string;
  itemCount: number;
  itemCountLabel?: string;
  integrityStatus: HealthStatus;
  verificationStatus: VerificationStatus;
  releaseCompatible: boolean;
  coverage?: {
    current: number;
    expected?: number;
    percentage?: number;
  };
  issues: string[];
}

export interface ChampionStatCoverage {
  total: number;
  hp: number;
  ad: number;
  armor: number;
  mr: number;
  as: number;
  mana: number;
  crit: number;
}

export interface SystemDataHealthReport {
  overallStatus: HealthStatus;
  datasets: DatasetHealth[];
  championStats: ChampionStatCoverage;
  brokenReferences: {
    brokenChampions: number;
    brokenItems: number;
    brokenTraits: number;
    brokenAugments: number;
  };
  evaluatedAt: string;
}

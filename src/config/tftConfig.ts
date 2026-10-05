import manifest from "@/generated/tft/manifest.json";

export interface ProjectTargetRelease {
  setId: string;
  setName: string;
  patch: string;
  sourceVersion: string;
  verifiedAt: string;
}

export interface TftReleaseConfig {
  setId: string;
  setName: string;
  patch: string;
  source: {
    readonly provider: string;
    readonly version: string;
  };
}

export const PROJECT_TARGET_RELEASE: ProjectTargetRelease = {
  setId: manifest.set,
  setName: manifest.name,
  patch: manifest.patch,
  sourceVersion: manifest.sourceVersion,
  verifiedAt: manifest.generatedAt,
};

export const TFT_RELEASE_CONFIG = {
  setId: "18",
  setName: "Enchanted Wilds",
  patch: "18.3",

  source: {
    provider: "communitydragon",
    version: "16.19",
  },
} as const;


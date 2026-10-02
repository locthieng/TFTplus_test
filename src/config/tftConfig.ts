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
  source: string;
}

export const PROJECT_TARGET_RELEASE: ProjectTargetRelease = {
  setId: manifest.set,
  setName: manifest.name,
  patch: manifest.patch,
  sourceVersion: manifest.sourceVersion,
  verifiedAt: manifest.generatedAt,
};

export const TFT_RELEASE_CONFIG: TftReleaseConfig = {
  setId: manifest.set,
  setName: `Set ${manifest.set} (${manifest.name})`,
  patch: manifest.patch,
  source: manifest.source,
};

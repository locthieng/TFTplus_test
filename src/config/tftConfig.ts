import manifest from "@/generated/tft/manifest.json";

export interface TftReleaseConfig {
  setId: string;
  setName: string;
  patch: string;
  source: string;
}

export const TFT_RELEASE_CONFIG: TftReleaseConfig = {
  setId: manifest.set,
  setName: `Set ${manifest.set} (${manifest.name})`,
  patch: manifest.patch,
  source: manifest.source,
};

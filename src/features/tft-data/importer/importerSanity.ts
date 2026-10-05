export interface ImporterCounts {
  championCount: number;
  traitCount: number;
  itemCount: number;
  augmentCount: number;
}

export const MIN_IMPORTER_THRESHOLDS = {
  minChampions: 70,
  minTraits: 30,
  minItems: 150,
  minAugments: 300,
} as const;

export function validateImporterCounts(counts: ImporterCounts): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (counts.championCount < MIN_IMPORTER_THRESHOLDS.minChampions) {
    errors.push(
      `Champion count is low: ${counts.championCount} < ${MIN_IMPORTER_THRESHOLDS.minChampions}`
    );
  }
  if (counts.traitCount < MIN_IMPORTER_THRESHOLDS.minTraits) {
    errors.push(
      `Trait count is low: ${counts.traitCount} < ${MIN_IMPORTER_THRESHOLDS.minTraits}`
    );
  }
  if (counts.itemCount < MIN_IMPORTER_THRESHOLDS.minItems) {
    errors.push(
      `Item count is low: ${counts.itemCount} < ${MIN_IMPORTER_THRESHOLDS.minItems}`
    );
  }
  if (counts.augmentCount < MIN_IMPORTER_THRESHOLDS.minAugments) {
    errors.push(
      `Augment count is low: ${counts.augmentCount} < ${MIN_IMPORTER_THRESHOLDS.minAugments}`
    );
  }
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function resolveCdragonSourceVersion(env: {
  CDRAGON_SOURCE_VERSION?: string;
  CDRAGON_VERSION?: string;
}): string {
  return env.CDRAGON_SOURCE_VERSION || env.CDRAGON_VERSION || "16.19";
}

export function buildManifestData(params: {
  setNumber: number;
  setName: string;
  patch: string;
  sourceVersion: string;
  counts: ImporterCounts;
  generatedAt?: string;
}) {
  return {
    set: String(params.setNumber),
    name: params.setName,
    patch: params.patch,
    championCount: params.counts.championCount,
    traitCount: params.counts.traitCount,
    itemCount: params.counts.itemCount,
    augmentCount: params.counts.augmentCount,
    generatedAt: params.generatedAt || new Date().toISOString(),
    source: "communitydragon" as const,
    sourceVersion: params.sourceVersion,
  };
}

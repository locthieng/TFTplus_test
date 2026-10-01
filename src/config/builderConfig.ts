export const BUILDER_CONFIG = {
  rows: 4,
  columns: 7,
  defaultMaxUnits: 10,
  maxUnits: 10,
  maxItemsPerChampion: 3,
} as const;

export type BuilderConfig = typeof BUILDER_CONFIG;

import { z } from "zod";
import { BUILDER_CONFIG } from "@/config/builderConfig";

export const BoardChampionSchema = z.object({
  championId: z.string().min(1),
  x: z.number().int().min(0).max(BUILDER_CONFIG.columns - 1),
  y: z.number().int().min(0).max(BUILDER_CONFIG.rows - 1),
  starLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  items: z.array(z.string()).max(BUILDER_CONFIG.maxItemsPerChampion),
});

export const BuilderSnapshotSchema = z
  .array(BoardChampionSchema)
  .max(BUILDER_CONFIG.defaultMaxUnits);

export type ValidatedBoardChampion = z.infer<typeof BoardChampionSchema>;
export type ValidatedBuilderSnapshot = z.infer<typeof BuilderSnapshotSchema>;

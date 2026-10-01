import { z } from "zod";

export const RawChampionAbilitySchema = z
  .object({
    desc: z.string().optional().default(""),
    icon: z.string().optional().nullable(),
    name: z.string().optional().default(""),
    variables: z.array(z.any()).optional().default([]),
  })
  .passthrough();

export const RawChampionSchema = z
  .object({
    apiName: z.string(),
    name: z.string(),
    cost: z.number().default(1),
    traits: z.array(z.string()).default([]),
    tileIcon: z.string().optional().nullable(),
    squareIcon: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    stats: z.record(z.string(), z.any()).optional().default({}),
    ability: RawChampionAbilitySchema.optional().nullable(),
  })
  .passthrough();

export type RawChampion = z.infer<typeof RawChampionSchema>;

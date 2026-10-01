import { z } from "zod";

export const RawTraitEffectSchema = z
  .object({
    maxUnits: z.number().optional().nullable(),
    minUnits: z.number().nullable().optional().default(1),
    style: z.number().nullable().optional().default(1),
    variables: z.record(z.string(), z.any()).optional().default({}),
  })
  .passthrough();

export const RawTraitSchema = z
  .object({
    apiName: z.string(),
    name: z.string(),
    desc: z.string().default(""),
    icon: z.string().optional().nullable(),
    effects: z.array(RawTraitEffectSchema).optional().default([]),
  })
  .passthrough();

export type RawTrait = z.infer<typeof RawTraitSchema>;

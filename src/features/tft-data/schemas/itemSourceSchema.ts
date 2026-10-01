import { z } from "zod";

export const RawItemSchema = z
  .object({
    apiName: z.string(),
    name: z.string().optional().default(""),
    desc: z.string().nullable().optional().default(""),
    icon: z.string().nullable().optional(),
    effects: z.record(z.string(), z.any()).nullable().optional().default({}),
    composition: z.array(z.string()).nullable().optional().default([]),
    from: z.array(z.any()).nullable().optional(),
    isAugment: z.boolean().nullable().optional().default(false),
    unique: z.boolean().nullable().optional().default(false),
  })
  .passthrough();

export type RawItem = z.infer<typeof RawItemSchema>;

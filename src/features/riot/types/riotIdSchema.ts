import { z } from "zod";

export const RiotIdSchema = z.object({
  gameName: z
    .string()
    .trim()
    .min(3, "Game name must be between 3 and 16 characters")
    .max(16, "Game name cannot exceed 16 characters")
    .refine((v) => !v.includes("#"), "Game name cannot contain '#'"),
  tagLine: z
    .string()
    .trim()
    .min(3, "Tag line must be between 3 and 5 characters")
    .max(5, "Tag line cannot exceed 5 characters"),
});

export type ValidatedRiotId = z.infer<typeof RiotIdSchema>;

export function parseRiotId(input: string): {
  success: boolean;
  data?: ValidatedRiotId;
  error?: string;
} {
  const trimmed = input.trim();
  if (!trimmed.includes("#")) {
    return {
      success: false,
      error: "Please enter Riot ID in Name#Tag format (e.g. Faker#KR1)",
    };
  }

  const parts = trimmed.split("#");
  if (parts.length > 2) {
    return {
      success: false,
      error: "Invalid Riot ID: multiple '#' symbols found",
    };
  }

  const gameName = parts[0].trim();
  const tagLine = parts[1].trim();

  const parseResult = RiotIdSchema.safeParse({ gameName, tagLine });
  if (!parseResult.success) {
    const issue = parseResult.error.issues?.[0];
    return {
      success: false,
      error: issue?.message || "Invalid Riot ID format",
    };
  }

  return {
    success: true,
    data: parseResult.data,
  };
}

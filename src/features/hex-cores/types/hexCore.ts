export type HexCoreTier = "hero" | "priority" | "alternative";

export interface HexCore {
  id: string;
  name: string;
  tier: HexCoreTier;
  iconUrl?: string;
  description: string;
  source?: string;
  setId?: string;
  patch?: string;
  verified: boolean;
}

export type WispCategory =
  | "champion"
  | "combat"
  | "misc"
  | "shop"
  | "gold-xp"
  | "risky"
  | "item";

export interface Wisp {
  id: string;
  name: string;
  description: string;
  category?: WispCategory;
  cost?: number;
  tier?: number;
  iconUrl?: string;
  setId: string;
  patch: string;
  source: string;
  verified: boolean;
}

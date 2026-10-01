export type CostTier = 1 | 2 | 3 | 4 | 5 | 6;

export interface ChampionAbility {
  name: string;
  description: string;
  iconUrl?: string;
  mana?: {
    starting: number;
    total: number;
  };
  stats?: Record<string, string | number>;
}

export interface Champion {
  id: string;
  apiName: string;
  name: string;
  cost: CostTier;
  imageUrl: string;
  splashUrl?: string;
  traits: string[];
  health?: number[];
  attackDamage?: number[];
  attackSpeed?: number;
  armor?: number;
  magicResist?: number;
  range?: number;
  critChance?: number;
  critDamage?: number;
  role?: string;
  ability?: ChampionAbility;
}

export type ItemType =
  | "component"
  | "completed"
  | "radiant"
  | "artifact"
  | "support"
  | "emblem";

export interface Item {
  id: string;
  apiName: string;
  name: string;
  imageUrl: string;
  description: string;
  effects?: Record<string, number | string>;
  composition?: string[]; // IDs of 2 component items if completed
  type: ItemType;
  unique?: boolean;
}

export type TraitTierStyle = "bronze" | "silver" | "gold" | "prismatic";

export interface TraitBreakpoint {
  minUnits: number;
  maxUnits?: number;
  style: TraitTierStyle;
  description?: string;
}

export interface Trait {
  id: string;
  apiName: string;
  name: string;
  iconUrl: string;
  description: string;
  breakpoints: TraitBreakpoint[];
}

export type AugmentTier = "silver" | "gold" | "prismatic";

export interface Augment {
  id: string;
  apiName: string;
  name: string;
  iconUrl: string;
  description: string;
  tier: AugmentTier;
  category?: string;
}

export type TeamCompTier = "S" | "A" | "B" | "C";

export type PlaystyleDifficulty = "Easy" | "Medium" | "Hard";

export interface TeamCompChampion {
  championId: string;
  name: string;
  cost: CostTier;
  imageUrl: string;
  starLevel?: 1 | 2 | 3;
  isCarry?: boolean;
  isTank?: boolean;
  items?: string[]; // Item IDs
  position?: {
    row: number; // 0 to 3
    col: number; // 0 to 6
  };
}

export interface TeamCompTrait {
  traitId: string;
  name: string;
  iconUrl: string;
  count: number;
  activeBreakpoint?: number;
  style: TraitTierStyle;
}

export interface TeamCompItem {
  championId: string;
  itemId: string;
}

export interface TeamComp {
  id: string;
  name: string;
  tier: TeamCompTier;
  difficulty?: PlaystyleDifficulty;
  patch: string;
  setId: string;
  champions: TeamCompChampion[];
  traits: TeamCompTrait[];
  recommendedItems: TeamCompItem[];
  augments: string[]; // Augment IDs or names
  carryChampionIds?: string[];
  coreChampionIds?: string[];
  heroHexCoreIds?: string[];
  priorityHexCoreIds?: string[];
  alternativeHexCoreIds?: string[];
  tags?: string[];
  earlyGame?: string;
  midGame?: string;
  lateGame?: string;
  description?: string;
  playstyle?: string; // e.g. "Fast 8", "Reroll 2-cost", "Slow Roll 3-cost"
  createdAt?: string;
  updatedAt?: string;
}

export interface BoardChampion {
  championId: string;
  x: number; // 0 to 6 (col)
  y: number; // 0 to 3 (row)
  starLevel: 1 | 2 | 3;
  items: string[];
}

export interface CalculatedTrait {
  trait: Trait;
  count: number;
  activeBreakpoint?: TraitBreakpoint;
  isActive: boolean;
}

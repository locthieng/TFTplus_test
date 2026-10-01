import {
  MOCK_CHAMPIONS,
  MOCK_ITEMS,
  MOCK_TRAITS,
  MOCK_AUGMENTS,
  MOCK_TEAM_COMPS,
} from "@/data/mockTftData";
import {
  Champion,
  Trait,
  Item,
  Augment,
  TeamComp,
  TeamCompTier,
  ItemType,
  AugmentTier,
} from "@/types/tft";

export class TftService {
  public static async getChampions(filters?: {
    cost?: number;
    trait?: string;
    search?: string;
  }): Promise<Champion[]> {
    let result = [...MOCK_CHAMPIONS];

    if (filters?.cost) {
      result = result.filter((c) => c.cost === filters.cost);
    }

    if (filters?.trait) {
      const traitLower = filters.trait.toLowerCase();
      result = result.filter((c) =>
        c.traits.some((t) => t.toLowerCase() === traitLower)
      );
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(searchLower));
    }

    return result.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
  }

  public static async getChampionById(id: string): Promise<Champion | null> {
    const champ = MOCK_CHAMPIONS.find((c) => c.id === id || c.apiName === id);
    return champ || null;
  }

  public static async getTraits(): Promise<Trait[]> {
    return [...MOCK_TRAITS].sort((a, b) => a.name.localeCompare(b.name));
  }

  public static async getTraitById(id: string): Promise<Trait | null> {
    const trait = MOCK_TRAITS.find((t) => t.id === id || t.apiName === id);
    return trait || null;
  }

  public static async getItems(type?: ItemType): Promise<Item[]> {
    let result = [...MOCK_ITEMS];
    if (type) {
      result = result.filter((item) => item.type === type);
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  public static async getItemById(id: string): Promise<Item | null> {
    const item = MOCK_ITEMS.find((i) => i.id === id || i.apiName === id);
    return item || null;
  }

  public static async getAugments(tier?: AugmentTier): Promise<Augment[]> {
    let result = [...MOCK_AUGMENTS];
    if (tier) {
      result = result.filter((a) => a.tier === tier);
    }
    return result.sort((a, b) => a.name.localeCompare(b.name));
  }

  public static async getTeamComps(filters?: {
    tier?: TeamCompTier;
    patch?: string;
    search?: string;
    trait?: string;
  }): Promise<TeamComp[]> {
    let result = [...MOCK_TEAM_COMPS];

    if (filters?.tier) {
      result = result.filter((c) => c.tier === filters.tier);
    }

    if (filters?.patch) {
      result = result.filter((c) => c.patch === filters.patch);
    }

    if (filters?.trait) {
      result = result.filter((c) =>
        c.traits.some((t) => t.traitId === filters.trait)
      );
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(searchLower) ||
          c.champions.some((champ) => champ.name.toLowerCase().includes(searchLower))
      );
    }

    const tierOrder: Record<TeamCompTier, number> = { S: 1, A: 2, B: 3, C: 4 };
    return result.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
  }

  public static async getTeamCompById(id: string): Promise<TeamComp | null> {
    const comp = MOCK_TEAM_COMPS.find((c) => c.id === id);
    return comp || null;
  }
}

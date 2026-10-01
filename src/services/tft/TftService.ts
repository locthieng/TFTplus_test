import { TftRepository } from "@/features/tft-data/repositories/TftRepository";
import {
  TeamCompRepository,
  TeamCompFilters,
} from "@/features/team-comps/repositories/TeamCompRepository";
import {
  Champion,
  Trait,
  Item,
  Augment,
  TeamComp,
  ItemType,
  AugmentTier,
} from "@/types/tft";

export class TftService {
  constructor(
    private readonly tftRepository: TftRepository,
    private readonly teamCompRepository: TeamCompRepository
  ) {}

  public async getChampions(filters?: {
    cost?: number;
    trait?: string;
    search?: string;
  }): Promise<Champion[]> {
    let result = await this.tftRepository.getChampions();

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

    return result;
  }

  public async getChampionById(id: string): Promise<Champion | null> {
    return this.tftRepository.getChampionById(id);
  }

  public async getTraits(): Promise<Trait[]> {
    return this.tftRepository.getTraits();
  }

  public async getTraitById(id: string): Promise<Trait | null> {
    return this.tftRepository.getTraitById(id);
  }

  public async getItems(type?: ItemType): Promise<Item[]> {
    let result = await this.tftRepository.getItems();
    if (type) {
      result = result.filter((item) => item.type === type);
    }
    return result;
  }

  public async getItemById(id: string): Promise<Item | null> {
    return this.tftRepository.getItemById(id);
  }

  public async getAugments(tier?: AugmentTier): Promise<Augment[]> {
    let result = await this.tftRepository.getAugments();
    if (tier) {
      result = result.filter((a) => a.tier === tier);
    }
    return result;
  }

  public async getAugmentById(id: string): Promise<Augment | null> {
    return this.tftRepository.getAugmentById(id);
  }

  public async getTeamComps(filters?: TeamCompFilters): Promise<TeamComp[]> {
    return this.teamCompRepository.getTeamComps(filters);
  }

  public async getTeamCompById(id: string): Promise<TeamComp | null> {
    return this.teamCompRepository.getTeamCompById(id);
  }
}

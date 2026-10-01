import { TftRepository } from "./TftRepository";
import { Champion, Trait, Item, Augment } from "@/types/tft";
import championsData from "@/generated/tft/champions.json";
import traitsData from "@/generated/tft/traits.json";
import itemsData from "@/generated/tft/items.json";
import augmentsData from "@/generated/tft/augments.json";

export class StaticTftRepository implements TftRepository {
  private readonly champions: Champion[] = championsData as unknown as Champion[];
  private readonly traits: Trait[] = traitsData as unknown as Trait[];
  private readonly items: Item[] = itemsData as unknown as Item[];
  private readonly augments: Augment[] = augmentsData as unknown as Augment[];

  private readonly championsById: Map<string, Champion> = new Map();
  private readonly traitsById: Map<string, Trait> = new Map();
  private readonly itemsById: Map<string, Item> = new Map();
  private readonly augmentsById: Map<string, Augment> = new Map();

  constructor() {
    for (const c of this.champions) {
      this.championsById.set(c.id.toLowerCase(), c);
      if (c.apiName) this.championsById.set(c.apiName.toLowerCase(), c);
      this.championsById.set(c.name.toLowerCase(), c);
    }

    for (const t of this.traits) {
      this.traitsById.set(t.id.toLowerCase(), t);
      if (t.apiName) this.traitsById.set(t.apiName.toLowerCase(), t);
      this.traitsById.set(t.name.toLowerCase(), t);
      this.traitsById.set(t.name.toLowerCase().replace(/\s+/g, ""), t);
    }

    for (const i of this.items) {
      this.itemsById.set(i.id.toLowerCase(), i);
      if (i.apiName) this.itemsById.set(i.apiName.toLowerCase(), i);
      this.itemsById.set(i.name.toLowerCase(), i);
    }

    for (const a of this.augments) {
      this.augmentsById.set(a.id.toLowerCase(), a);
      if (a.apiName) this.augmentsById.set(a.apiName.toLowerCase(), a);
      this.augmentsById.set(a.name.toLowerCase(), a);
    }
  }

  async getChampions(): Promise<Champion[]> {
    return [...this.champions].sort(
      (a, b) => a.cost - b.cost || a.name.localeCompare(b.name)
    );
  }

  async getChampionById(id: string): Promise<Champion | null> {
    const idLower = id.toLowerCase();
    return this.championsById.get(idLower) ?? null;
  }

  async getTraits(): Promise<Trait[]> {
    return [...this.traits].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getTraitById(id: string): Promise<Trait | null> {
    const idLower = id.toLowerCase().replace(/\s+/g, "");
    return (
      this.traitsById.get(idLower) ??
      this.traitsById.get(id.toLowerCase()) ??
      null
    );
  }

  async getItems(): Promise<Item[]> {
    return [...this.items];
  }

  async getItemById(id: string): Promise<Item | null> {
    const idLower = id.toLowerCase();
    return this.itemsById.get(idLower) ?? null;
  }

  async getAugments(): Promise<Augment[]> {
    return [...this.augments];
  }

  async getAugmentById(id: string): Promise<Augment | null> {
    const idLower = id.toLowerCase();
    return this.augmentsById.get(idLower) ?? null;
  }
}

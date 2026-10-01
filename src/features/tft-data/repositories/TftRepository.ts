import { Champion, Trait, Item, Augment } from "@/types/tft";

export interface TftRepository {
  getChampions(): Promise<Champion[]>;
  getChampionById(id: string): Promise<Champion | null>;
  getTraits(): Promise<Trait[]>;
  getTraitById(id: string): Promise<Trait | null>;
  getItems(): Promise<Item[]>;
  getItemById(id: string): Promise<Item | null>;
  getAugments(): Promise<Augment[]>;
  getAugmentById(id: string): Promise<Augment | null>;
}

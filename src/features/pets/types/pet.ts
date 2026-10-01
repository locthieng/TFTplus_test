export type PetRarity = "Rare" | "Epic" | "Legendary" | "Mythic";

export interface Pet {
  id: string;
  name: string;
  species: string;
  imageUrl: string;
  rarity: PetRarity;
  description: string;
}

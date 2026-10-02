export type PetRarity = "Common" | "Rare" | "Epic" | "Legendary" | "Mythic" | string;

export interface PetVariant {
  id: string;
  name: string;
  imageUrl?: string;
  rarity?: PetRarity;
}

export interface PetSpecies {
  id: string;
  name: string;
  imageUrl?: string;
  variants: PetVariant[];
  source: string;
  verified: boolean;
}

// Backwards-compatible alias for existing imports if needed
export type Pet = PetVariant & { species: string; description?: string };

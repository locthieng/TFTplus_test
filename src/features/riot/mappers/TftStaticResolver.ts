import "server-only";

import championsData from "@/generated/tft/champions.json";
import traitsData from "@/generated/tft/traits.json";
import itemsData from "@/generated/tft/items.json";
import augmentsData from "@/generated/tft/augments.json";
import { Champion, Trait, Item, Augment } from "@/types/tft";

export interface ResolveResult<T> {
  resolved: boolean;
  entity?: T;
  rawId: string;
  displayName: string;
}

export interface UnresolvedMetrics {
  champions: string[];
  items: string[];
  traits: string[];
  augments: string[];
}

function cleanRawKey(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/^tft\d*_?/i, "")
    .replace(/^da_\d*_?/i, "")
    .replace(/^tft_item_?/i, "")
    .replace(/^tft_augment_?/i, "")
    .replace(/[^a-z0-9]/g, "");
}

export class TftStaticResolver {
  private championsByExactId = new Map<string, Champion>();
  private championsByCleanKey = new Map<string, Champion>();

  private traitsByExactId = new Map<string, Trait>();
  private traitsByCleanKey = new Map<string, Trait>();

  private itemsByExactId = new Map<string, Item>();
  private itemsByCleanKey = new Map<string, Item>();

  private augmentsByExactId = new Map<string, Augment>();
  private augmentsByCleanKey = new Map<string, Augment>();

  private unresolvedChampions = new Set<string>();
  private unresolvedItems = new Set<string>();
  private unresolvedTraits = new Set<string>();
  private unresolvedAugments = new Set<string>();

  constructor() {
    this.indexChampions(championsData as unknown as Champion[]);
    this.indexTraits(traitsData as unknown as Trait[]);
    this.indexItems(itemsData as unknown as Item[]);
    this.indexAugments(augmentsData as unknown as Augment[]);
  }

  private indexChampions(champions: Champion[]) {
    for (const c of champions) {
      this.championsByExactId.set(c.id.toLowerCase(), c);
      if (c.apiName) {
        this.championsByExactId.set(c.apiName.toLowerCase(), c);
        this.championsByCleanKey.set(cleanRawKey(c.apiName), c);
      }
      this.championsByCleanKey.set(cleanRawKey(c.id), c);
      this.championsByCleanKey.set(cleanRawKey(c.name), c);
    }
  }

  private indexTraits(traits: Trait[]) {
    for (const t of traits) {
      this.traitsByExactId.set(t.id.toLowerCase(), t);
      if (t.apiName) {
        this.traitsByExactId.set(t.apiName.toLowerCase(), t);
        this.traitsByCleanKey.set(cleanRawKey(t.apiName), t);
      }
      this.traitsByCleanKey.set(cleanRawKey(t.id), t);
      this.traitsByCleanKey.set(cleanRawKey(t.name), t);
    }
  }

  private indexItems(items: Item[]) {
    for (const i of items) {
      this.itemsByExactId.set(i.id.toLowerCase(), i);
      if (i.apiName) {
        this.itemsByExactId.set(i.apiName.toLowerCase(), i);
        this.itemsByCleanKey.set(cleanRawKey(i.apiName), i);
      }
      this.itemsByCleanKey.set(cleanRawKey(i.id), i);
      this.itemsByCleanKey.set(cleanRawKey(i.name), i);
    }
  }

  private indexAugments(augments: Augment[]) {
    for (const a of augments) {
      this.augmentsByExactId.set(a.id.toLowerCase(), a);
      if (a.apiName) {
        this.augmentsByExactId.set(a.apiName.toLowerCase(), a);
        this.augmentsByCleanKey.set(cleanRawKey(a.apiName), a);
      }
      this.augmentsByCleanKey.set(cleanRawKey(a.id), a);
      this.augmentsByCleanKey.set(cleanRawKey(a.name), a);
    }
  }

  resolveChampion(characterId: string): ResolveResult<Champion> {
    const rawLower = characterId.toLowerCase();
    const exact = this.championsByExactId.get(rawLower);
    if (exact) {
      return { resolved: true, entity: exact, rawId: characterId, displayName: exact.name };
    }

    const cleaned = cleanRawKey(characterId);
    const byClean = this.championsByCleanKey.get(cleaned);
    if (byClean) {
      return { resolved: true, entity: byClean, rawId: characterId, displayName: byClean.name };
    }

    this.unresolvedChampions.add(characterId);
    const fallbackName = characterId
      .replace(/^TFT\d*_?/i, "")
      .replace(/^DA_\d*_?/i, "")
      .replace(/([A-Z])/g, " $1")
      .trim();

    return {
      resolved: false,
      rawId: characterId,
      displayName: fallbackName || characterId,
    };
  }

  resolveItem(itemApiName: string): ResolveResult<Item> {
    const rawLower = itemApiName.toLowerCase();
    const exact = this.itemsByExactId.get(rawLower);
    if (exact) {
      return { resolved: true, entity: exact, rawId: itemApiName, displayName: exact.name };
    }

    const cleaned = cleanRawKey(itemApiName);
    const byClean = this.itemsByCleanKey.get(cleaned);
    if (byClean) {
      return { resolved: true, entity: byClean, rawId: itemApiName, displayName: byClean.name };
    }

    this.unresolvedItems.add(itemApiName);
    const fallbackName = itemApiName
      .replace(/^TFT_Item_/i, "")
      .replace(/([A-Z])/g, " $1")
      .trim();

    return {
      resolved: false,
      rawId: itemApiName,
      displayName: fallbackName || itemApiName,
    };
  }

  resolveTrait(traitApiName: string): ResolveResult<Trait> {
    const rawLower = traitApiName.toLowerCase();
    const exact = this.traitsByExactId.get(rawLower);
    if (exact) {
      return { resolved: true, entity: exact, rawId: traitApiName, displayName: exact.name };
    }

    const cleaned = cleanRawKey(traitApiName);
    const byClean = this.traitsByCleanKey.get(cleaned);
    if (byClean) {
      return { resolved: true, entity: byClean, rawId: traitApiName, displayName: byClean.name };
    }

    this.unresolvedTraits.add(traitApiName);
    const fallbackName = traitApiName
      .replace(/^TFT\d*_?/i, "")
      .replace(/^DA_\d*_?/i, "")
      .replace(/([A-Z])/g, " $1")
      .trim();

    return {
      resolved: false,
      rawId: traitApiName,
      displayName: fallbackName || traitApiName,
    };
  }

  resolveAugment(augmentApiName: string): ResolveResult<Augment> {
    const rawLower = augmentApiName.toLowerCase();
    const exact = this.augmentsByExactId.get(rawLower);
    if (exact) {
      return { resolved: true, entity: exact, rawId: augmentApiName, displayName: exact.name };
    }

    const cleaned = cleanRawKey(augmentApiName);
    const byClean = this.augmentsByCleanKey.get(cleaned);
    if (byClean) {
      return { resolved: true, entity: byClean, rawId: augmentApiName, displayName: byClean.name };
    }

    this.unresolvedAugments.add(augmentApiName);
    const fallbackName = augmentApiName
      .replace(/^TFT\d*_Augment_/i, "")
      .replace(/([A-Z])/g, " $1")
      .trim();

    return {
      resolved: false,
      rawId: augmentApiName,
      displayName: fallbackName || augmentApiName,
    };
  }

  getUnresolvedMetrics(): UnresolvedMetrics {
    return {
      champions: Array.from(this.unresolvedChampions),
      items: Array.from(this.unresolvedItems),
      traits: Array.from(this.unresolvedTraits),
      augments: Array.from(this.unresolvedAugments),
    };
  }
}

export const defaultTftStaticResolver = new TftStaticResolver();

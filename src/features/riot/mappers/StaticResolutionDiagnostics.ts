export interface ResolutionMisses {
  champions: string[];
  items: string[];
  traits: string[];
  augments: string[];
}

export interface StaticResolutionReport {
  counts: {
    champions: number;
    items: number;
    traits: number;
    augments: number;
    total: number;
  };
  sampleUnknownIds: {
    champions: string[];
    items: string[];
    traits: string[];
    augments: string[];
  };
}

export class StaticResolutionDiagnostics {
  private unknownChampions = new Set<string>();
  private unknownItems = new Set<string>();
  private unknownTraits = new Set<string>();
  private unknownAugments = new Set<string>();

  recordUnknownChampion(id: string): void {
    if (id) this.unknownChampions.add(id);
  }

  recordUnknownItem(id: string): void {
    if (id) this.unknownItems.add(id);
  }

  recordUnknownTrait(id: string): void {
    if (id) this.unknownTraits.add(id);
  }

  recordUnknownAugment(id: string): void {
    if (id) this.unknownAugments.add(id);
  }

  getMisses(): ResolutionMisses {
    return {
      champions: Array.from(this.unknownChampions),
      items: Array.from(this.unknownItems),
      traits: Array.from(this.unknownTraits),
      augments: Array.from(this.unknownAugments),
    };
  }

  getReport(): StaticResolutionReport {
    const champions = Array.from(this.unknownChampions);
    const items = Array.from(this.unknownItems);
    const traits = Array.from(this.unknownTraits);
    const augments = Array.from(this.unknownAugments);

    return {
      counts: {
        champions: champions.length,
        items: items.length,
        traits: traits.length,
        augments: augments.length,
        total: champions.length + items.length + traits.length + augments.length,
      },
      sampleUnknownIds: {
        champions: champions.slice(0, 10),
        items: items.slice(0, 10),
        traits: traits.slice(0, 10),
        augments: augments.slice(0, 10),
      },
    };
  }

  reset(): void {
    this.unknownChampions.clear();
    this.unknownItems.clear();
    this.unknownTraits.clear();
    this.unknownAugments.clear();
  }
}

export const defaultStaticResolutionDiagnostics = new StaticResolutionDiagnostics();

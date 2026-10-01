"use client";

import React, { createContext, useContext, useMemo } from "react";
import { Champion, Trait, Item, TeamComp } from "@/types/tft";

export interface BuilderDataContextValue {
  champions: Champion[];
  traits: Trait[];
  items: Item[];
  teamComps: TeamComp[];
  championsById: ReadonlyMap<string, Champion>;
  traitsById: ReadonlyMap<string, Trait>;
  itemsById: ReadonlyMap<string, Item>;
}

export interface BuilderDataProviderProps {
  children: React.ReactNode;
  champions: Champion[];
  traits: Trait[];
  items: Item[];
  teamComps: TeamComp[];
}

const BuilderDataContext = createContext<BuilderDataContextValue | null>(null);

export function BuilderDataProvider({
  children,
  champions,
  traits,
  items,
  teamComps,
}: BuilderDataProviderProps) {
  const championsById = useMemo(() => {
    const map = new Map<string, Champion>();
    for (const champ of champions) {
      map.set(champ.id, champ);
      map.set(champ.id.toLowerCase(), champ);
      if (champ.apiName) {
        map.set(champ.apiName.toLowerCase(), champ);
      }
    }
    return map;
  }, [champions]);

  const traitsById = useMemo(() => {
    const map = new Map<string, Trait>();
    for (const trait of traits) {
      map.set(trait.id, trait);
      map.set(trait.id.toLowerCase(), trait);
      map.set(trait.name.toLowerCase(), trait);
      map.set(trait.name.toLowerCase().replace(/\s+/g, ""), trait);
      if (trait.apiName) {
        map.set(trait.apiName.toLowerCase(), trait);
      }
    }
    return map;
  }, [traits]);

  const itemsById = useMemo(() => {
    const map = new Map<string, Item>();
    for (const item of items) {
      map.set(item.id, item);
      map.set(item.id.toLowerCase(), item);
      if (item.apiName) {
        map.set(item.apiName.toLowerCase(), item);
      }
    }
    return map;
  }, [items]);

  const value: BuilderDataContextValue = useMemo(
    () => ({
      champions,
      traits,
      items,
      teamComps,
      championsById,
      traitsById,
      itemsById,
    }),
    [champions, traits, items, teamComps, championsById, traitsById, itemsById]
  );

  return (
    <BuilderDataContext.Provider value={value}>
      {children}
    </BuilderDataContext.Provider>
  );
}

export function useBuilderData(): BuilderDataContextValue {
  const context = useContext(BuilderDataContext);
  if (!context) {
    throw new Error("useBuilderData must be used within a BuilderDataProvider");
  }
  return context;
}

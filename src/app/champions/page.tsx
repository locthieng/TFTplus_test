import type { Metadata } from "next";
import { tftService } from "@/services/tft";
import { ChampionsClient } from "./ChampionsClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Champions Database — Set 18 Enchanted Wilds",
  description:
    "Explore all Set 18 TFT champions with stats, ability scaling, traits, costs, and meta builds.",
};

export default async function ChampionsPage() {
  const [champions, traits] = await Promise.all([
    tftService.getChampions(),
    tftService.getTraits(),
  ]);

  return (
    <ChampionsClient
      initialChampions={champions}
      initialTraits={traits}
    />
  );
}

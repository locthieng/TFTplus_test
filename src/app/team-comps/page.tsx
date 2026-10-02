import type { Metadata } from "next";
import { tftService } from "@/services/tft";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { TeamCompsClient } from "./TeamCompsClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Meta Team Comps — Set 18 Tier List",
  description:
    "Top performing team comps for TFT Set 18 Enchanted Wilds (Patch 18.3). Positioning boards, carry items, and leveling strategy.",
};

export default async function TeamCompsPage() {
  const comps = await tftService.getTeamComps({
    setId: TFT_RELEASE_CONFIG.setId,
  });

  // When no meta comps exist for the current set, avoid serializing full TFT database payload
  if (comps.length === 0) {
    return (
      <TeamCompsClient
        initialComps={[]}
        initialTraits={[]}
        initialChampions={[]}
        initialItems={[]}
        initialAugments={[]}
      />
    );
  }

  const [traits, champions, items, augments] = await Promise.all([
    tftService.getTraits(),
    tftService.getChampions(),
    tftService.getItems(),
    tftService.getAugments(),
  ]);

  return (
    <TeamCompsClient
      initialComps={comps}
      initialTraits={traits}
      initialChampions={champions}
      initialItems={items}
      initialAugments={augments}
    />
  );
}

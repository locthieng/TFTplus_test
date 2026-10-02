import type { Metadata } from "next";
import { tftService } from "@/services/tft";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { BUILDER_EQUIPPABLE_ITEM_TYPES } from "@/features/builder/rules/builderItemRules";
import { BuilderClient } from "./BuilderClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Hex Team Builder — Set 18",
  description:
    "Interactive TFT Set 18 hex grid team builder. Simulate synergies, test item combinations, calculate breakpoint bonuses, and share boards with 1-click URL.",
};

export default async function BuilderPage() {
  const [champions, traits, allItems, teamComps] = await Promise.all([
    tftService.getChampions(),
    tftService.getTraits(),
    tftService.getItems(),
    tftService.getTeamComps({ setId: TFT_RELEASE_CONFIG.setId }),
  ]);

  // Send only equippable items to Builder to reduce client payload
  const equippableItems = allItems.filter((i) =>
    BUILDER_EQUIPPABLE_ITEM_TYPES.has(i.type)
  );

  return (
    <BuilderClient
      initialChampions={champions}
      initialTraits={traits}
      initialItems={equippableItems}
      initialTeamComps={teamComps}
    />
  );
}

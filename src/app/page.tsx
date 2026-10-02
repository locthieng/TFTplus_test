import { tftService } from "@/services/tft";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { HomeClient } from "./HomeClient";

export const dynamic = "force-static";

export default async function HomePage() {
  const comps = await tftService.getTeamComps({
    setId: TFT_RELEASE_CONFIG.setId,
  });

  // When no meta comps exist for the current set, avoid serializing full TFT database payload
  if (comps.length === 0) {
    return (
      <HomeClient
        initialComps={[]}
        initialChampions={[]}
        initialTraits={[]}
        initialItems={[]}
        initialAugments={[]}
      />
    );
  }

  const [champions, traits, items, augments] = await Promise.all([
    tftService.getChampions(),
    tftService.getTraits(),
    tftService.getItems(),
    tftService.getAugments(),
  ]);

  return (
    <HomeClient
      initialComps={comps}
      initialChampions={champions}
      initialTraits={traits}
      initialItems={items}
      initialAugments={augments}
    />
  );
}

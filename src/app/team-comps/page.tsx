import { tftService } from "@/services/tft";
import { TFT_RELEASE_CONFIG } from "@/config/tftConfig";
import { TeamCompsClient } from "./TeamCompsClient";

export const dynamic = "force-static";

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
      />
    );
  }

  const [traits, champions, items] = await Promise.all([
    tftService.getTraits(),
    tftService.getChampions(),
    tftService.getItems(),
  ]);

  return (
    <TeamCompsClient
      initialComps={comps}
      initialTraits={traits}
      initialChampions={champions}
      initialItems={items}
    />
  );
}

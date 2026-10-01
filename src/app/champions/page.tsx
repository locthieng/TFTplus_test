import { tftService } from "@/services/tft";
import { ChampionsClient } from "./ChampionsClient";

export const dynamic = "force-static";

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

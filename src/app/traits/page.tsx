import { tftService } from "@/services/tft";
import { TraitsClient } from "./TraitsClient";

export const dynamic = "force-static";

export default async function TraitsPage() {
  const [traits, champions] = await Promise.all([
    tftService.getTraits(),
    tftService.getChampions(),
  ]);

  return (
    <TraitsClient
      initialTraits={traits}
      initialChampions={champions}
    />
  );
}

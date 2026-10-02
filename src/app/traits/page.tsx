import type { Metadata } from "next";
import { tftService } from "@/services/tft";
import { TraitsClient } from "./TraitsClient";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Traits & Synergies — Set 18",
  description:
    "Explore all Set 18 TFT traits, breakpoint effects, synergy bonuses, and associated champions.",
};

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

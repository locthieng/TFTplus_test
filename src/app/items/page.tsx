import type { Metadata } from "next";
import { tftService } from "@/services/tft";
import { ItemsTableView } from "@/features/items/components/ItemsTableView";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Items & Recipes — Set 18",
  description:
    "Complete TFT Set 18 item recipes, basic components, combined items, radiant equipment, and seasonal emblems.",
};

export default async function ItemsPage() {
  const items = await tftService.getItems();

  return <ItemsTableView initialItems={items} activeCategory="basic" />;
}

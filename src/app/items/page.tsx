import { tftService } from "@/services/tft";
import { ItemsTableView } from "@/features/items/components/ItemsTableView";

export const dynamic = "force-static";

export default async function ItemsPage() {
  const items = await tftService.getItems();

  return <ItemsTableView initialItems={items} activeCategory="basic" />;
}

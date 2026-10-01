import { notFound } from "next/navigation";
import { tftService } from "@/services/tft";
import { ItemsTableView } from "@/features/items/components/ItemsTableView";
import {
  ItemPageCategory,
  ITEM_PAGE_CATEGORIES,
} from "@/features/items/categories/itemCategoryMapper";

export const dynamic = "force-static";

export function generateStaticParams() {
  return ITEM_PAGE_CATEGORIES.map((c) => ({
    category: c.id,
  }));
}

export default async function ItemCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  const validCategory = ITEM_PAGE_CATEGORIES.find((c) => c.id === category);
  if (!validCategory) {
    notFound();
  }

  const items = await tftService.getItems();

  return (
    <ItemsTableView
      initialItems={items}
      activeCategory={category as ItemPageCategory}
    />
  );
}

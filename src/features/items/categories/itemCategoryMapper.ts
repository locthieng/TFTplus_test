import { Item, ItemType } from "@/types/tft";

export type ItemPageCategory =
  | "basic"
  | "combined"
  | "seasonal"
  | "radiant"
  | "artifact"
  | "support";

export const ITEM_PAGE_CATEGORIES: {
  id: ItemPageCategory;
  label: string;
  href: string;
}[] = [
  { id: "basic", label: "Basic", href: "/items/basic" },
  { id: "combined", label: "Combined", href: "/items/combined" },
  { id: "seasonal", label: "Seasonal", href: "/items/seasonal" },
  { id: "radiant", label: "Radiant", href: "/items/radiant" },
  { id: "artifact", label: "Artifact", href: "/items/artifact" },
  { id: "support", label: "Support", href: "/items/support" },
];

export function mapItemTypeToCategory(type: ItemType): ItemPageCategory {
  switch (type) {
    case "component":
      return "basic";
    case "completed":
      return "combined";
    case "emblem":
      return "seasonal";
    case "radiant":
      return "radiant";
    case "artifact":
      return "artifact";
    case "support":
      return "support";
  }
}

export function filterItemsByCategory(
  items: Item[],
  category: ItemPageCategory
): Item[] {
  return items.filter((item) => mapItemTypeToCategory(item.type) === category);
}

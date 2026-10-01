import { Item, ItemType } from "@/types/tft";

/**
 * Standard item types that can be equipped onto champions on the hex board.
 * Base components (e.g. B.F. Sword) cannot be equipped in full-item team builds.
 */
export const BUILDER_EQUIPPABLE_ITEM_TYPES = new Set<ItemType>([
  "completed",
  "artifact",
  "radiant",
  "support",
  "emblem",
]);

export const BUILDER_EQUIPPABLE_TABS: { type: ItemType; label: string }[] = [
  { type: "completed", label: "Completed" },
  { type: "artifact", label: "Artifact" },
  { type: "radiant", label: "Radiant" },
  { type: "support", label: "Support" },
  { type: "emblem", label: "Emblem" },
];

export function isBuilderEquippableItem(item: Item): boolean {
  return BUILDER_EQUIPPABLE_ITEM_TYPES.has(item.type);
}

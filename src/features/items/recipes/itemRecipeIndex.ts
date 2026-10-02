import { Item } from "@/types/tft";

/**
 * Builds a reverse index mapping component item IDs to all craftable items
 * that require that component in their recipe.
 *
 * Example:
 * 'tft_item_bfsword' -> ['tft_item_deathblade', 'tft_item_infinityedge', 'tft_item_bloodthirster', ...]
 */
export function buildItemRecipeIndex(items: Item[]): Map<string, Item[]> {
  const reverseMap = new Map<string, Item[]>();

  for (const item of items) {
    if (!item.composition || !Array.isArray(item.composition) || item.composition.length === 0) {
      continue;
    }

    for (const compId of item.composition) {
      const normalizedId = compId.toLowerCase();
      const currentList = reverseMap.get(normalizedId) || [];
      // Avoid duplicate item entries if an item uses 2 of the same component (e.g. Deathblade = BF + BF)
      if (!currentList.some((existing) => existing.id.toLowerCase() === item.id.toLowerCase())) {
        currentList.push(item);
      }
      reverseMap.set(normalizedId, currentList);
    }
  }

  return reverseMap;
}

/**
 * Returns all craftable items that use the specified component item ID.
 */
export function getCraftableItemsForComponent(
  recipeIndex: Map<string, Item[]>,
  componentId: string
): Item[] {
  return recipeIndex.get(componentId.toLowerCase()) || [];
}

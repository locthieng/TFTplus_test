import { BoardChampion, Champion, Item } from "@/types/tft";
import { BUILDER_CONFIG } from "@/config/builderConfig";
import { isBuilderEquippableItem } from "../rules/builderItemRules";

export type BuilderValidationIssueCode =
  | "UNKNOWN_CHAMPION"
  | "UNKNOWN_ITEM"
  | "INVALID_ITEM_TYPE"
  | "DUPLICATE_POSITION"
  | "OUT_OF_BOUNDS"
  | "EXCEEDS_UNIT_LIMIT"
  | "EXCEEDS_ITEM_LIMIT";

export interface BuilderValidationIssue {
  code: BuilderValidationIssueCode;
  message: string;
  championId?: string;
  itemId?: string;
  x?: number;
  y?: number;
}

export interface BuilderValidationResult {
  valid: boolean;
  board: BoardChampion[];
  issues: BuilderValidationIssue[];
}

export interface ValidateSnapshotInput {
  snapshot: BoardChampion[];
  championsById: ReadonlyMap<string, Champion>;
  itemsById: ReadonlyMap<string, Item>;
}

/**
 * Validates a builder snapshot against real TFT domain data and board rules.
 * Sanitizes unknown units, invalid positions, and excess items/units.
 */
export function validateBuilderSnapshotDomain(
  input: ValidateSnapshotInput
): BuilderValidationResult {
  const { snapshot, championsById, itemsById } = input;
  const issues: BuilderValidationIssue[] = [];
  const sanitizedBoard: BoardChampion[] = [];
  const occupiedCoords = new Set<string>();

  for (const unit of snapshot) {
    // 1. Check max board units
    if (sanitizedBoard.length >= BUILDER_CONFIG.maxUnits) {
      issues.push({
        code: "EXCEEDS_UNIT_LIMIT",
        message: `Board exceeds maximum unit limit of ${BUILDER_CONFIG.maxUnits}`,
        championId: unit.championId,
      });
      break;
    }

    // 2. Bounds check
    if (
      unit.x < 0 ||
      unit.x >= BUILDER_CONFIG.columns ||
      unit.y < 0 ||
      unit.y >= BUILDER_CONFIG.rows
    ) {
      issues.push({
        code: "OUT_OF_BOUNDS",
        message: `Champion position (${unit.x}, ${unit.y}) is out of board bounds`,
        championId: unit.championId,
        x: unit.x,
        y: unit.y,
      });
      continue;
    }

    // 3. Duplicate coordinates check
    const coordKey = `${unit.x}:${unit.y}`;
    if (occupiedCoords.has(coordKey)) {
      issues.push({
        code: "DUPLICATE_POSITION",
        message: `Duplicate unit placement at position (${unit.x}, ${unit.y})`,
        championId: unit.championId,
        x: unit.x,
        y: unit.y,
      });
      continue;
    }

    // 4. Unknown champion check
    const champ =
      championsById.get(unit.championId) ||
      championsById.get(unit.championId.toLowerCase());

    if (!champ) {
      issues.push({
        code: "UNKNOWN_CHAMPION",
        message: `Champion with ID "${unit.championId}" does not exist in the current set`,
        championId: unit.championId,
      });
      continue;
    }

    // 5. Item validation
    const validItems: string[] = [];
    for (const itemId of unit.items || []) {
      if (validItems.length >= BUILDER_CONFIG.maxItemsPerChampion) {
        issues.push({
          code: "EXCEEDS_ITEM_LIMIT",
          message: `Champion "${unit.championId}" exceeds 3 items limit`,
          championId: unit.championId,
          itemId,
        });
        break;
      }

      const item =
        itemsById.get(itemId) || itemsById.get(itemId.toLowerCase());

      if (!item) {
        issues.push({
          code: "UNKNOWN_ITEM",
          message: `Item with ID "${itemId}" does not exist in database`,
          championId: unit.championId,
          itemId,
        });
        continue;
      }

      if (!isBuilderEquippableItem(item)) {
        issues.push({
          code: "INVALID_ITEM_TYPE",
          message: `Item "${item.name}" of type "${item.type}" cannot be equipped on board champions`,
          championId: unit.championId,
          itemId,
        });
        continue;
      }

      validItems.push(itemId);
    }

    occupiedCoords.add(coordKey);
    sanitizedBoard.push({
      championId: champ.id,
      x: unit.x,
      y: unit.y,
      starLevel: unit.starLevel ?? 2,
      items: validItems,
    });
  }

  return {
    valid: issues.length === 0,
    board: sanitizedBoard,
    issues,
  };
}

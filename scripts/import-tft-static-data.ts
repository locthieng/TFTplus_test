import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { RawChampionSchema } from "../src/features/tft-data/schemas/championSourceSchema";
import { RawTraitSchema } from "../src/features/tft-data/schemas/traitSourceSchema";
import { RawItemSchema, RawItem } from "../src/features/tft-data/schemas/itemSourceSchema";
import { mapRawChampionToDomain } from "../src/features/tft-data/mappers/championMapper";
import { mapRawTraitToDomain } from "../src/features/tft-data/mappers/traitMapper";
import { mapRawItemToDomain } from "../src/features/tft-data/mappers/itemMapper";
import { mapRawAugmentToDomain } from "../src/features/tft-data/mappers/augmentMapper";
import { shouldIncludeTftItem } from "../src/features/tft-data/filters/itemFilter";
import { shouldIncludeAugment } from "../src/features/tft-data/filters/augmentFilter";
import { isCurrentSetCompatibleItem } from "../src/features/tft-data/filters/currentSetItemFilter";
import {
  validateImporterCounts,
  resolveCdragonSourceVersion,
  buildManifestData,
} from "../src/features/tft-data/importer/importerSanity";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CDRAGON_SOURCE_VERSION = resolveCdragonSourceVersion({
  CDRAGON_SOURCE_VERSION: process.env.CDRAGON_SOURCE_VERSION,
  CDRAGON_VERSION: process.env.CDRAGON_VERSION,
});
const CDRAGON_URL = `https://raw.communitydragon.org/${CDRAGON_SOURCE_VERSION}/cdragon/tft/en_us.json`;
const OUTPUT_DIR = path.resolve(__dirname, "../src/generated/tft");

const SET_NUMBER = 18;
const SET_NAME = "Enchanted Wilds";
const SET_PATCH = "18.3";

async function runImporter() {
  console.log(`\n⏳ Fetching CommunityDragon TFT static data from: ${CDRAGON_URL}...`);
  const response = await fetch(CDRAGON_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch CommunityDragon data: HTTP ${response.status}`);
  }

  const data = await response.json();
  const setDataList = Array.isArray(data.setData)
    ? data.setData
    : Object.values(data.setData || {});

  interface RawSetEntry {
    number: number;
    name: string;
    mutator: string;
    champions?: Array<{ traits?: unknown[]; cost?: number }>;
    traits?: unknown[];
    augments?: string[];
  }

  // 1. Locate Set 18
  const set18 = (setDataList as RawSetEntry[]).find((s) => s.number === SET_NUMBER);
  if (!set18) {
    throw new Error(`Could not find Set ${SET_NUMBER} data in CommunityDragon payload!`);
  }

  console.log(`✅ Loaded Set ${SET_NUMBER} (${SET_NAME}) (Mutator: ${set18.mutator})`);

  // 2. Champions (Playable champions with traits and cost >= 1)
  const rawChamps = (set18.champions || []).filter(
    (c) => c.traits && c.traits.length > 0 && typeof c.cost === "number" && c.cost >= 1
  );

  const champions = rawChamps.map((raw) => {
    const validated = RawChampionSchema.parse(raw);
    return mapRawChampionToDomain(validated);
  });

  // Sort champions by cost then name
  champions.sort((a, b) => a.cost - b.cost || a.name.localeCompare(b.name));
  console.log(`✅ Mapped ${champions.length} Set ${SET_NUMBER} champions.`);

  // 3. Traits
  const rawTraits = set18.traits || [];
  const traits = rawTraits.map((raw) => {
    const validated = RawTraitSchema.parse(raw);
    return mapRawTraitToDomain(validated);
  });

  // Sort traits by name
  traits.sort((a, b) => a.name.localeCompare(b.name));
  const currentTraitNames = new Set<string>(traits.map((t) => t.name));
  console.log(`✅ Mapped ${traits.length} Set ${SET_NUMBER} traits.`);

  // 4. Set 18 Augments set
  const set18AugmentNames = new Set<string>(set18.augments || []);

  // 5. Items and Augments filtering
  const allRawItems = (data.items || []) as unknown[];

  const seenItemNames = new Set<string>();
  const items = [];
  let skippedItemsPlaceholder = 0;
  let skippedItemsInvalid = 0;
  let skippedItemsLegacySet = 0;
  let skippedItemsDuplicate = 0;

  const seenAugmentNames = new Set<string>();
  const augments = [];
  let skippedAugmentsOldSet = 0;
  let skippedAugmentsInvalid = 0;
  let skippedAugmentsDuplicate = 0;

  for (const raw of allRawItems) {
    let validated: RawItem;
    try {
      validated = RawItemSchema.parse(raw);
    } catch {
      continue;
    }

    // Try item inclusion
    if (shouldIncludeTftItem(validated)) {
      const isSetCompatible = isCurrentSetCompatibleItem(validated, {
        setId: String(SET_NUMBER),
        currentTraitNames,
      });

      if (isSetCompatible) {
        const normalizedName = validated.name.toLowerCase().trim();
        if (!seenItemNames.has(normalizedName)) {
          seenItemNames.add(normalizedName);
          items.push(mapRawItemToDomain(validated));
        } else {
          skippedItemsDuplicate++;
        }
      } else {
        skippedItemsLegacySet++;
      }
    } else {
      if (validated.name && validated.name.startsWith("tft_")) {
        skippedItemsPlaceholder++;
      } else {
        skippedItemsInvalid++;
      }
    }

    // Try augment inclusion
    if (shouldIncludeAugment(validated, set18AugmentNames)) {
      const normalizedName = validated.name.toLowerCase().trim();
      if (!seenAugmentNames.has(normalizedName)) {
        seenAugmentNames.add(normalizedName);
        augments.push(mapRawAugmentToDomain(validated));
      } else {
        skippedAugmentsDuplicate++;
      }
    } else {
      const api = validated.apiName.toLowerCase();
      if (api.startsWith("tft13_") || api.startsWith("tft12_") || api.startsWith("tft11_")) {
        skippedAugmentsOldSet++;
      } else {
        skippedAugmentsInvalid++;
      }
    }
  }

  // Sort items and augments deterministically
  items.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name));
  augments.sort((a, b) => a.tier.localeCompare(b.tier) || a.name.localeCompare(b.name));

  // Structured logging (Phase L)
  console.log(`\n========================================`);
  console.log(`Set ${SET_NUMBER} — ${SET_NAME}`);
  console.log(`Patch: ${SET_PATCH} (Source Version: ${CDRAGON_SOURCE_VERSION})`);
  console.log(`----------------------------------------`);
  console.log(`Champions: ${champions.length}`);
  console.log(`Traits:    ${traits.length}`);
  console.log(`Items:     ${items.length}`);
  console.log(`Augments:  ${augments.length}`);
  console.log(`----------------------------------------`);
  console.log(`Skipped Items:`);
  console.log(`  - placeholder:             ${skippedItemsPlaceholder}`);
  console.log(`  - internal / unclassified: ${skippedItemsInvalid}`);
  console.log(`  - legacy / other set:      ${skippedItemsLegacySet}`);
  console.log(`  - duplicate:               ${skippedItemsDuplicate}`);
  console.log(`Skipped Augments:`);
  console.log(`  - previous-set:            ${skippedAugmentsOldSet}`);
  console.log(`  - non-set18 / invalid:     ${skippedAugmentsInvalid}`);
  console.log(`  - duplicate:               ${skippedAugmentsDuplicate}`);
  console.log(`========================================\n`);

  // 6. Sanity Checks
  const validation = validateImporterCounts({
    championCount: champions.length,
    traitCount: traits.length,
    itemCount: items.length,
    augmentCount: augments.length,
  });

  if (!validation.valid) {
    throw new Error(
      `Importer sanity validation failed:\n  - ${validation.errors.join("\n  - ")}`
    );
  }

  // 7. Write output files (Atomic write only after validation passes)
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "champions.json"),
    JSON.stringify(champions, null, 2),
    "utf-8"
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "traits.json"),
    JSON.stringify(traits, null, 2),
    "utf-8"
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "items.json"),
    JSON.stringify(items, null, 2),
    "utf-8"
  );
  fs.writeFileSync(
    path.join(OUTPUT_DIR, "augments.json"),
    JSON.stringify(augments, null, 2),
    "utf-8"
  );

  const manifest = buildManifestData({
    setNumber: SET_NUMBER,
    setName: SET_NAME,
    patch: SET_PATCH,
    sourceVersion: CDRAGON_SOURCE_VERSION,
    counts: {
      championCount: champions.length,
      traitCount: traits.length,
      itemCount: items.length,
      augmentCount: augments.length,
    },
  });

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf-8"
  );

  console.log(`🎉 Successfully generated Set ${SET_NUMBER} (${SET_NAME}) dataset in ${OUTPUT_DIR}!\n`);
}

runImporter().catch((err) => {
  console.error("❌ Importer failed:", err);
  process.exit(1);
});

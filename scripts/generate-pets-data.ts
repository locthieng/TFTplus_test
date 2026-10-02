import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PetSpecies, PetVariant } from "../src/features/pets/types/pet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawCompanionPayload {
  contentId?: string;
  itemId?: number;
  name?: string;
  loadoutsIcon?: string;
  speciesName?: string;
  rarity?: string;
}

function resolveCompanionImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const clean = path.replace(/^\/lol-game-data\/assets\//i, "").toLowerCase();
  return `https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/${clean}`;
}

async function generatePetsData() {
  console.log("Fetching CommunityDragon companion data...");
  const res = await fetch(
    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/companions.json"
  );
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);

  const rawCompanions = (await res.json()) as RawCompanionPayload[];
  const speciesMap = new Map<string, Map<string, RawCompanionPayload>>();

  for (const c of rawCompanions) {
    if (!c.speciesName || !c.name) continue;
    const sName = c.speciesName.trim();
    if (!speciesMap.has(sName)) {
      speciesMap.set(sName, new Map<string, RawCompanionPayload>());
    }
    const varMap = speciesMap.get(sName)!;
    const vName = c.name.trim();
    // Keep first variant encountered for each unique variant name (usually Tier 1 or base)
    if (!varMap.has(vName)) {
      varMap.set(vName, c);
    }
  }

  const speciesList: PetSpecies[] = [];

  for (const [speciesName, variantsMap] of speciesMap) {
    const sId = speciesName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const variants: PetVariant[] = [];
    for (const raw of variantsMap.values()) {
      const imgUrl = resolveCompanionImageUrl(raw.loadoutsIcon);
      variants.push({
        id: `pet_${raw.itemId || raw.contentId}`,
        name: raw.name ? raw.name.trim() : "Unknown Variant",
        imageUrl: imgUrl,
        rarity: raw.rarity || "Rare",
      });
    }

    variants.sort((a, b) => a.name.localeCompare(b.name));

    speciesList.push({
      id: sId,
      name: speciesName,
      imageUrl: variants[0]?.imageUrl,
      variants,
      source: "communitydragon",
      verified: true,
    });
  }

  speciesList.sort((a, b) => a.name.localeCompare(b.name));

  console.log(
    `Successfully grouped into ${speciesList.length} species with a total of ${speciesList.reduce(
      (sum, s) => sum + s.variants.length,
      0
    )} variants.`
  );

  const outPath = path.resolve(__dirname, "../src/features/pets/data/petsData.ts");
  const content = `import { PetSpecies } from "../types/pet";\n\nexport const PET_SPECIES_DATA: PetSpecies[] = ${JSON.stringify(
    speciesList,
    null,
    2
  )};\n\n// Flat variants export for backward compatibility\nexport const PETS_DATA = PET_SPECIES_DATA.flatMap((s) =>\n  s.variants.map((v) => ({\n    ...v,\n    species: s.name,\n    speciesId: s.id,\n  }))\n);\n`;

  fs.writeFileSync(outPath, content, "utf-8");
  console.log(`Saved to ${outPath}`);
}

generatePetsData().catch((err) => {
  console.error("Failed to generate pets data:", err);
  process.exit(1);
});

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cleanTftDescription, resolveCdragonImageUrl } from "../src/features/tft-data/mappers/mapperUtils";
import { Wisp } from "../src/features/wisps/types/wisp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface RawItemPayload {
  apiName: string;
  name?: string;
  desc?: string;
  icon?: string;
  effects?: Record<string, number | string>;
}

interface RawSetPayload {
  number: number;
  items?: string[];
}

async function generateWispsData() {
  console.log("Fetching CommunityDragon data...");
  const res = await fetch("https://raw.communitydragon.org/latest/cdragon/tft/en_us.json");
  if (!res.ok) throw new Error(`HTTP error ${res.status}`);

  const d = await res.json();
  const rawItems = (d.items || []) as RawItemPayload[];
  const itemMap = new Map(rawItems.map((i) => [i.apiName, i]));
  const setDataList = (Array.isArray(d.setData) ? d.setData : Object.values(d.setData || {})) as RawSetPayload[];
  const set18 = setDataList.find((s) => s.number === 18);
  if (!set18) throw new Error("Set 18 not found in CommunityDragon data");

  const rawIds = set18.items || [];
  const seenNames = new Set<string>();
  const wisps: Wisp[] = [];

  for (const id of rawIds) {
    if (!id.startsWith("DA_")) continue;
    const it = itemMap.get(id);
    if (!it || !it.name || !it.desc) continue;
    if (it.name.startsWith("TFT_") || it.apiName.includes("Upgrade") || it.apiName.includes("Prismatic")) continue;
    const n = it.name.trim();
    if (seenNames.has(n)) continue;
    seenNames.add(n);

    let desc = it.desc;
    if (it.effects) {
      for (const [k, v] of Object.entries(it.effects)) {
        if (typeof v === "number" || typeof v === "string") {
          desc = desc.replace(new RegExp(`@${k}@`, "gi"), String(v));
        }
      }
    }
    const cleanDesc = cleanTftDescription(desc);
    if (!cleanDesc) continue;

    wisps.push({
      id: it.apiName.toLowerCase(),
      name: n,
      description: cleanDesc,
      iconUrl: resolveCdragonImageUrl(it.icon),
      setId: "18",
      patch: "18.3",
      source: "communitydragon",
      verified: true,
    });
  }

  wisps.sort((a, b) => a.name.localeCompare(b.name));
  console.log(`Successfully mapped ${wisps.length} verified Set 18 Wisps.`);

  const outPath = path.resolve(__dirname, "../src/features/wisps/data/wispsData.ts");
  const content = `import { Wisp } from "../types/wisp";\n\nexport const WISPS_DATA: Wisp[] = ${JSON.stringify(
    wisps,
    null,
    2
  )};\n`;

  fs.writeFileSync(outPath, content, "utf-8");
  console.log(`Saved to ${outPath}`);
}

generateWispsData().catch((err) => {
  console.error("Failed to generate wisps data:", err);
  process.exit(1);
});

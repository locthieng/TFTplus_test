# PLAN_TFTPLUS_DATA_AUTHENTICITY_AND_VISUAL_IDENTITY.md

## Goal

Hoàn thiện 2 phần còn yếu nhất của project hiện tại:

1. **Data Authenticity**
   - Không còn dữ liệu giả / fallback số bịa.
   - Wisps đúng domain gameplay thật.
   - Hex Core chỉ hiển thị nếu có source xác minh.
   - Pet/Tactician catalog không còn placeholder.

2. **Visual Identity**
   - HomeHero có artwork/game identity mạnh.
   - Website nhìn gần một TFT data portal thật hơn.
   - Không còn cảm giác generic dark dashboard.

Sau phase này mới chuyển sang:

```text
Riot API
Player Profile thật
Match History thật
Live Leaderboard
```

---

# 1. Current Stable Foundation

Hiện tại project đã có:

```text
Next.js 16
React 19
TypeScript
Tailwind
Zustand
Zod
Vitest
Vercel Production
GitHub CI
```

Production:

```text
https://tf-tplus-test.vercel.app
```

CI hiện đang pass:

```text
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm build
```

Test hiện tại:

```text
18 test files
159 tests
159 passed
```

Build:

```text
Next.js compile success
TypeScript success
145 pages generated
```

Không rewrite architecture hiện tại.

---

# 2. Phase A — Remove Fake Champion Stats

## Problem

UI đã hiển thị:

```text
—
```

khi data thiếu.

Nhưng mapper vẫn tự tạo số giả:

```ts
const hp = raw.stats?.hp || raw.stats?.health || 650;
const ad = raw.stats?.damage || raw.stats?.attackDamage || 50;

attackSpeed: raw.stats?.attackSpeed || 0.7,
armor: raw.stats?.armor || 35,
magicResist: raw.stats?.magicResist || 35,
range: raw.stats?.range || 1,

startingMana: raw.stats?.initialMana || 0,
mana: raw.stats?.mana || 80
```

Điều này làm UI tưởng data là thật.

---

## A1. Replace `|| fallback`

Không dùng:

```ts
value || fakeDefault
```

Dùng:

```ts
value ?? undefined
```

Example:

```ts
const hp =
    raw.stats?.hp ??
    raw.stats?.health;

const ad =
    raw.stats?.damage ??
    raw.stats?.attackDamage;
```

---

## A2. Optional Domain Fields

Update `Champion`:

```ts
health?: number[];
attackDamage?: number[];

attackSpeed?: number;

armor?: number;
magicResist?: number;

range?: number;

critChance?: number;
critDamage?: number;
```

Ability mana:

```ts
mana?: {
    starting?: number;
    total?: number;
}
```

---

## A3. Star Scaling

Only calculate:

```text
1★
2★
3★
```

if base stat exists.

Example:

```ts
function buildStarScaling(base?: number): number[] | undefined {
    if (base == null) return undefined;

    return [
        base,
        Math.round(base * 1.8),
        Math.round(base * 3.24),
    ];
}
```

---

## A4. Tests

Update:

```text
mappers.test.ts
```

Required tests:

```text
missing HP -> undefined
missing AD -> undefined
missing armor -> undefined
missing mana -> undefined
0 is preserved
valid source values map correctly
```

Important:

```text
0 must not be interpreted as missing
```

---

# 3. Phase B — Champion Data Health

Add checks to generated-data tests:

```text
count champions with missing HP
count missing AD
count missing armor
count missing MR
count missing mana
```

Do not fail automatically if source legitimately lacks a field.

But output coverage:

```text
HP coverage        74 / 74
AD coverage        74 / 74
Armor coverage     74 / 74
Crit coverage       X / 74
```

Add to:

```text
/dev/data-health
```

---

# 4. Phase C — Rebuild Wisps From Real Gameplay Data

## Critical

Delete current fake/cosmetic Wisps dataset.

Current incorrect examples:

```text
River Sprite
Forest Luminary
Moonlit Wisp
Solar Spark
Coven Familiar
```

Do not preserve these just because UI exists.

---

# 4.1 Define Correct Wisp Domain

Create:

```text
src/features/wisps/types/wisp.ts
```

Target:

```ts
export interface Wisp {
    id: string;

    name: string;

    description: string;

    cost?: number;

    tier?: number;

    iconUrl?: string;

    setId: string;

    patch: string;

    source: string;

    verified: boolean;
}
```

Do NOT include:

```text
origin
cosmetic species
companion description
```

unless source proves those fields exist.

---

# 4.2 Wisp Source Strategy

Preferred order:

```text
1. CommunityDragon current Set18 data
2. Riot official Set18 source
3. Curated reference with explicit source metadata
```

Do not invent entries.

---

# 4.3 Wisp Data Pipeline

Create:

```text
src/features/wisps/data/wispSourceMetadata.ts
```

Example:

```ts
export const WISP_SOURCE_METADATA = {
    setId: "18",
    patch: "18.3",
    sourceName: "...",
    verifiedAt: "...",
};
```

If source can be imported:

```text
Raw Wisp Data
↓
Schema
↓
Mapper
↓
WISPS_DATA
```

---

# 4.4 Wisp Validation

Create:

```text
wispData.test.ts
```

Check:

```text
id unique
name not empty
description not empty
setId == current set
patch compatible
verified == true
no placeholder names
```

---

# 5. Phase D — Hide Hex Core Until Verified

## Current Problem

Hex Core data currently contains entries like:

```text
Aphelios: Moonfall
Nidalee: Primal Pounce
Unified Front
Jeweled Lotus
Cybernetic Implants
...
```

but does not have strong source verification.

---

# D1. Add Source Fields

Update `HexCore`:

```ts
interface HexCore {
    id: string;

    name: string;

    tier:
        | "hero"
        | "priority"
        | "alternative";

    iconUrl?: string;

    description: string;

    source?: string;

    setId?: string;

    patch?: string;

    verified: boolean;
}
```

---

# D2. Production Rule

If:

```ts
verified !== true
```

then:

```text
DO NOT render as real TFT data.
```

Preferred behavior:

```text
Builder hides Hex Core sections.
```

Alternative:

```text
show "Experimental / Unverified"
```

but production default should be hidden.

---

# D3. Builder Config

Add:

```ts
export const BUILDER_FEATURE_FLAGS = {
    hexCores: false,
};
```

Use this to control UI.

Later when data verified:

```ts
hexCores: true
```

---

# D4. Team Comp

If TeamComp has:

```text
heroHexCoreIds
priorityHexCoreIds
alternativeHexCoreIds
```

but feature disabled:

```text
do not render
do not break comp
```

---

# 6. Phase E — Pet/Tactician Catalog Rebuild

## Problem

Current dataset only has 8 sample pets.

Target:

```text
Species
└── Variants / Skins
```

---

# E1. New Domain

Replace flat:

```ts
interface Pet
```

with:

```ts
interface PetSpecies {
    id: string;

    name: string;

    imageUrl?: string;

    variants: PetVariant[];

    source: string;

    verified: boolean;
}

interface PetVariant {
    id: string;

    name: string;

    imageUrl?: string;

    rarity?: string;
}
```

---

# E2. Migration

Do not keep old sample data just to avoid empty UI.

If real data importer is not ready:

```text
Pet page may show:
"Catalog data is being indexed."
```

Better than fake/partial data presented as complete.

---

# E3. Pet Source

Preferred:

```text
CommunityDragon companion/tactician data
```

Pipeline:

```text
Raw companion data
↓
Group by species
↓
Map variants
↓
PetSpecies[]
```

---

# E4. Pet Routes

Current:

```text
/pet
```

Target:

```text
/pet
/pet/[speciesId]
```

List:

```text
Species image
Species name
Variant count
```

Detail:

```text
Species
All variants
Rarity
Images
```

---

# E5. Pet Tests

Add:

```text
petCatalog.test.ts
```

Check:

```text
unique species ID
unique variant ID
variant belongs to species
image URL valid/non-empty if provided
verified source
```

---

# 7. Phase F — Data Health Source Verification

Current Data Health checks mostly:

```text
count > 0
```

This is not enough.

---

# F1. Split Health Dimensions

Every dataset should expose:

```text
Coverage
Integrity
Verification
Release Compatibility
Assets
```

---

## Example

```text
Wisps

Count: 0
Coverage: Critical

Integrity: —
Verification: Critical
Release: Unknown

Overall: Critical
```

---

## Pet Example

```text
Pets

Species: 38
Variants: 210

Integrity: Healthy
Verification: Healthy
Release Compatibility: N/A

Overall: Healthy
```

---

## Hex Core Example

```text
Hex Cores

Count: 12

Integrity: Healthy
Verification: Critical
Release: Unknown

Overall: Critical
```

---

# F2. Do Not Treat Non-Empty As Healthy

Remove logic like:

```ts
WISPS_DATA.length > 0
    ? "ok"
```

Instead use:

```text
verified count
expected coverage
source metadata
```

---

# 8. Phase G — HomeHero Real Artwork

## Goal

HomeHero phải có strong game identity.

Current:

```text
gradient
radial glow
hex dot pattern
```

Target:

```text
real Set18 artwork
+
dark overlay
+
current Set identity
```

---

# G1. Artwork Source

Use only:

```text
Riot public/promotional artwork
CommunityDragon game assets
or own composition
```

Do not copy TFTPlus hero art directly.

---

# G2. Store Locally

Preferred:

```text
/public/tft/set18/
```

Example:

```text
hero.webp
logo.webp
```

Avoid relying entirely on remote hero URL.

---

# G3. HomeHeroBackground

Target structure:

```tsx
<div>
    <Image fill ... />

    <div className="dark-overlay" />

    <div className="vignette" />

    <div className="bottom-fade" />
</div>
```

---

# G4. Responsive Crop

Desktop:

```text
object-position center
```

Mobile:

```text
object-position 60% center
```

Adjust based on subject position.

---

# 9. Phase H — Hero Branding

Do not fake official branding.

Use:

```text
TEAMFIGHT TACTICS

SET 18
ENCHANTED WILDS
```

with typography inspired by game UI.

Do not copy TFTPlus logo.

---

# 10. Phase I — Team Comp Source Metadata Fix

Current source:

```text
"TFTPlus Verified Set 18 Meta Lineups"
```

is misleading.

Change to:

```text
"Curated Set 18 Meta Compositions"
```

Suggested:

```ts
export const TEAM_COMP_SOURCE_METADATA = {
    sourceName: "Curated Set 18 Meta Compositions",

    setId: TFT_RELEASE_CONFIG.setId,

    patch: TFT_RELEASE_CONFIG.patch,

    verifiedAt: "...",

    curationType: "curated",

    sourceNotes:
        "Composition data curated from current Set 18 game data and verified against project static datasets.",
};
```

---

# 11. Phase J — SEO Truthfulness

Current metadata says:

```text
Real-time meta team comps
```

but data is curated static.

Replace with:

```text
Meta team comps
```

or:

```text
Curated meta team comps
```

Do not claim:

```text
real-time
live stats
live meta
```

until Riot/statistical pipeline exists.

---

# 12. Phase K — Builder Save Schema Version

Current saved build has:

```text
id
name
createdAt
setId
patch
board
meta
```

Add:

```ts
version: number;
updatedAt: string;
```

---

# K1. Current Version

```ts
const BUILDER_SAVE_SCHEMA_VERSION = 1;
```

---

# K2. Save

```ts
{
    version: BUILDER_SAVE_SCHEMA_VERSION,

    createdAt,
    updatedAt,

    ...
}
```

---

# K3. Migration

Create:

```text
migrateSavedBuild()
```

Flow:

```text
old build
↓
detect version
↓
migrate
↓
validate
↓
load
```

---

# 13. Phase L — Update Production Audit

Current:

```text
docs/PRODUCTION_AUDIT.md
```

contains old TODOs that are already completed.

Update status:

```text
Reverse item recipe    DONE
CI workflow            DONE
GameImage              DONE
Data Health dynamic    DONE
Champion UI fallback   DONE
```

New pending:

```text
Champion mapper truthfulness
Wisps rebuild
Pet catalog
Hex Core verification
Hero artwork
```

---

# 14. Phase M — Add Source Verification Metadata

Create shared type:

```ts
interface DataSourceMetadata {
    sourceName: string;

    sourceUrl?: string;

    setId?: string;

    patch?: string;

    generatedAt?: string;

    verifiedAt: string;

    verificationStatus:
        | "verified"
        | "curated"
        | "unverified";
}
```

Use for:

```text
Team Comps
Wisps
Pets
Hex Cores
```

---

# 15. Phase N — Production Feature Flags

Create:

```text
src/config/featureFlags.ts
```

Example:

```ts
export const FEATURE_FLAGS = {
    wisps: true,
    pets: true,

    hexCores: false,

    riotLogin: false,

    liveLeaderboard: false,
};
```

This avoids exposing unfinished features.

---

# 16. Phase O — Production UI Rules

If feature is disabled:

Do not render:

```text
fake content
placeholder data
broken CTA
```

Prefer:

```text
hide navigation item
```

or:

```text
Coming Soon
```

depending UX.

---

# 17. Phase P — Tests

Add/update:

```text
championMapperTruthfulness.test.ts

wispData.test.ts

petCatalog.test.ts

hexCoreVerification.test.ts

featureFlags.test.ts

savedBuildMigration.test.ts
```

---

# 18. Phase Q — CI

Current CI is good.

Keep:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm build
```

Add optional:

```bash
pnpm data:import
```

only if importer is deterministic and does not unexpectedly mutate committed files.

---

# 19. Phase R — Production Review

After implementation:

Check:

```text
/
 /champions
 /champions/[id]
 /team-comps
 /builder
 /wisps
 /pet
 /dev/data-health
```

---

# 20. Implementation Order

Follow strictly:

```text
TASK 01
Fix ChampionMapper fake defaults

TASK 02
Update mapper tests

TASK 03
Add stat coverage to Data Health

TASK 04
Create shared DataSourceMetadata

TASK 05
Mark current Hex Core data unverified

TASK 06
Add Hex Core feature flag

TASK 07
Hide Hex Core production UI

TASK 08
Delete fake Wisp dataset

TASK 09
Find/implement verified Wisp source

TASK 10
Create Wisp source metadata

TASK 11
Add Wisp validation tests

TASK 12
Replace Pet flat model with PetSpecies + variants

TASK 13
Build Pet catalog importer/mapper

TASK 14
Create /pet/[speciesId]

TASK 15
Add Pet validation tests

TASK 16
Upgrade Data Health verification logic

TASK 17
Add real Set18 Hero artwork

TASK 18
Rebuild HomeHeroBackground

TASK 19
Tune desktop hero crop

TASK 20
Tune mobile hero crop

TASK 21
Rename Team Comp source metadata

TASK 22
Fix SEO "real-time" claim

TASK 23
Add Builder save schema version

TASK 24
Add saved build migration

TASK 25
Update PRODUCTION_AUDIT.md

TASK 26
Run pnpm lint

TASK 27
Run pnpm test

TASK 28
Run pnpm build

TASK 29
Push feature branch

TASK 30
Review Vercel Preview

TASK 31
Merge main

TASK 32
Verify Production
```

---

# 21. Acceptance Criteria

Phase complete only when:

## Champion Data

No mapper-level fake defaults:

```text
650 HP
50 AD
35 Armor
35 MR
0.7 AS
1 Range
80 Mana
```

unless source actually provides those values.

---

## Wisps

No fabricated cosmetic Wisp data.

Every Wisp:

```text
source known
verified
current-set compatible
```

---

## Hex Core

No unverified Hex Core shown as production TFT data.

---

## Pets

No 8-entry sample catalog presented as complete.

Pet catalog must:

```text
group by species
contain variants
have source metadata
```

---

## Home

Hero has:

```text
real game artwork
dark overlay
set identity
responsive crop
```

---

## Data Health

Must detect:

```text
unverified data
incomplete catalog
cross-set data
broken refs
```

not only count > 0.

---

## CI

Pass:

```text
lint
test
build
```

---

# 22. What Not To Do Yet

Do not start:

```text
Riot API
OAuth
PostgreSQL
Redis
Admin CMS
```

until this plan passes.

---

# 23. Next Phase

After this phase:

```text
PHASE LIVE TFT DATA

Riot Account API
Riot TFT League API
TFT Match API

Player Search
Player Profile
Rank
Match History
Match Detail
Live Leaderboard
```

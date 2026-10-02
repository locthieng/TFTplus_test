# Production Audit Baseline — TFTPlus

**Date:** 2026-10-02  
**Target Environment:** Production (`https://tf-tplus-test.vercel.app`)  
**Repository:** `locthieng/TFTplus_test`  
**Target Branch:** `main`  
**Active Release:** Set 18 (*Enchanted Wilds*), Patch 18.3  
**Data Source:** CommunityDragon (`sourceVersion: latest`)  

---

## 1. System Inventory & Dataset Metrics

| Dataset | Count | Status | Notes |
| :--- | :---: | :---: | :--- |
| **Champions** | 74 | Verified Authentic | Real Set 18 champions with abilities & 100% verified stats (0 mapper fake fallbacks) |
| **Traits (Origins / Classes)** | 36 | Verified Authentic | All active traits and breakpoint styling |
| **Items** | 171 | Verified Authentic | Clean Set 18 items with bidirectional recipe graph (no legacy leakage) |
| **Augments** | 345 | Verified Authentic | Silver, Gold, Prismatic tiers with numeric tier styling |
| **Team Comps** | 12 | Curated Authentic | Curated Set 18 meta compositions strictly bound to real champions, items, traits & augments |
| **Wisps** | 162 | Verified Authentic | Real Set 18 gameplay shop mechanic parsed directly from CommunityDragon Set 18 data |
| **Pets (Tacticians)** | 138 Species (939 Variants) | Verified Authentic | Complete CommunityDragon companion catalog with species & variant hierarchy |
| **Hex Cores** | 12 | Unverified (Disabled) | Explicitly marked unverified; disabled in production via feature flags |

---

## 2. Route Audit Matrix

| Route | Type | Render Target | Audit Status | Quality Notes |
| :--- | :---: | :---: | :---: | :--- |
| `/` | Static | Home Portal | **PASS** | Authentic Set 18 key art hero, dark overlay, responsive crop, dominant search, quick links |
| `/team-comps` | Static | Comps List | **PASS** | Curated Set 18 meta comps, dense rows, carry highlights, augment badges |
| `/team-comps/[id]` | SSG (12) | Comp Detail | **PASS** | Leveling curve, board positioning, traits, carry item builds |
| `/builder` | Static | Team Builder | **PASS** | Hex board, synergies, snapshot sharing, schema v1 versioning & migration |
| `/leaderboard` | Static | Leaderboard | **PASS** | Leaderboard table (ready for live Riot API phase) |
| `/champions` | Static | Champion Grid | **PASS** | Dense 6-column portrait grid with GameImage fallbacks |
| `/champions/[id]` | SSG (74) | Champion Detail | **PASS** | Truthful stats (no fake fallbacks), synergies, ability, related meta comps |
| `/traits` | Static | Origins/Classes | **PASS** | Dense 3-column cards with unit avatars |
| `/traits/[id]` | SSG (36) | Trait Detail | **PASS** | Synergy details and champion roster |
| `/items/basic` | SSG | Basic Items | **PASS** | "Combined Into" recipe column showing craftable completed items |
| `/items/combined` | SSG | Combined Items | **PASS** | Recipe components display with craftable pairings |
| `/items/seasonal` | SSG | Seasonal/Emblems| **PASS** | Set 18 emblems verified against active traits |
| `/items/radiant` | SSG | Radiant Items | **PASS** | Radiant variants |
| `/items/artifact` | SSG | Artifact Items | **PASS** | Ornn & special artifacts |
| `/items/support` | SSG | Support Items | **PASS** | Support equipment |
| `/augments/1` | SSG | Tier 1 (Silver) | **PASS** | Table view with normalized tier labels |
| `/augments/2` | SSG | Tier 2 (Gold) | **PASS** | Table view with normalized tier labels |
| `/augments/3` | SSG | Tier 3 (Prism) | **PASS** | Table view with normalized tier labels |
| `/wisps` | Static | Wisps Catalog | **PASS** | 162 verified Set 18 shop mechanic wisps with authentic in-game effects |
| `/pet` | Static | Pets Catalog | **PASS** | 138 Little Legend species with variant counts |
| `/pet/[speciesId]` | SSG (138) | Species Detail | **PASS** | Full skin variants list with rarity badges and CDN artwork |
| `/report-bug` | Static | Bug Report | **PASS** | Form with clipboard & mailto |
| `/dev/data-health`| Dynamic| Health Monitor | **PASS** | Multi-dimensional provenance, stat coverage (HP/AD/Armor/MR/AS/Mana), relational checks |

---

## 3. Implemented Hardening & Modernizations

1. **Champion Mapper Truthfulness (Phase A & B):**
   - Eliminated mapper-level hardcoded stat defaults (`650`, `50`, `35`, `0.7`, `80`). Missing stats resolve to `undefined` and render truthful `—` placeholders in UI.
   - Verified that all 74 playable Set 18 champions in CommunityDragon genuinely have 100% coverage for HP, AD, Armor, MR, AS, and Mana.
   - Crit is truthfully audited as 0/74 (unfabricated) without breaking domain contracts.
2. **Wisps Domain Rebuild (Phase C):**
   - Removed cosmetic/fabricated wisps (`River Sprite`, `Forest Luminary`, etc.).
   - Parsed 162 authentic Set 18 shop mechanics directly from CommunityDragon Set 18 dataset (`DA_18_...`).
   - Attached authentic tooltips, effect interpolations, and Set 18 provenance metadata.
3. **Hex Core Verification & Feature Flag (Phase D & N):**
   - Tagged all speculative hex cores with `verified: false` and `curated-speculative` source.
   - Added production feature flag `FEATURE_FLAGS.hexCores: false` and hid hex cores from production builder UI until verified.
4. **Pet & Tactician Catalog Rebuild (Phase E):**
   - Replaced flat 8-pet sample with hierarchical `PetSpecies` and `PetVariant` models.
   - Indexed all 138 species and 939 variants from CommunityDragon companion dataset.
   - Built dynamic SSG route `/pet/[speciesId]` rendering all skin variants and rarity badges.
5. **HomeHero Artwork & Visual Identity (Phase G & H):**
   - Replaced procedural-only background with authentic Set 18 Enchanted Wilds key art (`/public/tft/set18/hero.webp`).
   - Added dark overlay, atmospheric radial glows, vignette, and mobile-optimized crop (`object-[60%_center]`).
   - Standardized hero branding to Set 18 Enchanted Wilds game UI typography.
6. **Data Health & Provenance Dashboard (Phase F):**
   - Split dataset health into multi-dimensional audits: Coverage, Relational Integrity, Verification Status, and Release Compatibility.
   - Added champion stat coverage breakdown dashboard.
7. **Team Comp Source Metadata & SEO Truthfulness (Phase I & J):**
   - Renamed team comp provenance to "Curated Set 18 Meta Compositions" with explicit curation notes.
   - Replaced misleading "real-time" SEO descriptions with truthful "curated" meta comp phrasing.
8. **Builder Save Versioning & Migration (Phase K):**
   - Added `BUILDER_SAVE_SCHEMA_VERSION = 1`, `updatedAt` timestamps, and `migrateSavedBuild()` pipeline.
   - Preserved cross-set compatibility warnings.
9. **CI & Automated Verification (Phase P & Q):**
   - Test suites expanded to 23 test files covering mappers, feature flags, saved build migrations, wisp data, and pet catalog integrity.

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
| **Champions** | 74 | Verified | Complete Set 18 champions with abilities & base stats |
| **Traits (Origins / Classes)** | 36 | Verified | All active traits and breakpoint styling |
| **Items** | 171 | Verified | Clean Set 18 items (no legacy item leakage) |
| **Augments** | 345 | Verified | Silver, Gold, Prismatic tiers |
| **Team Comps** | 12 | Curated | Authentic Set 18 comps (need augment IDs normalization) |
| **Wisps** | 8 | Pending Parity | Need verified game spirits / tactician data |
| **Pets (Little Legends)** | 8 | Pending Parity | Catalog needs expansion to species & variants |
| **Hex Cores** | 12 | Unverified | Needs experimental labeling or verification |

---

## 2. Route Audit Matrix

| Route | Type | Render Target | Audit Status | Quality Notes |
| :--- | :---: | :---: | :---: | :--- |
| `/` | Static | Home Portal | **PASS** | Has Hero, dominant search, filter bar, dense rows |
| `/team-comps` | Static | Comps List | **PASS** | Dense TeamCompRows, filter bar |
| `/team-comps/[id]` | SSG (12) | Comp Detail | **PASS** | Leveling curve, board positioning, traits |
| `/builder` | Static | Team Builder | **PASS** | Hex board, synergies, snapshot sharing |
| `/leaderboard` | Static | Leaderboard | **PASS** | Leaderboard table |
| `/champions` | Static | Champion Grid | **PASS** | Dense 6-column portrait grid |
| `/champions/[id]` | SSG (74) | Champion Detail | **PASS** | Stats, synergies, ability, related meta comps |
| `/traits` | Static | Origins/Classes | **PASS** | Dense 3-column cards with unit avatars |
| `/traits/[id]` | SSG (36) | Trait Detail | **PASS** | Synergy details and champion roster |
| `/items/basic` | SSG | Basic Items | **PASS** | Needs "Combined Into" recipe column |
| `/items/combined` | SSG | Combined Items | **PASS** | Recipe components display |
| `/items/seasonal` | SSG | Seasonal/Emblems| **PASS** | Set 18 emblems |
| `/items/radiant` | SSG | Radiant Items | **PASS** | Radiant variants |
| `/items/artifact` | SSG | Artifact Items | **PASS** | Ornn & special artifacts |
| `/items/support` | SSG | Support Items | **PASS** | Support equipment |
| `/augments/1` | SSG | Tier 1 (Silver) | **PASS** | Table view |
| `/augments/2` | SSG | Tier 2 (Gold) | **PASS** | Table view |
| `/augments/3` | SSG | Tier 3 (Prism) | **PASS** | Table view |
| `/wisps` | Static | Wisps Catalog | **PASS** | Catalog table |
| `/pet` | Static | Pets Catalog | **PASS** | Little Legends catalog |
| `/report-bug` | Static | Bug Report | **PASS** | Form with clipboard & mailto |
| `/dev/data-health`| Dynamic| Health Monitor | **PASS** | Relational integrity verification |

---

## 3. Identified Gaps & Remediation Plan

1. **Item Page Correctness (Phase G):**
   - Implement `buildItemRecipeIndex(items)` to map component items to their combined recipe outputs.
   - For `/items/basic`, display the "Combined Into" column showing what completed items can be crafted from that component.
2. **Team Comp Data Integrity & Source Strategy (Phase D & E):**
   - Add `teamCompSourceMetadata.ts` documenting curation source, patch, and verification date.
   - Replace free-text augment names with verified `augmentIds` (and fallback names) in `set18TeamComps.ts`.
   - Add strict augment and core integrity checks in test suites.
3. **Champion Data Truthfulness (Phase I):**
   - Remove hardcoded fallback stats (`?? 25`, `?? 140`, `?? 30`) and display truth values or `—` when source metadata is not present.
4. **Image Reliability (Phase P):**
   - Create reusable `GameImage` component with automatic local placeholder fallback on remote 404/load error.
5. **Builder & Hex Cores Verification (Phase L & M):**
   - Label unverified Hex Cores as `Curated / Tactical Preset`.
   - Store `setId` and `patch` in saved builder models in localStorage; show warning if loading cross-set builds.
6. **Data Health Dashboard Upgrade (Phase N):**
   - Make `/dev/data-health` calculate dynamic health statuses (`Healthy`, `Warning`, `Critical`) based on actual verification metrics rather than static badge.
7. **Production CI & Deployment Safety (Phase U & T):**
   - Add GitHub Actions CI workflow (`.github/workflows/ci.yml`) to enforce frozen-lockfile, lint, test, and build checks before merge.

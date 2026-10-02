# PLAN_TFTPLUS_PRODUCTION_PARITY_AND_DATA_SYNC.md

## Goal

Tiếp tục phát triển website production:

`https://tf-tplus-test.vercel.app`

theo hướng:

- Production-ready
- Visual parity tốt hơn với TFTPlus reference
- Data coverage đầy đủ hơn
- Data source đáng tin
- Không còn mock/fake domain data
- Mỗi push `main` → Vercel tự deploy

Phase này ưu tiên:
1. Xác minh current TFT release/source
2. Home visual parity
3. Team Comp data parity
4. Items / Augments parity
5. Builder verified data
6. Wisps / Pet đúng domain
7. Production QA
8. Responsive
9. Performance
10. CI / deployment safety

Chưa ưu tiên PostgreSQL / Redis / Riot OAuth / live match history cho tới khi production site có visual/data parity ổn định.

---

# 1. Current Production State

Production:
`https://tf-tplus-test.vercel.app`

Repository:
`locthieng/TFTplus_test`

Branch:
`main`

Deployment flow:
`GitHub push → Vercel automatic build → Production`

Current app manifest:
- Set 18
- Enchanted Wilds
- Patch 18.3
- Champions: 74
- Traits: 36
- Items: 171
- Augments: 345

---

# 2. Critical Rule — Verify Release Before Syncing Reference

Không được rewrite project data chỉ vì TFTPlus reference đang hiển thị một set/patch khác.

Trước mỗi lần sync meta/data cần so sánh:
- Project manifest
- CommunityDragon
- Riot official patch/set
- TFTPlus reference website

Tạo một source of truth duy nhất:

```ts
interface ProjectTargetRelease {
  setId: string;
  setName: string;
  patch: string;
  sourceVersion: string;
  verifiedAt: string;
}
```

Không bao giờ trộn:
- champion Set A
- comp Set B
- augment Set C

---

# 3. Phase A — Production Audit Baseline

Tạo:

`docs/PRODUCTION_AUDIT.md`

Ghi:
- Production URL
- Current commit
- Current Set/Patch
- Build status
- Known visual gaps
- Known data gaps
- Broken routes
- Missing images

Audit các route:
- `/`
- `/team-comps`
- `/builder`
- `/leaderboard`
- `/champions`
- `/traits`
- `/items/basic`
- `/items/combined`
- `/items/seasonal`
- `/items/radiant`
- `/items/artifact`
- `/items/support`
- `/augments/1`
- `/augments/2`
- `/augments/3`
- `/wisps`
- `/pet`
- `/report-bug`

Mỗi route phải không có:
- 404
- 500
- hydration error
- console crash
- broken image

---

# 4. Phase B — Home Visual Parity Final Pass

Home target composition:

```text
Utility Header
Main Navigation
Hero Artwork
Set Identity
Player Search
Login CTA placeholder
Meta Filter Bar
Dense Team Comp Rows
```

## Hero

Tạo component `HomeHeroBackground`.

Dùng artwork hợp lệ/public của Riot hoặc visual riêng dựa trên game assets.

Hero nên có:
- TEAMFIGHT TACTICS
- Current Set Name
- Current Patch
- Player Search

Desktop hero height khoảng 430–560px.

Overlay:
- dark vignette
- purple/navy overlay
- bottom gradient

---

# 5. Phase C — Header / Navigation Parity

Desktop:

```text
ROW 1
Brand                         Language  Login

ROW 2
Team Comp
Builder
Leaderboard
Champion
Origins/Classes
Item
Augment
Wisps
Pet
Report Bug
```

Yêu cầu:
- active route state
- compact height
- không giant pill buttons
- có thể sticky header nếu không gây layout jump

---

# 6. Phase D — Team Comp Source Strategy

Tạo:

`src/features/team-comps/data/teamCompSourceMetadata.ts`

```ts
interface TeamCompSourceMetadata {
  sourceName: string;
  sourceUrl?: string;
  patch: string;
  setId: string;
  verifiedAt: string;
}
```

Không tự claim `S/A/B Tier` nếu không có nguồn hoặc tiêu chí rõ ràng.

Nếu tự curated:
- ghi rõ `Curated`
- không giả vờ là live statistical tier

---

# 7. Phase E — Team Comp Data Integrity

Team Comp phải có:
- id
- name
- tier
- patch
- setId
- champions
- positions
- carryChampionIds
- coreChampionIds
- recommendedItems
- traits
- augments
- strategy data

Thay free-text augment names bằng `augmentIds`.

Validate:
- champion ID tồn tại
- item ID tồn tại
- trait ID tồn tại
- augment ID tồn tại
- hex core ID tồn tại nếu dùng
- no duplicate board position
- current set only
- current patch compatible

Tạo:
`teamCompCrossDomainIntegrity.test.ts`

---

# 8. Phase F — Team Comp Row Parity

Collapsed row ưu tiên:
- Tier
- Comp name
- Champion portraits
- Carry items
- Trait icons
- Small arrow

Giảm:
- long descriptions
- oversized buttons
- quá nhiều metadata text

Carry nên:
- portrait nổi bật hơn
- gold border
- item row ngay bên dưới

Expanded row:
- Board
- Augments
- Strategy
- Early/Mid/Late

---

# 9. Phase G — Item Page Correctness

Tạo reverse recipe index:

```ts
buildItemRecipeIndex(items)
```

Output:
`Map<ComponentItemId, Item[]>`

Basic page:
- Item
- Bonus
- Combined Into

Combined page:
- Item
- Effect
- Recipe

Seasonal:
- chỉ current-set emblems / set-specific equipment
- không legacy item

---

# 10. Phase H — Augment Parity

Routes giữ:
- `/augments/1`
- `/augments/2`
- `/augments/3`

UI Tier column hiển thị:
- 1
- 2
- 3

Internal domain vẫn có thể dùng:
- silver
- gold
- prismatic

---

# 11. Phase I — Champion Data Truthfulness

Không dùng fake numeric fallback.

Bỏ kiểu:

```ts
champion.critChance ?? 25
champion.critDamage ?? 140
champion.armor ?? 30
```

Nếu thiếu source:
- hiển thị `—`

Mapper chỉ assign stat khi source thực sự có dữ liệu.

---

# 12. Phase J — Wisps Domain Rebuild

Không dùng placeholder/fake Wisp data.

Wisp model:

```ts
interface Wisp {
  id: string;
  name: string;
  description: string;
  cost?: number;
  tier?: number;
  iconUrl?: string;
}
```

Nguồn:
- CommunityDragon
- Riot static data
- curated reference có kiểm chứng

Xóa placeholder entries chỉ dùng để lấp UI.

---

# 13. Phase K — Pet / Tactician Catalog

Thay tiny placeholder catalog bằng data thật.

```ts
interface PetSpecies {
  id: string;
  name: string;
  imageUrl: string;
  variants: PetVariant[];
}
```

```ts
interface PetVariant {
  id: string;
  name: string;
  imageUrl: string;
  rarity?: string;
}
```

Page:
- image
- species
- variant count
- detail page chứa skins/variants

---

# 14. Phase L — Hex Core Verification

Không expose handcrafted/fake Hex Core data như dữ liệu game thật.

Mỗi core cần:
- id
- name
- description
- tier
- source
- verified

Nếu chưa verify:
- hide section trong production
hoặc
- label `Experimental`

---

# 15. Phase M — Builder Parity

Sau khi data verify:

```text
Board
Active Synergies
Carry Champion
Hero Hex Core
Priority Hex Core
Alternative Hex Core
Champion tab
Item tab
Trait filter
Save
Share
```

Saved build phải lưu:
- version
- setId
- patch
- createdAt
- updatedAt

Nếu load build khác set:
- show warning
- không silent load

---

# 16. Phase N — Data Health Upgrade

`/dev/data-health` phải kiểm tra:

- Integrity
- Coverage
- Source Verification
- Assets
- Release Compatibility

Status:
- Healthy
- Warning
- Critical

Không hardcode `System Healthy`.

Ví dụ:

```text
Champions: Healthy
Team Comps: Verified patch
Wisps: 0 verified → Critical
Pets: incomplete → Warning
Hex Cores: source unverified → Critical
```

---

# 17. Phase O — Production Runtime Monitoring

Sau mỗi deploy kiểm tra:
- Home
- Builder
- Champion detail
- Team Comp detail
- Items
- Augments

Fix trước:
- 500
- broken assets
- hydration mismatch
- unhandled promise
- invalid image host

---

# 18. Phase P — Image Reliability

Tạo reusable `GameImage`.

Behavior:

```text
remote image
↓ error
local placeholder
```

Áp dụng cho:
- Champions
- Items
- Traits
- Augments
- Pets
- Wisps

Không để broken image icon.

---

# 19. Phase Q — Mobile Pass

Breakpoints:
- >=1440 desktop
- 1024 laptop
- 768 tablet
- <768 mobile

Mobile:
- hero search stack
- filter collapse
- TeamComp row → compact card
- Items/Augments table → stacked row/card

Không chỉ dùng horizontal scroll.

---

# 20. Phase R — Performance

Review production bằng Lighthouse.

Targets:
- LCP < 2.5s
- CLS < 0.1
- không huge blocking JS

Giảm:
- `unoptimized` image usage
- full JSON gửi xuống client
- unused animations
- dataset không cần thiết trên từng page

Ưu tiên Server Components.

---

# 21. Phase S — SEO

Thêm:
- title
- description
- OpenGraph
- canonical

Cho:
- Home
- Champion
- Trait
- Team Comp
- Item category
- Augment tier

---

# 22. Phase T — Deployment Safety

Hiện tại:
`push main → auto production`

Đề xuất:

```text
feature/*
→ Vercel Preview
→ verify
→ merge main
→ Production
```

`main` chỉ dùng production.

---

# 23. Phase U — CI Quality Gate

Tạo:

`.github/workflows/ci.yml`

Run khi:
- pull_request
- push main

Commands:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm test
pnpm build
```

---

# 24. Production Checklist

Trước merge:

- [ ] lint pass
- [ ] test pass
- [ ] build pass
- [ ] no console error
- [ ] Home checked
- [ ] Builder checked
- [ ] one detail route checked
- [ ] mobile checked
- [ ] no obvious broken image

---

# 25. Recommended Implementation Order

1. Create release verification check
2. Create `PRODUCTION_AUDIT.md`
3. Verify target Set/Patch
4. Rebuild Hero with real set artwork
5. Finalize header/nav spacing
6. Define TeamComp source metadata
7. Convert augment names → augment IDs
8. Add TeamComp augment/core validation
9. Polish TeamCompRow data density
10. Build reverse item recipe index
11. Fix Basic Items `Combined Into`
12. Render Augment numeric tier
13. Remove fake Champion stat fallbacks
14. Rebuild Wisps from verified data
15. Replace Pet placeholder dataset
16. Verify or hide Hex Core data
17. Add Set/Patch version to saved Builder builds
18. Upgrade `/dev/data-health`
19. Create `GameImage`
20. Production QA all routes
21. Mobile Home pass
22. Mobile TeamComp pass
23. Mobile Items/Augments pass
24. Performance pass
25. SEO metadata
26. Add CI workflow
27. Move to feature branch → preview → merge workflow

---

# 26. Milestone 1 — Production Visual Pass

Complete when:
- Home visually strong
- Hero has real game identity
- Header/navigation compact
- TeamComp rows dense
- No obvious broken images

---

# 27. Milestone 2 — Trusted Data Pass

Complete when:
- Team Comp source documented
- No fake champion stats
- Wisps verified
- Pet catalog sourced
- Hex Cores verified or hidden
- No cross-set contamination

---

# 28. Milestone 3 — Production Quality Pass

Complete when:
- Desktop stable
- Mobile stable
- CI green
- Vercel preview workflow works
- No major runtime errors

---

# 29. Acceptance Criteria

Không chuyển sang Riot API/database phase cho tới khi:

- Home parity tốt
- Team Comp source trusted
- Items correct
- Augments correct
- Champions truthful
- Wisps truthful
- Pets real
- Builder metadata verified
- Production stable
- Mobile usable
- CI pass

---

# 30. Next Phase

Sau plan này:

## LIVE DATA
- Riot Account API
- TFT League API
- TFT Match API
- Player Profile
- Match History
- Leaderboard

## DATABASE
- Prisma
- PostgreSQL
- Admin
- Cloud Saved Builds
- Team Comp CMS
- Redis

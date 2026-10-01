# PLAN_TFTPLUS_REFERENCE_PARITY_PHASE.md

## 1. Goal

Mục tiêu phase này:

```text
Biến project hiện tại từ:

"TFT Companion có feature tương tự"

thành:

"TFT data portal có information architecture,
page composition, density và UX gần TFTPlus reference"
```

Không copy:

```text
source code
logo
branding
exact proprietary artwork
private content
```

Có thể tham khảo:

```text
page structure
information hierarchy
interaction flow
data density
filter layout
table/card composition
navigation grouping
```

---

# 2. Important Change Of Direction

Các phase trước đã hoàn thành phần foundation:

```text
Repository
Importer
Static data
Set 18 data normalization
Builder state
Validation
Server/client split
DI
Testing
```

Không rewrite các phần này.

Từ phase này trở đi:

```text
REFERENCE PARITY
>
architecture expansion
```

Tạm thời KHÔNG ưu tiên:

```text
Prisma
PostgreSQL
Redis
Admin
Riot API
Authentication thật
```

cho đến khi:

```text
Home
Team Comp
Champion
Traits
Items
Augments
Builder
```

đã gần reference về visual + content coverage.

---

# 3. Current Gap Summary

Project hiện có static data:

```text
Champions: 74
Traits: 36
Items: 171
Augments: 345
```

Nhưng thiếu:

```text
Set 18 Team Comps
Wisps
Pet data
Hero Hex Core data
Priority Hex Core data
Alternative Hex Core data
Carry metadata
Riot login integration
Live leaderboard
Live player profile
```

Lỗi lớn nhất về product coverage:

```text
Team Comp Set 18 = 0
```

Do đó:

```text
Home
Team Comp page
Builder presets
Champion recommended comps
```

đều thiếu content quan trọng.

---

# 4. Reference Information Architecture

Target navigation:

```text
TOP UTILITY BAR

Logo
Language
Login
```

Main navigation:

```text
Team Comp
Builder
Leaderboard
Champion
Origins / Classes
Item
Augment
Wisps
Pet
Report Bug
```

Mapping với project hiện tại:

```text
Team Comp          -> /team-comps
Builder            -> /builder
Leaderboard        -> /leaderboard
Champion           -> /champions
Origins / Classes  -> /traits
Item               -> /items
Augment            -> /augments

Wisps              -> NEW
Pet                 -> NEW
Report Bug          -> NEW simple page/modal
```

---

# 5. Phase A — Rebuild Global Header

## Goal

Navbar hiện tại mang style SaaS dashboard.

Target:

```text
2-row compact navigation
```

---

## A1. Utility Header

Create:

```text
src/components/layout/UtilityHeader.tsx
```

Structure:

```text
------------------------------------------------
LOGO                         Language   Login
------------------------------------------------
```

Do NOT implement real authentication yet.

Login button:

```text
LOGIN
```

temporary behavior:

```text
open disabled/mock login modal
```

or:

```text
show "Riot login coming soon"
```

---

## A2. Main Navigation

Create/refactor:

```text
MainNavigation.tsx
```

Desktop:

```text
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

Target visual:

```text
compact height
small-medium font
no large icon buttons
minimal rounded-pill styling
active item highlighted by color/border
```

Avoid current:

```text
large icons
large pill cards
SaaS navigation feel
```

---

## A3. Mobile

Keep responsive drawer.

Mobile order must match desktop.

---

# 6. Phase B — Rebuild Home Page From Scratch

## Goal

Home phải giống reference về composition.

Không chỉnh nhỏ Home hiện tại.

Create new layout.

---

# 6.1 Remove Current Marketing Sections

Remove/rework:

```text
Quick Navigation Cards
large marketing heading
generic builder CTA
generic SaaS feature cards
large empty spacing
```

Home phải:

```text
Game identity
Player search
Filters
Team comp data
```

---

# 6.2 Hero Section

Target:

```text
full-width game artwork background

dark overlay

TEAMFIGHT TACTICS

SET 18
ENCHANTED WILDS

Player search

secondary sign-in CTA
```

Suggested component:

```text
src/features/home/components/HomeHero.tsx
```

---

## Hero Layers

```text
Hero Container
├─ Background image
├─ Dark overlay
├─ Set identity
├─ PlayerSearch
└─ RiotLoginPlaceholder
```

---

## Do Not

Do not directly copy TFTPlus artwork unless licensing/source is appropriate.

Use:

```text
Riot-approved public set art
or
own background composition
```

while keeping layout close to reference.

---

# 6.3 Player Search

Existing `PlayerSearch` can be reused.

Visual target:

```text
[ VN ▼ ][ In-game name + #tagname                 ]
```

Larger width.

No oversized orange CTA.

Search bar should be dominant.

---

# 6.4 Riot Login Placeholder

Below search:

```text
[ service icon ][ service icon ]

OR

[ Sign in with Riot ID ]
```

No actual OAuth yet.

Implement component:

```text
RiotLoginPlaceholder.tsx
```

---

# 7. Phase C — Home Team Comp Filter Bar

Target structure:

```text
[ Trait / All ▼ ]

[ icon ][ S ][ A ][ B ]

                    [ Search team comps ... ]
```

---

## C1. Trait Filter

Use Set 18 traits.

Prefer select/dropdown instead of 36 pills.

Component:

```text
TeamCompTraitFilter
```

---

## C2. Tier Filter

Tabs:

```text
All
S
A
B
```

Do not show C on Home unless data uses it.

---

## C3. Search

Search by:

```text
comp name
champion name
trait
```

---

# 8. Phase D — Build Real Set 18 Team Comp Dataset

## Highest Priority Data Task

Do this BEFORE polishing TeamCompCard heavily.

Current:

```text
Set 18 comps = 0
```

Target initial milestone:

```text
minimum 10–15 real Set 18 comps
```

---

# 8.1 New Data Location

Create:

```text
src/features/team-comps/data/set18TeamComps.ts
```

Do not mix with old Set 13 mocks.

---

# 8.2 Team Comp Data Requirements

Each comp must contain:

```ts
id
name
tier
patch
setId
difficulty
playstyle

champions[]
traits[]
recommendedItems[]
augments[]

earlyGame
midGame
lateGame
description
```

---

# 8.3 Add Reference-Style Metadata

Extend `TeamComp` if needed:

```ts
interface TeamComp {
    ...

    carryChampionIds?: string[];

    coreChampionIds?: string[];

    heroHexCoreIds?: string[];

    priorityHexCoreIds?: string[];

    alternativeHexCoreIds?: string[];

    tags?: string[];
}
```

Do not force all fields required.

---

# 8.4 Initial Comp Coverage

Seed current Set 18 comps based on current meta/reference.

Examples to support:

```text
Aphelios Nidalee
Kha'Zix Lunarwood
Master Yi Rengar
```

Then expand.

Do not scrape/copy proprietary guide text verbatim.

Use:

```text
your own concise strategy text
```

---

# 8.5 Data Validation

Add:

```text
TeamCompSchema
```

Validate:

```text
champion ID exists
trait ID exists
item ID exists
augment ID exists
setId == 18
patch matches current supported patch
board position valid
max 10 units unless explicitly configured
```

---

# 9. Phase E — Rebuild Team Comp Row/Card

Current card is too much like SaaS Card.

Target:

```text
dense horizontal game row
```

---

## E1. Structure

```text
Tier Strip
Comp Name

Champion portraits
Items under/over carry champions

Trait icons

Core item preview

Expand / Details arrow
```

---

## E2. Visual

Target:

```text
small spacing
compact height
dark purple/navy surface
thin borders
small icons
dense readable data
```

Avoid:

```text
large card padding
large rounded corners
large description text
```

---

## E3. Expandable Row

Preferred:

```text
collapsed
↓ click
expanded details
```

Expanded:

```text
positioning board
recommended augments
strategy
early/mid/late
```

Optional initially.

---

# 10. Phase F — Team Comp Detail Parity

Route:

```text
/team-comps/[id]
```

Target content:

```text
Comp header
Tier
Patch

Champion lineup

Positioning board

Traits

Recommended items

Hero Hex Core
Priority Hex Core
Alternative Hex Core

Augments

Early game
Mid game
Late game
```

---

# 11. Phase G — Rework Champion List Page

Current:

```text
large cards
```

Target:

```text
compact champion browser
```

Options:

```text
small portrait grid
or
dense table/list
```

Preferred:

```text
portrait grid
```

Each entry:

```text
portrait
name
cost
traits
```

---

# 12. Phase H — Champion Detail Data Coverage

Extend model where necessary.

Current missing important UI stats:

```text
Crit Chance
Crit Damage
Starting Mana separate display
Mana
possibly role
```

Suggested:

```ts
interface Champion {
    ...

    critChance?: number;
    critDamage?: number;
    role?: string;
}
```

---

## Detail Layout

```text
Champion portrait

Name
Cost
Traits

Stats panel

HP
AD
Attack Speed
Armor
MR
Range
Starting Mana
Mana
Crit Chance
Crit Damage

Ability

Recommended items

Current Team Comps
```

---

# 13. Phase I — Rename Traits UX To Origins / Classes

Route can stay:

```text
/traits
```

Navigation label:

```text
Origins/Classes
```

Page target:

```text
Origin/Class icon
Name
Description
Breakpoints
Champion portraits
```

Dense layout.

Avoid giant cards.

---

# 14. Phase J — Rebuild Items IA

Reference item categories:

```text
Basic
Combined
Seasonal
Radiant
Artifact
Support
```

Current project categories are implementation types.

Need UI category mapper.

---

# J1. UI Category

Create:

```ts
type ItemPageCategory =
    | "basic"
    | "combined"
    | "seasonal"
    | "radiant"
    | "artifact"
    | "support";
```

Mapping:

```text
component -> Basic
completed -> Combined
emblem/current-set special -> Seasonal
radiant -> Radiant
artifact -> Artifact
support -> Support
```

---

# J2. Routes

Preferred:

```text
/items/basic
/items/combined
/items/seasonal
/items/radiant
/items/artifact
/items/support
```

`/items` redirect to:

```text
/items/basic
```

---

# J3. Layout

Use table/list:

```text
Item
Item Bonus
Combined
```

For recipes:

```text
component icon + component icon
```

Not card grid.

---

# 15. Phase K — Rebuild Augment IA

Reference:

```text
Tier 1
Tier 2
Tier 3
```

Current domain:

```text
silver
gold
prismatic
```

Map:

```text
silver    -> Tier 1
gold      -> Tier 2
prismatic -> Tier 3
```

---

## Routes

```text
/augments/1
/augments/2
/augments/3
```

---

## Layout

Table:

```text
Augment
Augment Bonus
Tier
```

Rows:

```text
icon
name
description
tier
```

---

# 16. Phase L — Builder Reference Parity

Keep current board logic.

Rebuild surrounding UX.

---

# L1. Required Areas

Target:

```text
Save Builder

Active Synergies

Hero Hex Core

Carry Champion

Priority Hex Core
+ + +

Alternative Hex Core
+ + +

Champion / Item tabs

Trait filter
```

---

# L2. Builder Domain Extension

Create:

```ts
interface BuilderMeta {
    carryChampionId?: string;

    heroHexCoreId?: string;

    priorityHexCoreIds: string[];

    alternativeHexCoreIds: string[];
}
```

Zustand can use separate store slice.

---

# L3. Hex Core Domain

Create:

```text
src/features/hex-cores/
```

Need determine static data source.

Do not invent data.

If static source unavailable initially:

```text
build UI
use validated curated local dataset
```

---

# L4. Save Builder

MVP:

```text
localStorage
```

No DB yet.

Functions:

```text
Save build
Load saved build
Delete build
```

Later DB migration.

---

# 17. Phase M — Add Wisps Domain

Current reference has Wisp page.

Create:

```text
src/features/wisps/
src/app/wisps/
```

---

## Wisp Model

Example:

```ts
interface Wisp {
    id: string;
    name: string;
    iconUrl: string;
    description: string;
    cost?: number;
    tier?: number;
}
```

---

## Page

Dense table/grid:

```text
Icon
Name
Effect
Cost/Tier
```

---

# 18. Phase N — Add Pet Page

Do not overbuild initially.

Route:

```text
/pet
```

First milestone:

```text
static catalog
search/filter
image
name
rarity/type if available
```

Only use reliable data source.

---

# 19. Phase O — Report Bug

Simple first implementation:

```text
/report-bug
```

Fields:

```text
Category
Page
Description
Steps
Optional contact
```

Until backend exists:

Option A:

```text
mailto link
```

Option B:

```text
copy formatted report
```

Do not build DB for bug reports yet.

---

# 20. Phase P — Visual Design System Rewrite

## Current Problem

Current design:

```text
large rounded cards
large titles
big spacing
SaaS dashboard
```

Target:

```text
dense game portal
```

---

# P1. Design Tokens

Create CSS variables:

```text
--bg-main
--bg-header
--bg-nav
--bg-panel
--bg-panel-alt

--border
--text-primary
--text-secondary

--accent-gold
--accent-purple
--tier-s
--tier-a
--tier-b
```

---

# P2. Radius

Reduce excessive:

```text
rounded-2xl
rounded-3xl
```

Use more:

```text
rounded-sm
rounded-md
```

---

# P3. Typography

Reduce:

```text
huge page headings
```

Increase information density.

Typical:

```text
nav: 13–15px
table: 12–14px
section title: 18–24px
```

---

# P4. Container Width

Reference uses wider content.

Current:

```text
max-w-7xl
```

Evaluate:

```text
max-w-[1440px]
max-w-[1500px]
```

depending page.

---

# 21. Phase Q — Responsive Strategy

Desktop reference parity first.

Then support:

```text
1440+
1024
768
mobile
```

Do not simply shrink desktop tables.

Mobile:

```text
tables -> stacked rows
main nav -> drawer
filters -> scrollable bar
team comp row -> compact card
```

---

# 22. Phase R — Data Coverage Dashboard

Create dev-only route:

```text
/dev/data-health
```

Development only.

Display:

```text
Set
Patch

Champions count
Traits count
Items count
Augments count
Team Comps count
Wisps count
Pets count
Hex Cores count

Broken champion refs
Broken item refs
Broken trait refs
Broken augment refs
Missing images
```

This prevents future "why is data missing?" confusion.

---

# 23. Phase S — Data Integrity Tests

Add tests:

```text
all TeamComp champion ids exist
all TeamComp item ids exist
all TeamComp trait ids exist
all TeamComp augment ids resolve where required

all images non-empty
all Set18 comps use Set18
no Set13 comp appears in current repository
```

---

# 24. Phase T — Do Not Do Yet

Do NOT implement yet:

```text
real Riot OAuth
real player profile
real match history
live leaderboard
Prisma
PostgreSQL
Redis
Admin CMS
```

Reason:

```text
visual and data parity should be stabilized first.
```

---

# 25. Implementation Order

Follow this order.

```text
TASK 01
Snapshot current pages/screens

TASK 02
Create reference-parity design tokens

TASK 03
Create UtilityHeader

TASK 04
Rebuild MainNavigation

TASK 05
Remove old Home marketing sections

TASK 06
Build HomeHero

TASK 07
Restyle PlayerSearch to reference

TASK 08
Add RiotLoginPlaceholder

TASK 09
Build TeamComp filter bar

TASK 10
Create Set18 TeamComp data model extensions

TASK 11
Add first 10–15 Set18 TeamComps

TASK 12
Add TeamComp validation tests

TASK 13
Rebuild TeamCompRow

TASK 14
Rebuild Home TeamComp list

TASK 15
Rebuild TeamComp Detail

TASK 16
Rework Champion list density

TASK 17
Extend Champion stats

TASK 18
Rebuild Champion detail

TASK 19
Rename Traits nav -> Origins/Classes

TASK 20
Rework Traits page

TASK 21
Create ItemPageCategory mapper

TASK 22
Create /items/basic

TASK 23
Create /items/combined

TASK 24
Create /items/seasonal

TASK 25
Create /items/radiant

TASK 26
Create /items/artifact

TASK 27
Create /items/support

TASK 28
Replace item card grid with table layout

TASK 29
Create /augments/1

TASK 30
Create /augments/2

TASK 31
Create /augments/3

TASK 32
Replace augment card layout with table

TASK 33
Extend Builder metadata

TASK 34
Build Hero Hex Core section

TASK 35
Build Priority Hex Core section

TASK 36
Build Alternative Hex Core section

TASK 37
Build Carry Champion selector

TASK 38
Add local Save Builder

TASK 39
Create Wisps domain + page

TASK 40
Create Pet page

TASK 41
Create Report Bug page

TASK 42
Create /dev/data-health

TASK 43
Add cross-domain data integrity tests

TASK 44
Desktop reference review

TASK 45
Responsive pass

TASK 46
pnpm lint

TASK 47
pnpm test

TASK 48
pnpm build
```

---

# 26. Milestone 1 — Home Parity

Do not continue to other pages until Home has:

```text
2-row header
reference-like navigation
hero artwork
Set 18 identity
large Riot ID search
login placeholder
trait filter
tier filter
team comp search
real Set18 comps
dense comp rows
```

This is the first visual checkpoint.

---

# 27. Milestone 2 — Static Database Parity

Must have:

```text
Champions
Origins/Classes
Items by 6 categories
Augments Tier 1/2/3
Wisps
```

All with dense reference-like presentation.

---

# 28. Milestone 3 — Builder Parity

Must have:

```text
Hex board
Active synergies
Champion selector
Item selector

Carry
Hero Hex Core
Priority Hex Core
Alternative Hex Core

Save
Share
```

---

# 29. Acceptance Criteria

## Home

A user comparing screenshots should immediately recognize the same type of layout:

```text
header
hero
search
filter bar
comp rows
```

without relying on identical branding.

---

## Data

No major empty current-set modules:

```text
Team Comps > 0
Champions > 0
Traits > 0
Items > 0
Augments > 0
Wisps > 0
```

---

## Team Comp

At least:

```text
10–15 Set18 comps
```

with valid:

```text
champions
traits
items
positions
tiers
```

---

## Items

Routes:

```text
Basic
Combined
Seasonal
Radiant
Artifact
Support
```

---

## Augments

Routes:

```text
Tier 1
Tier 2
Tier 3
```

---

## Builder

Has:

```text
Carry
Hero Hex Core
Priority Hex Core
Alternative Hex Core
```

in addition to existing board.

---

## Quality

Pass:

```bash
pnpm lint
pnpm test
pnpm build
```

---

# 30. Next Phase After Reference Parity

Only after this phase:

```text
LIVE DATA PHASE

Riot API Client
Account lookup
Summoner / TFT rank
Match history
Match detail
Leaderboard
Riot OAuth/Login

then:

DATABASE PHASE

Prisma
PostgreSQL
Admin TeamComp editor
User saved builds
Cloud persistence
Redis
```

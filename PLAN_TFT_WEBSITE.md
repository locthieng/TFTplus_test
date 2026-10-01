# TFT Companion Website — Development Plan

## 1. Goal

Xây dựng một website companion cho Teamfight Tactics có trải nghiệm và nhóm tính năng tương tự các website TFT phổ biến như TFTPlus, nhưng:

- Không sao chép source code, branding hoặc nội dung độc quyền của website khác.
- Có UI/UX riêng.
- Kiến trúc code sạch, dễ maintain, dễ mở rộng.
- Có thể cập nhật theo từng TFT set/patch.
- Có thể tích hợp Riot Games API.
- Có hệ thống Team Comp, Team Builder, Champion, Trait, Item, Augment, Leaderboard và Player Profile.
- Có Admin Panel để cập nhật meta mà không phải sửa code.
- Có cache để giảm số request tới Riot API.
- Có thể deploy production thực tế.

---

# 2. Recommended Tech Stack

## Frontend

- Next.js
- TypeScript
- React
- Tailwind CSS

## State Management

- Zustand

Chỉ dùng global state cho các dữ liệu thực sự cần chia sẻ:

- Team Builder state
- Player search state
- Filters
- User preferences

Không đưa mọi state vào global store.

## Backend

Giai đoạn đầu:

- Next.js Route Handlers
- Server Actions khi phù hợp

Nếu project lớn hơn có thể tách backend riêng bằng:

- Node.js
- NestJS

Nhưng không nên tách backend quá sớm.

## Database

- PostgreSQL

## ORM

- Prisma

## Cache

- Redis
- Upstash Redis khi deploy serverless

## TFT Static Data

Nguồn dữ liệu có thể lấy từ:

- Riot Data Dragon
- CommunityDragon
- Các nguồn TFT static data phù hợp

Static data bao gồm:

- Champions
- Items
- Traits
- Augments
- Set metadata
- Images
- Icons

## Riot Data

Sử dụng Riot Games API cho:

- Riot Account
- Summoner
- TFT Rank
- Match History
- Match Detail
- Leaderboard

## Deployment

Recommended:

- GitHub
- Vercel
- Neon hoặc Supabase PostgreSQL
- Upstash Redis
- Cloudflare cho DNS/domain

---

# 3. Main Features

Website nên chia thành các module độc lập.

```text
TFT Website
│
├── Home
├── Team Comps
├── Team Builder
├── Champions
├── Traits
├── Items
├── Augments
├── Leaderboard
├── Player Search
├── Player Profile
├── Match History
├── Match Detail
└── Admin Panel
```

---

# 4. Main Navigation

Desktop navigation:

```text
Logo

Team Comps
Builder
Champions
Traits
Items
Augments
Leaderboard

Search Riot ID

Language
Theme
```

Mobile:

```text
Logo
Search
Menu Button
```

Menu mở dạng drawer.

---

# 5. Phase 0 — Project Foundation

## Goal

Tạo base project sạch trước khi code feature.

## Tasks

### Setup

- Create Next.js project
- Enable TypeScript
- Setup Tailwind CSS
- Setup ESLint
- Setup Prettier
- Setup path aliases
- Setup environment variables

Example:

```text
.env.local

DATABASE_URL=
REDIS_URL=

RIOT_API_KEY=

NEXT_PUBLIC_SITE_URL=
```

Không expose Riot API key bằng biến `NEXT_PUBLIC_*`.

---

## Folder Structure

Recommended:

```text
src/
│
├── app/
│   ├── api/
│   ├── champions/
│   ├── traits/
│   ├── items/
│   ├── augments/
│   ├── team-comps/
│   ├── builder/
│   ├── leaderboard/
│   ├── player/
│   └── admin/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── champion/
│   ├── trait/
│   ├── item/
│   ├── augment/
│   ├── team-comp/
│   ├── builder/
│   └── player/
│
├── features/
│   ├── champions/
│   ├── traits/
│   ├── items/
│   ├── augments/
│   ├── team-comps/
│   ├── builder/
│   └── player/
│
├── services/
│   ├── riot/
│   ├── tft-data/
│   ├── cache/
│   └── database/
│
├── stores/
│
├── hooks/
│
├── types/
│
├── constants/
│
└── utils/
```

---

# 6. Architecture Rules

Agent phải tuân thủ các rule sau.

## Separation of Concerns

Không để:

- API logic
- UI logic
- database query
- business logic

trong cùng một component.

Bad:

```text
TeamCompCard.tsx

fetch API
query database
calculate traits
render UI
save favorite
```

Good:

```text
TeamCompCard
      ↓
useTeamComp
      ↓
TeamCompService
      ↓
Repository/API
```

---

## UI Components

Component UI chỉ nên nhận data và event.

Ví dụ:

```tsx
<TeamCompCard
    comp={teamComp}
    onSelect={handleSelect}
/>
```

Không fetch API trực tiếp trong card nếu không cần thiết.

---

# 7. Core Domain Models

## Champion

```ts
interface Champion {
    id: string;
    apiName: string;
    name: string;
    cost: number;

    imageUrl: string;

    traits: string[];

    health?: number[];
    attackDamage?: number[];
    attackSpeed?: number;
    armor?: number;
    magicResist?: number;

    ability?: ChampionAbility;
}
```

---

## Item

```ts
interface Item {
    id: string;
    apiName: string;
    name: string;

    imageUrl: string;

    description: string;

    effects?: Record<string, number | string>;

    type: ItemType;
}
```

---

## Trait

```ts
interface Trait {
    id: string;
    apiName: string;
    name: string;

    iconUrl: string;

    description: string;

    breakpoints: TraitBreakpoint[];
}
```

---

## Augment

```ts
interface Augment {
    id: string;
    apiName: string;
    name: string;

    iconUrl: string;

    description: string;

    tier?: string;
}
```

---

## Team Comp

```ts
interface TeamComp {
    id: string;

    name: string;

    tier: TeamCompTier;

    patch: string;
    setId: string;

    champions: TeamCompChampion[];

    traits: TeamCompTrait[];

    recommendedItems: TeamCompItem[];

    augments: string[];

    earlyGame?: string;
    midGame?: string;
    lateGame?: string;

    description?: string;
}
```

---

# 8. Phase 1 — UI Prototype

## Goal

Hoàn thiện toàn bộ visual bằng fake data trước.

Không tích hợp Riot API ở phase này.

## Pages

### Home

Home page gồm:

```text
Hero / Header
Player Search
Meta Team Comps
Tier Filter
Trait Filter
Patch Filter
Team Comp List
```

---

## Team Comp Card

Card cần hiển thị:

```text
Comp Name
Tier

Champion portraits

Carry Indicator

Recommended Items

Active Traits

Difficulty

Patch
```

Interactions:

- Hover champion
- Hover item
- Hover trait
- Click card
- Responsive
- Loading skeleton

---

# 9. Phase 2 — Static TFT Data

## Goal

Website có database TFT thật.

## Data Importer

Tạo script:

```text
scripts/
└── import-tft-data.ts
```

Pipeline:

```text
Static TFT Source
      ↓
Fetch JSON
      ↓
Normalize
      ↓
Validate
      ↓
Store Database
```

---

## Important

Không để raw CommunityDragon/Riot format lan toàn project.

Phải normalize về domain model của project.

Example:

```text
CommunityDragonChampion
          ↓
ChampionMapper
          ↓
Champion
```

---

# 10. Phase 3 — Champion Module

## Champion List Page

Features:

- Search
- Cost filter
- Trait filter
- Sorting
- Responsive grid

Example:

```text
Search Champion

Cost
[1] [2] [3] [4] [5]

Trait
[Filter]

Champion Grid
```

---

## Champion Detail

Display:

- Portrait
- Cost
- Traits
- Ability
- Stats
- Recommended Items
- Team Comps using champion

---

# 11. Phase 4 — Trait Module

Trait List:

```text
Trait
Icon
Name
Description
Breakpoint
Champion List
```

Trait Detail:

```text
Trait Name

Effect

2 units
4 units
6 units
8 units

Champions
```

---

# 12. Phase 5 — Item Module

Item Page:

```text
Search

Type Filter

Components
Completed Items
Artifacts
Radiant
Support
Emblems
```

Item Detail:

```text
Icon
Name
Stats
Description
Recipe
Recommended Champions
```

---

# 13. Phase 6 — Augment Module

Augment list:

```text
Search
Tier Filter
Category Filter
```

Augment card:

```text
Icon

Name

Description

Tier
```

---

# 14. Phase 7 — Team Comp System

## Goal

Tạo hệ thống meta comp độc lập với code.

Team comp phải lưu trong database.

## Prisma Example

```text
TeamComp

id
name
tier
patch
setId
description
earlyGame
midGame
lateGame
createdAt
updatedAt
```

Relations:

```text
TeamComp
│
├── TeamCompChampion
├── TeamCompItem
├── TeamCompTrait
└── TeamCompAugment
```

---

# 15. Team Comp Detail Page

Layout:

```text
Header

Comp Name
Tier
Patch

Board

Champions

Carry Units

Recommended Items

Traits

Augments

Leveling Guide

Early Game

Mid Game

Late Game
```

---

# 16. Phase 8 — Team Builder

Đây là feature quan trọng nhất sau static database.

## Builder Layout

```text
────────────────────────────

Champion Search

Champion List

────────────────────────────

            Board

        ⬡ ⬡ ⬡ ⬡
      ⬡ ⬡ ⬡ ⬡
        ⬡ ⬡ ⬡ ⬡
      ⬡ ⬡ ⬡ ⬡

────────────────────────────

Active Traits

────────────────────────────
```

---

## Builder Features

### Add Champion

User:

```text
click champion
```

System:

```text
Add Champion
      ↓
Find Empty Hex
      ↓
Update Board
      ↓
Recalculate Traits
```

---

## Drag Drop

Support:

```text
Champion List
       ↓
drag
       ↓
Board Hex
```

Board champion:

```text
drag
 ↓
move
 ↓
other hex
```

---

## Champion State

```ts
interface BoardChampion {
    championId: string;

    x: number;
    y: number;

    starLevel: 1 | 2 | 3;

    items: string[];
}
```

---

# 17. Trait Calculator

Không hardcode trait logic theo từng comp.

Input:

```text
Board Champions
```

Process:

```text
Collect Traits

Count Units

Apply Trait Rules

Calculate Active Breakpoints
```

Output:

```text
Bruiser 4

Invoker 2

Arcanist 6
```

---

# 18. Builder Save System

Support URL sharing.

Example:

```text
/builder/AbC123
```

Option:

```text
Save Composition
      ↓
Create Builder Snapshot
      ↓
Generate ID
```

User khác mở URL sẽ load lại board.

---

# 19. Phase 9 — Riot API Integration

## Rule

Frontend tuyệt đối không gọi Riot API trực tiếp.

Correct:

```text
Browser

   ↓

Our Backend

   ↓

Cache

   ↓

Riot API
```

---

# 20. Riot Account Search

User input:

```text
GameName#TAG
```

Flow:

```text
Game Name + Tag

      ↓

Account API

      ↓

PUUID

      ↓

TFT APIs
```

---

# 21. Riot Service Layer

Recommended:

```text
services/
└── riot/
    ├── RiotClient.ts
    ├── RiotAccountService.ts
    ├── RiotSummonerService.ts
    ├── RiotLeagueService.ts
    ├── RiotMatchService.ts
    └── RiotRateLimiter.ts
```

---

# 22. Riot Client

`RiotClient` chịu trách nhiệm:

- Base URL
- API key
- HTTP requests
- Timeout
- Retry
- Error mapping
- Rate limit handling

Không duplicate fetch logic ở các service.

---

# 23. Player Profile

Page:

```text
/player/[region]/[gameName]/[tag]
```

Display:

```text
Avatar

Game Name
Tag

Rank

Tier
Division
LP

Games

Win Rate
Average Placement

Recent Matches
```

---

# 24. Match History

Match Card:

```text
Placement

Mode

Duration

Date

Champions

Traits

Augments
```

Example:

```text
#1

Aphelios
Nidalee
Kindred

Lunar 6
Hunter 4
```

---

# 25. Match Detail

Display:

```text
Player

Placement

Board

Champions

Items

Traits

Augments

Damage

Gold

Level

All Players
```

---

# 26. Phase 10 — Riot API Cache

Caching là bắt buộc.

Suggested TTL:

```text
Account
30 minutes

Player Rank
2-5 minutes

Match IDs
2-5 minutes

Match Detail
30-60 minutes

Leaderboard
10 minutes

Static Data
24 hours+
```

---

# 27. Cache Architecture

```text
Request

  ↓

Cache Service

  ↓

Cache Found?
   │
 ┌─┴─┐
 │   │
Yes  No
 │   │
Return Riot API
       │
       ↓
     Cache
```

---

# 28. Rate Limit Handling

Implement:

- Retry after header
- Exponential backoff
- Request queue
- Cache deduplication

Không spam Riot API.

---

# 29. Phase 11 — Leaderboard

Leaderboard:

```text
Rank

Player

Tier

LP

Games

Wins

Top 4 Rate
```

Filters:

```text
Region

Tier

Patch
```

---

# 30. Phase 12 — Admin Panel

Không quản lý meta bằng code.

Admin routes:

```text
/admin

/admin/team-comps

/admin/team-comps/new

/admin/team-comps/[id]

/admin/patches
```

---

# 31. Team Comp Editor

Editor:

```text
Name

Tier

Patch

Champions

Board Positions

Carry

Items

Traits

Augments

Early Game

Mid Game

Late Game
```

---

# 32. Authentication

Admin cần authentication.

Có thể dùng:

- Auth.js
- Supabase Auth

Không tự viết authentication/password system nếu không cần thiết.

---

# 33. Phase 13 — Responsive UI

Support:

```text
Desktop
Laptop
Tablet
Mobile
```

Recommended breakpoints:

```text
sm
md
lg
xl
2xl
```

Không thiết kế desktop rồi scale nhỏ toàn bộ.

Mobile cần layout riêng khi cần.

---

# 34. Performance

## Images

Use:

```text
next/image
```

Optimize:

- Lazy loading
- Proper image sizes
- CDN

---

## Page Rendering

Static pages:

```text
Champions
Items
Traits
Augments
```

Có thể cache mạnh.

Dynamic pages:

```text
Player
Match
Leaderboard
```

Cache ngắn hơn.

---

# 35. SEO

Implement:

```text
title

description

Open Graph

Twitter Card

canonical URL

structured data
```

Pages quan trọng:

```text
Champion

Trait

Item

Team Comp
```

---

# 36. Analytics

Options:

- Google Analytics
- PostHog
- Plausible

Track:

```text
player search

team comp view

builder usage

champion search

item search
```

---

# 37. Error Handling

Phải có error state rõ ràng.

Example:

```text
Player Not Found

Invalid Riot ID

Region Unsupported

Riot API Unavailable

Rate Limited

Network Error
```

Không chỉ console.log.

---

# 38. Loading UX

Use:

```text
Skeleton Cards

Spinner

Progress State

Disabled Buttons
```

Không để màn hình trắng trong lúc fetch.

---

# 39. Design System

Tạo reusable components:

```text
Button

Card

Tooltip

Modal

Popover

Tabs

Badge

Select

SearchInput

Dropdown

LoadingSkeleton
```

Không style từng page độc lập hoàn toàn.

---

# 40. Tooltip System

Website TFT cần tooltip tốt.

Tooltip dùng cho:

```text
Champion

Trait

Item

Augment
```

Example:

```text
Hover Item

       ↓

Item Tooltip

Icon

Name

Stats

Description
```

---

# 41. UI Style

Recommended:

```text
Dark background

Panel surfaces

Gold / cyan accent

High contrast

Game-like cards

Soft glow

Minimal animation
```

Avoid:

- Too much glow
- Overly complex gradients
- Large animation everywhere
- Excessively small text

---

# 42. Animation Guidelines

Use animation cho feedback.

Good:

```text
Card hover

Tooltip fade

Filter transition

Board drag

Modal

Champion placement
```

Không animate mọi component.

Recommended:

- Framer Motion

---

# 43. Testing Strategy

## Unit Tests

Test:

```text
Trait Calculator

Data Mapper

Team Comp calculations

Riot API mapper

Cache keys
```

---

## Integration Tests

Test:

```text
Player Search

Team Builder Save

Team Comp Loading

API routes
```

---

## E2E

Use:

- Playwright

Test flow:

```text
Home

Search Player

Open Player

Open Match

Return

Open Builder

Add Champion

Save Team
```

---

# 44. Security

Important:

Do not expose:

```text
RIOT_API_KEY

DATABASE_URL

REDIS_URL

ADMIN_SECRET
```

Validate all API input.

Use:

```text
Zod
```

Example:

```ts
const RiotIdSchema = z.object({
    gameName: z.string().min(1),
    tagLine: z.string().min(1),
});
```

---

# 45. Database Indexing

Add indexes cho:

```text
champion.apiName

trait.apiName

item.apiName

teamComp.patch

teamComp.tier

player.puuid

match.matchId
```

---

# 46. Logging

Add structured logging.

Log:

```text
Riot API error

Database error

Cache error

Admin update

Import data
```

Không log Riot API key.

---

# 47. Monitoring

Production nên có:

- Sentry
- Vercel logs
- Database monitoring

---

# 48. Deployment Pipeline

Recommended:

```text
Developer

   ↓

GitHub

   ↓

Pull Request

   ↓

CI

   ↓

Vercel Preview

   ↓

Production
```

---

# 49. Environments

Use:

```text
development

preview

production
```

Không dùng production database khi development.

---

# 50. Development Roadmap

## Milestone 1

Foundation

```text
Next.js
TypeScript
Tailwind
Layout
Design System
```

Deliverable:

Website shell chạy được.

---

## Milestone 2

Static TFT Data

```text
Champions

Traits

Items

Augments
```

Deliverable:

Có thể browse toàn bộ game data.

---

## Milestone 3

Team Comp

```text
Comp List

Comp Detail

Tier

Filters
```

Deliverable:

Website meta comp chạy với database.

---

## Milestone 4

Builder

```text
Hex Board

Champion Placement

Trait Calculation

Items

Save
```

Deliverable:

Builder hoạt động hoàn chỉnh.

---

## Milestone 5

Riot Integration

```text
Riot ID

Profile

Rank

Match History

Match Detail
```

Deliverable:

Có player lookup thật.

---

## Milestone 6

Leaderboard

```text
Region

Rank

LP
```

Deliverable:

Leaderboard hoạt động.

---

## Milestone 7

Admin

```text
Login

Team Comp Editor

Patch Management
```

Deliverable:

Có thể update meta không sửa code.

---

## Milestone 8

Production

```text
Cache

SEO

Analytics

Monitoring

Responsive

Performance

Security
```

Deliverable:

Deploy production.

---

# 51. Recommended Implementation Order

Agent phải thực hiện theo thứ tự:

```text
01 Foundation

02 Design System

03 Static UI

04 TFT Static Data

05 Champions

06 Traits

07 Items

08 Augments

09 Team Comps

10 Team Comp Detail

11 Team Builder

12 Trait Calculator

13 Builder Save

14 Riot Client

15 Player Search

16 Player Profile

17 Match History

18 Match Detail

19 Cache

20 Leaderboard

21 Admin

22 SEO

23 Analytics

24 Performance

25 Production
```

---

# 52. Rules For Coding Agent

## Do

- Read existing architecture before editing.
- Reuse existing components.
- Keep components small.
- Prefer composition.
- Use interfaces/types.
- Validate external data.
- Keep API services isolated.
- Follow SOLID when useful.
- Use dependency injection where it improves testability.
- Avoid unnecessary abstractions.
- Write readable code.
- Add tests for business logic.
- Handle errors explicitly.
- Keep feature modules independent.

---

# 53. Do Not

Agent không được:

```text
Copy source code from TFTPlus

Copy branding

Expose Riot API key

Hardcode every team comp

Put API logic in UI components

Put database logic in React components

Create giant components

Create unnecessary singleton managers

Use any everywhere

Duplicate data models

Call Riot API repeatedly without cache

Hardcode trait calculation per comp
```

---

# 54. Definition of Done — Feature

Một feature chỉ được coi là hoàn thành khi:

- UI đúng design.
- Desktop responsive.
- Mobile responsive.
- Loading state.
- Empty state.
- Error state.
- Data validation.
- No console errors.
- No TypeScript errors.
- API errors handled.
- Code follows project architecture.
- Basic tests pass.

---

# 55. MVP Scope

Không cần làm toàn bộ ngay.

MVP nên gồm:

```text
Home

Team Comp List

Team Comp Detail

Champions

Traits

Items

Augments

Basic Team Builder
```

Sau khi MVP ổn mới làm:

```text
Riot ID

Player Profile

Match History

Leaderboard

Admin Panel
```

---

# 56. Final Target

Sản phẩm cuối:

```text
TFT Companion Platform

│
├─ Meta
│  └─ Team Comps
│
├─ Database
│  ├─ Champions
│  ├─ Traits
│  ├─ Items
│  └─ Augments
│
├─ Tools
│  └─ Team Builder
│
├─ Player
│  ├─ Profile
│  ├─ Rank
│  └─ Match History
│
├─ Competitive
│  └─ Leaderboard
│
└─ Management
   └─ Admin
```

Kiến trúc phải đủ tốt để sau này có thể thêm:

```text
Meta Statistics

Champion Stats

Item Stats

Augment Win Rate

Composition Analytics

Patch Comparison

Favorite Comps

User Accounts

Community Builds

AI Team Suggestions
```

mà không phải rewrite toàn bộ project.

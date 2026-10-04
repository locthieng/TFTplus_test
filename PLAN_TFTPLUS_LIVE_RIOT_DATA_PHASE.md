# PLAN_TFTPLUS_LIVE_RIOT_DATA_PHASE.md

## Goal

Chuyển `TFTplus_test` từ static portal + mock Player/Leaderboard sang live Riot data:

- Real Riot ID Search
- Real TFT Rank
- Real Match History
- Real Player Profile
- Real Challenger Leaderboard

Giữ nguyên các phần đã ổn:

- StaticTftRepository / TftService
- Builder
- Team Comp
- Champion / Trait / Item / Augment pipeline
- Wisps
- Pets
- GitHub CI
- Vercel production

---

# 1. Current Reviewed State

```text
Branch: main
Commit: e395f6c
Production: https://tf-tplus-test.vercel.app

Set 18 — Enchanted Wilds
Patch 18.3

Champions: 74
Traits: 36
Items: 171
Augments: 345
Wisps: 162
Pet Species: 138
Pet Variants: 939
Team Comps: 12 curated
Hex Cores: hidden / unverified
```

Current CI is green:

```text
lint
test
build
```

---

# 2. Static Cleanup Before Riot API

## 2.1 Pin CommunityDragon Source Version

Current importer:

```ts
const CDRAGON_VERSION =
  process.env.CDRAGON_VERSION || "latest";
```

but manifest still declares Patch 18.3.

Problem:

```text
latest changes
+
hardcoded 18.3
=
manifest may become inaccurate
```

Preferred:

```env
CDRAGON_VERSION=<exact-version-for-target-release>
```

or derive source version from payload if reliable.

Do not keep:

```text
latest + hardcoded patch
```

long-term.

---

## 2.2 Refactor Data Health

Current dashboard still has several hardcoded values such as:

```text
coverage: "100%"
integrity: "Healthy"
```

Create:

```text
src/features/data-health/
├── datasetHealth.types.ts
└── datasetHealth.ts
```

Suggested:

```ts
export type HealthStatus =
  | "healthy"
  | "warning"
  | "critical";

export interface DatasetHealth {
  name: string;
  itemCount: number;

  integrityStatus: HealthStatus;

  verificationStatus:
    | "verified"
    | "curated"
    | "unverified";

  releaseCompatible: boolean;

  coverage?: {
    current: number;
    expected?: number;
    percentage?: number;
  };

  issues: string[];
}
```

`/dev/data-health` only renders calculated results.

---

## 2.3 Improve Wisp Presentation

Dataset is now real, but UI still mainly shows:

```text
Name
Description
Source
```

Set 18 Wisps have categories and costs.

If source exposes them, add:

```ts
export type WispCategory =
  | "champion"
  | "combat"
  | "misc"
  | "shop"
  | "gold-xp"
  | "risky"
  | "item";
```

Then:

```ts
category?: WispCategory;
cost?: number;
```

Do not invent missing values.

Wisp page target:

```text
Filters:
All
Champion
Combat
Misc
Shop
Gold / XP
Risky
Item

Columns:
Wisp
Category
Cost
Effect
```

---

## 2.4 Update PRODUCTION_AUDIT.md

Update:

```text
current commit
current CI test count
static page count
dataset counts
remaining issues
next phase = Riot API
```

---

# 3. Riot API Policy Gate

Before public live Riot data is enabled:

```text
Riot product registration
+
appropriate production API access
```

Development keys expire regularly and are for development only.

Do not run public production using a development or personal key.

---

# 4. Environment Variables

Create:

```text
.env.example
```

Example:

```env
RIOT_API_KEY=
RIOT_API_ENABLED=false
RIOT_API_TIMEOUT_MS=8000
```

Never create:

```env
NEXT_PUBLIC_RIOT_API_KEY=
```

Vercel later:

```text
Settings
→ Environment Variables
→ RIOT_API_KEY
→ RIOT_API_ENABLED
```

API key is server-only.

---

# 5. Feature Flags

Extend:

```ts
export const FEATURE_FLAGS = {
  wisps: true,
  pets: true,

  hexCores: false,

  livePlayerData:
    process.env.RIOT_API_ENABLED === "true",

  liveLeaderboard:
    process.env.RIOT_API_ENABLED === "true",

  riotLogin: false,
};
```

Do not tie Riot Sign On to normal API lookup.

---

# 6. Riot Routing Model

Current UI only needs:

```text
VN
NA
KR
EUW
```

Keep those four for MVP.

Separate:

```text
UI Region
Platform Route
Regional Route
Riot ID Tag
```

These are different concepts.

Create:

```text
src/features/riot/routing/
├── riotRouting.types.ts
├── riotRouting.ts
└── riotRouting.test.ts
```

Types:

```ts
export type RiotPlatformRoute =
  | "VN2"
  | "NA1"
  | "KR"
  | "EUW1";

export type RiotRegionalRoute =
  | "ASIA"
  | "AMERICAS"
  | "EUROPE";
```

Mapping:

```text
VN
platform = VN2
regional = ASIA

KR
platform = KR
regional = ASIA

NA
platform = NA1
regional = AMERICAS

EUW
platform = EUW1
regional = EUROPE
```

---

# 7. Fix PlayerSearch

Current logic can invent a tag when user enters only a name.

Remove that behavior.

Require:

```text
GameName#TagLine
```

Example:

```text
Faker#KR1
Em Chè#DDT
```

If no `#tag`:

```text
show validation error
do not navigate
```

Region selector remains independent.

---

## Riot ID Validation

Create:

```text
riotIdSchema.ts
```

Use Zod.

```ts
export const RiotIdSchema = z.object({
  gameName: z.string().min(3).max(16),
  tagLine: z.string().min(3).max(5),
});
```

Support Unicode in Game Name.

---

# 8. Riot API Architecture

Create:

```text
src/features/riot/
│
├── client/
│   ├── RiotApiClient.ts
│   ├── RiotApiError.ts
│   └── riotResponse.ts
│
├── routing/
├── account/
├── player/
├── rank/
├── matches/
├── leaderboard/
├── mappers/
├── types/
└── __fixtures__/
```

Do not add live Riot APIs into `TftService`.

Static game data and live player data are separate domains.

---

# 9. RiotApiClient

Responsibilities only:

```text
HTTP
API key
host
timeout
headers
error mapping
rate limit handling
```

Add:

```ts
import "server-only";
```

Header:

```text
X-Riot-Token
```

Read key:

```ts
process.env.RIOT_API_KEY
```

Never expose it to client code.

---

# 10. Error Mapping

Create:

```ts
export type RiotApiErrorCode =
  | "INVALID_INPUT"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "RATE_LIMITED"
  | "SERVICE_UNAVAILABLE"
  | "TIMEOUT"
  | "UNKNOWN";
```

Map:

```text
400 → INVALID_INPUT
401 → UNAUTHORIZED
403 → FORBIDDEN
404 → NOT_FOUND
429 → RATE_LIMITED
5xx → SERVICE_UNAVAILABLE
Abort → TIMEOUT
```

---

# 11. Retry Rules

Do not retry every error.

```text
400 → no retry
401 → no retry
403 → no retry
404 → no retry

429
→ respect Retry-After
→ max controlled retry

500 / 503
→ retry max 1–2
→ exponential delay
```

---

# 12. Account Lookup

Create:

```text
src/features/riot/account/RiotAccountService.ts
```

Flow:

```text
GameName + TagLine
↓
ACCOUNT-V1
↓
PUUID
```

Endpoint:

```text
/riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine}
```

Domain:

```ts
interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}
```

---

# 13. TFT Player / Rank Service

Create:

```text
src/features/riot/player/
src/features/riot/rank/
```

Use current Riot TFT PUUID-based endpoints.

Do not use deprecated player-facing summoner-name lookup.

Rank domain:

```ts
interface TftRank {
  queueType: string;

  tier: string;
  rank?: string;

  leaguePoints: number;

  wins: number;
  losses: number;

  games: number;
}
```

Where:

```ts
games = wins + losses;
```

Do not invent unsupported metrics.

---

# 14. Match History Service

Create:

```text
src/features/riot/matches/
├── TftMatchService.ts
├── tftMatch.types.ts
├── tftMatchMapper.ts
└── tftMatchMapper.test.ts
```

Flow:

```text
PUUID
↓
TFT-MATCH-V1
↓
Recent Match IDs
↓
Match Detail
↓
Find participant by PUUID
↓
Map to project domain
```

MVP fetch:

```text
10 matches
```

Optional later:

```text
20
```

Concurrency:

```text
3–5 match-detail requests at once
```

Do not send 20 uncontrolled parallel calls.

---

# 15. Match Domain

```ts
interface PlayerMatchSummary {
  matchId: string;

  gameDatetime: number;
  gameLengthSeconds: number;

  queueId?: number;

  placement: number;
  level: number;
  goldLeft: number;

  units: PlayerMatchUnit[];
  traits: PlayerMatchTrait[];
  augmentIds: string[];
}
```

Unit:

```ts
interface PlayerMatchUnit {
  championApiName: string;

  starLevel: number;

  itemApiNames: string[];
}
```

Trait:

```ts
interface PlayerMatchTrait {
  traitApiName: string;

  numUnits: number;

  style?: number;
}
```

---

# 16. Static Resolver

Create:

```text
src/features/riot/mappers/TftStaticResolver.ts
```

Resolve live IDs against current static data:

```ts
resolveChampion(characterId)

resolveItem(itemApiName)

resolveTrait(traitApiName)

resolveAugment(augmentApiName)
```

Unknown ID behavior:

```text
do not crash
show raw API name
GameImage fallback
record issue in dev health
```

---

# 17. PlayerProfileService

Create:

```text
PlayerProfileService
```

Flow:

```text
gameName + tagLine + region

↓ account lookup

PUUID

↓ rank
↓ match ids
↓ match detail

combine

↓ PlayerProfile
```

Domain:

```ts
interface PlayerProfile {
  account: RiotAccount;

  region: PlatformRegion;

  rank?: TftRank;

  recentMatches: PlayerMatchSummary[];
}
```

---

# 18. Replace Mock Player Page

Current route:

```text
/player/[region]/[gameName]/[tag]
```

currently contains:

```text
mockMatches
fake Challenger
fake Rank #1
fake LP
fake win rate
fake top-4 rate
```

Delete all fake player data.

New:

```text
params
↓
validate region
↓
validate Riot ID
↓
PlayerProfileService
↓
render live data
```

Never fallback to mock data.

---

# 19. Player States

Required:

```text
Loading
Invalid Riot ID
Player Not Found
API Disabled
API Key Invalid
Rate Limited
Riot Service Unavailable
Success
```

---

# 20. Player Header

Show only real fields:

```text
GameName#Tag
Region
Tier
Rank
LP
Games
```

Do not show:

```text
Rank #1
24.8% Win Rate
68.2% Top 4
```

unless derived from real data.

---

# 21. Recent Match Metrics

You may compute from recent matches:

```text
Average Placement
Top 4 Rate
First Place Rate
```

but label them clearly:

```text
Last 10 Games
```

Do not imply lifetime statistics.

---

# 22. Match History UI

Reuse current UI shell.

Replace mocks with:

```text
real placement
real duration
real date
real champions
real items
real traits
real augments
real level
```

---

# 23. Match Detail Route

Milestone 2:

```text
/match/[region]/[matchId]
```

Display:

```text
Match metadata
All players
Placement
Units
Items
Traits
Augments
Level
Gold
```

Highlight selected player when navigated from profile.

---

# 24. Leaderboard Service

Delete:

```text
MOCK_LEADERBOARD
```

Create:

```text
src/features/riot/leaderboard/
```

Use:

```text
TFT-LEAGUE-V1
```

for platform leaderboards.

MVP:

```text
Challenger Top 25
```

Then:

```text
Top 50
Grandmaster
Master
```

---

# 25. Leaderboard Domain

```ts
interface LeaderboardEntry {
  rank: number;

  puuid?: string;
  summonerId?: string;

  gameName?: string;
  tagLine?: string;

  tier: string;

  leaguePoints: number;

  wins: number;
  losses: number;
}
```

---

# 26. Riot ID Resolution For Leaderboard

If league response only gives PUUID:

```text
PUUID
↓
ACCOUNT-V1 by PUUID
↓
GameName#Tag
```

This creates many calls.

Do not resolve hundreds of users uncached.

Start with:

```text
Top 25
```

and cache account resolution.

---

# 27. Remove Unsupported Leaderboard Metrics

Current UI shows:

```text
Top 4 Rate
Win Rate
Games
```

Do not show metrics unless source semantics support them.

Safe MVP:

```text
Rank
Riot ID
Tier
LP
Wins
Losses
Games
```

with:

```text
Games = Wins + Losses
```

If a metric is ambiguous:

```text
omit it
```

---

# 28. Cache Architecture

Create:

```ts
interface RiotCache {
  get<T>(key: string): Promise<T | null>;

  set<T>(
    key: string,
    value: T,
    ttlSeconds: number
  ): Promise<void>;
}
```

Suggested TTL:

```text
Riot ID → PUUID
30–60 min

PUUID → Riot ID
30–60 min

Rank
2 min

Match IDs
2 min

Match Detail
30 min

Leaderboard
5–10 min
```

Development can start without Redis.

Production later:

```text
Upstash Redis
```

or another Vercel-compatible Redis.

---

# 29. Rate Limit Protection

Read headers where available:

```text
X-App-Rate-Limit
X-App-Rate-Limit-Count
X-Method-Rate-Limit
X-Method-Rate-Limit-Count
Retry-After
```

Never expose them to browser.

---

# 30. Server Architecture

Preferred:

```text
Server Component
↓
PlayerProfileService
↓
Riot services
```

Do not create unnecessary `/api/*` endpoints.

Add route handlers only when a client-side refresh feature requires them.

---

# 31. API Disabled Behavior

If:

```text
RIOT_API_ENABLED !== true
```

Player page:

```text
Live Riot player data is currently disabled.
```

Leaderboard:

```text
Live leaderboard is currently disabled.
```

Never render mock data.

---

# 32. Local Development Workflow

`.env.local`:

```env
RIOT_API_KEY=...
RIOT_API_ENABLED=true
```

Never commit this file.

Development keys are temporary.

---

# 33. Public Production Gate

Because production is public:

```text
https://tf-tplus-test.vercel.app
```

do not enable a development/personal key for public traffic.

Only set:

```text
RIOT_API_ENABLED=true
```

in Vercel Production after appropriate Riot production access is ready.

---

# 34. Site Verification Support

If Riot asks for domain verification:

```text
public/riot.txt
```

Flow:

```text
add verification token
↓
deploy
↓
verify domain
↓
remove file after verification
```

Do not permanently store the verification token.

---

# 35. Tests

Add:

```text
riotRouting.test.ts
riotIdSchema.test.ts
RiotApiClient.test.ts
RiotAccountService.test.ts
TftRankService.test.ts
tftMatchMapper.test.ts
TftStaticResolver.test.ts
PlayerProfileService.test.ts
LeaderboardService.test.ts
```

Unit tests must use fixtures.

Do not call live Riot API from tests.

---

# 36. Fixtures

Create:

```text
src/features/riot/__fixtures__/
```

Examples:

```text
account.json
rank.json
matchIds.json
matchDetail.json
challengerLeague.json
```

No secrets.

---

# 37. Error Test Cases

Test:

```text
404 Account
429 Rate Limit
503 Service unavailable
Timeout
Unranked player
No recent matches
Unknown champion ID
Unknown item ID
Unknown augment ID
```

---

# 38. Data Health Integration

Add safe Riot section:

```text
Riot API enabled: yes/no
API key configured: yes/no
Account service configured
Rank service configured
Match service configured
Leaderboard service configured
Cache configured
```

Never display key value.

---

# 39. Logging

Log:

```text
service
route
status
duration
cache hit/miss
rate limit event
```

Never log:

```text
API key
auth headers
```

---

# 40. SEO

Dynamic player pages:

```text
noindex
```

initially.

Leaderboard can remain indexable once live.

Do not claim:

```text
real-time
```

if data is cached.

Prefer:

```text
Current TFT Challenger Leaderboard
```

---

# 41. Implementation Order

```text
TASK 01
Pin/verify CommunityDragon source version

TASK 02
Refactor Data Health calculated status

TASK 03
Add Wisp category + cost where source supports them

TASK 04
Update PRODUCTION_AUDIT.md

TASK 05
Create .env.example

TASK 06
Add livePlayerData feature flag

TASK 07
Create Riot routing model

TASK 08
Fix PlayerSearch to require Name#Tag

TASK 09
Create RiotIdSchema

TASK 10
Create RiotApiError

TASK 11
Create RiotApiClient

TASK 12
Add Riot routing/client tests

TASK 13
Create RiotAccountService

TASK 14
Verify Riot ID → PUUID locally

TASK 15
Create TftPlayerService

TASK 16
Create TftRankService

TASK 17
Create match domain types

TASK 18
Create TftMatchService

TASK 19
Create match mapper

TASK 20
Create Static TFT resolver

TASK 21
Create PlayerProfileService

TASK 22
Delete mock Player Profile data

TASK 23
Render real rank

TASK 24
Render real recent 10 matches

TASK 25
Calculate recent Avg Placement / Top4 / Wins

TASK 26
Add Player Profile error states

TASK 27
Create LeaderboardService

TASK 28
Delete MOCK_LEADERBOARD

TASK 29
Render live Challenger Top 25

TASK 30
Resolve leaderboard Riot IDs safely

TASK 31
Create RiotCache interface

TASK 32
Add initial cache

TASK 33
Add rate-limit handling

TASK 34
Add Riot fixtures/tests

TASK 35
Update Data Health

TASK 36
pnpm lint

TASK 37
pnpm test

TASK 38
pnpm build

TASK 39
Push feature branch

TASK 40
Test Vercel Preview with live API disabled

TASK 41
Test locally using development API key

TASK 42
Enable public live data only with appropriate Riot production access
```

---

# 42. Milestone 1 — Account Lookup

Complete when:

```text
Region + Name#Tag
↓
real PUUID
```

works for:

```text
VN
NA
KR
EUW
```

with correct errors.

---

# 43. Milestone 2 — Real Player Profile

Complete when all fake profile data is deleted.

Page uses only:

```text
real Riot ID
real rank
real LP
real recent matches
real units
real items
real traits
real augments
```

---

# 44. Milestone 3 — Live Leaderboard

Complete when:

```text
MOCK_LEADERBOARD
```

is deleted and supported regions load actual Riot TFT leaderboard data.

---

# 45. Milestone 4 — Production Safety

Complete when:

```text
server-only API key
cache
rate limit handling
feature flags
error states
CI green
```

Production live data remains disabled until proper Riot production access is ready.

---

# 46. Acceptance Criteria

## Search

```text
Name#Tag required
No guessed tag
Correct platform/regional routing
```

## Player

```text
No fake rank
No fake LP
No mock matches
No fake player statistics
```

## Leaderboard

```text
No MOCK_LEADERBOARD
No fabricated metrics
```

## Security

```text
API key never client-side
API key not committed
API key not logged
```

## Resilience

```text
404 handled
429 handled
5xx handled
timeout handled
unknown static IDs handled
```

## Quality

```bash
pnpm lint
pnpm test
pnpm build
```

all pass.

---

# 47. Do Not Implement Yet

Do not implement Riot Sign On / OAuth in this phase.

Keep:

```text
riotLogin = false
```

RSO should be a separate phase after Riot product/client approval.

Do not add PostgreSQL yet unless there is a concrete requirement for:

```text
user accounts
cloud saved builds
favorites
persistent player cache
```

---

# 48. Next Phase

After this plan:

```text
RIOT SIGN ON + DATABASE PHASE

Riot Sign On
User accounts
PostgreSQL
Prisma
Cloud saved builds
Favorites
Recent searches
Admin Team Comp CMS
Production Redis cache
Analytics
```

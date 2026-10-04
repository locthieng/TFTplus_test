# PLAN_TFTPLUS_RIOT_API_STABILIZATION_AND_PRODUCTION_GATE.md

## Goal

Hoàn thiện phần Live Riot Data vừa triển khai trước khi bật trên production.

Current state:
- Branch: `main`
- Commit: `e395f6c`
- Working tree: **dirty**
- Production: `https://tf-tplus-test.vercel.app`
- Riot routing / account / rank / matches / player profile / leaderboard / cache abstraction đã có.
- Mock Player Profile và mock Leaderboard đã được thay bằng live-data flow có feature flag.
- CI xanh hiện tại chỉ xác nhận commit `e395f6c`, **không xác nhận các thay đổi Riot API chưa commit**.

Mục tiêu:

```text
Fix API contracts
→ Fix data truthfulness
→ Add production cache/rate-limit safety
→ Add partial-failure handling
→ Add Match Detail
→ Run lint/test/build
→ Vercel Preview
→ Merge main
→ Enable production only with proper Riot access
```

---

# 1. Move Work Off Main

Trước khi sửa tiếp:

```bash
git switch -c feature/riot-live-data-stabilization
```

Giữ toàn bộ working tree hiện tại trên branch mới.

Flow:

```text
feature branch
→ lint/test/build
→ push
→ Vercel Preview
→ review
→ merge main
```

---

# 2. Critical Fix — TFT Rank Endpoint

Current code:

```text
/tft/league/v1/entries/by-puuid/{puuid}
```

Current API endpoint phải là:

```text
/tft/league/v1/by-puuid/{puuid}
```

Update:

`src/features/riot/rank/TftRankService.ts`

Target:

```ts
const url =
  `${baseUrl}/tft/league/v1/by-puuid/${encodeURIComponent(puuid)}`;
```

Add exact URL tests for:
- VN2
- NA1
- KR
- EUW1

This is a blocker.

---

# 3. Verify Challenger Queue Contract

Current leaderboard uses:

```text
GET /tft/league/v1/challenger
```

Keep this endpoint.

Prefer explicit queue if supported by current API reference:

```text
?queue=RANKED_TFT
```

Add contract test so future API changes are caught.

---

# 4. Enforce Server-Only Riot Modules

Runtime `typeof window` check is not enough.

Add:

```ts
import "server-only";
```

to server live-data modules, especially:

```text
RiotApiClient.ts
RiotAccountService.ts
TftRankService.ts
TftMatchService.ts
PlayerProfileService.ts
LeaderboardService.ts
```

Goal:

```text
Client Component importing Riot services
→ build failure
```

API key must never enter browser bundles.

---

# 5. Fix Riot ID Validation

Current schema allows names/tags as short as 1 char.

Use Riot ID constraints:

```text
Game Name: 3–16 chars
Tag Line: 3–5 chars
```

Update `riotIdSchema.ts`.

Example:

```ts
gameName:
  z.string()
   .trim()
   .min(3)
   .max(16)
   .refine(v => !v.includes("#"))

tagLine:
  z.string()
   .trim()
   .min(3)
   .max(5)
```

Do not use an ASCII-only rule that incorrectly rejects supported Unicode letters.

Tests:

```text
AB#VN2       invalid
ABC#V        invalid
ABC#VN       invalid
ABC#VN2      valid
Unicode name valid
multiple #    invalid
>16 name      invalid
>5 tag        invalid
```

---

# 6. RiotApiClient Hardening

Keep current:
- server API key
- timeout
- 429 handling
- 5xx retry
- typed RiotApiError

Add rate-limit metadata capture:

```text
X-App-Rate-Limit
X-App-Rate-Limit-Count
X-Method-Rate-Limit
X-Method-Rate-Limit-Count
Retry-After
```

Create:

```ts
interface RiotRateLimitSnapshot {
  appLimit?: string;
  appCount?: string;
  methodLimit?: string;
  methodCount?: string;
  retryAfterSeconds?: number;
}
```

Use only for server diagnostics/logging.

---

# 7. Stop Swallowing Rank / Match Errors

Current `PlayerProfileService` converts:

```text
rank failure → undefined
match failure → []
```

This incorrectly makes these cases look the same:

```text
Unranked
429
503
Expired API key
No recent matches
```

Create:

```ts
interface PlayerProfileWarnings {
  rankUnavailable?: boolean;
  matchesUnavailable?: boolean;
  messages: string[];
}
```

Rules:

```text
Account lookup fails
→ fail profile

Rank endpoint returns no ranked entry
→ Unranked, not error

Rank service fails
→ render profile + warning

No match IDs
→ valid empty history

Match service fails
→ render profile + warning
```

---

# 8. Preserve Partial Match Failures

Current match detail errors are silently converted to `null`.

Change result:

```ts
interface MatchFetchResult {
  matches: PlayerMatchSummary[];
  failedMatchIds: string[];
}
```

UI can display:

```text
8 of 10 recent matches loaded.
```

Do not silently imply Riot returned only 8.

---

# 9. Fix Static Resolver Truthfulness

Current unresolved fallback fabricates:

```text
Champion cost = 1
Item type = completed
Augment tier = silver
```

Remove these fake values.

Create:

```ts
interface ResolveResult<T> {
  resolved: boolean;
  entity?: T;
  rawId: string;
  displayName: string;
}
```

Then:

```text
unknown Champion
→ raw ID + placeholder image

unknown Item
→ raw ID + placeholder

unknown Augment
→ raw ID + placeholder
```

No fake cost/type/tier.

---

# 10. Track Static Resolution Misses

Track:

```text
unknown champions
unknown items
unknown traits
unknown augments
```

Surface counts/IDs in:

```text
/dev/data-health
```

This is important when Riot match data moves to a newer patch than static generated data.

---

# 11. Fix Leaderboard Fake Riot IDs

Current fallback can generate:

```text
Player 1
Summoner abc123
tag = platform route
```

These are not real Riot IDs.

Change domain:

```ts
interface LeaderboardEntry {
  rank: number;
  puuid?: string;
  summonerId?: string;

  accountResolved: boolean;

  gameName?: string;
  tagLine?: string;

  tier: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  games: number;
}
```

UI:

```text
resolved
→ GameName#Tag
→ clickable profile

not resolved
→ Riot ID unavailable
→ not clickable
```

Never create fake player links.

---

# 12. Control Leaderboard N+1 Requests

Top 25 can cause:

```text
1 League request
+
up to 25 Account-V1 requests
```

Keep:
- Top 25 MVP
- controlled concurrency

Add configurable value:

```env
RIOT_ACCOUNT_RESOLUTION_CONCURRENCY=3
```

Recommended initial:

```text
3–5
```

Do not expand Top 50 until caching is production-ready.

---

# 13. Production Cache

Current:

```text
InMemoryRiotCache
```

Good for:
- tests
- local dev

Not reliable for Vercel serverless.

Keep `RiotCache` interface and add:

```text
RedisRiotCache
createRiotCache()
```

Factory:

```text
Redis configured
→ RedisRiotCache

else
→ InMemoryRiotCache
```

Suggested TTLs:

```text
Riot ID ↔ PUUID: 30–60 min
Rank: 2 min
Match IDs: 2 min
Match detail: 30 min
Leaderboard: 5–10 min
```

Cache failure must be non-fatal:

```text
cache fails
→ log warning
→ call Riot API
```

---

# 14. Add Rate-Limit State / Request Budget

Reactive 429 retry alone is not enough for public traffic.

Create:

```text
src/features/riot/rate-limit/
├── RiotRateLimiter.ts
└── RiotRateLimitState.ts
```

Use observed Riot headers to:
- reduce bursts
- control leaderboard identity resolution
- avoid exhausting request budget

Do not expose rate-limit internals to frontend.

---

# 15. Add Match Detail Route

Not implemented yet.

Create:

```text
/match/[region]/[matchId]
```

Show:

```text
Match ID
Date
Duration
Queue
Set

All players

Placement
Riot ID if resolved
Level
Gold

Champions
Items
Traits
Augments
```

Player match row:

```text
View Match →
```

Optionally pass selected player PUUID to highlight.

---

# 16. Match Detail Identity Resolution

Do not resolve 8 Riot IDs sequentially.

Use:

```text
Account cache
+
controlled concurrency
```

If identity cannot resolve:

```text
Riot ID unavailable
```

Never fake a name.

---

# 17. Decide Match Queue Behavior

Document whether Player Profile shows:

```text
All TFT matches
```

or:

```text
Ranked TFT only
```

Use supported query filters where available.

Otherwise filter after match detail.

UI must label the behavior clearly.

---

# 18. Add Riot Diagnostics To Data Health

Current `/dev/data-health` has no Riot section.

Add:

```text
LIVE RIOT SERVICES
```

Safe fields:

```text
Live Player feature: enabled/disabled
Live Leaderboard: enabled/disabled
API key configured: yes/no

Account Service: Ready
Rank Service: Ready
Match Service: Ready
Leaderboard Service: Ready

Cache:
In-Memory / Redis

Production Cache:
Ready / Missing
```

Never display API key.

---

# 19. Finish Calculated Dataset Health

Current Data Health still hardcodes some:

```text
100%
Healthy
ok
```

Move calculation to:

```text
src/features/data-health/
```

UI should render:

```ts
DatasetHealth[]
```

rather than declaring health status inline.

---

# 20. Align CommunityDragon Version Pinning

`.env.example` says:

```text
CDRAGON_VERSION=18.3
```

but importer currently defaults to:

```text
latest
```

Make this consistent.

Important:

```text
TFT display patch
```

and:

```text
CommunityDragon directory version
```

may not use identical version identifiers.

Use a verified version that actually exists.

Importer must:

```text
fetch source
→ verify Set 18 exists
→ verify sanity counts
→ only then write manifest
```

---

# 21. Feature Flag Safety

Keep production default:

```env
RIOT_API_ENABLED=false
```

until proper Riot production access is ready.

Vercel Preview can remain disabled.

Local dev:

```env
RIOT_API_KEY=...
RIOT_API_ENABLED=true
```

Never commit `.env.local`.

---

# 22. Improve Partial Error UI

Show explicit warnings:

```text
Rank temporarily unavailable.
Match history temporarily unavailable.
8/10 matches loaded.
Some leaderboard Riot IDs could not be resolved.
```

Do not show full-success UI after partial API failures.

---

# 23. Structured Riot Logging

Create:

```text
src/features/riot/logging/
```

Log:

```text
service
operation
region/platform
status
durationMs
cacheHit
retryCount
rateLimited
```

Never log:
- API key
- request auth headers

Avoid full PUUID unless needed.

---

# 24. Tests To Add / Update

Required:

```text
TftRankService uses /tft/league/v1/by-puuid

strict Riot ID length rules
Unicode Riot IDs

server-only Riot client boundary

PlayerProfile:
- unranked
- rank failure
- match failure
- partial match load

Leaderboard:
- unresolved account
- no fake Riot ID
- no profile link for unresolved entry

StaticResolver:
- unresolved entity has no fake cost/type/tier

Redis:
- hit
- miss
- TTL
- cache unavailable fallback

Rate limit:
- header parsing
- Retry-After
```

Fixtures:

```text
account 404
403 expired/invalid key
429
503
unranked
no matches
partial match failure
unknown entity
leaderboard entry without resolved account
```

No live Riot calls from unit tests.

---

# 25. Current Working Tree Quality Gate

Before commit:

```bash
pnpm lint
pnpm test
pnpm build
```

All must run against the **current dirty working tree**.

The previous GitHub CI result is not enough.

---

# 26. Commit Strategy

After fixes:

```bash
git add .
git commit -m "feat(riot): stabilize live TFT player and leaderboard data"
git push -u origin feature/riot-live-data-stabilization
```

Review Vercel Preview first.

Do not push this unfinished phase directly to `main`.

---

# 27. Preview Verification

Preview environment:

```env
RIOT_API_ENABLED=false
```

Verify:

```text
build works without Riot key
static pages work
Player Profile shows disabled state
Leaderboard shows disabled state
no secrets required at build time
```

---

# 28. Local Live Verification

Using a development Riot key, test:

```text
VN
KR
NA
EUW
```

For each:

```text
Riot ID → PUUID
Rank
Recent match IDs
Match details
Champion resolution
Item resolution
Trait resolution
Augment resolution
```

Also test:

```text
Unranked player
No recent matches
Invalid Riot ID
Unknown player
```

---

# 29. Production Gate

Before:

```env
RIOT_API_ENABLED=true
```

in Vercel Production confirm:

```text
Riot product registered
appropriate API access/key
production Redis/cache ready
rate limits understood
monitoring ready
```

A public player-facing TFT product should be registered with Riot.

---

# 30. Do Not Implement Riot Sign On Yet

Keep:

```ts
riotLogin: false
```

API-key lookup and Riot Sign On are separate.

RSO comes later after Riot client/product approval.

---

# 31. Recommended Implementation Order

```text
TASK 01
Create feature/riot-live-data-stabilization branch

TASK 02
Fix TFT rank endpoint

TASK 03
Verify Challenger queue contract

TASK 04
Add server-only boundaries

TASK 05
Fix Riot ID validation

TASK 06
Update Riot ID tests

TASK 07
Stop swallowing rank/match errors

TASK 08
Add PlayerProfile warnings model

TASK 09
Track partial match failures

TASK 10
Remove fake StaticResolver metadata

TASK 11
Track unresolved static IDs

TASK 12
Remove Leaderboard fake Riot IDs

TASK 13
Disable unresolved player links

TASK 14
Add Riot diagnostics to Data Health

TASK 15
Finish DatasetHealth calculation layer

TASK 16
Align CommunityDragon source pinning

TASK 17
Implement RedisRiotCache

TASK 18
Implement cache factory

TASK 19
Make cache failures non-fatal

TASK 20
Add rate-limit state tracking

TASK 21
Configure account-resolution concurrency

TASK 22
Create Match Detail route

TASK 23
Render all match participants

TASK 24
Resolve match Riot IDs with cache/concurrency

TASK 25
Link Player Profile matches to detail page

TASK 26
Add Riot structured logging

TASK 27
Add missing tests

TASK 28
pnpm lint

TASK 29
pnpm test

TASK 30
pnpm build

TASK 31
Commit feature branch

TASK 32
Push branch

TASK 33
Review Vercel Preview

TASK 34
Local live test with dev key

TASK 35
Test VN/KR/NA/EUW

TASK 36
Merge main after review
```

---

# 32. Acceptance Criteria

Phase is complete only when:

## API Contracts

```text
Account endpoint correct
TFT Rank endpoint correct
TFT Match endpoint correct
Platform/regional routing correct
```

## Player

```text
No mock player data
Unranked != API error
Partial failures are visible
No fake recent metrics
```

## Leaderboard

```text
No MOCK_LEADERBOARD
No fake GameName#Tag
No fake player links
```

## Static Resolver

```text
Unknown IDs do not receive fabricated cost/type/tier
```

## Security

```text
Riot modules server-only
API key never browser-side
```

## Infrastructure

```text
production-capable cache
rate-limit handling
controlled concurrency
```

## Quality

```bash
pnpm lint
pnpm test
pnpm build
```

all pass.

---

# 33. Next Phase

After this stabilization phase:

## RIOT PRODUCTION ENABLEMENT

```text
Riot product registration
Production API access
Production Redis
Enable livePlayerData
Enable liveLeaderboard
Production monitoring
```

Then:

## DATABASE + USER PHASE

```text
Prisma
PostgreSQL
Cloud saved builds
Favorites
Recent searches
Admin Team Comp CMS
Riot Sign On when approved
Analytics
```

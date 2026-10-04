# PLAN_TFTPLUS_RIOT_API_FINAL_STABILIZATION.md

## Goal

Hoàn tất phần Riot API stabilization trước khi merge branch vào `main` và trước khi bật live Riot data trên production.

Current branch:

```text
feature/riot-live-data-stabilization
```

Current reviewed status:

```text
Riot Routing                  ✅
Riot ID Validation            ✅
Account Service               ✅
Rank Service                  ✅
Match Service                 ✅
Player Profile                ✅
Leaderboard                   ✅
Match Detail                  ✅

Partial Failure Handling      ✅
Redis Cache                   🟡
Rate Limit Prevention         🟡
Static Resolver Truthfulness  🟡
Structured Logging            🟡
Data Health Riot Diagnostics  🟡

GitHub CI for current branch  ❌ not verified yet
Vercel Preview                ❌ not verified yet
```

Mục tiêu phase này:

```text
Fix remaining blockers
↓
Run local quality gates
↓
Push feature branch
↓
GitHub Actions green
↓
Vercel Preview green
↓
Manual QA
↓
Merge main
```

---

# 1. Fix RedisRiotCache SET

## Problem

Không nhét serialized JSON vào URL:

```text
/set/{key}/{serializedValue}?ex={ttl}
```

vì leaderboard/match payload có thể làm URL quá dài.

## Target

Dùng POST body.

```ts
async set<T>(
  key: string,
  value: T,
  ttlSeconds: number
): Promise<void> {
  try {
    const serialized =
      typeof value === "string"
        ? value
        : JSON.stringify(value);

    const response = await fetch(
      `${this.baseUrl}/set/${encodeURIComponent(key)}?EX=${ttlSeconds}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "text/plain",
        },
        body: serialized,
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Redis SET failed: ${response.status}`);
    }
  } catch (error) {
    console.warn(
      `[RedisRiotCache] SET failed for "${key}"`,
      error
    );
  }
}
```

Có thể dùng command-style REST nếu muốn, nhưng chỉ chọn một convention.

---

# 2. Redis Tests

Update:

```text
RedisRiotCache.test.ts
```

Required:

```text
GET hit
GET miss
SET uses POST
SET sends value in body
SET sends TTL
network failure is non-fatal
invalid JSON fallback
```

Mock `fetch`; không gọi Redis thật trong unit test.

---

# 3. Cache Namespace + Version

Tạo:

```ts
const RIOT_CACHE_PREFIX = "tftplus:riot";
const RIOT_CACHE_VERSION = "v1";
```

Helper:

```ts
buildRiotCacheKey(...)
```

Target:

```text
tftplus:riot:v1:account:...
tftplus:riot:v1:rank:...
tftplus:riot:v1:match_detail:...
tftplus:riot:v1:leaderboard:...
```

Không hardcode prefix ở từng service.

---

# 4. Proactive Riot Rate Limiter

Hiện project đã đọc rate-limit headers nhưng chủ yếu phản ứng sau `429`.

Tạo:

```text
src/features/riot/rate-limit/RiotRateLimiter.ts
```

Interface:

```ts
export interface RiotRateLimiter {
  beforeRequest(scope: string): Promise<void>;

  recordResponse(
    scope: string,
    headers: Headers,
    status: number
  ): void;
}
```

Flow:

```text
beforeRequest
↓
fetch
↓
recordResponse
```

---

# 5. Normalize Rate-Limit State

Parse:

```text
X-App-Rate-Limit
X-App-Rate-Limit-Count
X-Method-Rate-Limit
X-Method-Rate-Limit-Count
Retry-After
```

Suggested:

```ts
interface RiotRateWindow {
  limit: number;
  windowSeconds: number;
  used: number;
}

interface RiotRateLimitSnapshot {
  app: RiotRateWindow[];
  method: RiotRateWindow[];
  retryAfterSeconds?: number;
  updatedAt: number;
}
```

MVP policy:

```text
Retry-After active
→ wait

window >= 90% used
→ small delay

window >= 100%
→ wait until safe
```

Không cần distributed token bucket ở phase này.

---

# 6. Inject Rate Limiter Into RiotApiClient

Add config/dependency:

```ts
rateLimiter?: RiotRateLimiter;
```

Flow:

```ts
await rateLimiter.beforeRequest(scope);

const response = await fetch(...);

rateLimiter.recordResponse(
  scope,
  response.headers,
  response.status
);
```

Tests dùng fake timers.

---

# 7. Static Resolver — No Fake Domain Values

Verify toàn bộ `TftStaticResolver.ts`.

Forbidden:

```text
Champion cost = 1
Item type = completed
Augment tier = silver
```

Target:

```ts
interface ResolveResult<T> {
  resolved: boolean;
  entity?: T;
  rawId: string;
  displayName: string;
}
```

Unknown entity:

```text
raw ID
human-readable fallback name
placeholder image
```

Nhưng không fabricate gameplay metadata.

---

# 8. Update Resolver Call Sites

Update:

```text
Player Profile
Match Detail
Any live Riot UI
```

Pattern:

```ts
const result = resolver.resolveItem(id);

if (result.resolved && result.entity) {
  // real entity
} else {
  // placeholder
}
```

---

# 9. Static Resolution Diagnostics

Tạo:

```text
src/features/riot/mappers/StaticResolutionDiagnostics.ts
```

Track:

```text
unknown champions
unknown items
unknown traits
unknown augments
```

Expose dev-safe counts to `/dev/data-health`.

Optional:

```text
show first 10 unknown IDs
```

---

# 10. Integrate RiotLogger

`RiotLogger.ts` không được chỉ tồn tại mà phải dùng thật.

Tích hợp trước tiên tại:

```text
RiotApiClient
```

Events:

```text
request_start
request_success
request_error
retry
rate_limited
timeout
```

Suggested shape:

```ts
interface RiotLogEvent {
  service: string;
  operation: string;
  region?: string;
  status?: number;
  durationMs?: number;
  retryCount?: number;
  rateLimited?: boolean;
  cacheHit?: boolean;
}
```

Never log:

```text
RIOT_API_KEY
X-Riot-Token
Authorization
full request headers
```

---

# 11. Cache Logging

Add reasonable cache hit/miss diagnostics for:

```text
Account
Rank
Match IDs
Match Detail
Leaderboard
```

Development có thể verbose hơn production.

---

# 12. Match Queue Policy

Chốt rõ:

## Recommended MVP

```text
Recent TFT Matches
```

không phải:

```text
Recent Ranked TFT Matches
```

unless bạn thực sự filter rank queue.

Mỗi row phải hiển thị queue name dựa trên `queueId`.

Examples:

```text
Ranked TFT
Normal TFT
Double Up
Hyper Roll
```

---

# 13. Match Detail QA

Route:

```text
/match/[region]/[matchId]
```

Must show:

```text
Match ID
Date
Duration
Queue
Set

All participants sorted by placement

Riot ID if resolved
unresolved identity state

Level
Gold
Units
Items
Traits
Augments
```

No fake identities.

---

# 14. Selected Player Highlight

Profile link:

```text
/match/{region}/{matchId}?player={puuid}
```

Match Detail highlight participant tương ứng.

---

# 15. Link Match Rows Clearly

Player Profile row có:

```text
View Match →
```

hoặc toàn row click được.

Không dùng target quá nhỏ/khó thấy.

---

# 16. Riot Diagnostics In Data Health

Add section:

```text
LIVE RIOT SERVICES
```

Display safe values:

```text
Live Player Data:
Enabled / Disabled

Live Leaderboard:
Enabled / Disabled

Riot API Key:
Configured / Missing

Account Service:
Ready

Rank Service:
Ready

Match Service:
Ready

Leaderboard Service:
Ready

Cache:
Redis / InMemory

Production Cache:
Ready / Warning

Rate Limiter:
Ready / Missing
```

Never display secret values.

---

# 17. Finish DatasetHealth Calculation

Không hardcode trong JSX:

```text
100%
Healthy
ok
```

Move logic to:

```text
src/features/data-health/datasetHealth.ts
```

Return:

```ts
DatasetHealth[]
```

UI chỉ render.

---

# 18. CommunityDragon Version Pinning

`.env.example` và importer phải thống nhất.

Không assume:

```text
TFT patch 18.3
=
CommunityDragon directory 18.3
```

Use a verified source version.

Importer flow:

```text
fetch configured source
↓
verify Set 18 exists
↓
verify champion/trait/item/augment sanity counts
↓
write generated data
↓
write manifest
```

Manifest:

```json
{
  "set": "18",
  "patch": "18.3",
  "source": "communitydragon",
  "sourceVersion": "<actual version>",
  "generatedAt": "..."
}
```

---

# 19. Update `.env.example`

Add:

```env
RIOT_ACCOUNT_RESOLUTION_CONCURRENCY=3

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Keep:

```env
RIOT_API_ENABLED=false
```

default.

---

# 20. Production Feature Flag Rules

Local dev:

```env
RIOT_API_ENABLED=true
RIOT_API_KEY=<development key>
```

Preview:

```env
RIOT_API_ENABLED=false
```

Production:

```env
RIOT_API_ENABLED=false
```

until Riot production access is ready.

---

# 21. Unit Test Expansion

Add/update tests:

```text
Redis POST body
Redis TTL
Redis failure fallback

Rate limiter wait behavior
Rate-limit header parser

StaticResolver unresolved Champion
StaticResolver unresolved Item
StaticResolver unresolved Trait
StaticResolver unresolved Augment

Logger never logs secrets

Match queue name mapping
Selected player helper

Data Health Riot diagnostics
```

---

# 22. Integration Scenarios

Use fixtures/mocks:

```text
Ranked player + matches
Unranked player
No recent matches

Rank fails + matches succeed
Matches fail + rank succeeds
2/10 match details fail

Leaderboard Account lookup partially fails

Redis unavailable

429 + Retry-After

503 retry
```

No live Riot calls in unit tests.

---

# 23. Local Quality Gate

Run:

```bash
pnpm lint
pnpm test
pnpm build
```

All must pass against current branch.

Do not rely on old CI.

---

# 24. Push Feature Branch

After local success:

```bash
git push -u origin feature/riot-live-data-stabilization
```

---

# 25. GitHub Actions Gate

Verify current commit:

```text
lint ✅
test ✅
build ✅
```

If one fails:

```text
do not merge
```

---

# 26. Vercel Preview Gate

Preview environment:

```env
RIOT_API_ENABLED=false
```

Verify:

```text
Home works
Team Comps works
Builder works
Champions works
Items works
Augments works
Wisps/Pets work

Player Profile:
shows live-data-disabled state

Leaderboard:
shows live-data-disabled state

No secret required to build
```

---

# 27. Local Live Riot QA

With development API key test:

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
Recent matches
Match detail
Static entity resolution
```

Also:

```text
Unranked player
No matches
Invalid Riot ID
Unknown player
```

---

# 28. Partial Failure QA

Simulate:

```text
Rank API down
Match API down
2 match details fail
```

Expected:

```text
Profile still renders where possible
warning visible
no fake data
```

---

# 29. Leaderboard Partial Identity QA

Simulate:

```text
5 / 25 account resolutions fail
```

Expected:

```text
20 real Riot IDs with profile links

5 rows:
Riot ID unavailable

no fake GameName
no fake Tag
no fake link
```

---

# 30. Production Redis Gate

Before live production configure:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
```

Data Health should show:

```text
Cache: Redis
Production Cache: Ready
```

---

# 31. Riot Production Access Gate

Before setting:

```env
RIOT_API_ENABLED=true
```

on Vercel Production verify:

```text
Riot product registered
appropriate API key/access
rate limits understood
Redis works
logging works
```

---

# 32. Merge Main

Only after:

```text
local quality gate pass
GitHub Actions pass
Vercel Preview pass
manual QA pass
```

Then:

```bash
git switch main
git pull
git merge feature/riot-live-data-stabilization
git push origin main
```

---

# 33. Production QA

After Vercel production deploy:

```text
/
 /team-comps
 /builder
 /champions
 /items/basic
 /augments/1
 /wisps
 /pet
 /dev/data-health
```

Live Player/Leaderboard stay disabled until production Riot access is approved/configured.

---

# 34. Recommended Implementation Order

```text
TASK 01
Fix Redis SET to POST body

TASK 02
Update Redis tests

TASK 03
Add cache namespace/version

TASK 04
Create RiotRateLimiter

TASK 05
Normalize rate-limit windows

TASK 06
Inject limiter into RiotApiClient

TASK 07
Add limiter tests

TASK 08
Verify/remove StaticResolver fake metadata

TASK 09
Update resolver call sites

TASK 10
Add StaticResolutionDiagnostics

TASK 11
Expose resolution diagnostics in Data Health

TASK 12
Integrate RiotLogger into RiotApiClient

TASK 13
Add cache diagnostics

TASK 14
Finalize Recent TFT Matches queue policy

TASK 15
Add queue labels to match rows

TASK 16
Verify Match Detail content

TASK 17
Add selected player highlight

TASK 18
Link match rows to Match Detail

TASK 19
Add Live Riot section to Data Health

TASK 20
Finish DatasetHealth calculation layer

TASK 21
Align CommunityDragon version pinning

TASK 22
Update .env.example

TASK 23
Expand tests

TASK 24
pnpm lint

TASK 25
pnpm test

TASK 26
pnpm build

TASK 27
Push feature branch

TASK 28
Verify GitHub Actions

TASK 29
Verify Vercel Preview

TASK 30
Local live API QA

TASK 31
Merge main only after review
```

---

# 35. Acceptance Criteria

Phase complete only when:

## Redis

```text
POST body used
TTL works
cache failure non-fatal
```

## Rate Limits

```text
headers parsed
proactive limiter active
429 handled
```

## Static Resolver

```text
no fake cost
no fake item type
no fake augment tier
```

## Logging

```text
integrated into actual request flow
no secrets logged
```

## Match UX

```text
queue policy clear
queue label shown
detail route works
selected player highlight works
```

## Data Health

```text
Riot diagnostics present
cache type visible
rate limiter status visible
no hardcoded health claims
```

## Quality

```bash
pnpm lint
pnpm test
pnpm build
```

all pass.

## Delivery

```text
feature branch pushed
GitHub Actions green
Vercel Preview green
main merged only after review
```

---

# 36. Next Phase

After this phase:

## RIOT PRODUCTION ENABLEMENT

```text
Riot product registration
Production API access
Production Redis
Enable live Player Profile
Enable live Leaderboard
Monitor rate limits/errors
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
Riot Sign On
Analytics
```

# PLAN_TFTPLUS_PRE_MERGE_BLOCKER_CLEANUP.md

## Goal

Đóng sạch 4 blocker còn lại trước khi merge:

```text
feature/riot-live-data-stabilization
→ main
```

Current reviewed branch:

```text
feature/riot-live-data-stabilization
```

Current reviewed commit:

```text
3035ab4
```

Current status:

```text
Vercel Preview Build     ✅
Redis POST body          ✅
Static Resolver          ✅
Riot Logger integrated   ✅
Match Detail             ✅
Data Health Riot section ✅
```

Remaining blockers:

```text
1. CommunityDragon source version pinning
2. Redis config/runtime consistency
3. App-level Riot rate-limit scope
4. Logging full cache keys / identifiers
```

Không thêm feature mới trong phase này.

---

# 1. Blocker A — Fix CommunityDragon Source Version

## Current Problem

Current:

```env
CDRAGON_VERSION=18.3
```

Importer fetch:

```text
https://raw.communitydragon.org/18.3/cdragon/tft/en_us.json
```

Nhưng:

```text
TFT patch = 18.3
```

và CommunityDragon source version không dùng cùng numbering.

Không được dùng TFT patch number làm CommunityDragon folder version.

---

# 2. Separate Release Version From Source Version

Target:

```ts
export const TFT_RELEASE_CONFIG = {
  setId: "18",
  setName: "Enchanted Wilds",
  patch: "18.3",

  source: {
    provider: "communitydragon",
    version: "<verified-cdragon-version>",
  },
} as const;
```

TFT release patch và source version phải là hai field riêng.

---

# 3. Rename Environment Variable

Change:

```env
CDRAGON_VERSION=18.3
```

to:

```env
CDRAGON_SOURCE_VERSION=<verified-version>
```

Optional temporary compatibility:

```ts
const sourceVersion =
  process.env.CDRAGON_SOURCE_VERSION ??
  process.env.CDRAGON_VERSION ??
  DEFAULT_CDRAGON_SOURCE_VERSION;
```

Sau migration nên bỏ alias cũ.

---

# 4. Validate CommunityDragon Source Before Import

Importer flow:

```text
fetch configured source
↓
HTTP 200?
↓
Set 18 exists?
↓
Set metadata sensible?
↓
champion count sane?
↓
trait count sane?
↓
item count sane?
↓
augment count sane?
↓
only then generate files
```

Suggested sanity:

```text
champions >= 70
traits >= 30
items >= 150 after filters
augments >= 300 after filters
```

Không write partial output nếu validation fail.

---

# 5. Make Import Safer

Preferred:

```text
fetch
↓
parse
↓
validate all
↓
build all outputs in memory
↓
write generated files
```

Nếu chưa làm atomic replace full thì tối thiểu validate all counts trước lần write đầu tiên.

---

# 6. Manifest Must Tell The Truth

Target:

```json
{
  "set": "18",
  "name": "Enchanted Wilds",
  "patch": "18.3",
  "source": "communitydragon",
  "sourceVersion": "<actual-cdragon-version>",
  "championCount": 74,
  "traitCount": 36,
  "itemCount": 171,
  "augmentCount": 345,
  "generatedAt": "..."
}
```

Forbidden:

```json
"sourceVersion": "latest"
```

khi source đã pin.

---

# 7. Add Importer Version Tests

Test helpers:

```text
source version not assumed equal to TFT patch
manifest sourceVersion comes from actual source config
invalid source fails
missing Set18 fails
low champion count fails
```

Không gọi live CommunityDragon trong unit tests.

---

# 8. Blocker B — Fix Redis Config Consistency

## Current Problem

Data Health currently considers Redis ready if:

```text
UPSTASH_REDIS_REST_URL + TOKEN
OR
KV_REST_API_URL + TOKEN
OR
REDIS_URL
```

Nhưng cache factory chỉ dùng:

```text
UPSTASH_REDIS_REST_URL + TOKEN
OR
KV_REST_API_URL + TOKEN
```

Nếu chỉ set:

```env
REDIS_URL=
```

thì dashboard có thể báo Ready nhưng runtime vẫn dùng InMemory.

---

# 9. Choose One Redis Support Strategy

Recommended:

```text
Support Upstash REST
Support Vercel KV REST aliases
Do not claim generic REDIS_URL support yet
```

Nếu sau này muốn generic Redis TCP thì thêm client riêng.

---

# 10. Remove REDIS_URL From `.env.example`

Keep:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

KV_REST_API_URL=
KV_REST_API_TOKEN=
```

Remove:

```env
REDIS_URL=
```

unless runtime actually supports it.

---

# 11. Centralize Cache Config

Create:

```text
src/features/riot/cache/riotCacheConfig.ts
```

Suggested:

```ts
export interface RiotCacheConfigStatus {
  provider:
    | "upstash-rest"
    | "vercel-kv-rest"
    | "memory";

  productionReady: boolean;
}
```

Function:

```ts
getRiotCacheConfig()
```

Use the same helper in:

```text
createRiotCache()
computeRiotHealthDiagnostics()
```

Không duplicate env detection.

---

# 12. Cache Config Helper Example

```ts
export function getRiotCacheConfig() {
  const upstashUrl =
    process.env.UPSTASH_REDIS_REST_URL;

  const upstashToken =
    process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    return {
      provider: "upstash-rest" as const,
      productionReady: true,
      url: upstashUrl,
      token: upstashToken,
    };
  }

  const kvUrl =
    process.env.KV_REST_API_URL;

  const kvToken =
    process.env.KV_REST_API_TOKEN;

  if (kvUrl && kvToken) {
    return {
      provider: "vercel-kv-rest" as const,
      productionReady: true,
      url: kvUrl,
      token: kvToken,
    };
  }

  return {
    provider: "memory" as const,
    productionReady: false,
  };
}
```

---

# 13. Update Cache Factory

Target:

```ts
const config = getRiotCacheConfig();

if (
  config.provider === "upstash-rest" ||
  config.provider === "vercel-kv-rest"
) {
  return new RedisRiotCache({
    url: config.url,
    token: config.token,
  });
}

return new InMemoryRiotCache();
```

---

# 14. Update Data Health

Dashboard must report exactly runtime behavior.

Examples:

```text
Cache Provider: Upstash REST
Production Cache: Ready
```

or:

```text
Cache Provider: In-Memory
Production Cache: Warning
```

---

# 15. Add Cache Config Tests

Cases:

```text
Upstash URL + token -> upstash-rest
KV URL + token      -> vercel-kv-rest
URL only            -> memory
token only          -> memory
nothing             -> memory
```

---

# 16. Blocker C — Fix Riot App-Level Rate Limit Scope

## Current Problem

Current rate limiter scope can be method-specific:

```text
asia.api.riotgames.com/riot/account/v1
asia.api.riotgames.com/tft/match/v1
```

Application rate limit needs broader sharing by Riot host/region.

Method limits remain method-specific.

Need separate:

```text
APP SCOPE
METHOD SCOPE
```

---

# 17. Create Rate Limit Scopes

Create:

```ts
export interface RiotRateLimitScopes {
  appScope: string;
  methodScope: string;
}
```

Helper:

```ts
getRiotRateLimitScopes(url)
```

---

# 18. App Scope

Recommended:

```text
host
```

Examples:

```text
asia.api.riotgames.com
na1.api.riotgames.com
vn2.api.riotgames.com
```

All methods on same host share app usage state.

---

# 19. Method Scope

Recommended conceptual format:

```text
host + stable method family
```

Examples:

```text
asia.api.riotgames.com:account-v1/by-riot-id
asia.api.riotgames.com:tft-match-v1/by-puuid
vn2.api.riotgames.com:tft-league-v1/by-puuid
```

Do not include:

```text
PUUID
matchId
gameName
tag
```

otherwise every request becomes its own bucket.

---

# 20. Separate App And Method State

Possible model:

```ts
interface RiotRateState {
  appScopes: Map<string, RiotRateWindow[]>;
  methodScopes: Map<string, RiotRateWindow[]>;
  retryAfterByScope: Map<string, number>;
}
```

Do not store app + method windows only inside one method scope.

---

# 21. `beforeRequest()` Checks Both

Flow:

```text
beforeRequest(appScope, methodScope)
↓
check Retry-After
↓
check app limit
↓
check method limit
↓
wait / reject if needed
```

---

# 22. Fix Saturated Window Waiting

Current saturated handling can wait max 1 second.

Do not assume 1 second is enough for long windows.

Recommended MVP:

```text
1-second window
→ short wait

10-second window
→ bounded wait

long app window
→ do not block SSR request for tens of seconds
→ return typed local rate-limit error
```

---

# 23. Add Local Budget Exhausted Error

Add code such as:

```text
LOCAL_RATE_LIMITED
```

or reuse:

```text
RATE_LIMITED
```

with metadata indicating it came from local proactive limiter.

UI:

```text
Live Riot data is temporarily busy.
Please retry shortly.
```

Better than hanging a page request for 60–120 seconds.

---

# 24. Keep Riot Retry-After Handling

Current behavior can remain:

```text
Retry-After <= 2 sec
→ one controlled retry

Retry-After > 2 sec
→ return RATE_LIMITED error
```

Do not retry indefinitely.

---

# 25. Rate Limiter Tests

Add:

```text
Account response app usage affects Match request on same host

method usage affects only same method scope

different region host independent

90% app usage throttles

short saturated window waits

long saturated window returns local rate-limit error

Retry-After respected
```

---

# 26. Blocker D — Stop Logging Full Cache Keys

## Current Problem

Current pattern can log:

```text
tftplus:riot:v1:account_by_puuid:asia:<FULL_PUUID>
```

or Riot ID segments.

Do not put full identifiers in normal production logs.

---

# 27. Change Cache Log API

Instead of:

```ts
logCacheHit(
  service,
  operation,
  cacheKey
)
```

use safe metadata:

```ts
logCacheHit(
  service,
  operation,
  {
    namespace: "account_by_puuid",
    region: regionalRoute,
  }
);
```

No raw cache key.

---

# 28. Safe Identifier Logging

If identifier absolutely needed:

```text
abcd...wxyz
```

Use explicit truncation.

Never log:

```text
full PUUID
full Riot ID
API key
Authorization
X-Riot-Token
```

---

# 29. Update Cache Logs Everywhere

Review:

```text
RiotAccountService
TftRankService
TftMatchService
LeaderboardService
```

Ensure none logs full cache key.

---

# 30. Logger Tests

Required:

```text
API key absent
Bearer token absent
full PUUID absent
full Riot ID absent
full cache key absent
truncated identifier allowed
```

---

# 31. Data Health Release/Source Display

Show separately:

```text
TFT Release:
Set 18 / Patch 18.3

Static Source:
CommunityDragon / <actual-version>
```

Do not visually imply patch and source version are the same thing.

---

# 32. Data Health Cache Display

Use `getRiotCacheConfig()`.

Display:

```text
Provider
Production Ready
```

No independent env guessing.

---

# 33. Data Health Rate-Limit Display

Show architecture status:

```text
Proactive Rate Limiter: Ready
App Scope: Ready
Method Scope: Ready
```

Do not expose detailed production request budget publicly.

---

# 34. CI Workflow

Current workflow running on:

```text
push main
pull_request -> main
```

is acceptable.

Do not change it merely to run on every feature push.

Open a PR to trigger CI.

---

# 35. Local Quality Gate

Before PR:

```bash
pnpm lint
pnpm test
pnpm build
```

All must pass.

---

# 36. Commit Fixes

Suggested:

```bash
git add .
git commit -m "fix(riot): close pre-merge production blockers"
git push
```

---

# 37. Open PR

Create:

```text
feature/riot-live-data-stabilization
→ main
```

Suggested title:

```text
feat: add stabilized Riot TFT live data pipeline
```

---

# 38. PR Gate

Wait for:

```text
GitHub Actions
Lint  ✅
Test  ✅
Build ✅

Vercel Preview
Ready ✅
```

Do not merge while any check is failing/pending.

---

# 39. Manual Preview QA

With:

```env
RIOT_API_ENABLED=false
```

verify:

```text
/
 /team-comps
 /builder
 /champions
 /traits
 /items/basic
 /augments/1
 /wisps
 /pet

/player/...
→ disabled state

/leaderboard
→ disabled state

/match/...
→ disabled state

/dev/data-health
→ correct source/cache/rate-limit diagnostics
```

---

# 40. Local Live API QA

Development env:

```env
RIOT_API_ENABLED=true
RIOT_API_KEY=<dev-key>
```

Test:

```text
VN
KR
NA
EUW
```

For each:

```text
Riot ID lookup
Rank
Recent Matches
Match Detail
Leaderboard
```

---

# 41. Rate-Limit QA

Use mocks/tests rather than hammering Riot.

Verify:

```text
near limit -> throttle

app usage shared across methods

method usage isolated

long-window saturation -> typed busy state

429 -> Retry-After respected
```

---

# 42. Redis Failure QA

Simulate cache failure.

Expected:

```text
GET cache fails
→ Riot upstream still called

SET cache fails
→ page still returns data
```

Cache remains optimization, not hard dependency.

---

# 43. Keep Live Riot Production Disabled

Production:

```env
RIOT_API_ENABLED=false
```

until:

```text
Riot product registration
appropriate API access
production Redis configured
```

---

# 44. Merge Criteria

Merge only if:

```text
CommunityDragon source version correct

Redis config and Data Health consistent

App + Method rate limit scopes correct

No full PUUID/Riot ID/cache key logs

pnpm lint pass
pnpm test pass
pnpm build pass

GitHub Actions green
Vercel Preview green
Manual QA pass
```

---

# 45. Merge

Preferred:

```text
GitHub PR merge
```

Alternative:

```bash
git switch main
git pull
git merge feature/riot-live-data-stabilization
git push origin main
```

PR merge is preferred because CI history stays attached.

---

# 46. Post-Merge Production Verification

After deploy:

```text
Production Ready

Home works
Static data pages work
Builder works
Data Health works

Live Riot remains disabled
```

---

# 47. Recommended Implementation Order

```text
TASK 01
Separate TFT patch from CommunityDragon source version

TASK 02
Set verified CommunityDragon source version

TASK 03
Add importer sanity validation

TASK 04
Fix manifest sourceVersion

TASK 05
Remove unsupported REDIS_URL

TASK 06
Create shared riotCacheConfig

TASK 07
Use cache config helper in runtime factory

TASK 08
Use same helper in Data Health

TASK 09
Split app rate-limit scope

TASK 10
Split method rate-limit scope

TASK 11
Update RiotApiClient scope handling

TASK 12
Fix long-window saturation behavior

TASK 13
Add local rate-limited error

TASK 14
Expand rate limiter tests

TASK 15
Remove full cache-key logging

TASK 16
Add safe cache log metadata

TASK 17
Expand logger privacy tests

TASK 18
Update Data Health source/cache/rate-limit display

TASK 19
pnpm lint

TASK 20
pnpm test

TASK 21
pnpm build

TASK 22
Commit fixes

TASK 23
Push feature branch

TASK 24
Open PR to main

TASK 25
Verify GitHub Actions

TASK 26
Verify Vercel Preview

TASK 27
Manual preview QA

TASK 28
Merge main
```

---

# 48. Acceptance Criteria

## CommunityDragon

```text
TFT patch separate from source version
source URL valid
manifest sourceVersion truthful
```

## Redis

```text
Data Health and runtime share config helper
No unsupported REDIS_URL claim
```

## Rate Limit

```text
app scope shared by host
method scope separate
long-window saturation safe
Retry-After respected
```

## Logging

```text
no full PUUID
no full Riot ID
no full cache key
no API secret
```

## Delivery

```text
lint/test/build pass
PR created
GitHub Actions green
Vercel Preview green
manual QA pass
```

---

# 49. Next Phase

After merge:

## RIOT PRODUCTION ENABLEMENT

```text
Register/confirm Riot product access
Configure production Riot API key
Configure production Upstash cache
Enable live Player Profile
Enable live Leaderboard
Monitor rate limits/errors
```

Then:

## USER / DATABASE PHASE

```text
PostgreSQL
Prisma
Cloud saved builds
Favorites
Recent searches
Admin Team Comp CMS
Riot Sign On
Analytics
```

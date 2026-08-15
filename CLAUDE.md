# LeagueDraft

## What this is

A live champion-select ("draft") assistant for League of Legends players on PC.
While a player is in champ select, LeagueDraft shows role predictions for
enemy picks, team-comp-aware suggestions, counter/synergy picks, blind-pick
suggestions, and ban-aware recommendations. Champion pool ("champions I
play") is stored client-side (localStorage), no login required — accounts
are a possible future addition, not built yet.

Public product, ad-supported eventually. Currently solo-developed.

## The constraint that shapes the architecture

Champ-select data lives behind Riot's League Client Update (LCU) API, which
is **local-only**: self-signed cert, and auth requires reading a local
lockfile off disk. None of that is reachable from a browser tab — no
filesystem access, and `fetch()` can't work around the cert. This is why a
pure website can only ever show *post-game-start* data (via the public
Spectator API), never live draft data.

**Do not propose "just call the LCU API from the browser/extension directly"
— it does not work.** The architecture below exists specifically to solve
this.

## Architecture

```
LeagueDraft/
  apps/
    web/              Next.js 16 (App Router) + TypeScript — the actual site
    extension/        Manifest V3 browser extension (WXT + TypeScript)
    native-helper/    Go — native-messaging host, bridges extension <-> LCU API
  packages/
    shared-types/      TS types shared by web + extension (DraftState, etc.)
```

Data flow (once fully wired — not all built yet, see Status below):
`League Client (LCU API)` → `native-helper` (Go, reads lockfile, calls LCU)
→ `extension` background worker (via Chrome Native Messaging, stdio,
length-prefixed JSON) → `web` app (renders draft state + recommendations).

The extension's first-run flow should offer a single "install helper" step
that registers the native-helper as a native messaging host — closest
achievable UX to "just install an extension" given the constraint above.

## Commands

**apps/web** (Next.js):
- `npm run dev` — local dev server
- `npm run build` / `npm run start` — production build/run
- `npm run lint` — ESLint

**apps/extension** (WXT):
- `npm run dev` — dev build, watches for changes (load unpacked in
  `chrome://extensions`)
- `npm run build` — production build
- `npm run compile` — `tsc --noEmit` type check

**apps/native-helper** (Go):
- `go build` — compile
- `go vet ./...` — static checks
- `gofmt -l .` — formatting check

## Conventions

- TypeScript strict mode across `apps/web`, `apps/extension`,
  `packages/shared-types`.
- Formatting: Prettier for TS/TSX, `gofmt` for Go — both auto-run on save
  via `.claude/hooks/` (see below), not a manual step.
- Keep the recommendation logic behind an interface
  (`RecommendationProvider` or equivalent) so the data source is swappable —
  see Status.

## Status / what's deliberately not built yet

- No live data flowing end-to-end (helper → extension → web) — each piece
  is currently just a scaffold.
- No real recommendation data. Role %, counters, and synergies need either
  a Riot Production API key + a match-data pipeline, or a curated static
  dataset. Neither is implemented — build behind a swappable interface so
  either can be plugged in later without touching the UI.
- No accounts/login, no ads integration, no deployment/hosting setup.

Do not build ahead of this list without checking — the point of the
interface seams described above is to defer these decisions cleanly, not to
half-implement them.

## Riot API constraints (relevant once the data pipeline is built)

- Commercial use requires an approved **Production API key**; one product
  per key.
- Passive ads (banners, sponsor overlays, pre-roll) are allowed under
  Riot's API policy, but Riot has final say on what counts as appropriate.
- Source: https://developer.riotgames.com/policies/general

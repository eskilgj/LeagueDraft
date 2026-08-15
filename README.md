# LeagueDraft

A live champion-select ("draft") assistant for League of Legends players on
PC — role predictions for enemy picks, team-comp-aware suggestions,
counter/synergy picks, and ban-aware recommendations while you're in champ
select.

See [CLAUDE.md](./CLAUDE.md) for the full architecture, the reasoning
behind it, and current build status.

## Structure

- `apps/web` — the website (Next.js + TypeScript)
- `apps/extension` — browser extension (Manifest V3, WXT + TypeScript)
- `apps/native-helper` — native-messaging host (Go) that bridges the
  extension to the League client's local API
- `packages/shared-types` — TypeScript types shared by `web` and
  `extension`

## Getting started

```sh
npm install        # installs all workspaces
npm run format      # prettier --write everything
```

Then see each app's own README/CLAUDE.md for its dev commands.

# Project Structure

What's in each folder, and what the important files do. Auto-generated
boilerplate (icons, default CSS, lockfiles) is skipped.

```
LeagueDraft/
├── CLAUDE.md
├── README.md
├── package.json
├── docs/
├── .claude/
├── apps/
│   ├── web/
│   ├── extension/
│   └── native-helper/
└── packages/
    └── shared-types/
```

## Root

| File | Purpose |
|---|---|
| `CLAUDE.md` | The agent-facing doc — product summary, the architecture constraint (why a browser can't talk to the League client directly), commands, and what's deliberately not built yet. Read this first. |
| `README.md` | Human-facing overview and quick-start. |
| `package.json` | Defines the npm workspace (links `apps/*` and `packages/*`) and holds shared dev tooling like Prettier. |
| `.gitignore` | Ignores `node_modules`, build output, and any `.env*` files. |

## `docs/`

- `TECH_STACK.md` — every technology in the project, what it's for, why it
  was picked.
- `PROJECT_STRUCTURE.md` — this file.

## `.claude/`

Claude Code's project configuration — not application code.

- `settings.json` — permission allowlist for common build/test commands,
  plus two hooks: one blocks committing secret-looking files (`.env*`,
  `*.pem`, `*.key`), the other auto-formats files after every edit.
- `hooks/block-secret-commits.js` — the secret-blocking hook's logic.
- `hooks/format-file.js` — the auto-formatting hook's logic (Prettier for
  TS, `gofmt` for Go).
- `agents/web-frontend.md`, `agents/native-helper.md` — subagents scoped
  to `apps/web` and `apps/native-helper` respectively.

## `apps/web` — the website (Next.js)

- `src/app/layout.tsx` — root layout, wraps every page.
- `src/app/page.tsx` — the homepage (currently default Next.js
  boilerplate — this is where the draft UI will live).
- `src/app/globals.css` — global styles.
- `next.config.ts` — Next.js configuration.
- `package.json` — scripts: `dev`, `build`, `start`, `lint`.
- `AGENTS.md` / `CLAUDE.md` — auto-generated and auto-maintained by Next.js
  itself (`next dev` rewrites them); flags any breaking API changes in
  this specific Next.js version. Don't hand-edit.

## `apps/extension` — the browser extension (WXT, Manifest V3)

- `entrypoints/background.ts` — the background service worker; this is
  where the native-messaging connection to `apps/native-helper` will be
  established (`chrome.runtime.connectNative`).
- `entrypoints/content.ts` — content script injected into pages.
- `entrypoints/popup/` — the extension's toolbar popup UI
  (`index.html` + `main.ts` + `style.css`).
- `components/counter.ts` — WXT template placeholder component (not
  project-specific; safe to remove once real popup logic exists).
- `wxt.config.ts` — WXT build/manifest configuration.
- `package.json` — scripts: `dev` (load-unpacked watch build), `build`,
  `compile` (type-check only).

## `apps/native-helper` — the native-messaging host (Go)

- `go.mod` — Go module definition (currently the only file; no source yet).
  This is the only part of the project allowed to read the League
  client's local lockfile and call its local API — see `CLAUDE.md` for
  why that constraint exists.

## `packages/shared-types` — shared TypeScript contract

- `package.json` — published internally as `@leaguedraft/shared-types`
  within the workspace; consumed by `apps/web` and `apps/extension`.
- `src/` — currently empty; intended home for the shared `DraftState`
  types (bans, picks, roles) once written, so the web app and extension
  agree on one shape.

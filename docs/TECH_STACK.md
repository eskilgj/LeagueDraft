# Tech Stack

What each piece is, what it does in this project, and why it was picked.

## Product

**TypeScript** — used everywhere except the native helper (web, extension,
shared-types). Adds static types on top of JavaScript, catching a large
class of bugs at compile time instead of runtime. Picked so all
JS-based parts of the project share one language and one type contract.

**Next.js 16 (React 19)** — the framework behind `apps/web`. Handles
routing, server/client rendering, and bundling for the actual website.
Picked because it's the current industry-standard choice for a public,
SEO- and ad-friendly product, with the largest ecosystem and easiest
hosting story (e.g. Vercel).

**React** — the UI library Next.js is built on; components are written as
React function components. Comes bundled with the Next.js choice above.

**WXT** — the framework behind `apps/extension`. Wraps the raw Chrome
Manifest V3 extension APIs (background service workers, content scripts,
native messaging) with a modern dev/build setup and TypeScript support.
Picked over hand-rolling a Manifest V3 extension because it removes a lot
of manifest/bundling boilerplate while staying close to the underlying
web-extension APIs.

**Go** — the language behind `apps/native-helper`, a small native-messaging
host that reads the League client's local lockfile and talks to its local
API on the extension's behalf (browsers can't do this themselves — see
`CLAUDE.md` for why). Picked over a Node-based helper because it compiles
to a single small, dependency-free binary with near-instant startup — the
standard choice for this category of small local system utility, and a
genuinely transferable skill beyond this project.

**npm workspaces** — ties `apps/*` and `packages/*` together as one
monorepo installed/managed from the root `package.json`, so shared code
(`packages/shared-types`) is referenced normally instead of copy-pasted or
published as a separate package.

## Dev tooling

**Prettier** — auto-formats all TS/TSX files. Wired to run automatically
after every file edit via a Claude Code hook, so formatting is never a
manual step or a PR review comment.

**ESLint** (via `eslint-config-next`) — lints `apps/web` for common React/
Next.js mistakes, bundled in by `create-next-app`.

**gofmt** — Go's standard formatter, auto-run on `.go` files the same way
Prettier is auto-run on TS files.

**Git** — version control for the whole repo.

## Deferred (not chosen yet, on purpose)

- **Recommendation data source** — either a Riot Games Production API key
  feeding a self-built match-data pipeline, or a curated static dataset.
  Both are viable; the code is structured (`RecommendationProvider`
  interface) so the choice can be made later without a rewrite.
- **Database** — none yet. Champion pool is local-only (browser
  localStorage) for now; a database only enters the picture if/when
  accounts are added.

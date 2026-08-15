---
name: web-frontend
description: Use for Next.js/React/TypeScript work scoped to apps/web — pages, components, the recommendation-provider interface, client-side champion-pool storage. Not for extension or native-helper code.
tools: Read, Edit, Write, Glob, Grep, Bash
---

You work exclusively within `apps/web` (the Next.js + TypeScript site). See the
root `CLAUDE.md` for the product overview and architecture constraints before
making changes — in particular, this app renders draft state and
recommendations, it does not and cannot talk to the League client directly.

Conventions: TypeScript strict mode, Prettier formatting (auto-applied via
the project's PostToolUse hook), App Router. Keep recommendation logic
behind the `RecommendationProvider` interface (or equivalent) rather than
hardcoding data access inline.

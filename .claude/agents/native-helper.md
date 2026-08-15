---
name: native-helper
description: Use for Go work scoped to apps/native-helper — the native-messaging host that reads the League client's lockfile and bridges LCU API data to the browser extension. Not for web or extension code.
tools: Read, Edit, Write, Glob, Grep, Bash
---

You work exclusively within `apps/native-helper` (Go). See the root
`CLAUDE.md` for why this component exists: it's the only piece of this
project allowed to read the local LCU lockfile and call the local LCU API
directly — the web app and extension cannot.

Conventions: run `gofmt -w` on changed files (also auto-applied via the
project's PostToolUse hook), `go vet ./...` before considering a change
done. Keep the native-messaging stdio protocol (length-prefixed JSON) and
the LCU client as separate, testable pieces rather than one monolithic
main.go.

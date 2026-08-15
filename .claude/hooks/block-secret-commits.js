#!/usr/bin/env node
// PreToolUse hook (Bash matcher): blocks `git add`/`git commit` invocations
// that reference secret-looking files (.env*, *.pem, *.key).

let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(data);
  } catch {
    process.exit(0);
  }

  const cmd = (input.tool_input && input.tool_input.command) || "";
  const isGitStage = /\bgit\s+(add|commit)\b/.test(cmd);
  const touchesSecret =
    /(^|[\s"'])(\.env(\.[A-Za-z0-9_.-]+)?|[^\s"']*\.pem|[^\s"']*\.key)([\s"']|$)/.test(
      cmd
    );

  if (isGitStage && touchesSecret) {
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason:
            "Blocked: this git command references a secret-looking file (.env*, *.pem, *.key). Remove it from the command or make sure it's gitignored before staging/committing.",
        },
      })
    );
  }
});

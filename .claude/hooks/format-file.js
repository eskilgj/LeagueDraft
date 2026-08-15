#!/usr/bin/env node
// PostToolUse hook (Write|Edit matcher): auto-formats the file that was just
// touched. Prettier for .ts/.tsx, gofmt for .go. Silently no-ops otherwise.

const { spawnSync } = require("child_process");
const path = require("path");

let data = "";
process.stdin.on("data", (chunk) => (data += chunk));
process.stdin.on("end", () => {
  let input;
  try {
    input = JSON.parse(data);
  } catch {
    process.exit(0);
  }

  const filePath =
    (input.tool_response && input.tool_response.filePath) ||
    (input.tool_input && input.tool_input.file_path);
  if (!filePath) process.exit(0);

  // Quoted as a single command string (not an args array) so shell:true -
  // required on Windows to resolve npx.cmd/gofmt via PATH - has nothing to
  // interpolate itself with.
  const quoted = `"${filePath.replace(/"/g, '\\"')}"`;

  const ext = path.extname(filePath);
  if (ext === ".ts" || ext === ".tsx") {
    spawnSync(`npx prettier --write ${quoted}`, {
      cwd: path.join(__dirname, "..", ".."),
      shell: true,
      stdio: "ignore",
    });
  } else if (ext === ".go") {
    spawnSync(`gofmt -w ${quoted}`, { shell: true, stdio: "ignore" });
  }
});

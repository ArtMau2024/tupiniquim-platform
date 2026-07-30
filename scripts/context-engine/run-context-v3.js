"use strict";

const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = process.cwd();

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

function runNpmScript(scriptName) {
  if (process.platform === "win32") {
    const commandProcessor = process.env.ComSpec || "cmd.exe";
    run(commandProcessor, ["/d", "/s", "/c", `npm run ${scriptName}`]);
    return;
  }

  run("npm", ["run", scriptName]);
}

try {
  runNpmScript("context:lote4:verify");
  run(process.execPath, [
    path.join(ROOT, "scripts", "context-engine", "promote-v3.js"),
  ]);
  run(process.execPath, [
    path.join(ROOT, "scripts", "context-engine", "validate-official-v3.js"),
  ]);
  console.log("Official Context Engine V3 update completed successfully.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

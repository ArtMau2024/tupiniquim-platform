"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const ROOT = process.cwd();
const memoryTool = path.join(__dirname, "decision-memory.js");
const baselineVerifier = path.join(__dirname, "verify-baseline.js");
function run(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], { cwd: ROOT, stdio: "inherit", shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
run(memoryTool, ["init"]);
run(baselineVerifier);
console.log("Context Engine environment prepared.");

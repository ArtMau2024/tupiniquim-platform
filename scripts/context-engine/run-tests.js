"use strict";
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const testsDir = path.join(__dirname, "__tests__");
const tests = fs.readdirSync(testsDir).filter((name) => name.endsWith(".test.js")).sort().map((name) => path.join(testsDir, name));
if (tests.length === 0) { console.error("No Context Engine tests found."); process.exit(1); }
const result = spawnSync(process.execPath, ["--test", ...tests], { cwd: process.cwd(), stdio: "inherit", shell: false });
if (result.error) { console.error(result.error.message); process.exit(1); }
process.exit(result.status || 0);

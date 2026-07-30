"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");
const ROOT = process.cwd();
const stable = path.join(ROOT, "scripts", "generate-project-map.js");
const manifest = path.join(ROOT, "scripts", "baseline", "baseline-manifest.json");
const staged = path.join(ROOT, "site-context", ".generation-tmp", "project-map.json");
function sha256(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
function run(script, args = []) {
  const result = spawnSync(process.execPath, [script, ...args], { cwd: ROOT, stdio: "inherit", shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}
try {
  const baseline = JSON.parse(fs.readFileSync(manifest, "utf8"));
  if (sha256(stable) !== baseline.sha256) throw new Error("Stable generator changed after Lote 0.");
  fs.rmSync(path.dirname(staged), { recursive: true, force: true });
  run(path.join(ROOT, "scripts", "generate-project-map-v3.js"));
  run(path.join(__dirname, "validate-staged.js"));
  run(path.join(__dirname, "compare-staged.js"));
  if (!fs.existsSync(staged)) throw new Error("Staged map disappeared unexpectedly.");
  console.log("Context Engine V3 Lote 1 verified successfully.");
  console.log("Canonical project-map.json was not promoted or replaced.");
} catch (error) { console.error(error.message); process.exit(1); }

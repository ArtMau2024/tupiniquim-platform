"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");
const ROOT = process.cwd();
const staged = path.join(ROOT, "site-context", ".generation-tmp", "project-map.json");
const canonical = path.join(ROOT, "site-context", "project-map.json");
const stable = path.join(ROOT, "scripts", "generate-project-map.js");
const baselineManifest = path.join(ROOT, "scripts", "baseline", "baseline-manifest.json");
function sha(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
function run(script) { const result = spawnSync(process.execPath, [script], { cwd: ROOT, stdio: "inherit", shell: false }); if (result.error) throw result.error; if (result.status !== 0) process.exit(result.status || 1); }
try {
  const baseline = JSON.parse(fs.readFileSync(baselineManifest, "utf8"));
  if (sha(stable) !== baseline.sha256) throw new Error("Stable generator differs from baseline.");
  const canonicalHash = sha(canonical);
  const map = JSON.parse(fs.readFileSync(staged, "utf8"));
  if (!map.knowledgeGraph || !Array.isArray(map.knowledgeGraph.relations)) throw new Error("Knowledge Graph missing from staged map.");
  if (map.knowledgeGraph.relations.length === 0) throw new Error("Knowledge Graph contains no relations.");
  if (!map.knowledgeGraph.relations.some((r) => r.specifier === "next/link")) throw new Error("Expected external import next/link was not detected.");
  if (!map.knowledgeGraph.relations.some((r) => r.specifier === "@/lib/generated-posts" && r.targetKind === "internal" && r.resolved)) throw new Error("Expected @ alias import was not resolved.");
  run(path.join(__dirname, "validate-staged.js"));
  if (sha(canonical) !== canonicalHash) throw new Error("Canonical project map changed during Lote 2.");
  console.log("Context Engine V3 Lote 2 verified successfully.");
  console.log("Stable generator and canonical project-map.json remain unchanged.");
} catch (error) { console.error(error.message); process.exit(1); }

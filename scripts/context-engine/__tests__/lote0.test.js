"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");
const ROOT = process.cwd();
function sha256(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
test("baseline matches stable generator", () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/baseline/baseline-manifest.json"), "utf8"));
  assert.equal(sha256(path.join(ROOT, manifest.source)), manifest.sha256);
  assert.equal(sha256(path.join(ROOT, manifest.baseline)), manifest.sha256);
});
test("decision memory is valid and initialization is idempotent", () => {
  const tool = path.join(ROOT, "scripts/context-engine/decision-memory.js");
  const file = path.join(ROOT, "site-context/decision-memory.json");
  const before = sha256(file);
  const result = spawnSync(process.execPath, [tool, "init"], { cwd: ROOT, encoding: "utf8", shell: false });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(sha256(file), before);
});
test("Ajv2020 compiles the Context Engine schema", () => {
  const schema = JSON.parse(fs.readFileSync(path.join(ROOT, "site-context/context-engine-v3.schema.json"), "utf8"));
  const ajv = new Ajv2020({ strict: true, allErrors: true, allowUnionTypes: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  assert.equal(validate({ $schema: "./context-engine-v3.schema.json", schemaVersion: "3.0.0", generatedAt: new Date().toISOString(), project: {}, architecture: {}, filesystem: [], routes: [], dependencies: {}, scripts: {}, components: [], posts: [], importGraph: [], integrations: {}, runtime: {}, executionFlow: {}, contextEngine: {}, sourceMapStatus: {}, sourceFiles: [], excludedSourceFiles: [] }), true, JSON.stringify(validate.errors));
});

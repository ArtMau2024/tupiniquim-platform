"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { validateRegistry, definitions } = require("../source-registry");
const ROOT = process.cwd();
function hash(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
function fixture() {
  return {
    schemaVersion: "1.0.0",
    sources: definitions.map(item => ({ ...item, sha256: hash(path.resolve(ROOT, item.path)) }))
  };
}
test("validates the fifteen canonical Harness sources", () => assert.equal(validateRegistry(fixture(), true).sources.length, 15));
test("rejects duplicate source ids", () => {
  const registry = fixture();
  registry.sources[1] = { ...registry.sources[1], id: registry.sources[0].id };
  assert.throws(() => validateRegistry(registry, false), /Duplicate source id/);
});
test("rejects duplicate source paths", () => {
  const registry = fixture();
  registry.sources[1] = { ...registry.sources[1], path: registry.sources[0].path };
  assert.throws(() => validateRegistry(registry, false), /Duplicate source path/);
});
test("rejects a stale source hash", () => {
  const registry = fixture();
  registry.sources[0] = { ...registry.sources[0], sha256: "0".repeat(64) };
  assert.throws(() => validateRegistry(registry, true), /hash mismatch/);
});

"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { resolveReference } = require("../context-resolver");
test("resolves the canonical Anchor MVP plan", () => {
  const result = resolveReference("plan://PLAN-ANCHOR-MVP");
  assert.equal(result.type, "plan");
  assert.equal(result.value.id, "PLAN-ANCHOR-MVP");
});
test("resolves an active decision from Decision Memory", () => {
  const result = resolveReference("decision://DEC-2026-ANCHOR-HARNESS-FIRST");
  assert.equal(result.type, "decision");
  assert.equal(result.value.status, "active");
});
test("rejects unsupported references", () => {
  assert.throws(() => resolveReference("unknown://item"), /Unsupported/);
});
test("rejects file references outside the project root", () => {
  assert.throws(() => resolveReference("file://../outside.txt"), /escapes/);
});

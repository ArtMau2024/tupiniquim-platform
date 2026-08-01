"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { validateDecision, validate } = require("../decision-memory");
const decision = {
  id: "DEC-2026-001", title: "Priorizar CMS", status: "active", decidedAt: "2026-07-30", category: "product-priority",
  context: "Contexto", decision: "Decisao", reason: "Motivo", impacts: ["Impacto"], rules: ["Regra"],
  resumeCriteria: ["Criterio"], supersedes: [], affectedAreas: ["CMS"]
};
test("validates the complete persistent decision contract", () => assert.equal(validateDecision(decision), decision));
test("rejects duplicate decision ids", () => assert.throws(() => validate({ schemaVersion: "1.0.0", decisions: [decision, decision] }), /Duplicate/));
test("rejects unknown superseded decisions", () => assert.throws(() => validate({ schemaVersion: "1.0.0", decisions: [{ ...decision, supersedes: ["DEC-UNKNOWN"] }] }), /unknown/));

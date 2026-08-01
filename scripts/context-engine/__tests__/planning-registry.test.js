"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { validatePlan } = require("../planning-registry");
const decisions = new Set(["DEC-1"]);
const plan = {
  id: "PLAN-TEST",
  projectId: "PRJ-TEST",
  title: "Plano de teste",
  status: "in_progress",
  objective: "Validar o contrato.",
  motivation: ["Evitar regressao."],
  scope: ["Contrato."],
  nonGoals: [],
  sources: ["source.md"],
  phases: [{ id: "PHASE-TEST-01", name: "Fase", status: "in_progress", objective: "Testar.", deliverables: ["saida.json"], acceptanceCriteria: ["Saida valida."] }],
  currentPhase: "PHASE-TEST-01",
  nextPhase: null,
  risks: [],
  globalAcceptanceCriteria: ["Contrato valido."],
  relatedDecisions: ["DEC-1"]
};
test("validates a complete in-progress plan", () => assert.equal(validatePlan(plan, "PLAN-TEST.json", decisions), plan));
test("rejects a physical filename that differs from the stable id", () => assert.throws(() => validatePlan(plan, "wrong.json", decisions), /physical name/));
test("rejects references to missing decisions", () => assert.throws(() => validatePlan({ ...plan, relatedDecisions: ["DEC-MISSING"] }, "PLAN-TEST.json", decisions), /missing related decisions/));
test("rejects an inconsistent current phase", () => assert.throws(() => validatePlan({ ...plan, phases: [{ ...plan.phases[0], status: "planned" }] }, "PLAN-TEST.json", decisions), /not in_progress/));

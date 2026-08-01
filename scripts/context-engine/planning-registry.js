"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
const plansDir = path.join(ROOT, "site-context", "registry", "plans");
const memoryFile = path.join(ROOT, "site-context", "decision-memory.json");
const planStatuses = new Set(["planned", "in_progress", "blocked", "completed", "cancelled", "paused"]);
const phaseStatuses = new Set(["planned", "in_progress", "blocked", "completed", "cancelled", "paused"]);
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function planFiles() {
  if (!fs.existsSync(plansDir)) return [];
  return fs.readdirSync(plansDir).filter(name => /^PLAN-[A-Z0-9-]+\.json$/.test(name)).sort();
}
function requiredText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required.`);
}
function requiredStringArray(value, label, allowEmpty = false) {
  if (!Array.isArray(value) || (!allowEmpty && value.length === 0) || value.some(item => typeof item !== "string" || !item.trim())) throw new Error(`${label} must be ${allowEmpty ? "an" : "a non-empty"} array of strings.`);
}
function validatePlan(plan, fileName, decisionIds) {
  if (!plan || typeof plan !== "object") throw new Error(`${fileName}: plan must be an object.`);
  for (const field of ["id", "projectId", "title", "objective"]) requiredText(plan[field], `${fileName}: ${field}`);
  if (!/^PLAN-[A-Z0-9-]+$/.test(plan.id)) throw new Error(`${fileName}: invalid plan id ${plan.id}.`);
  if (fileName !== `${plan.id}.json`) throw new Error(`${fileName}: physical name must match plan id ${plan.id}.`);
  if (!planStatuses.has(plan.status)) throw new Error(`${fileName}: invalid status ${plan.status}.`);
  for (const field of ["motivation", "scope", "nonGoals", "sources", "globalAcceptanceCriteria", "relatedDecisions"]) requiredStringArray(plan[field], `${fileName}: ${field}`, field === "nonGoals");
  const missingDecisions = plan.relatedDecisions.filter(id => !decisionIds.has(id));
  if (missingDecisions.length) throw new Error(`${fileName}: missing related decisions: ${missingDecisions.join(", ")}.`);
  if (!Array.isArray(plan.phases) || plan.phases.length === 0) throw new Error(`${fileName}: phases are required.`);
  const phaseIds = new Set();
  for (const phase of plan.phases) {
    for (const field of ["id", "name", "objective"]) requiredText(phase[field], `${fileName}: phase ${field}`);
    if (!/^PHASE-[A-Z0-9-]+$/.test(phase.id)) throw new Error(`${fileName}: invalid phase id ${phase.id}.`);
    if (phaseIds.has(phase.id)) throw new Error(`${fileName}: duplicate phase id ${phase.id}.`);
    phaseIds.add(phase.id);
    if (!phaseStatuses.has(phase.status)) throw new Error(`${fileName}: invalid phase status ${phase.status}.`);
    requiredStringArray(phase.deliverables, `${fileName}: ${phase.id} deliverables`);
    requiredStringArray(phase.acceptanceCriteria, `${fileName}: ${phase.id} acceptanceCriteria`);
  }
  if (plan.status === "in_progress") {
    requiredText(plan.currentPhase, `${fileName}: currentPhase`);
    if (!phaseIds.has(plan.currentPhase)) throw new Error(`${fileName}: current phase does not exist.`);
    const current = plan.phases.find(phase => phase.id === plan.currentPhase);
    if (current.status !== "in_progress") throw new Error(`${fileName}: current phase is not in_progress.`);
  }
  if (plan.nextPhase && !phaseIds.has(plan.nextPhase)) throw new Error(`${fileName}: next phase does not exist.`);
  return plan;
}
function loadValidated() {
  const memory = readJson(memoryFile);
  const decisionIds = new Set(memory.decisions.map(item => item.id));
  const seen = new Set();
  return planFiles().map(fileName => {
    const plan = validatePlan(readJson(path.join(plansDir, fileName)), fileName, decisionIds);
    if (seen.has(plan.id)) throw new Error(`Duplicate plan id: ${plan.id}`);
    seen.add(plan.id);
    return plan;
  });
}
function list() {
  const plans = loadValidated();
  for (const plan of plans) console.log(`${plan.id} | ${plan.status} | ${plan.projectId} | ${plan.title}`);
  console.log(`Total plans: ${plans.length}`);
}
function show(id) {
  requiredText(id, "Plan id");
  const plans = loadValidated();
  const plan = plans.find(item => item.id === id);
  if (!plan) throw new Error(`Plan not found: ${id}`);
  console.log(JSON.stringify(plan, null, 2));
}
function validateAll() {
  const plans = loadValidated();
  if (!plans.length) throw new Error("Planning Registry has no plans.");
  console.log(`Planning Registry is valid. Plans: ${plans.length}.`);
}
function main() {
  const command = process.argv[2];
  try {
    if (command === "list") list();
    else if (command === "show") show(process.argv[3]);
    else if (command === "validate") validateAll();
    else throw new Error(`Unsupported Planning Registry command: ${String(command)}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
if (require.main === module) main();
module.exports = { validatePlan };

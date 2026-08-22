"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
const plansDir = path.join(ROOT, "site-context", "registry", "plans");
const memoryFile = path.join(ROOT, "site-context", "decision-memory.json");
const statuses = new Set(["planned", "in_progress", "blocked", "completed", "cancelled", "paused"]);
const executionStates = new Set(["executing", "awaiting_next_authorization"]);
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function planFiles() { return fs.existsSync(plansDir) ? fs.readdirSync(plansDir).filter(name => /^PLAN-[A-Z0-9-]+\.json$/.test(name)).sort() : []; }
function requiredText(value, label) { if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required.`); }
function requiredStringArray(value, label, allowEmpty = false) { if (!Array.isArray(value) || (!allowEmpty && value.length === 0) || value.some(item => typeof item !== "string" || !item.trim())) throw new Error(`${label} must be ${allowEmpty ? "an" : "a non-empty"} array of strings.`); }
function validateTask(task, label, taskIds) {
  if (!task || typeof task !== "object") throw new Error(`${label}: task must be an object.`);
  for (const field of ["id", "title", "objective"]) requiredText(task[field], `${label}: ${field}`);
  if (!/^TASK-[A-Z0-9-]+$/.test(task.id)) throw new Error(`${label}: invalid task id ${task.id}.`);
  if (taskIds.has(task.id)) throw new Error(`${label}: duplicate task id ${task.id}.`);
  taskIds.add(task.id);
  if (!statuses.has(task.status)) throw new Error(`${label}: invalid task status ${task.status}.`);
  requiredStringArray(task.acceptanceCriteria, `${label}: acceptanceCriteria`);
  if (Object.prototype.hasOwnProperty.call(task, "nextCommand")) requiredText(task.nextCommand, `${label}: nextCommand`);
}
function validatePlan(plan, fileName, decisionIds) {
  if (!plan || typeof plan !== "object") throw new Error(`${fileName}: plan must be an object.`);
  for (const field of ["id", "projectId", "title", "objective"]) requiredText(plan[field], `${fileName}: ${field}`);
  if (!/^PLAN-[A-Z0-9-]+$/.test(plan.id)) throw new Error(`${fileName}: invalid plan id ${plan.id}.`);
  if (fileName !== `${plan.id}.json`) throw new Error(`${fileName}: physical name must match plan id ${plan.id}.`);
  if (!statuses.has(plan.status)) throw new Error(`${fileName}: invalid status ${plan.status}.`);
  for (const field of ["motivation", "scope", "nonGoals", "sources", "globalAcceptanceCriteria", "relatedDecisions"]) requiredStringArray(plan[field], `${fileName}: ${field}`, field === "nonGoals");
  const missingDecisions = plan.relatedDecisions.filter(id => !decisionIds.has(id));
  if (missingDecisions.length) throw new Error(`${fileName}: missing related decisions: ${missingDecisions.join(", ")}.`);
  if (!Array.isArray(plan.phases) || !plan.phases.length) throw new Error(`${fileName}: phases are required.`);
  const phaseIds = new Set(); const taskIds = new Set(); const activeTasks = [];
  for (const phase of plan.phases) {
    for (const field of ["id", "name", "objective"]) requiredText(phase[field], `${fileName}: phase ${field}`);
    if (!/^PHASE-[A-Z0-9-]+$/.test(phase.id)) throw new Error(`${fileName}: invalid phase id ${phase.id}.`);
    if (phaseIds.has(phase.id)) throw new Error(`${fileName}: duplicate phase id ${phase.id}.`);
    phaseIds.add(phase.id);
    if (!statuses.has(phase.status)) throw new Error(`${fileName}: invalid phase status ${phase.status}.`);
    requiredStringArray(phase.deliverables, `${fileName}: ${phase.id} deliverables`);
    requiredStringArray(phase.acceptanceCriteria, `${fileName}: ${phase.id} acceptanceCriteria`);
    if (phase.tasks !== undefined && !Array.isArray(phase.tasks)) throw new Error(`${fileName}: ${phase.id} tasks must be an array when present.`);
    for (const task of phase.tasks || []) {
      validateTask(task, `${fileName}: ${phase.id}`, taskIds);
      if (task.status === "in_progress") activeTasks.push({ phaseId: phase.id, task });
    }
    if (phase.status === "completed" && (phase.tasks || []).some(task => task.status === "in_progress")) throw new Error(`${fileName}: completed phase ${phase.id} cannot contain an in_progress task.`);
  }
  if (plan.status === "in_progress") {
    const executionState = plan.executionState || "executing";
    if (!executionStates.has(executionState)) throw new Error(`${fileName}: invalid executionState ${executionState}.`);
    requiredText(plan.currentPhase, `${fileName}: currentPhase`);
    if (!phaseIds.has(plan.currentPhase)) throw new Error(`${fileName}: current phase does not exist.`);
    const current = plan.phases.find(phase => phase.id === plan.currentPhase);
    const currentActive = activeTasks.filter(item => item.phaseId === plan.currentPhase);
    if (executionState === "executing") {
      if (current.status !== "in_progress") throw new Error(`${fileName}: executing current phase is not in_progress.`);
      if (currentActive.length !== 1) throw new Error(`${fileName}: executing active phase must contain exactly one in_progress task.`);
      if (activeTasks.some(item => item.phaseId !== plan.currentPhase)) throw new Error(`${fileName}: in_progress task exists outside current phase.`);
    } else {
      if (activeTasks.length !== 0) throw new Error(`${fileName}: awaiting_next_authorization requires zero in_progress tasks.`);
      if (current.status !== "completed" && current.status !== "in_progress") throw new Error(`${fileName}: awaiting current phase must be completed or in_progress.`);
      for (const phase of plan.phases) for (const task of phase.tasks || []) if (Object.prototype.hasOwnProperty.call(task,"nextCommand")) throw new Error(`${fileName}: awaiting_next_authorization forbids nextCommand.`);
    }
  } else if (activeTasks.length) throw new Error(`${fileName}: non-active plan cannot contain in_progress tasks.`);
  if (plan.nextPhase && !phaseIds.has(plan.nextPhase)) throw new Error(`${fileName}: next phase does not exist.`);
  return plan;
}
function loadValidated() { const memory = readJson(memoryFile); const ids = new Set(memory.decisions.map(item => item.id)); const seen = new Set(); return planFiles().map(fileName => { const plan = validatePlan(readJson(path.join(plansDir, fileName)), fileName, ids); if (seen.has(plan.id)) throw new Error(`Duplicate plan id: ${plan.id}`); seen.add(plan.id); return plan; }); }
function main() { const command = process.argv[2]; try { const plans = loadValidated(); if (command === "validate") console.log(`Planning Registry is valid. Plans: ${plans.length}.`); else if (command === "list") { for (const plan of plans) console.log(`${plan.id} | ${plan.status} | ${plan.projectId} | ${plan.title}`); } else if (command === "show") { const plan = plans.find(x => x.id === process.argv[3]); if (!plan) throw new Error(`Plan not found: ${process.argv[3]}`); console.log(JSON.stringify(plan, null, 2)); } else throw new Error(`Unsupported Planning Registry command: ${String(command)}`); } catch (error) { console.error(error.message); process.exit(1); } }
if (require.main === module) main();
module.exports = { validatePlan, validateTask };
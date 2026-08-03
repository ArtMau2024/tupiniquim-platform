"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const ROOT = process.cwd();
const registryFile = path.join(ROOT, "site-context", "registry", "source-registry.json");
const definitions = [
  {
    id: "SRC-ANCHOR-HISTORICAL-DOCX",
    path: "docs/ÂNCORA PERMANENTE DO PROJETO.docx",
    type: "historical-document",
    role: "historical-operational-snapshot",
    authority: ["historical-anchor", "historical-rules", "historical-roadmap"],
    evidenceStatus: "historical",
    priority: 70,
    limitations: ["May contain outdated operational status.", "Must not overwrite current technical state automatically."]
  },
  {
    id: "SRC-BASELINE-HISTORICAL-DOCX",
    path: "docs/BASELINE.docx",
    type: "historical-document",
    role: "historical-patrimony",
    authority: ["historical-epics", "historical-method", "historical-milestones", "historical-rules"],
    evidenceStatus: "historical",
    priority: 80,
    limitations: ["Known conflicts with later project status require human resolution."]
  },
  {
    id: "SRC-BASELINE-MARKDOWN",
    path: "docs/baseline.md",
    type: "historical-document",
    role: "historical-baseline",
    authority: ["historical-epics", "historical-commits", "historical-gaps", "historical-adrs"],
    evidenceStatus: "historical",
    priority: 85,
    limitations: ["Reconstruction is incomplete.", "Missing ADR content must not be invented."]
  },
  {
    id: "SRC-PROJECT-MAP",
    path: "site-context/project-map.json",
    type: "generated-artifact",
    role: "current-technical-state",
    authority: ["current-architecture", "current-filesystem", "current-routes", "current-roadmap"],
    evidenceStatus: "current-derived",
    priority: 100,
    limitations: ["Derived and regenerable.", "Does not replace persistent decision or historical sources."]
  },
  {
    id: "SRC-DECISION-MEMORY",
    path: "site-context/decision-memory.json",
    type: "persistent-registry",
    role: "deliberative-truth",
    authority: ["active-decisions", "decision-rationale", "decision-rules", "resume-criteria"],
    evidenceStatus: "current-canonical",
    priority: 100,
    limitations: ["Stores decisions, not complete execution plans."]
  },
  {
    id: "SRC-CONTEXT-GOVERNANCE",
    path: "docs/context-engine-governance.md",
    type: "governance-document",
    role: "operational-governance",
    authority: ["persistence-process", "decision-lifecycle", "governance-procedure"],
    evidenceStatus: "current-canonical",
    priority: 95,
    limitations: ["Procedural authority only; not a technical inventory."]
  },
  {
    id: "SRC-ANCHOR-MVP-PLAN",
    path: "site-context/registry/plans/PLAN-ANCHOR-MVP.json",
    type: "planning-registry",
    role: "infrastructure-planning-history",
    authority: ["plan-status", "phases", "deliverables", "acceptance-criteria", "risks"],
    evidenceStatus: "historical-confirmed",
    priority: 80,
    limitations: ["Historical infrastructure plan; does not represent the active project or operational plan."]
  },
  {
    id: "SRC-ANCHOR-MVP-NARRATIVE",
    path: "docs/plans/anchor-engine-mvp.md",
    type: "planning-document",
    role: "planning-narrative",
    authority: ["plan-context", "plan-explanation", "risk-explanation"],
    evidenceStatus: "current-supporting",
    priority: 90,
    limitations: ["The structured plan controls machine-readable status and phase fields."]
  }
,
  {id:"SRC-HARNESS-RULES",path:"site-context/registry/rules/RULESET-HARNESS-QUALITY.json",type:"persistent-registry",role:"operational-rules",authority:["active-rules","rule-verification","rule-supersession"],evidenceStatus:"current-canonical",priority:100,limitations:["Stores operational rules, not decision rationale."]},
  {id:"SRC-METHOD-OF-OPERATION",path:"docs/method-of-operation.md",type:"governance-document",role:"agent-operation-method",authority:["operational-protocol","documentation-consultation","rag-usage","decision-clarity"],evidenceStatus:"current-canonical",priority:100,limitations:["Organizes the method; individual rules remain authoritative in the Rules Registry."]},
  {id:"SRC-PROJECT-REGISTRY",path:"site-context/registry/projects/PROJECT-REGISTRY-TUPINIQUIM.json",type:"persistent-registry",role:"project-state-truth",authority:["project-status","project-capabilities","resume-conditions","current-initiative"],evidenceStatus:"current-canonical",priority:100,limitations:["Technical filesystem state remains derived from the Project Map."]},
  {id:"SRC-MIGRATION-MATRIX",path:"site-context/registry/migration-matrix.json",type:"migration-registry",role:"patrimony-inventory",authority:["migration-provenance","evidence-classification","canonical-destination","migration-status"],evidenceStatus:"current-canonical",priority:95,limitations:["Inventory does not activate historical items automatically."]},
  {id:"SRC-CONFLICT-REGISTER",path:"site-context/registry/conflict-register.json",type:"governance-registry",role:"conflict-truth",authority:["open-conflicts","source-positions","conflict-resolution","resolution-decision"],evidenceStatus:"current-canonical",priority:100,limitations:["A resolved conflict does not replace its related decision or source history."]},
  {id:"SRC-HISTORY-CONTEXT-V2-V3",path:"docs/history/context-engine-v2-transition.md",type:"historical-document",role:"technical-transition-history",authority:["context-v2-v3-transition","absorbed-capabilities","removed-artifacts"],evidenceStatus:"historical-confirmed",priority:75,limitations:["Historical authority only; it does not define the current implementation."]},
  {id:"SRC-HISTORY-GOVERNANCE-HOTFIXES",path:"docs/history/context-engine-governance-hotfixes.md",type:"historical-document",role:"governance-hotfix-history",authority:["decision-memory-integration-history","governance-evolution","import-safety-history"],evidenceStatus:"historical-confirmed",priority:75,limitations:["Historical authority only; current behavior is defined by operational code and registries."]},
  {id:"SRC-PROJECT-HISTORY",path:"docs/project-history.md",type:"historical-registry",role:"verified-project-history",authority:["verified-commits","historical-hash-divergences","published-milestones"],evidenceStatus:"current-canonical",priority:95,limitations:["Git remains authoritative for commit objects and file changes."]},
  {id:"SRC-ADR-REGISTRY",path:"docs/adr-registry.md",type:"historical-registry",role:"adr-gap-registry",authority:["historical-adr-existence","historical-adr-approval","adr-gaps"],evidenceStatus:"current-canonical",priority:95,limitations:["Original ADR decisions were not recovered and must not be invented."]}
,
  {id:"SRC-CMS-PLAN",path:"site-context/registry/plans/PLAN-EDITORIAL-CMS-MVP.json",type:"persistent-registry",role:"current-execution-plan",authority:["active-editorial-project","cms-phases","cms-tasks","cms-acceptance-criteria","next-operational-action"],evidenceStatus:"current-canonical",priority:100,limitations:["Active selection depends on Project and Planning Registries; technical state remains verified by code and tests."]}

];
function sha256(file) { return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex"); }
function atomicJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  JSON.parse(fs.readFileSync(temp, "utf8"));
  fs.renameSync(temp, file);
}
function validateExecutionPlanDefinitions(items = definitions) {
  const current = items.filter(item => item.role === "current-execution-plan");
  if (current.length !== 1) throw new Error(`Expected exactly one current-execution-plan source, found ${current.length}.`);
  const selected = require("./active-plan").selectActiveProjectAndPlan();
  const source = current[0];
  if (source.evidenceStatus === "historical-confirmed") throw new Error("Historical source cannot be current-execution-plan.");
  if (source.path !== selected.planPath) throw new Error("Current execution plan source path differs from active plan path.");
  if (selected.plan.status !== "in_progress") throw new Error("Current execution plan must be in_progress.");
  if (selected.plan.projectId !== selected.activeProject.id) throw new Error("Current execution plan project differs from active project.");
  return source;
}
function validateRegistry(registry, checkHashes = true) {
  validateExecutionPlanDefinitions(definitions);
  if (!registry || registry.schemaVersion !== "1.0.0" || !Array.isArray(registry.sources)) throw new Error("Invalid Source Registry structure.");
  if (registry.sources.length !== definitions.length) throw new Error(`Expected ${definitions.length} sources, received ${registry.sources.length}.`);
  const ids = new Set();
  const paths = new Set();
  for (const source of registry.sources) {
    for (const field of ["id", "path", "type", "role", "evidenceStatus", "sha256"]) if (typeof source[field] !== "string" || !source[field].trim()) throw new Error(`Source ${field} is required.`);
    if (!/^SRC-[A-Z0-9-]+$/.test(source.id)) throw new Error(`Invalid source id: ${source.id}`);
    if (ids.has(source.id)) throw new Error(`Duplicate source id: ${source.id}`);
    if (paths.has(source.path)) throw new Error(`Duplicate source path: ${source.path}`);
    ids.add(source.id); paths.add(source.path);
    if (!Array.isArray(source.authority) || !source.authority.length) throw new Error(`Source authority is required: ${source.id}`);
    if (!Array.isArray(source.limitations)) throw new Error(`Source limitations must be an array: ${source.id}`);
    if (!Number.isInteger(source.priority) || source.priority < 0 || source.priority > 100) throw new Error(`Invalid source priority: ${source.id}`);
    const file = path.resolve(ROOT, source.path);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`Source file not found: ${source.path}`);
    if (checkHashes && sha256(file) !== source.sha256) throw new Error(`Source hash mismatch: ${source.id}`);
  }
  return registry;
}
function generate() {
  const sources = definitions.map(definition => {
    const file = path.resolve(ROOT, definition.path);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`Source file not found: ${definition.path}`);
    return { ...definition, sha256: sha256(file) };
  });
  const registry = { schemaVersion: "1.0.0", generatedAt: new Date().toISOString(), sources };
  validateRegistry(registry, true);
  atomicJson(registryFile, registry);
  console.log(`Source Registry generated: ${sources.length} sources.`);
}
function readRegistry() {
  if (!fs.existsSync(registryFile)) throw new Error("Source Registry not found. Run context:source:generate.");
  return JSON.parse(fs.readFileSync(registryFile, "utf8"));
}
function list() {
  const registry = validateRegistry(readRegistry(), true);
  for (const source of registry.sources) console.log(`${source.id} | ${source.evidenceStatus} | ${source.role} | ${source.path}`);
  console.log(`Total sources: ${registry.sources.length}`);
}
function validate() {
  const registry = validateRegistry(readRegistry(), true);
  console.log(`Source Registry is valid. Sources: ${registry.sources.length}.`);
}
function main() {
  try {
    const command = process.argv[2];
    if (command === "generate") generate();
    else if (command === "list") list();
    else if (command === "validate") validate();
    else throw new Error(`Unsupported Source Registry command: ${String(command)}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
if (require.main === module) main();
module.exports = { validateRegistry, definitions, validateExecutionPlanDefinitions };

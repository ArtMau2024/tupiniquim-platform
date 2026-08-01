"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
const memoryFile = path.join(ROOT, "site-context", "decision-memory.json");
const statuses = new Set(["active", "superseded", "completed", "cancelled"]);
const categories = new Set(["product-priority", "architecture", "governance", "operations"]);
function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  JSON.parse(fs.readFileSync(temp, "utf8"));
  fs.renameSync(temp, file);
}
function requireText(item, field) {
  if (typeof item[field] !== "string" || !item[field].trim()) throw new Error(`Decision ${field} is required.`);
}
function requireStringArray(item, field) {
  if (!Array.isArray(item[field]) || item[field].some(value => typeof value !== "string" || !value.trim())) throw new Error(`Decision ${field} must be an array of non-empty strings.`);
}
function validateDecision(item) {
  if (!item || typeof item !== "object") throw new Error("Decision must be an object.");
  for (const field of ["id", "title", "decidedAt", "context", "decision", "reason"]) requireText(item, field);
  if (!/^DEC-[A-Z0-9-]+$/.test(item.id)) throw new Error(`Invalid decision id: ${item.id}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(item.decidedAt)) throw new Error(`Invalid decision date: ${item.decidedAt}`);
  if (!statuses.has(item.status)) throw new Error(`Invalid decision status: ${item.status}`);
  if (!categories.has(item.category)) throw new Error(`Invalid decision category: ${item.category}`);
  for (const field of ["impacts", "rules", "resumeCriteria", "supersedes", "affectedAreas"]) requireStringArray(item, field);
  return item;
}
function validate(memory) {
  if (!memory || memory.schemaVersion !== "1.0.0" || !Array.isArray(memory.decisions)) throw new Error("Invalid decision memory structure.");
  const ids = new Set();
  for (const item of memory.decisions) {
    validateDecision(item);
    if (ids.has(item.id)) throw new Error(`Duplicate decision id: ${item.id}`);
    ids.add(item.id);
  }
  for (const item of memory.decisions) for (const prior of item.supersedes) if (!ids.has(prior)) throw new Error(`Decision ${item.id} supersedes unknown id: ${prior}`);
  return memory;
}
function readMemory() {
  if (!fs.existsSync(memoryFile)) return { schemaVersion: "1.0.0", decisions: [] };
  return validate(JSON.parse(fs.readFileSync(memoryFile, "utf8")));
}
function init() {
  if (!fs.existsSync(memoryFile)) writeJsonAtomic(memoryFile, { schemaVersion: "1.0.0", decisions: [] });
  validate(readMemory());
  console.log("Decision Memory already exists and is valid.");
}
function add(inputFile) {
  if (!inputFile) throw new Error("Usage: decision-memory.js add <decision.json>");
  const inputPath = path.resolve(ROOT, inputFile);
  const decision = validateDecision(JSON.parse(fs.readFileSync(inputPath, "utf8")));
  const memory = readMemory();
  if (memory.decisions.some(item => item.id === decision.id)) throw new Error(`Duplicate decision id: ${decision.id}`);
  memory.decisions.push(decision);
  memory.decisions.sort((a, b) => a.decidedAt.localeCompare(b.decidedAt) || a.id.localeCompare(b.id));
  validate(memory);
  writeJsonAtomic(memoryFile, memory);
  validate(readMemory());
  console.log(`Decision added: ${decision.id} - ${decision.title}`);
}
function list() {
  const memory = readMemory();
  for (const item of memory.decisions) console.log(`${item.id} | ${item.status} | ${item.category} | ${item.title}`);
  console.log(`Total decisions: ${memory.decisions.length}`);
}
function main() {
  const command = process.argv[2];
  try {
    if (command === "init") init();
    else if (command === "add") add(process.argv[3]);
    else if (command === "list") list();
    else if (command === "validate") { validate(readMemory()); console.log("Decision Memory is valid."); }
    else throw new Error(`Unsupported command: ${String(command)}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
if (require.main === module) main();
module.exports = { validateDecision, validate };

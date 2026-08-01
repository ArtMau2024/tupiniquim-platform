"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();
function readJson(file) { return JSON.parse(fs.readFileSync(file, "utf8")); }
function safeProjectPath(value) {
  const resolved = path.resolve(ROOT, value);
  const relative = path.relative(ROOT, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("Reference escapes the project root.");
  return resolved;
}
function resolveReference(reference) {
  if (typeof reference !== "string" || !reference.trim()) throw new Error("Reference is required.");
  if (reference.startsWith("plan://")) {
    const id = reference.slice("plan://".length);
    if (!/^PLAN-[A-Z0-9-]+$/.test(id)) throw new Error(`Invalid plan reference: ${reference}`);
    const file = path.join(ROOT, "site-context", "registry", "plans", `${id}.json`);
    if (!fs.existsSync(file)) throw new Error(`Plan not found: ${id}`);
    return { type: "plan", reference, source: path.relative(ROOT, file).replace(/\\/g, "/"), value: readJson(file) };
  }
  if (reference.startsWith("decision://")) {
    const id = reference.slice("decision://".length);
    const memoryFile = path.join(ROOT, "site-context", "decision-memory.json");
    const memory = readJson(memoryFile);
    const decision = memory.decisions.find(item => item.id === id);
    if (!decision) throw new Error(`Decision not found: ${id}`);
    return { type: "decision", reference, source: "site-context/decision-memory.json", value: decision };
  }
  if (reference.startsWith("file://")) {
    const relative = reference.slice("file://".length);
    const file = safeProjectPath(relative);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`File not found: ${relative}`);
    return { type: "file", reference, source: path.relative(ROOT, file).replace(/\\/g, "/"), value: fs.readFileSync(file, "utf8") };
  }
  throw new Error(`Unsupported reference: ${reference}`);
}
function main() {
  try {
    const reference = process.argv[2];
    const resolved = resolveReference(reference);
    console.log(`Reference: ${resolved.reference}`);
    console.log(`Type: ${resolved.type}`);
    console.log(`Source: ${resolved.source}\n`);
    console.log(typeof resolved.value === "string" ? resolved.value : JSON.stringify(resolved.value, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
if (require.main === module) main();
module.exports = { resolveReference };

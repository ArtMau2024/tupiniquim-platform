"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const ROOT = process.cwd();
const memoryFile = path.join(ROOT, "site-context", "decision-memory.json");
function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  JSON.parse(fs.readFileSync(temp, "utf8"));
  fs.renameSync(temp, file);
}
function validate(memory) {
  if (!memory || memory.schemaVersion !== "1.0.0" || !Array.isArray(memory.decisions)) throw new Error("Invalid decision memory structure.");
  const ids = new Set();
  for (const item of memory.decisions) {
    if (!item || typeof item.id !== "string" || !item.id.trim()) throw new Error("Decision id is required.");
    if (ids.has(item.id)) throw new Error(`Duplicate decision id: ${item.id}`);
    ids.add(item.id);
  }
  return memory;
}
function init() {
  if (!fs.existsSync(memoryFile)) {
    writeJsonAtomic(memoryFile, { schemaVersion: "1.0.0", decisions: [] });
    console.log("Decision Memory initialized."); return;
  }
  validate(JSON.parse(fs.readFileSync(memoryFile, "utf8")));
  console.log("Decision Memory already exists and is valid.");
}
const command = process.argv[2];
try {
  if (command === "init") init();
  else throw new Error(`Unsupported command in Lote 0: ${String(command)}`);
} catch (error) { console.error(error.message); process.exit(1); }

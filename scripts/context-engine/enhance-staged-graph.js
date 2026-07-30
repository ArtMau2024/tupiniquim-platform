"use strict";
const fs = require("fs");
const path = require("path");
const { buildKnowledgeGraph } = require("./knowledge-graph");
const ROOT = process.cwd();
const stagedFile = path.join(ROOT, "site-context", ".generation-tmp", "project-map.json");
function writeAtomic(file, value) { const temp = `${file}.tmp`; fs.writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8"); JSON.parse(fs.readFileSync(temp, "utf8")); fs.renameSync(temp, file); }
try {
  if (!fs.existsSync(stagedFile)) throw new Error("Staged project map not found. Run Lote 1 verification first.");
  const map = JSON.parse(fs.readFileSync(stagedFile, "utf8"));
  const graph = buildKnowledgeGraph(ROOT, map.sourceFiles || []);
  map.knowledgeGraph = graph;
  map.importGraph = (map.importGraph || []).map((entry) => ({ ...entry, imports: graph.relations.filter((relation) => relation.source === entry.file).map((relation) => relation.specifier) }));
  writeAtomic(stagedFile, map);
  console.log(`Knowledge Graph generated: ${graph.relations.length} relations, ${graph.cycles.length} cycles, ${graph.parseErrors.length} parse errors.`);
} catch (error) { console.error(error.message); process.exit(1); }

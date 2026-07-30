"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { searchContext } = require("./context-query");
const ROOT = process.cwd();
function sha(text) { return crypto.createHash("sha256").update(text, "utf8").digest("hex"); }
try {
  const mapRaw = fs.readFileSync(path.join(ROOT, "site-context", "project-map.json"), "utf8");
  const indexRaw = fs.readFileSync(path.join(ROOT, "site-context", "context-index.json"), "utf8");
  const index = JSON.parse(indexRaw);
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "site-context", "context-manifest.json"), "utf8"));
  if (index.sourceProjectMapHash !== sha(mapRaw)) throw new Error("Official Context Index is not synchronized with project-map.json.");
  if (manifest.artifacts.contextIndex.sha256 !== sha(indexRaw)) throw new Error("Official Context Index hash does not match manifest.");
  const imports = searchContext(index, "knowledge graph imports", { limit: 5 });
  const blog = searchContext(index, "categorias blog", { limit: 5 });
  if (!imports.length) throw new Error("Query engine returned no result for Knowledge Graph.");
  if (!blog.length) throw new Error("Query engine returned no result for Blog categories.");
  if (!imports.some(result => /knowledge-graph|generate-project-map|context-engine/.test(result.sourcePath))) throw new Error("Knowledge Graph query did not return an expected technical source.");
  console.log(`Context query verified successfully against ${index.chunks.length} official chunks.`);
  console.log(`Knowledge Graph query results: ${imports.length}. Blog query results: ${blog.length}.`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

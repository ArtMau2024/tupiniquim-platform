"use strict";
const fs = require("fs");
const path = require("path");
const { searchContext } = require("./context-query");
const ROOT = process.cwd();
function parseArgs(argv) {
  const args = { query: [], limit: 5, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--limit") { args.limit = Number(argv[i + 1]); i += 1; }
    else if (argv[i] === "--json") args.json = true;
    else args.query.push(argv[i]);
  }
  return { query: args.query.join(" ").trim(), limit: args.limit, json: args.json };
}
try {
  const args = parseArgs(process.argv.slice(2));
  if (!args.query) throw new Error('Usage: npm run context:query -- "your question" [--limit 5] [--json]');
  const indexFile = path.join(ROOT, "site-context", "context-index.json");
  const index = JSON.parse(fs.readFileSync(indexFile, "utf8"));
  const results = searchContext(index, args.query, { limit: args.limit });
  if (args.json) console.log(JSON.stringify({ query: args.query, count: results.length, results }, null, 2));
  else {
    console.log(`Query: ${args.query}`);
    console.log(`Results: ${results.length}\n`);
    results.forEach((result, indexPosition) => {
      console.log(`[${indexPosition + 1}] ${result.sourcePath}:${result.startLine}-${result.endLine}`);
      console.log(`Score: ${result.score} | Terms: ${result.matchedTerms.join(", ")}`);
      console.log(result.content.trim());
      console.log("\n---\n");
    });
  }
  if (!results.length) process.exitCode = 2;
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

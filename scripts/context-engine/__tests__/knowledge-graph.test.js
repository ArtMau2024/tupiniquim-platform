"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const { collectRelations, detectCycles } = require("../knowledge-graph");
const ROOT = process.cwd();
test("extracts imports without false positives from comments and strings", () => {
  const code = `// import fake from "./fake"\nconst text = 'require("./fake")';\nimport Link from "next/link";\nimport type { X } from "./types";\nexport * from "./public";\nconst lazy = import("./lazy");`;
  const result = collectRelations(ROOT, path.join("fixtures", "sample.ts"), code, {});
  assert.deepEqual(result.relations.map((r)=>r.specifier).sort(), ["./lazy","./public","./types","next/link"].sort());
  assert.equal(result.relations.find((r)=>r.specifier==="./types").relationType, "type_import");
});
test("detects a circular dependency", () => {
  const relations = [
    { id:"REL-A", source:"a.ts", target:"b.ts", targetKind:"internal", resolved:true },
    { id:"REL-B", source:"b.ts", target:"a.ts", targetKind:"internal", resolved:true }
  ];
  assert.equal(detectCycles(relations).length, 1);
});

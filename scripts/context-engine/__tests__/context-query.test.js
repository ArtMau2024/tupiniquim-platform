"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const { normalize, tokenize, searchContext } = require("../context-query");
const index = { chunks: [
  { id:"1", sourcePath:"scripts/context-engine/knowledge-graph.js", startLine:1, endLine:10, language:"javascript", category:"source-code", content:"Resolve internal imports and detect circular dependencies." },
  { id:"2", sourcePath:"app/blog/page.tsx", startLine:1, endLine:10, language:"typescript-react", category:"source-code", content:"Blog categories and latest publications." },
  { id:"3", sourcePath:"docs/other.md", startLine:1, endLine:10, language:"markdown", category:"documentation", content:"Unrelated content." }
]};
test("normalizes accents and removes Portuguese stopwords", () => {
  assert.equal(normalize("Categorias do Blog"), "categorias do blog");
  assert.deepEqual(tokenize("Onde estão as categorias do Blog?"), ["categorias", "blog"]);
});
test("ranks technical source for an import graph query", () => {
  const results = searchContext(index, "imports dependências circulares", { limit: 2 });
  assert.equal(results[0].sourcePath, "scripts/context-engine/knowledge-graph.js");
  assert.ok(results[0].score > 0);
});
test("supports deterministic limits and empty queries", () => {
  assert.equal(searchContext(index, "blog", { limit: 1 }).length, 1);
  assert.deepEqual(searchContext(index, "de e para", { limit: 5 }), []);
});

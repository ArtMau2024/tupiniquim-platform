"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {buildChunks}=require("../context-indexer");
test("never exceeds maxChars when a double newline crosses the boundary",()=>{
  const content="x".repeat(998)+"\n\n"+"tail";
  const file={path:"boundary.md",sha256:"boundary",language:"markdown",category:"documentation",redacted:false,content};
  const chunks=buildChunks(file,{maxChars:1000,overlapChars:150});
  assert.ok(chunks.length>=2);
  assert.ok(chunks.every(chunk=>chunk.content.length<=1000));
});

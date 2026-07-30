"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("fs");
const path=require("path");
test("V3 generator excludes official and transactional site-context artifacts",()=>{
 const source=fs.readFileSync(path.join(process.cwd(),"scripts","generate-project-map-v3.js"),"utf8");
 for(const value of ["site-context/context-index.json","site-context/context-manifest.json","site-context/decision-memory.json","site-context/context-engine-v3.schema.json","site-context/.generation-tmp/","site-context/.promotion-backup/"]) assert.ok(source.includes(value),value);
});

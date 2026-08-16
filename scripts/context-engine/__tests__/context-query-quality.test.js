"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("fs");
const path=require("path");
const {tokenize,searchContext}=require("../context-query");
test("removes weak Portuguese verb stopwords",()=>{assert.deepEqual(tokenize("onde está e onde ficam as categorias"),["categorias"]);});
test("diversifies top results by source file",()=>{const index={chunks:[{id:"1",sourcePath:"a.js",startLine:1,endLine:2,content:"blog categorias"},{id:"2",sourcePath:"a.js",startLine:3,endLine:4,content:"blog categorias"},{id:"3",sourcePath:"b.js",startLine:1,endLine:2,content:"blog categorias"}]};const results=searchContext(index,"blog categorias",{limit:2});assert.deepEqual(results.map(x=>x.sourcePath),["a.js","b.js"]);});
test("generator excludes tests fixtures and baseline from semantic sources",()=>{const source=fs.readFileSync(path.join(process.cwd(),"scripts","generate-project-map-v3.js"),"utf8");for(const item of ["scripts/context-engine/__tests__/","scripts/context-engine/fixtures/","scripts/baseline/"])assert.ok(source.includes(item),item);});

test("generator excludes backup variants from semantic sources",()=>{const source=fs.readFileSync(path.join(process.cwd(),"scripts","generate-project-map-v3.js"),"utf8");assert.match(source,/\(\^\|\[\.\-\]\)backup/);});

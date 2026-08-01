"use strict";
const test=require("node:test");const assert=require("node:assert/strict");const fs=require("fs");const path=require("path");
test("ask context declares deterministic continuity mode",()=>{const source=fs.readFileSync(path.join(__dirname,"..","ask-context.js"),"utf8");assert.match(source,/intent==="project_continuity"/);assert.match(source,/mode="deterministic"/);assert.match(source,/else\{try\{answer=validateAnswer\(await chat/);});
test("deterministic continuity mode removes misleading fallback warning",()=>{const source=fs.readFileSync(path.join(__dirname,"..","ask-context.js"),"utf8");assert.match(source,/answer\.warnings=answer\.warnings\.filter/);});

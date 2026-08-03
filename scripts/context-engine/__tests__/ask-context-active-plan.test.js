"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const path=require("node:path");
const {spawnSync}=require("node:child_process");
test("context ask resolves the active CMS project and plan",()=>{const r=spawnSync(process.execPath,[path.join(process.cwd(),"scripts","context-engine","ask-context.js"),"Qual projeto esta em execucao, qual e a fase atual e qual tarefa deve ser executada agora?"],{cwd:process.cwd(),encoding:"utf8"});assert.equal(r.status,0,r.stderr||r.stdout);assert.match(r.stdout,/EPIC-004/);assert.match(r.stdout,/PHASE-EDITORIAL-CMS-01-FOUNDATION/);assert.match(r.stdout,/TASK-EDITORIAL-CMS-01-GOVERNANCE-CLOSEOUT/);assert.match(r.stdout,/site-context\/registry\/plans\/PLAN-EDITORIAL-CMS-MVP\.json/);assert.doesNotMatch(r.stdout,/site-context\/registry\/plans\/PLAN-ANCHOR-MVP\.json/);assert.doesNotMatch(r.stdout,/selectActiveProjectAndPlan is not defined/);});

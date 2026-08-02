"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const {buildContextPackage}=require("../context-package");
const {selectActiveProjectAndPlan}=require("../active-plan");
function read(file){return JSON.parse(fs.readFileSync(file,"utf8"));}
test("project continuity declares only the selected CMS plan source",()=>{const selected=selectActiveProjectAndPlan();const pkg=buildContextPackage({question:"estado",intent:"project_continuity",map:{},index:{chunks:[]},projects:selected.projects,plan:selected.plan,planPath:selected.planPath,memory:read("site-context/decision-memory.json"),rules:read("site-context/registry/rules/RULESET-HARNESS-QUALITY.json"),conflicts:read("site-context/registry/conflict-register.json")});assert.equal(pkg.sources.length,5);assert.ok(pkg.sources.includes("site-context/registry/plans/PLAN-EDITORIAL-CMS-MVP.json"));assert.ok(!pkg.sources.includes("site-context/registry/plans/PLAN-ANCHOR-MVP.json"));});

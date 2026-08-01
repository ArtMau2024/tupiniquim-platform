"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {fallback,validateAnswer}=require("../contextual-answer");
const pkg={intent:"product_roadmap",facts:{currentEpic:{name:"Site",status:"in_progress"},nextEpic:{name:"CMS"},technicalRecommendation:"Resolve DT-001"},sources:["project-map.json#contextEngine.projectStatus","project-map.json#contextEngine.roadmap","project-map.json#aiContext.recommendedAction"],warnings:[]};
test("product roadmap requires complete fields and all minimum sources",()=>{const valid=fallback(pkg);assert.equal(validateAnswer(valid,pkg),valid);assert.throws(()=>validateAnswer({...valid,currentStatus:null},pkg),/currentStatus/);assert.throws(()=>validateAnswer({...valid,sources:[pkg.sources[1]]},pkg),/Required source/);});
test("incomplete Ollama product response is rejected for deterministic fallback",()=>{const incomplete={intent:"product_roadmap",answer:"CMS",sources:["project-map.json#contextEngine.roadmap"],warnings:[]};assert.throws(()=>validateAnswer(incomplete,pkg));});

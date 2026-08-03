"use strict";
const test=require("node:test");const assert=require("node:assert/strict");const {validatePlan}=require("../planning-registry");const decisions=new Set(["DEC-1"]);
function task(id,status="in_progress",extra={}){return{id,title:id,status,objective:"Validar.",acceptanceCriteria:["Valido."],...extra};}
function base(){return{id:"PLAN-TEST",projectId:"PRJ-TEST",title:"Plano",status:"in_progress",objective:"Validar.",motivation:["M"],scope:["S"],nonGoals:[],sources:["source.md"],globalAcceptanceCriteria:["G"],relatedDecisions:["DEC-1"],phases:[{id:"PHASE-TEST-01",name:"Atual",status:"in_progress",objective:"O",deliverables:["D"],acceptanceCriteria:["A"],tasks:[task("TASK-TEST-A")]},{id:"PHASE-TEST-02",name:"Futura",status:"planned",objective:"O",deliverables:["D"],acceptanceCriteria:["A"]}],currentPhase:"PHASE-TEST-01",nextPhase:"PHASE-TEST-02"};}
const valid=p=>validatePlan(p,"PLAN-TEST.json",decisions);
test("accepts active plan and future phase without tasks",()=>assert.equal(valid(base()).id,"PLAN-TEST"));
test("accepts empty tasks in future phase",()=>{const p=base();p.phases[1].tasks=[];assert.equal(valid(p).id,"PLAN-TEST");});
test("accepts optional nextCommand",()=>{const p=base();p.phases[0].tasks[0].nextCommand="npm run context:bootstrap";assert.equal(valid(p).id,"PLAN-TEST");});
test("rejects empty nextCommand",()=>{const p=base();p.phases[0].tasks[0].nextCommand="";assert.throws(()=>valid(p),/nextCommand/);});
test("rejects duplicate task ids",()=>{const p=base();p.phases[1].tasks=[task("TASK-TEST-A","planned")];assert.throws(()=>valid(p),/duplicate task id/);});
test("rejects no active task",()=>{const p=base();p.phases[0].tasks[0].status="completed";assert.throws(()=>valid(p),/exactly one/);});
test("rejects two active tasks",()=>{const p=base();p.phases[0].tasks.push(task("TASK-TEST-B"));assert.throws(()=>valid(p),/exactly one/);});
test("rejects active task outside current phase",()=>{const p=base();p.phases[1].tasks=[task("TASK-TEST-B")];assert.throws(()=>valid(p),/outside current phase/);});
test("rejects active task in completed phase",()=>{const p=base();p.phases[1].status="completed";p.phases[1].tasks=[task("TASK-TEST-B")];assert.throws(()=>valid(p),/completed phase|outside current phase/);});
test("rejects invalid task id and status",()=>{const p=base();p.phases[0].tasks[0].id="bad";assert.throws(()=>valid(p),/invalid task id/);const q=base();q.phases[0].tasks[0].status="bad";assert.throws(()=>valid(q),/invalid task status/);});
test("rejects missing task fields and empty criteria",()=>{const p=base();delete p.phases[0].tasks[0].title;assert.throws(()=>valid(p),/title/);const q=base();q.phases[0].tasks[0].acceptanceCriteria=[];assert.throws(()=>valid(q),/acceptanceCriteria/);});
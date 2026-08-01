"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {validateData}=require("../migration-registry");
function fixture(){const items=[];for(let i=0;i<70;i++)items.push({id:`MIG-RULE-${String(i+1).padStart(3,"0")}`,type:"rule",sourceRefs:["SRC-1"],evidenceStatus:"historical-confirmed",currentStatus:"unresolved",conflict:false,canonicalDestination:"site-context/registry/rules/",requiredAction:"review"});const summary={total:70,rules:70,methods:0,epics:0,adrs:0,commits:0,engines:0,conflicts:0};return{m:{items,summary},c:{conflicts:[],summary:{open:0}},s:{sources:[{id:"SRC-1"}]}};}
function audit(){return{status:"partial",classification:"historical-active / partially-covered",verifiedAt:"2026-08-01T00:00:00.000Z",destinationStatus:"existing",destinationEvidence:["docs/method-of-operation.md"],provenance:[{kind:"direct",ref:"SRC-1",note:"Direct historical evidence."}],gaps:["Full destination coverage is not proven."],correctedRefs:[],notes:"Audit does not change currentStatus."};}
test("accepts a complete audit block without changing migration status",()=>{const f=fixture();f.m.items[0].audit=audit();assert.equal(f.m.items[0].currentStatus,"unresolved");assert.doesNotThrow(()=>validateData(f.m,f.c,f.s));});
test("rejects unsupported audit status",()=>{const f=fixture();f.m.items[0].audit={...audit(),status:"resolved"};assert.throws(()=>validateData(f.m,f.c,f.s),/Invalid audit.status/);});
test("requires canonical ISO audit timestamp",()=>{const f=fixture();f.m.items[0].audit={...audit(),verifiedAt:"2026-08-01"};assert.throws(()=>validateData(f.m,f.c,f.s),/canonical ISO/);});
test("gap audit requires an explicit gap",()=>{const f=fixture();f.m.items[0].audit={...audit(),status:"gap",gaps:[]};assert.throws(()=>validateData(f.m,f.c,f.s),/Gap audit requires/);});
test("preserves historical and verified corrected references",()=>{const f=fixture();f.m.items[0].audit={...audit(),status:"verified",correctedRefs:[{kind:"commit",historical:"ff667591",verified:"f667591",evidence:"git show f667591"}]};assert.doesNotThrow(()=>validateData(f.m,f.c,f.s));});

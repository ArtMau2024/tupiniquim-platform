"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const {schemaForIntent}=require("../ollama-client");
test("product roadmap Ollama schema requires complete governance fields",()=>{const s=schemaForIntent("product_roadmap");for(const field of ["intent","answer","currentStatus","nextStep","technicalRecommendation","sources","warnings"])assert.ok(s.required.includes(field),field);});
test("context engine roadmap schema requires current status and next step",()=>{const s=schemaForIntent("context_engine_roadmap");assert.ok(s.required.includes("currentStatus"));assert.ok(s.required.includes("nextStep"));});
test("technical risk decisions and code schemas preserve core response contract",()=>{for(const intent of ["technical_risk","architecture_decision","code_search"]){const s=schemaForIntent(intent);assert.deepEqual(s.required,["intent","answer","sources","warnings"]);}});

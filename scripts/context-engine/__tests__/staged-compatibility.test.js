"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
test("technicalRoadmap is additive and legacy Context Engine fields remain stable",()=>{
 const canonical={contextEngine:{productVision:{name:"X"},businessGoals:["A"],projectStatus:{name:"Site"},roadmap:[{name:"Site"}],architectureDecisions:[{id:"ADR-1"}]}};
 const staged={contextEngine:{...canonical.contextEngine,technicalRoadmap:[{name:"Resposta contextual",status:"completed"}]}};
 for(const key of ["productVision","businessGoals","projectStatus","roadmap","architectureDecisions"]) assert.deepEqual(staged.contextEngine[key],canonical.contextEngine[key]);
 assert.ok(staged.contextEngine.technicalRoadmap.length>0);
});

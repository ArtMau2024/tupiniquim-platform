"use strict";
const {searchContext}=require("./context-query");
function firstPlanned(items=[]){return items.find(x=>x.status==="planned")||null;}
function buildContextPackage({question,intent,map,index,projects,plan,memory,rules,conflicts}){const base={question,intent,facts:{},sources:[],warnings:[]};
 if(intent==="project_continuity"){
  const allProjects=projects?.projects||[];const phase=(plan?.phases||[]).find(x=>x.id===plan?.currentPhase)||null;
  const currentProject=allProjects.find(x=>x.status==="in_progress")||null;
  const pausedProjects=allProjects.filter(x=>x.status==="paused").map(x=>({id:x.id,name:x.name,status:x.status}));
  const currentTasks=(phase?.tasks||[]).filter(x=>x.status==="in_progress").map(x=>({id:x.id,title:x.title,status:x.status}));
  base.facts={currentProject:currentProject?{id:currentProject.id,name:currentProject.name,status:currentProject.status}:null,pausedProjects,currentPhase:phase?{id:phase.id,name:phase.name,status:phase.status}:null,currentTasks,nextPhase:plan?.nextPhase||null,activeDecisionCount:(memory?.decisions||[]).filter(x=>x.status==="active").length,activeRuleCount:(rules?.rules||[]).filter(x=>x.status==="active").length,openConflicts:conflicts?.summary?.open??null};
  base.sources=["site-context/registry/projects/PROJECT-REGISTRY-TUPINIQUIM.json","site-context/registry/plans/PLAN-ANCHOR-MVP.json","site-context/decision-memory.json","site-context/registry/rules/RULESET-HARNESS-QUALITY.json","site-context/registry/conflict-register.json"];
  if(!base.facts.currentProject)base.warnings.push("Nenhum projeto em andamento encontrado no Project Registry");
  if(!base.facts.currentPhase)base.warnings.push("Fase atual ausente no Planning Registry");
 }
 else if(intent==="product_roadmap"){base.facts.currentEpic=map.contextEngine?.projectStatus||null;const road=map.contextEngine?.roadmap||[];const currentIndex=road.findIndex(x=>x.name===base.facts.currentEpic?.name);base.facts.nextEpic=firstPlanned(currentIndex>=0?road.slice(currentIndex+1):road);base.facts.technicalRecommendation=map.aiContext?.recommendedAction||null;base.sources=["project-map.json#contextEngine.projectStatus","project-map.json#contextEngine.roadmap","project-map.json#aiContext.recommendedAction"];}
 else if(intent==="context_engine_roadmap"){const road=map.contextEngine?.technicalRoadmap||[];base.facts.current=road.filter(x=>x.status==="in_progress");base.facts.completed=road.filter(x=>x.status==="completed");base.facts.next=firstPlanned(road);base.sources=["project-map.json#contextEngine.technicalRoadmap"];if(!road.length)base.warnings.push("technicalRoadmap ausente");}
 else if(intent==="technical_risk"){base.facts.architectureHealth=map.architectureHealth||null;base.facts.openDebts=(map.technicalDebt||[]).filter(x=>x.status==="open");base.sources=["project-map.json#architectureHealth","project-map.json#technicalDebt"];}
 else if(intent==="architecture_decision"){base.facts.decisions=(map.contextEngine?.architectureDecisions||[]).filter(x=>["approved","active","accepted"].includes(x.status));base.facts.memory=map.contextEngine?.decisionMemory||null;base.sources=["project-map.json#contextEngine.architectureDecisions","project-map.json#contextEngine.decisionMemory"];}
 else{base.facts.chunks=searchContext(index,question,{limit:3}).map(x=>({sourcePath:x.sourcePath,startLine:x.startLine,endLine:x.endLine,content:x.content,score:x.score}));base.sources=base.facts.chunks.map(x=>`${x.sourcePath}:${x.startLine}-${x.endLine}`);if(!base.facts.chunks.length)base.warnings.push("Nenhum chunk relevante encontrado");}
 return base;}
module.exports={buildContextPackage};

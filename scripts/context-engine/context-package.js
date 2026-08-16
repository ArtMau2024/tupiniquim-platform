"use strict";
const {searchContext}=require("./context-query");
function firstPlanned(items=[]){return items.find(x=>x.status==="planned")||null;}
function buildContextPackage({question,intent,map,index,projects,plan,planPath,memory,rules,conflicts,editorialProcedure}){const base={question,intent,facts:{},sources:[],warnings:[]};
 if(intent==="project_continuity"){
  const allProjects=projects?.projects||[];const phase=(plan?.phases||[]).find(x=>x.id===plan?.currentPhase)||null;
  const currentProject=allProjects.find(x=>x.status==="in_progress")||null;
  const pausedProjects=allProjects.filter(x=>x.status==="paused").map(x=>({id:x.id,name:x.name,status:x.status}));
  const currentTasks=(phase?.tasks||[]).filter(x=>x.status==="in_progress").map(x=>({id:x.id,title:x.title,status:x.status}));
  base.facts={currentProject:currentProject?{id:currentProject.id,name:currentProject.name,status:currentProject.status}:null,pausedProjects,currentPhase:phase?{id:phase.id,name:phase.name,status:phase.status}:null,currentTasks,nextPhase:plan?.nextPhase||null,activeDecisionCount:(memory?.decisions||[]).filter(x=>x.status==="active").length,activeRuleCount:(rules?.rules||[]).filter(x=>x.status==="active").length,openConflicts:conflicts?.summary?.open??null};
  if(typeof planPath!=="string"||!planPath.trim())throw new Error("Active plan source path is required for project continuity");base.sources=["site-context/registry/projects/PROJECT-REGISTRY-TUPINIQUIM.json",planPath,"site-context/decision-memory.json","site-context/registry/rules/RULESET-HARNESS-QUALITY.json","site-context/registry/conflict-register.json"];
  if(!base.facts.currentProject)base.warnings.push("Nenhum projeto em andamento encontrado no Project Registry");
  if(!base.facts.currentPhase)base.warnings.push("Fase atual ausente no Planning Registry");
 }
 else if(intent==="editorial_operation"){
  if(typeof editorialProcedure!=="string"||!editorialProcedure.trim())throw new Error("Canonical editorial procedure is required");
  const decisions=memory?.decisions||[];const phase=(plan?.phases||[]).find(x=>x.id===plan?.currentPhase)||null;const tasks=phase?.tasks||[];
  const currentDecision=decisions.find(x=>x.id==="DEC-2026-EDITORIAL-CMS-D1-LOCAL-PUBLISHING-FLOW")||null;
  const legacyDecision=decisions.find(x=>x.id==="DEC-2026-EDITORIAL-CMS-LOCAL-INGESTION-MVP")||null;
  const localTask=tasks.find(x=>x.id==="TASK-EDITORIAL-CMS-01-LOCAL-INGESTION-MVP")||null;
  const d1Task=tasks.find(x=>x.id==="TASK-EDITORIAL-CMS-01-D1-DRAFT-PERSISTENCE")||null;
  const closeoutTask=tasks.find(x=>x.id==="TASK-EDITORIAL-CMS-01-D1-LOCAL-FLOW-CLOSEOUT")||null;
  const decisionIds=new Set([currentDecision?.id,legacyDecision?.id].filter(Boolean));
  base.facts={procedure:editorialProcedure,currentDecision,legacyDecision,localTask,d1Task,closeoutTask,editorialRuleCount:(rules?.rules||[]).filter(x=>decisionIds.has(x.decisionRef)).length};
  base.sources=["docs/cms-local-ingestion-mvp.md","site-context/decision-memory.json","site-context/registry/plans/PLAN-EDITORIAL-CMS-MVP.json","site-context/registry/rules/RULESET-HARNESS-QUALITY.json"];
  if(!currentDecision)base.warnings.push("Decisao canonica do fluxo D1 local ausente");
  if(!legacyDecision)base.warnings.push("Decisao legada do pipeline TXT ausente");
  if(!localTask||localTask.status!=="completed")base.warnings.push("Tarefa TXT concluida ausente ou invalida");
  if(!d1Task||d1Task.status!=="completed")base.warnings.push("Tarefa D1 concluida ausente ou invalida");
  if(!closeoutTask||closeoutTask.status!=="in_progress")base.warnings.push("Tarefa de fechamento ativa ausente ou invalida");
 }
 else if(intent==="product_roadmap"){base.facts.currentEpic=map.contextEngine?.projectStatus||null;const road=map.contextEngine?.roadmap||[];const currentIndex=road.findIndex(x=>x.name===base.facts.currentEpic?.name);base.facts.nextEpic=firstPlanned(currentIndex>=0?road.slice(currentIndex+1):road);base.facts.technicalRecommendation=map.aiContext?.recommendedAction||null;base.sources=["project-map.json#contextEngine.projectStatus","project-map.json#contextEngine.roadmap","project-map.json#aiContext.recommendedAction"];}
 else if(intent==="context_engine_roadmap"){const road=map.contextEngine?.technicalRoadmap||[];base.facts.current=road.filter(x=>x.status==="in_progress");base.facts.completed=road.filter(x=>x.status==="completed");base.facts.next=firstPlanned(road);base.sources=["project-map.json#contextEngine.technicalRoadmap"];if(!road.length)base.warnings.push("technicalRoadmap ausente");}
 else if(intent==="technical_risk"){base.facts.architectureHealth=map.architectureHealth||null;base.facts.openDebts=(map.technicalDebt||[]).filter(x=>x.status==="open");base.sources=["project-map.json#architectureHealth","project-map.json#technicalDebt"];}
 else if(intent==="architecture_decision"){base.facts.decisions=(map.contextEngine?.architectureDecisions||[]).filter(x=>["approved","active","accepted"].includes(x.status));base.facts.memory=map.contextEngine?.decisionMemory||null;base.sources=["project-map.json#contextEngine.architectureDecisions","project-map.json#contextEngine.decisionMemory"];}
 else{base.facts.chunks=searchContext(index,question,{limit:3}).map(x=>({sourcePath:x.sourcePath,startLine:x.startLine,endLine:x.endLine,content:x.content,score:x.score}));base.sources=base.facts.chunks.map(x=>`${x.sourcePath}:${x.startLine}-${x.endLine}`);if(!base.facts.chunks.length)base.warnings.push("Nenhum chunk relevante encontrado");}
 return base;}
module.exports={buildContextPackage};

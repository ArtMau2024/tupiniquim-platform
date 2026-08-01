"use strict";
const fs=require("fs");const path=require("path");const crypto=require("crypto");
const {buildContextPackage}=require("./context-package");
const ROOT=process.cwd();
const read=r=>JSON.parse(fs.readFileSync(path.join(ROOT,r),"utf8"));
const sha=v=>crypto.createHash("sha256").update(typeof v==="string"?v:JSON.stringify(v)).digest("hex");
function buildAnchor(){
 const projects=read("site-context/registry/projects/PROJECT-REGISTRY-TUPINIQUIM.json"),plan=read("site-context/registry/plans/PLAN-ANCHOR-MVP.json"),memory=read("site-context/decision-memory.json"),rules=read("site-context/registry/rules/RULESET-HARNESS-QUALITY.json"),conflicts=read("site-context/registry/conflict-register.json");
 const pkg=buildContextPackage({question:"bootstrap",intent:"project_continuity",map:{},index:{chunks:[]},projects,plan,memory,rules,conflicts});const f=pkg.facts;
 const blocks=[
  {id:"architecture",title:"Arquitetura Fisica completa com status",content:{currentProject:f.currentProject,currentPhase:f.currentPhase,currentTasks:f.currentTasks,pausedProjects:f.pausedProjects,activeDecisions:f.activeDecisionCount,activeRules:f.activeRuleCount,openConflicts:f.openConflicts},sources:pkg.sources},
  {id:"roadmap",title:"Roadmap acumulado",content:{currentPhase:f.currentPhase?.id,nextPhase:f.nextPhase,remainingPhases:(plan.phases||[]).filter(x=>["in_progress","planned"].includes(x.status)).map(x=>({id:x.id,status:x.status,name:x.name}))},sources:["site-context/registry/plans/PLAN-ANCHOR-MVP.json"]},
  {id:"flow",title:"Fluxo de Execucao real",content:{sequence:[f.currentProject?.id,f.currentPhase?.id,...(f.currentTasks||[]).map(x=>x.id),f.nextPhase].filter(Boolean)},sources:["site-context/registry/projects/PROJECT-REGISTRY-TUPINIQUIM.json","site-context/registry/plans/PLAN-ANCHOR-MVP.json"]},
  {id:"rules",title:"Regras alinhadas no decorrer do chat",content:{activeRuleIds:(rules.rules||[]).filter(x=>x.status==="active").map(x=>x.id),activeDecisionIds:(memory.decisions||[]).filter(x=>x.status==="active").map(x=>x.id),openConflicts:f.openConflicts},sources:["site-context/registry/rules/RULESET-HARNESS-QUALITY.json","site-context/decision-memory.json","site-context/registry/conflict-register.json"]},
  {id:"nextStep",title:"Sugestao Fixa de Proxima Etapa",content:{task:(f.currentTasks||[])[0]?.id||f.nextPhase,command:"npm run context:bootstrap"},sources:["site-context/registry/plans/PLAN-ANCHOR-MVP.json"]}
 ];
 return{schemaVersion:"1.0.0",generatedAt:new Date().toISOString(),blocks,sourceDigest:sha(pkg.sources)};
}
function validateAnchor(a){if(!a||a.schemaVersion!=="1.0.0"||!Array.isArray(a.blocks)||a.blocks.length!==5)throw new Error("Anchor must contain exactly five blocks.");const ids=a.blocks.map(x=>x.id);if(new Set(ids).size!==5)throw new Error("Anchor block ids must be unique.");for(const id of ["architecture","roadmap","flow","rules","nextStep"])if(!ids.includes(id))throw new Error(`Missing anchor block: ${id}`);for(const b of a.blocks)if(!Array.isArray(b.sources)||!b.sources.length)throw new Error(`Anchor block without sources: ${b.id}`);return a;}
function writeAtomic(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+".tmp";fs.writeFileSync(tmp,JSON.stringify(value,null,2)+"\n","utf8");JSON.parse(fs.readFileSync(tmp,"utf8"));fs.renameSync(tmp,file);}
function generate(){const anchor=validateAnchor(buildAnchor());const anchorFile=path.join(ROOT,"site-context","anchor.json"),historyFile=path.join(ROOT,"site-context","anchor-history.json");const previous=fs.existsSync(anchorFile)?JSON.parse(fs.readFileSync(anchorFile,"utf8")):null;const history=fs.existsSync(historyFile)?JSON.parse(fs.readFileSync(historyFile,"utf8")):{schemaVersion:"1.0.0",entries:[]};const previousHash=history.entries.length?history.entries[history.entries.length-1].hash:null;const hash=sha(anchor);history.entries.push({generatedAt:anchor.generatedAt,hash,previousHash,currentProject:anchor.blocks[0].content.currentProject?.id||null,currentPhase:anchor.blocks[0].content.currentPhase?.id||null});writeAtomic(anchorFile,anchor);writeAtomic(historyFile,history);return{anchor,hash,previous};}
function main(){const r=generate();console.log("Anchor bootstrap generated: 5 blocks.");console.log(`Current project: ${r.anchor.blocks[0].content.currentProject?.id}`);console.log(`Current phase: ${r.anchor.blocks[0].content.currentPhase?.id}`);console.log(`Next step: ${r.anchor.blocks[4].content.task}`);console.log("Sources are attached to every block.");}
if(require.main===module){try{main();}catch(e){console.error(e.message);process.exit(1);}}
module.exports={buildAnchor,validateAnchor,generate};

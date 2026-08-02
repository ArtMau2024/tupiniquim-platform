"use strict";
const fs=require("fs"),path=require("path");
const ROOT=process.cwd();
function readJson(file){return JSON.parse(fs.readFileSync(path.join(ROOT,file),"utf8"));}
function selectActiveProjectAndPlan(){const projects=readJson("site-context/registry/projects/PROJECT-REGISTRY-TUPINIQUIM.json");const active=projects.projects.filter(x=>x.status==="in_progress");if(active.length!==1)throw new Error(`Expected exactly one in_progress project, found ${active.length}.`);const plansDir=path.join(ROOT,"site-context","registry","plans");const plans=fs.readdirSync(plansDir).filter(x=>/^PLAN-[A-Z0-9-]+\.json$/.test(x)).map(x=>JSON.parse(fs.readFileSync(path.join(plansDir,x),"utf8")));const matches=plans.filter(x=>x.projectId===active[0].id&&x.status==="in_progress");if(matches.length!==1)throw new Error(`Expected exactly one in_progress plan for ${active[0].id}, found ${matches.length}.`);const plan=matches[0];const planPath=`site-context/registry/plans/${plan.id}.json`;return{projects,activeProject:active[0],plan,planPath};}
module.exports={selectActiveProjectAndPlan};

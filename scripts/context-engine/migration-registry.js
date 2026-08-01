"use strict";
const fs=require("fs");
const path=require("path");
const ROOT=process.cwd();
const matrixFile=path.join(ROOT,"site-context","registry","migration-matrix.json");
const conflictFile=path.join(ROOT,"site-context","registry","conflict-register.json");
const sourceFile=path.join(ROOT,"site-context","registry","source-registry.json");
const ALLOWED={evidenceStatus:new Set(["historical-confirmed","historical","incomplete","conflicting"]),currentStatus:new Set(["resolved","unresolved"]),requiredAction:new Set(["review","preserve-gap","migrate"])};
function read(file){return JSON.parse(fs.readFileSync(file,"utf8"));}
function ensure(v,m){if(!v)throw new Error(m);}
function count(items,field,value){return items.filter(x=>x[field]===value).length;}
function validateData(m,c,s){ensure(Array.isArray(m.items)&&m.items.length>=70,"Migration matrix is incomplete.");const ids=new Set();for(const item of m.items){ensure(item&&typeof item.id==="string"&&item.id,"Migration item id is required.");ensure(!ids.has(item.id),`Duplicate migration item: ${item.id}`);ids.add(item.id);ensure(Array.isArray(item.sourceRefs)&&item.sourceRefs.length>0,`Item without source: ${item.id}`);for(const field of Object.keys(ALLOWED))ensure(ALLOWED[field].has(item[field]),`Invalid ${field} in ${item.id}: ${item[field]}`);ensure(typeof item.canonicalDestination==="string"&&item.canonicalDestination.trim(),`Canonical destination missing in ${item.id}`);if(item.currentStatus==="resolved"){ensure(typeof item.resolution==="string"&&item.resolution.trim(),`Resolved item without resolution: ${item.id}`);ensure(typeof item.decisionRef==="string"&&item.decisionRef.trim(),`Resolved item without decisionRef: ${item.id}`);}if(item.requiredAction==="preserve-gap")ensure(item.evidenceStatus==="incomplete",`preserve-gap requires incomplete evidence: ${item.id}`);if(item.conflict===true)ensure(item.currentStatus!=="resolved",`Resolved item cannot keep open conflict: ${item.id}`);}
const sourceIds=new Set((s.sources||[]).map(x=>x.id));for(const item of m.items)for(const ref of item.sourceRefs)ensure(sourceIds.has(ref),`Unknown source ${ref} in ${item.id}`);for(const conflict of c.conflicts||[])ensure(ids.has(conflict.itemRef),`Unknown conflict item: ${conflict.itemRef}`);
ensure(m.summary&&m.summary.total===m.items.length,"Migration summary mismatch.");const checks={rules:count(m.items,"type","rule"),methods:count(m.items,"type","method"),epics:count(m.items,"type","epic"),adrs:count(m.items,"type","adr"),commits:count(m.items,"type","commit"),engines:count(m.items,"type","engine"),conflicts:count(m.items,"evidenceStatus","conflicting")};for(const [key,value] of Object.entries(checks))ensure(m.summary[key]===value,`Migration summary mismatch for ${key}. Expected ${value}, received ${m.summary[key]}.`);ensure((c.summary?.open??0)===(c.conflicts||[]).filter(x=>x.status==="open").length,"Conflict Register open summary mismatch.");return{matrix:m,conflicts:c};}
function validate(){return validateData(read(matrixFile),read(conflictFile),read(sourceFile));}
if(require.main===module){try{const r=validate();console.log(`Migration Matrix is valid. Items: ${r.matrix.items.length}. Open conflicts: ${r.conflicts.summary.open}.`);}catch(e){console.error(e.message);process.exit(1);}}
module.exports={validate,validateData};

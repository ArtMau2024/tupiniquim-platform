"use strict";
const fs=require("fs");
const path=require("path");
const ROOT=process.cwd();
const matrixFile=path.join(ROOT,"site-context","registry","migration-matrix.json");
const conflictFile=path.join(ROOT,"site-context","registry","conflict-register.json");
const sourceFile=path.join(ROOT,"site-context","registry","source-registry.json");
function read(file){return JSON.parse(fs.readFileSync(file,"utf8"));}
function validate(){const m=read(matrixFile),c=read(conflictFile),s=read(sourceFile);if(!Array.isArray(m.items)||m.items.length<70)throw new Error("Migration matrix is incomplete.");const ids=new Set();for(const item of m.items){if(ids.has(item.id))throw new Error(`Duplicate migration item: ${item.id}`);ids.add(item.id);if(!item.sourceRefs.length)throw new Error(`Item without source: ${item.id}`);}const sourceIds=new Set(s.sources.map(x=>x.id));for(const item of m.items)for(const ref of item.sourceRefs)if(!sourceIds.has(ref))throw new Error(`Unknown source ${ref} in ${item.id}`);for(const conflict of c.conflicts)if(!ids.has(conflict.itemRef))throw new Error(`Unknown conflict item: ${conflict.itemRef}`);if(m.summary.total!==m.items.length)throw new Error("Migration summary mismatch.");return{matrix:m,conflicts:c};}
if(require.main===module){try{const r=validate();console.log(`Migration Matrix is valid. Items: ${r.matrix.items.length}. Open conflicts: ${r.conflicts.summary.open}.`);}catch(e){console.error(e.message);process.exit(1);}}
module.exports={validate};

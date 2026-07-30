"use strict";
const DEFINITIONS=[
 {id:"FEATURE-BLOG",name:"Blog",roadmapName:"Blog",include:[/^app\/blog\//,/^content\/posts\//,/^lib\/generated-posts\.ts$/,/^lib\/blog-categories\.ts$/,/^scripts\/generate-posts\.js$/],exclude:[/legado/i],allowSharedFiles:true},
 {id:"FEATURE-CONTEXT-ENGINE",name:"Context Engine",roadmapName:"Context Engine",include:[/^scripts\/generate-project-map/,/^scripts\/context-engine\//,/^scripts\/baseline\//,/^site-context\//],exclude:[/\.generation-tmp\//],allowSharedFiles:true}
];
function buildFeatureMap(files,roadmap=[]){
 const paths=files.map(x=>typeof x==="string"?x:x.path).filter(Boolean).sort(); const claimed=new Set();
 const features=DEFINITIONS.map(def=>{ const selected=paths.filter(p=>def.include.some(r=>r.test(p))&&!def.exclude.some(r=>r.test(p))); selected.forEach(p=>claimed.add(p)); const road=roadmap.find(x=>x.name===def.roadmapName); return {id:def.id,name:def.name,status:road?road.status:"unknown",files:selected,sharedFiles:[],unresolvedPatterns:[]}; });
 const owners=new Map(); for(const f of features) for(const p of f.files){if(!owners.has(p))owners.set(p,[]);owners.get(p).push(f.id);} for(const f of features)f.sharedFiles=f.files.filter(p=>(owners.get(p)||[]).length>1);
 return {features,unclassifiedFiles:paths.filter(p=>!claimed.has(p))};
}
module.exports={buildFeatureMap};

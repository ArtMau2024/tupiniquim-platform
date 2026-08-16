import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";

export type GeneratedCatalogPost = { slug:string; title:string; date:string; author:string; description:string; category:string; image:string|null; content:string };
export type LocalCatalogOptions = { root?:string; environment?:string; timeoutMs?:number; nodeExecutable?:string; scriptRelativePath?:string };
export type LocalCatalogResult = Readonly<{ slug:string; previousCount:number; currentCount:number; state:"awaiting_local_validation" }>;
const SLUG=/^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const sha=(data:Buffer|string)=>crypto.createHash("sha256").update(data).digest("hex");
export function parseGeneratedCatalog(source:string):GeneratedCatalogPost[]{
 const marker="export const generatedPosts: GeneratedPost[] = "; const start=source.indexOf(marker); if(start<0)throw new Error("Catálogo local inválido.");
 const tail=source.slice(start+marker.length); const end=tail.lastIndexOf(";"); if(end<0)throw new Error("Catálogo local inválido.");
 const value=JSON.parse(tail.slice(0,end).trim()); if(!Array.isArray(value))throw new Error("Catálogo local inválido."); return value;
}
function validateUnique(posts:GeneratedCatalogPost[]){const seen=new Set<string>();for(const p of posts){if(!SLUG.test(p.slug)||seen.has(p.slug))throw new Error(`Slug inválido ou duplicado no catálogo: ${p.slug}`);seen.add(p.slug);}return seen;}
function runProcess(executable:string,args:string[],cwd:string,timeoutMs:number):Promise<{stdout:string;stderr:string}>{return new Promise((resolve,reject)=>{const child=spawn(executable,args,{cwd,windowsHide:true,stdio:["ignore","pipe","pipe"]});let stdout="",stderr="",settled=false;child.stdout.on("data",d=>stdout+=d);child.stderr.on("data",d=>stderr+=d);const timer=setTimeout(()=>{if(settled)return;settled=true;child.kill();reject(new Error("A geração do catálogo excedeu o tempo limite."));},timeoutMs);child.on("error",e=>{if(settled)return;settled=true;clearTimeout(timer);reject(e)});child.on("close",code=>{if(settled)return;settled=true;clearTimeout(timer);if(code!==0)reject(new Error(stderr.trim()||`Gerador encerrou com código ${code}.`));else resolve({stdout,stderr});});});}
export async function generateLocalCatalog(slug:string,options:LocalCatalogOptions={}):Promise<LocalCatalogResult>{
 const root=path.resolve(options.root??process.cwd()),env=options.environment??process.env.NODE_ENV;if(env==="production")throw new Error("A geração do catálogo está disponível somente no ambiente editorial local.");if(!SLUG.test(slug))throw new Error("Slug inválido para geração do catálogo.");
 const pkg=path.join(root,"package.json"),mdx=path.join(root,"content","posts",`${slug}.mdx`),catalog=path.join(root,"lib","generated-posts.ts"),script=path.join(root,options.scriptRelativePath??"scripts/generate-posts.js");
 for(const [p,m] of [[pkg,"Projeto local inválido."],[mdx,"Arquivo MDX correspondente não encontrado."],[catalog,"Catálogo local não encontrado."],[script,"Gerador oficial não encontrado."]] as const)if(!fs.existsSync(p))throw new Error(m);
 const mdxBefore=fs.readFileSync(mdx),mdxHash=sha(mdxBefore),catalogBefore=fs.readFileSync(catalog),catalogHash=sha(catalogBefore),previous=parseGeneratedCatalog(catalogBefore.toString("utf8")),oldSlugs=validateUnique(previous);if(oldSlugs.has(slug))throw new Error("O artigo já está presente no catálogo local.");
 const tx=path.join(root,"site-context",".generation-tmp","cms-catalog"),lock=path.join(tx,"catalog.lock"),backup=path.join(tx,"generated-posts.backup.ts");fs.mkdirSync(tx,{recursive:true});let locked=false;
 try{fs.writeFileSync(lock,JSON.stringify({slug,startedAt:new Date().toISOString()}),{flag:"wx",encoding:"utf8"});locked=true;fs.copyFileSync(catalog,backup);await runProcess(options.nodeExecutable??process.execPath,[script],root,options.timeoutMs??30000);const currentSource=fs.readFileSync(catalog,"utf8"),current=parseGeneratedCatalog(currentSource),newSlugs=validateUnique(current);if(current.length!==previous.length+1)throw new Error("Quantidade final do catálogo é inesperada.");if(current.filter(p=>p.slug===slug).length!==1)throw new Error("O artigo esperado não foi incorporado ao catálogo.");for(const old of oldSlugs)if(!newSlugs.has(old))throw new Error(`Slug anterior ausente: ${old}`);const article=current.find(p=>p.slug===slug)!;if(!article.title||!article.description||!article.category||!article.content)throw new Error("Metadados do artigo gerado estão incompletos.");if(sha(fs.readFileSync(mdx))!==mdxHash)throw new Error("O MDX foi alterado durante a geração do catálogo.");return{slug,previousCount:previous.length,currentCount:current.length,state:"awaiting_local_validation"};
 }catch(error){if(fs.existsSync(backup)){fs.copyFileSync(backup,catalog);if(sha(fs.readFileSync(catalog))!==catalogHash)throw new Error("Falha ao restaurar o catálogo anterior.");}throw error;
 }finally{if(fs.existsSync(backup))fs.rmSync(backup,{force:true});if(locked&&fs.existsSync(lock))fs.rmSync(lock,{force:true});if(fs.existsSync(tx)&&fs.readdirSync(tx).length===0)fs.rmdirSync(tx);}
}

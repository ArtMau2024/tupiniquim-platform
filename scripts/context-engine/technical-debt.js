"use strict";
const ts=require("typescript");
function evidence(file,reason,lines=[]){return {file,reason,lines:[...new Set(lines)].sort((a,b)=>a-b)};}
function lineOf(source,node){return source.getLineAndCharacterOfPosition(node.getStart(source)).line+1;}
function detectTechnicalDebt(sourceFiles,dependencies={}){
 const byPath=new Map(sourceFiles.map(f=>[f.path,f])); const debts=[];
 const legacy=byPath.get("lib/posts.ts"); if(legacy&&/(from\s+["']fs["']|require\(["']fs["']\)|node:fs)/.test(legacy.content)&&/(readdirSync|readFileSync)/.test(legacy.content)) debts.push({id:"DT-001",detectorId:"DET-001",severity:"critical",status:"open",files:[legacy.path],reason:"legacy-runtime-fs",evidence:[evidence(legacy.path,"filesystem post reader")] ,detectorVersion:"1.0.0"});
 const post=byPath.get("app/blog/[slug]/page.tsx"); if(post&&/dangerouslySetInnerHTML/.test(post.content)&&/markdownToHtml|inlineMd/.test(post.content)&&/\.replace\(/.test(post.content)) debts.push({id:"DT-002",detectorId:"DET-002",severity:"high",status:"open",files:[post.path],reason:"regex-markdown-parser",evidence:[evidence(post.path,"manual markdown parser")],detectorVersion:"1.0.0"});
 const generator=byPath.get("scripts/generate-posts.js"); if(generator&&/matter\(/.test(generator.content)&&!/(zod|safeParse|parseAsync|validateFrontmatter)/.test(generator.content)) debts.push({id:"DT-003",detectorId:"DET-003",severity:"high",status:"open",files:[generator.path],reason:"frontmatter-without-schema",evidence:[evidence(generator.path,"frontmatter consumed without formal validation")],detectorVersion:"1.0.0"});
 const inline=[]; const embedded=[];
 for(const file of sourceFiles.filter(f=>/[.]tsx?$|[.]jsx?$/.test(f.path))){ const src=ts.createSourceFile(file.path,file.content,ts.ScriptTarget.Latest,true,file.path.endsWith("x")?ts.ScriptKind.TSX:ts.ScriptKind.TS); function visit(node){ if(ts.isJsxAttribute(node)&&node.name&&node.name.text==="style") inline.push({file:file.path,line:lineOf(src,node)}); if(ts.isJsxElement(node)&&node.openingElement.tagName.getText(src)==="style") embedded.push({file:file.path,line:lineOf(src,node)}); ts.forEachChild(node,visit);} visit(src); }
 if(inline.length) debts.push({id:"DT-004",detectorId:"DET-004",severity:"medium",status:"open",files:[...new Set(inline.map(x=>x.file))].sort(),reason:"inline-react-style",evidence:inline.map(x=>evidence(x.file,"JSX style attribute",[x.line])),detectorVersion:"1.0.0"});
 if(embedded.length) debts.push({id:"DT-005",detectorId:"DET-005",severity:"medium",status:"open",files:[...new Set(embedded.map(x=>x.file))].sort(),reason:"embedded-style-block",evidence:embedded.map(x=>evidence(x.file,"JSX style element",[x.line])),detectorVersion:"1.0.0"});
 return debts.sort((a,b)=>a.id.localeCompare(b.id));
}
function architectureHealth(debts){const weights={critical:20,high:10,medium:5,low:2};const open=debts.filter(d=>d.status==="open");const score=Math.max(0,Math.min(100,100-open.reduce((s,d)=>s+(weights[d.severity]||0),0)));return {score,status:score>=90?"healthy":score>=70?"attention":"critical",criticalDebts:open.filter(d=>d.severity==="critical").length,highDebts:open.filter(d=>d.severity==="high").length,mediumDebts:open.filter(d=>d.severity==="medium").length,lowDebts:open.filter(d=>d.severity==="low").length,calculationVersion:"1.0.0"};}
module.exports={detectTechnicalDebt,architectureHealth};

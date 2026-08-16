"use strict";
const fs=require("node:fs"),path=require("node:path");
const fields=["title","date","category","description","image","author"];
const nl=s=>s.replace(/^\uFEFF/,"").replace(/\r\n?/g,"\n");
const sc=s=>{s=s.trim().replace(/[.]+$/u,"").replace(/\s+/g," ");if(!s)return s;const l=s.toLocaleLowerCase("pt-BR");return l[0].toLocaleUpperCase("pt-BR")+l.slice(1)};
function front(m){const x=nl(m).match(/^---\n([\s\S]*?)\n---(?:\n|$)/);if(!x)throw Error("Frontmatter completo nao encontrado no MDX.");const a=x[1].split("\n");for(const f of fields)if(a.filter(v=>v.startsWith(f+":")).length!==1)throw Error(`Campo ${f} deve existir exatamente uma vez.`);return`---\n${x[1]}\n---`}
const caps=s=>{s=s.trim();const l=s.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ]/gu,"");return s.length>0&&s.length<=120&&l.length>=4&&l===l.toLocaleUpperCase("pt-BR")};
const numbered=s=>/^\s*\d+\.?\s+\S/u.test(s),sub=s=>/^\s*\d+\.\d+\s+\S/u.test(s);
function bullets(s){const lead=/^[•*√]\s*/u.test(s),m=lead?s[0]:"",c=lead?s.slice(1).trimStart():s;const n=c.replace(/\s*•\s*([A-ZÁÉÍÓÚÂÊÔÃÕÇ])/gu,(_,x)=>` ${x.toLocaleLowerCase("pt-BR")}`);return lead?`${m} ${n}`:n}
function start(a){let i=a.findIndex(x=>/^\s*RESUMO\s*$/iu.test(x));if(i>=0)return i;i=a.findIndex(x=>/^\s*(?:1\.?\s*)?INTRODU[CÇ][AÃ]O\s*$/iu.test(x));return i>=0?i:0}
function isolated(a,i){const s=a[i].trim();return !!s&&(i===0||!a[i-1].trim())&&(i===a.length-1||!a[i+1].trim())}
function normalHeading(a,i){const s=a[i].trim();if(!isolated(a,i)||s.length>90||/[.;:]$/u.test(s)||/^['"“”]/u.test(s))return false;if(/^(Essa|Esse|Isso|Por isso|Portanto|Entretanto|Algum|Alguma|Alguns|Algumas|Mais |Uma |Um |Não |Quando houver|Chás preparados|O chá verde é|A segurança|Entre os|É importante)$/iu.test(s))return false;if(/^Refer[eê]ncias$/iu.test(s))return true;if(/[?]$/u.test(s))return true;return /^(Introdução|Possíveis |Chá |O perigo |Interações |Gestantes|Como |Os principais |Substituir |Usar |O papel )/iu.test(s)}
function transform(txt){let a=nl(txt).split("\n");a=a.slice(start(a));const o=[];let refs=false,skip=false,seenIntro=false;for(let i=0;i<a.length;i++){let s=bullets(a[i].trim());if(!s){if(o.length&&o[o.length-1]!=="")o.push("");continue}if(/^Palavras-chave\s*:/iu.test(s))continue;
if(!seenIntro&&/^INTRODU[CÇ][AÃ]O$/iu.test(s)){seenIntro=true;s="## Introdução"}
else if(seenIntro&&(/^Introdução$/iu.test(s)||/^(Chás e Saúde: Benefícios, Cuidados e Riscos do Consumo de Plantas Medicinais)$/iu.test(s)))continue;
else if(/^REFER[EÊ]NCIAS\s*$/iu.test(s)){if(/^BIBLIOGR[AÁ]FICAS$/iu.test((a[i+1]||"").trim()))skip=true;s="## Referências bibliográficas";refs=true}
else if(skip&&/^BIBLIOGR[AÁ]FICAS$/iu.test(s)){skip=false;continue}
else if(/^REFER[EÊ]NCIAS\s+BIBLIOGR[AÁ]FICAS$/iu.test(s)){s="## Referências bibliográficas";refs=true}
else if(/^RESUMO$/iu.test(s))s="## Resumo";
else if(sub(s))s=`### ${sc(s.replace(/^\s*\d+\.\d+\s+/u,""))}`;
else if(numbered(s))s=`## ${sc(s.replace(/^\s*\d+\.?\s+/u,""))}`;
else if(caps(s))s=`## ${sc(s)}`;
else if(normalHeading(a,i))s=/^Refer[eê]ncias$/iu.test(s)?"## Referências bibliográficas":`## ${sc(s)}`;
else if(/^[•*√]\s*/u.test(s))s=`- ${s.replace(/^[•*√]\s*/u,"").trim()}`;
else if(refs&&!s.startsWith("## "))s=`- ${s.replace(/^[-•*√]\s*/u,"")}`;
o.push(s);if(s.startsWith("## ")&&s!=="## Referências bibliográficas")refs=false}
return o.join("\n").replace(/\n{3,}/g,"\n\n").trim()+"\n"}
function atomic(p,c){const t=p+".tmp";fs.writeFileSync(t,c,"utf8");fs.renameSync(t,p)}
function run({root=process.cwd(),slug}){if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug||""))throw Error("Slug invalido.");const t=path.join(root,"content","inbox",slug+".txt"),m=path.join(root,"content","posts",slug+".mdx"),b=m+".backup";if(!fs.existsSync(t))throw Error("TXT nao encontrado.");if(!fs.existsSync(m))throw Error("MDX nao encontrado.");const raw=fs.readFileSync(t,"utf8"),fm=front(fs.readFileSync(m,"utf8")),body=transform(raw);fs.copyFileSync(m,b);atomic(m,fm+"\n\n"+body);if(fs.readFileSync(t,"utf8")!==raw)throw Error("TXT alterado.");return{t,m,b,body}}
if(require.main===module){try{const r=run({slug:process.argv[2]});console.log("[OK] TXT preservado.\n[OK] Frontmatter preservado.\n[OK] Backup criado: "+r.b+"\n[OK] MDX atualizado: "+r.m);console.log("[INFO] Secoes ##: "+(r.body.match(/^## /gm)||[]).length);console.log("[INFO] Subsecoes ###: "+(r.body.match(/^### /gm)||[]).length);console.log("[INFO] Itens de lista: "+(r.body.match(/^- /gm)||[]).length)}catch(e){console.error("[FALHA] "+e.message);process.exitCode=1}}
module.exports={front,transform,bullets,run};

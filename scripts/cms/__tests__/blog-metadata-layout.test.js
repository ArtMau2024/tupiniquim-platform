"use strict";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const homePath=new URL("../../../app/blog/page.tsx",import.meta.url);
const articlePath=new URL("../../../app/blog/[slug]/page.tsx",import.meta.url);
const before=(s,a,b)=>{assert.notEqual(s.indexOf(a),-1);assert.notEqual(s.indexOf(b),-1);assert.ok(s.indexOf(a)<s.indexOf(b),`${a} deve anteceder ${b}`);};
test("hierarquia editorial da home",async()=>{const s=await readFile(homePath,"utf8");before(s,'<div className="lead-content">','<div className="lead-image-wrapper">');before(s,'<div className="secondary-image-wrapper">','<div className="secondary-content">');before(s,'<div className="latest-image-wrapper">','<div className="latest-content">');assert.match(s,/featuredPost\.author \?/);assert.match(s,/post\.author \?/);assert.match(s,/const featuredPost = posts\[0\]/);assert.match(s,/posts\.slice\(1, 3\)/);assert.doesNotMatch(s,/Atualizado em/i);});
test("hierarquia editorial do artigo",async()=>{const s=await readFile(articlePath,"utf8");before(s,'<header className="post-header">','<div className="post-image-wrapper">');before(s,'<div className="post-image-wrapper">','className="post-content"');for(const token of ["findEditorialPostBySlug","getBlogCategoryByValue","post.description","formatDate(post.date)","function safeHtml","function inlineMd","function markdownToHtml","dangerouslySetInnerHTML"])assert.match(s,new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")));assert.doesNotMatch(s,/Atualizado em/i);});

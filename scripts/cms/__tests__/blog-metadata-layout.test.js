"use strict";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const homePath = new URL("../../../app/blog/page.tsx", import.meta.url);
const articlePath = new URL("../../../app/blog/[slug]/page.tsx", import.meta.url);

function before(source, first, second) {
  assert.notEqual(source.indexOf(first), -1);
  assert.notEqual(source.indexOf(second), -1);
  assert.ok(source.indexOf(first) < source.indexOf(second), `${first} deve anteceder ${second}`);
}

test("hierarquia editorial da home", async () => {
  const source = await readFile(homePath, "utf8");
  before(source, '<div className="lead-content">', '<div className="lead-image-wrapper">');
  before(source, '<div className="secondary-image-wrapper">', '<div className="secondary-content">');
  before(source, '<div className="latest-image-wrapper">', '<div className="latest-content">');
  assert.match(source, /featuredPost\.author \?/);
  assert.match(source, /post\.author \?/);
  assert.match(source, /const featuredPost = posts\[0\]/);
  assert.match(source, /posts\.slice\(1, 3\)/);
  assert.doesNotMatch(source, /Atualizado em/i);
});

test("hierarquia editorial do artigo", async () => {
  const source = await readFile(articlePath, "utf8");
  before(source, '<header className="post-header">', '<div className="post-image-wrapper">');
  before(source, '<div className="post-image-wrapper">', 'className="post-content"');

  for (const token of [
    "findPublicEditorialPostBySlug",
    "getBlogCategoryByValue",
    "post.description",
    "formatDate(post.date)",
    "function safeHtml",
    "function inlineMd",
    "function markdownToHtml",
    "dangerouslySetInnerHTML",
    "generateMetadata",
    "openGraph",
    "notFound",
    'export const dynamic = "force-dynamic"',
  ]) {
    assert.ok(source.includes(token), `Contrato ausente: ${token}`);
  }

  assert.doesNotMatch(source, /import\s*\{\s*findEditorialPostBySlug\s*\}/);
  assert.doesNotMatch(source, /Atualizado em/i);
});

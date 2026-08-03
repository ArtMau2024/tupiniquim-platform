"use strict";
import test from "node:test";
import assert from "node:assert/strict";

async function catalogModule() {
  return import("../../../lib/cms/editorial-catalog.ts");
}

const basePost = {
  slug: "post-valido",
  title: "Post válido",
  date: "2026-08-01",
  author: "",
  description: "Descrição",
  category: "tecnologia",
  image: null,
  content: "Conteúdo",
};

test("carrega os quatro artigos reais sem fs", async () => {
  const { listEditorialPosts } = await catalogModule();
  const posts = listEditorialPosts();
  assert.equal(posts.length, 4);
  assert.equal(posts.some((post) => post.slug === "github-copilot-gratis"), true);
});

test("normaliza autor opcional e ordena por data e slug", async () => {
  const { listEditorialPosts } = await catalogModule();
  const posts = listEditorialPosts([
    { ...basePost, slug: "b", date: "2026-01-01", author: "  " },
    { ...basePost, slug: "a", date: "2026-01-01", author: "Arthur" },
    { ...basePost, slug: "c", date: "2026-02-01" },
  ]);
  assert.deepEqual(posts.map((post) => post.slug), ["c", "a", "b"]);
  assert.equal(posts.find((post) => post.slug === "b")?.author, null);
});

test("localiza apenas slug exato e rejeita entrada malformada", async () => {
  const { findEditorialPostBySlug } = await catalogModule();
  assert.equal(findEditorialPostBySlug("post-valido", [basePost])?.title, "Post válido");
  assert.equal(findEditorialPostBySlug("Post-Valido", [basePost]), null);
  assert.equal(findEditorialPostBySlug("../post-valido", [basePost]), null);
  assert.equal(findEditorialPostBySlug("inexistente", [basePost]), null);
});

test("rejeita slugs duplicados", async () => {
  const { findEditorialPostBySlug, listEditorialPosts } = await catalogModule();
  const duplicated = [basePost, { ...basePost }];
  assert.throws(() => listEditorialPosts(duplicated), /Duplicate editorial slug/);
  assert.throws(() => findEditorialPostBySlug(basePost.slug, duplicated), /Duplicate editorial slug/);
});
"use strict";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const pagePath = new URL("../../../app/blog/page.tsx", import.meta.url);
const catalogPath = new URL("../../../lib/cms/editorial-catalog.ts", import.meta.url);

test("pagina usa a ordenacao editorial canonica nos destaques", async () => {
  const source = await readFile(pagePath, "utf8");
  assert.match(source, /import \{ listEditorialPosts \} from ["']@\/lib\/cms\/editorial-catalog["']/);
  assert.match(source, /const posts = listEditorialPosts\(\);/);
  assert.match(source, /const featuredPost = posts\[0\];/);
  assert.match(source, /const secondaryPosts = posts\.slice\(1, 3\);/);
  assert.doesNotMatch(source, /construindo-um-blog/);
  assert.doesNotMatch(source, /find\(\(post\).*featuredPost/s);
});

test("catalogo ordena por data decrescente e slug em empate", async () => {
  const source = await readFile(catalogPath, "utf8");
  assert.match(source, /right\.date\.localeCompare\(left\.date\)/);
  assert.match(source, /left\.slug\.localeCompare\(right\.slug\)/);
});

test("fatias de destaque funcionam com colecoes reduzidas e sem duplicacao", () => {
  const select = (posts) => ({ featured: posts[0], secondary: posts.slice(1, 3) });
  assert.deepEqual(select([]), { featured: undefined, secondary: [] });
  assert.deepEqual(select([{ slug: "unico" }]), { featured: { slug: "unico" }, secondary: [] });
  const selected = select([{ slug: "a" }, { slug: "b" }, { slug: "c" }, { slug: "d" }]);
  assert.equal(selected.featured.slug, "a");
  assert.deepEqual(selected.secondary.map((post) => post.slug), ["b", "c"]);
  assert.ok(!selected.secondary.some((post) => post.slug === selected.featured.slug));
});

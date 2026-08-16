import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { BLOG_CATEGORIES } from "../../../lib/blog-categories.ts";

const sourcePath = path.resolve("lib/cms/draft.ts");
const tempDir = path.resolve("site-context/.generation-tmp/tests");
const tempPath = path.join(tempDir, "draft-domain.runtime.ts");
const expectedImport = 'from "../blog-categories"';
const categoriesUrl = pathToFileURL(path.resolve("lib/blog-categories.ts")).href;

let validateDraftInput;
try {
  const source = fs.readFileSync(sourcePath, "utf8");
  assert.equal(source.split(expectedImport).length - 1, 1, "Import extensionless esperado uma vez");
  const transformed = source.replace(expectedImport, `from "${categoriesUrl}"`);
  fs.mkdirSync(tempDir, { recursive: true });
  fs.writeFileSync(tempPath, transformed, { encoding: "utf8" });
  ({ validateDraftInput } = await import(`${pathToFileURL(tempPath).href}?v=${Date.now()}`));
} finally {
  if (fs.existsSync(tempPath)) fs.rmSync(tempPath, { force: true });
  if (fs.existsSync(tempDir) && fs.readdirSync(tempDir).length === 0) fs.rmdirSync(tempDir);
}

assert.equal(fs.existsSync(tempPath), false, "Arquivo temporário deve ser removido");
assert.equal(typeof validateDraftInput, "function", "validateDraftInput deve ser carregada");

test("valida e normaliza rascunho", () => {
  const result = validateDraftInput({ title: " T ", slug: "meu-post", description: " D ", category: BLOG_CATEGORIES[0].slug, content: " C " });
  assert.equal(result.ok, true);
  if (result.ok) assert.equal(result.value.title, "T");
});

test("rejeita campos e slug inválidos", () => {
  const result = validateDraftInput({ title: "", slug: "Slug Inválido", description: "", category: "x", content: "" });
  assert.equal(result.ok, false);
});

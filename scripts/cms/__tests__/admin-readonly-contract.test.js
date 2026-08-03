"use strict";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const listPath = new URL("../../../app/admin/posts/page.tsx", import.meta.url);
const detailPath = new URL("../../../app/admin/posts/[slug]/editar/page.tsx", import.meta.url);
const catalogPath = new URL("../../../lib/cms/editorial-catalog.ts", import.meta.url);

test("rotas exibem modo somente leitura e não oferecem salvamento", async () => {
  const source = `${await readFile(listPath, "utf8")}
${await readFile(detailPath, "utf8")}`;
  assert.match(source, /Modo somente leitura/);
  assert.doesNotMatch(source, /type=["']submit["'][^>]*>\s*Salvar/i);
  assert.doesNotMatch(source, /conteúdo salvo|salvo com sucesso/i);
});

test("catálogo usa projeção compilada e não usa sistema de arquivos", async () => {
  const source = await readFile(catalogPath, "utf8");
  assert.match(source, /generatedPosts/);
  assert.doesNotMatch(source, /node:fs|from ["']fs["']|node:path|from ["']path["']/);
});
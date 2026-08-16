"use strict";
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const listPath = new URL("../../../app/admin/posts/page.tsx", import.meta.url);
const detailPath = new URL("../../../app/admin/posts/[slug]/editar/page.tsx", import.meta.url);
const layoutPath = new URL("../../../app/admin/layout.tsx", import.meta.url);
const cssPath = new URL("../../../app/globals.css", import.meta.url);
const catalogPath = new URL("../../../lib/cms/editorial-catalog.ts", import.meta.url);
test("rotas exibem modo somente leitura e nao oferecem salvamento", async () => {
  const source = (await readFile(listPath, 'utf8')) + '\n' + (await readFile(detailPath, 'utf8'));
  assert.match(source, /modo somente leitura/i);
  assert.doesNotMatch(source, /type=["']submit["'][^>]*>\s*Salvar/i);
  assert.doesNotMatch(source, /conteudo salvo|salvo com sucesso/i);
});
test("catalogo usa projecao compilada e nao usa sistema de arquivos", async () => {
  const source = await readFile(catalogPath, "utf8");
  assert.match(source, /generatedPosts/);
  assert.doesNotMatch(source, /node:fs|from ["']fs["']|node:path|from ["']path["']/);
});
test("painel preserva contratos e aplica layout administrativo sem duplicar moldura global", async () => {
  const [page, layout, css] = await Promise.all([readFile(listPath,"utf8"),readFile(layoutPath,"utf8"),readFile(cssPath,"utf8")]);
  for (const token of ["hasValidAdminSession","logoutAdmin","listDrafts","getCmsDatabase","/admin/posts/novo","/admin/rascunhos/","cms-admin-page","cms-admin-badge"]) assert.match(page,new RegExp(token));
  assert.match(layout,/CMS Tupiniquim/);
  assert.match(layout,/cms-admin-shell/);
  assert.doesNotMatch(layout,/import\s+Header|import\s+Footer|<Header|<Footer/);
  assert.match(css,/\.cms-admin-shell/);
  assert.match(css,/@media/);
  assert.doesNotMatch(page,/publicar|git push|git commit/i);
});

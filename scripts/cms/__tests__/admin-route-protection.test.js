"use strict";
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const root = new URL("../../../", import.meta.url);
const adminPage = new URL("app/admin/page.tsx", root);
const postsPage = new URL("app/admin/posts/page.tsx", root);
const detailPage = new URL("app/admin/posts/[slug]/editar/page.tsx", root);
const loginPage = new URL("app/admin/login/page.tsx", root);
const proxyPath = new URL("proxy.ts", root);

async function source(url) {
  return readFile(url, "utf8");
}

function assertProtectedPage(text, name) {
  assert.match(text, /hasValidAdminSession\s*\(/, `${name} deve validar a sessão`);
  assert.match(text, /redirect\s*\(\s*["']\/admin\/login["']\s*\)/, `${name} deve redirecionar sessão inválida`);
  assert.doesNotMatch(text, /cookies\s*\(.*\.has\s*\(/s, `${name} não pode confiar apenas na presença do cookie`);
}

test("proxy incompatível está ausente", () => {
  assert.equal(existsSync(proxyPath), false);
});

test("páginas administrativas validam criptograficamente a sessão", async () => {
  assertProtectedPage(await source(adminPage), "/admin");
  assertProtectedPage(await source(postsPage), "/admin/posts");
  assertProtectedPage(await source(detailPage), "/admin/posts/[slug]/editar");
});

test("login valida sessão e redireciona usuário autenticado", async () => {
  const text = await source(loginPage);
  assert.match(text, /hasValidAdminSession\s*\(/);
  assert.match(text, /redirect\s*\(\s*["']\/admin\/posts["']\s*\)/);
  assert.doesNotMatch(text, /cookies\s*\(.*\.has\s*\(/s);
});
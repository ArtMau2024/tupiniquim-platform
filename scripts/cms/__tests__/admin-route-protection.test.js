"use strict";

import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { constants } from "node:fs";

const routes = [
  "app/admin/page.tsx",
  "app/admin/posts/page.tsx",
  "app/admin/posts/novo/page.tsx",
  "app/admin/posts/[id]/editar/page.tsx",
  "app/admin/rascunhos/[id]/editar/page.tsx",
];

const removedSlugRoute = "app/admin/posts/[slug]/editar/page.tsx";

test("proxy incompatível está ausente", async () => {
  await assert.rejects(access("proxy.ts", constants.F_OK));
});

test("páginas administrativas validam criptograficamente a sessão", async () => {
  for (const route of routes) {
    const source = await readFile(route, "utf8");
    assert.match(source, /hasValidAdminSession/, `Sessão não validada em ${route}`);
    assert.match(source, /redirect\(["']\/admin\/login["']\)/, `Redirecionamento ausente em ${route}`);
  }

  await assert.rejects(access(removedSlugRoute, constants.F_OK));
});

test("login valida sessão e redireciona usuário autenticado", async () => {
  const source = await readFile("app/admin/login/page.tsx", "utf8");
  assert.match(source, /hasValidAdminSession/);
  assert.match(source, /redirect\(["']\/admin(?:\/posts)?["']\)/);
});

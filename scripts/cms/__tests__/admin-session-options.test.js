"use strict";
import test from "node:test";
import assert from "node:assert/strict";

async function optionsModule() {
  return import("../../../lib/cms/admin-session-options.ts");
}

test("cookie de sessão possui atributos seguros", async () => {
  const { getSessionCookieOptions } = await optionsModule();
  const production = getSessionCookieOptions(true);
  assert.equal(production.httpOnly, true);
  assert.equal(production.secure, true);
  assert.equal(production.sameSite, "lax");
  assert.equal(production.path, "/");
  assert.equal(production.maxAge, 60 * 60 * 4);
});

test("logout expira o mesmo cookie", async () => {
  const { getClearedSessionCookieOptions } = await optionsModule();
  const options = getClearedSessionCookieOptions(true);
  assert.equal(options.httpOnly, true);
  assert.equal(options.secure, true);
  assert.equal(options.sameSite, "lax");
  assert.equal(options.path, "/");
  assert.equal(options.maxAge, 0);
  assert.equal(options.expires.getTime(), 0);
});
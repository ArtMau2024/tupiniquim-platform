"use strict";
import test from "node:test";
import assert from "node:assert/strict";

async function configModule() {
  return import("../../../lib/cms/admin-config.ts");
}

const validEnv = {
  CMS_ADMIN_USERNAME: "admin-local",
  CMS_ADMIN_PASSWORD: "strong-local-password",
  CMS_SESSION_SECRET: "independent-session-secret-with-at-least-32-characters",
};

test("configuração incompleta ou insegura bloqueia autenticação", async () => {
  const { getAdminConfig } = await configModule();
  assert.equal(getAdminConfig({}), null);
  assert.equal(getAdminConfig({ ...validEnv, CMS_ADMIN_USERNAME: "" }), null);
  assert.equal(getAdminConfig({ ...validEnv, CMS_ADMIN_PASSWORD: "" }), null);
  assert.equal(getAdminConfig({ ...validEnv, CMS_SESSION_SECRET: "short" }), null);
  assert.equal(getAdminConfig({ ...validEnv, CMS_SESSION_SECRET: validEnv.CMS_ADMIN_PASSWORD }), null);
});

test("somente a combinação correta é aceita", async () => {
  const { validateAdminCredentials } = await configModule();
  assert.equal(validateAdminCredentials("admin-local", "strong-local-password", validEnv), true);
  assert.equal(validateAdminCredentials("wrong", "strong-local-password", validEnv), false);
  assert.equal(validateAdminCredentials("admin-local", "wrong", validEnv), false);
  assert.equal(validateAdminCredentials("", "", validEnv), false);
});

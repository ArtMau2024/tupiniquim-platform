import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const sql = fs.readFileSync("migrations/0002_create_cms_posts.sql", "utf8");
const upper = sql.toUpperCase();

test("migration D1 nao usa transacao SQL explicita", () => {
  assert.doesNotMatch(upper, /BEGIN\s+TRANSACTION/);
  assert.doesNotMatch(upper, /SAVEPOINT/);
  assert.doesNotMatch(upper, /(^|;)\s*COMMIT\s*;/m);
});

test("migration cria cms_posts e preserva o legado", () => {
  for (const token of [
    "CREATE TABLE CMS_POSTS",
    "FROM CMS_DRAFTS",
    "COALESCE(NULLIF(TRIM(AUTHOR),''),'GREYCE')",
    "NULLIF(TRIM(IMAGE),'')",
    "'DRAFT'",
    "PUBLISHED_AT",
    "CREATE INDEX",
  ]) {
    assert.ok(upper.includes(token), `Contrato ausente: ${token}`);
  }
  assert.doesNotMatch(upper, /DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?CMS_DRAFTS/);
});

test("estado e data possuem invariante", () => {
  assert.match(
    sql,
    /CHECK\(\(status='draft' AND published_at IS NULL\) OR \(status='published' AND published_at IS NOT NULL\)\)/,
  );
});

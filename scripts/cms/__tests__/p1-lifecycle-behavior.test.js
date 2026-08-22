import test from "node:test";
import assert from "node:assert/strict";
import { D1PostRepository } from "../../../lib/cms/d1-post-repository.ts";

class FakeDB {
  constructor(row) {
    this.row = row;
  }

  prepare(sql) {
    return this.statement(sql, []);
  }

  statement(sql, args) {
    return {
      bind: (...nextArgs) => this.statement(sql, nextArgs),
      first: async () => this.row,
      all: async () => ({ results: this.row ? [this.row] : [] }),
      run: async () => {
        if (!sql.startsWith("UPDATE") || !this.row) {
          return { success: true, meta: { changes: 1 } };
        }

        if (sql.includes("SET status='published'")) {
          if (this.row.status !== "draft") {
            return { success: true, meta: { changes: 0 } };
          }
          this.row = {
            ...this.row,
            status: "published",
            published_at: args[0],
            updated_at: args[1],
          };
        } else if (sql.includes("SET status='draft'")) {
          if (this.row.status !== "published") {
            return { success: true, meta: { changes: 0 } };
          }
          this.row = {
            ...this.row,
            status: "draft",
            published_at: null,
            updated_at: args[0],
          };
        }

        return { success: true, meta: { changes: 1 } };
      },
    };
  }
}

function makeRow() {
  return {
    id: "1",
    slug: "teste",
    title: "Teste",
    description: "D",
    category: "tecnologia",
    content: "C",
    author: "Greyce",
    image: null,
    status: "draft",
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: "2026-01-01T00:00:00.000Z",
    published_at: null,
  };
}

test("publica, recusa segunda publicacao, retira e republica", async () => {
  const database = new FakeDB(makeRow());
  const repository = new D1PostRepository(database);

  const first = await repository.publish("1");
  assert.equal(first.status, "published");
  assert.ok(first.publishedAt);
  await assert.rejects(() => repository.publish("1"));

  const removed = await repository.unpublish("1");
  assert.equal(removed.status, "draft");
  assert.equal(removed.publishedAt, null);
  assert.equal(removed.content, "C");
  await assert.rejects(() => repository.unpublish("1"));

  const again = await repository.publish("1");
  assert.equal(again.status, "published");
  assert.equal(again.id, "1");
  assert.equal(again.slug, "teste");
  assert.equal(again.author, "Greyce");
  assert.equal(again.content, "C");
  assert.ok(again.publishedAt);
});

test("publicado bloqueia mudanca de slug", async () => {
  const row = makeRow();
  row.status = "published";
  row.published_at = "2026-01-02T00:00:00.000Z";
  const repository = new D1PostRepository(new FakeDB(row));

  await assert.rejects(
    () => repository.update("1", {
      title: "Teste",
      slug: "outro",
      description: "D",
      category: "tecnologia",
      content: "C",
      author: "Greyce",
      image: null,
    }),
    /Slug publicado/,
  );
});

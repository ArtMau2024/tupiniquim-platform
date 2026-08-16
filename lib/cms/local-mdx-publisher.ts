import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getBlogCategoryBySlug } from "../blog-categories";
import type { DraftInput } from "./draft";

export type LocalMdxResult = Readonly<{ relativePath: string; slug: string; date: string; state: "awaiting_catalog" }>;
export type LocalMdxOptions = Readonly<{ root?: string; now?: Date; environment?: string }>;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function yamlText(value: unknown): string {
  return JSON.stringify(String(value ?? "").replace(/\r?\n/g, " ").trim());
}
function normalizeImage(value: string | null | undefined): string {
  const image = String(value ?? "").trim();
  if (!image || /^https?:\/\//i.test(image)) return image;
  return `/${image.replace(/^\/+/, "")}`;
}
function bodyOnly(value: string): string {
  const body = value.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  return body.startsWith("---\n") ? body.replace(/^---\n[\s\S]*?\n---\n?/, "") : body;
}
export function serializeDraftToMdx(input: DraftInput, date: string): string {
  const category = getBlogCategoryBySlug(input.category);
  if (!category) throw new Error("Categoria editorial inválida.");
  const author = String(input.author ?? "").trim() || "Greyce";
  const content = bodyOnly(input.content).trimEnd();
  return [
    "---",
    `title: ${yamlText(input.title)}`,
    `date: ${yamlText(date)}`,
    `category: ${yamlText(category.label)}`,
    `description: ${yamlText(input.description)}`,
    `image: ${yamlText(normalizeImage(input.image))}`,
    `author: ${yamlText(author)}`,
    "---",
    content,
    "",
  ].join("\n");
}
export function generateLocalMdx(input: DraftInput, options: LocalMdxOptions = {}): LocalMdxResult {
  const root = path.resolve(options.root ?? process.cwd());
  const environment = options.environment ?? process.env.NODE_ENV;
  if (environment === "production") throw new Error("A geração de MDX está disponível somente no ambiente editorial local.");
  if (!SLUG.test(input.slug) || input.slug.includes("..") || /[\/\\]/.test(input.slug)) throw new Error("Slug inválido para geração local.");
  const postsDir = path.resolve(root, "content", "posts");
  if (!fs.existsSync(path.join(root, "package.json")) || !fs.statSync(postsDir, { throwIfNoEntry: false })?.isDirectory()) throw new Error("A geração de MDX está disponível somente no ambiente editorial local.");
  const destination = path.resolve(postsDir, `${input.slug}.mdx`);
  if (path.dirname(destination) !== postsDir) throw new Error("Destino de artigo inválido.");
  if (fs.existsSync(destination)) throw new Error("Já existe um artigo MDX com este slug. Nenhum arquivo foi alterado.");
  const now = options.now ?? new Date();
  const date = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`;
  const mdx = serializeDraftToMdx(input, date);
  const temporary = path.join(postsDir, `.${input.slug}.${crypto.randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temporary, mdx, { encoding: "utf8", flag: "wx" });
    const check = fs.readFileSync(temporary);
    if (check.length < 10 || (check[0] === 0xef && check[1] === 0xbb && check[2] === 0xbf) || !check.toString("utf8").startsWith("---\n") || !check.toString("utf8").endsWith("\n")) throw new Error("Falha na validação do MDX temporário.");
    if (fs.existsSync(destination)) throw new Error("Já existe um artigo MDX com este slug. Nenhum arquivo foi alterado.");
    fs.renameSync(temporary, destination);
  } catch (error) {
    if (fs.existsSync(temporary)) fs.rmSync(temporary, { force: true });
    throw error;
  }
  return { relativePath: `content/posts/${input.slug}.mdx`, slug: input.slug, date, state: "awaiting_catalog" };
}

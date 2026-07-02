#!/usr/bin/env node

/**
 * generate-posts.js
 *
 * Objetivo:
 * Ler os arquivos MDX de content/posts durante o build
 * e gerar um módulo TypeScript em lib/generated-posts.ts.
 *
 * Motivo:
 * Cloudflare Workers não deve depender de fs em runtime.
 * Assim, os posts são resolvidos antes do deploy.
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const postsDirectory = path.join(process.cwd(), "content", "posts");
const outputFile = path.join(process.cwd(), "lib", "generated-posts.ts");

function normalizeImagePath(image) {
  if (!image) {
    return null;
  }

  const value = String(image).trim();

  if (!value) {
    return null;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return "/" + value.replace(/^\/+/, "");
}

function readPosts() {
  if (!fs.existsSync(postsDirectory)) {
    throw new Error(`Pasta de posts não encontrada: ${postsDirectory}`);
  }

  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith(".mdx"))
    .sort();

  return files.map((file) => {
    const filePath = path.join(postsDirectory, file);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const { data, content } = matter(fileContents);

    return {
      slug: file.replace(/\.mdx$/, "").trim(),
      title: data.title || "Sem título",
      date: data.date || "",
      author: data.author || "",
      description: data.description || "",
      category: data.category || "geral",
      image: normalizeImagePath(data.image || null),
      content: content || "",
    };
  });
}

function writeGeneratedPosts(posts) {
  const fileContent = `/**
 * Arquivo gerado automaticamente por scripts/generate-posts.js.
 * Não edite manualmente este arquivo.
 */

export type GeneratedPost = {
  slug: string;
  title: string;
  date: string;
  author: string;
  description: string;
  category: string;
  image: string | null;
  content: string;
};

export const generatedPosts: GeneratedPost[] = ${JSON.stringify(posts, null, 2)};
`;

  fs.writeFileSync(outputFile, fileContent, "utf8");
}

function main() {
  const posts = readPosts();

  writeGeneratedPosts(posts);

  console.log(`✅ ${posts.length} posts gerados em lib/generated-posts.ts`);
}

main();
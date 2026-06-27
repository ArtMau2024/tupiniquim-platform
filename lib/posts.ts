import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Post = {
  slug: string;
  title: string;
  date: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

export function getAllPosts(): Post[] {
  const files = fs.readdirSync(postsDirectory);

  return files.map((file) => {
    const filePath = path.join(postsDirectory, file);
    const fileContents = fs.readFileSync(filePath, "utf8");

    const { data } = matter(fileContents);

    return {
      slug: file.replace(".mdx", "").trim(),
      title: data.title || "Sem título",
      date: data.date || "",
      category: data.category || "geral",
      image: data.image || null,
    };
  });
}
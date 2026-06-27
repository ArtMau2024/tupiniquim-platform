import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "content", "posts");
  const files = fs.readdirSync(postsDirectory);

  return files.map((file) => ({
    slug: file.replace(".mdx", ""),
  }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    return <div>Post inválido</div>;
  }

  const filePath = path.join(
    process.cwd(),
    "content",
    "posts",
    `${slug}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    return <div>Post não encontrado</div>;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return (
    <article>
      <h1>{data.title}</h1>
      <p>{data.date}</p>
      <div>{content}</div>
    </article>
  );
}

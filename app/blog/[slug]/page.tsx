import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ✅ garantir geração correta das rotas
export function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "content", "posts");
  const files = fs.readdirSync(postsDirectory);

  return files.map((file) => ({
    slug: file.replace(".mdx", ""),
  }));
}

// ✅ resolver problema do params em produção
export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const slug = params.slug;

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
    <article style={{ lineHeight: 1.6 }}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
        {data.title}
      </h1>

      <p style={{ color: "#666", marginBottom: "20px" }}>
        {data.date}
      </p>

      <hr style={{ marginBottom: "20px" }} />

      <div>{content}</div>
    </article>
  );
}
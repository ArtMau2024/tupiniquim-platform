import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ✅ gera os slugs corretamente
export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), "content", "posts");
  const files = fs.readdirSync(postsDirectory);

  return files.map((file) => ({
    slug: file.replace(".mdx", ""),
  }));
}

// ✅ COMPORTAMENTO CORRETO para Next moderno
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ✅ AGORA SIM: resolve corretamente
  const { slug } = await params;

  if (!slug) {
    return (
      <article>
        <h2>Post não encontrado</h2>
        <p>Slug indefinido</p>
      </article>
    );
  }

  const filePath = path.join(
    process.cwd(),
    "content",
    "posts",
    `${slug}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    return (
      <article>
        <h2>Post não encontrado</h2>
        <p>Arquivo não encontrado</p>
      </article>
    );
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  return (
    <article style={{ lineHeight: 1.6 }}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
        {data.title}
      </h1>

      <p
        style={{
          color: "#666",
          fontSize: "14px",
          marginBottom: "20px",
        }}
      >
        {data.date}
      </p>

      <hr style={{ marginBottom: "20px" }} />

      <div style={{ fontSize: "18px" }}>{content}</div>
    </article>
  );
}
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

export default function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const filePath = path.join(
    process.cwd(),
    "content",
    "posts",
    `${params.slug}.mdx`
  );

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
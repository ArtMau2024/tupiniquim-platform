import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main>
      <h1 style={{ marginBottom: "20px" }}>Blog</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {posts.map((post: any) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #eee",
                backgroundColor: "#fafafa",
                transition: "all 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f0f0f0";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fafafa";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <h2 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>
                {post.title}
              </h2>

              <p style={{ margin: 0, color: "#666", fontSize: "14px" }}>
                {post.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main>
      <h1 style={{ marginBottom: "24px", fontSize: "28px" }}>
        Blog
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {posts.map((post: any) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div className="post-card">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-date">{post.date}</p>
            </div>
          </Link>
        ))}
      </div>

      <style>{`
        .post-card {
          padding: 28px;
          border-radius: 12px;
          background: #ffffff;
          border: 1px solid #eaeaea;
          box-shadow: 
            0 2px 6px rgba(0,0,0,0.04),
            0 8px 20px rgba(0,0,0,0.06);
          transition: all 0.25s ease;
        }

        .post-card:hover {
          transform: translateY(-6px);
          box-shadow: 
            0 6px 12px rgba(0,0,0,0.08),
            0 16px 30px rgba(0,0,0,0.12);
          border-color: #ddd;
        }

        .post-title {
          margin: 0 0 12px 0;
          font-size: 22px;
          font-weight: 600;
        }

        .post-date {
          margin: 0;
          color: #888;
          font-size: 14px;
        }
      `}</style>
    </main>
  );
}
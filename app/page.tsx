import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  const posts = getAllPosts();

  // ✅ Definições consistentes
  const main = posts[0];
  const tech = posts.filter((p: any) => p.category === "tecnologia");
  const business = posts.filter((p: any) => p.category === "negócios");

  return (
    <main>

      {/* HERO */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{
          background: "#111",
          color: "#fff",
          padding: "30px",
          borderRadius: "12px"
        }}>
          {main && (
            <Link
              href={`/blog/${main.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
                {main.title}
              </h1>
              <p>{main.date}</p>
            </Link>
          )}
        </div>
      </section>

      {/* GRID PRINCIPAL */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
        }}
      >
        {/* TECNOLOGIA */}
        <div>
          <h2>🖥 Tecnologia</h2>

          {tech.map((post: any) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  padding: "16px",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  background: "#fafafa",
                }}
              >
                {post.title}
              </div>
            </Link>
          ))}
        </div>

        {/* NEGÓCIOS */}
        <div>
          <h2>💼 Negócios</h2>

          {business.map((post: any) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                style={{
                  padding: "16px",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  marginBottom: "12px",
                  background: "#fafafa",
                }}
              >
                {post.title}
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
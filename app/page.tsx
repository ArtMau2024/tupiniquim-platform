import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  const posts = getAllPosts() 
  const tech = posts.filter((p: any) => p.category === "tecnologia");
  const business = posts.filter((p: any) => p.category === "negócios");

  return (
  <main>

    {/* HERO */}
    <section style={{ marginBottom: "40px" }}>
      <div className="hero">
        <h1 className="hero-title">{posts[0].title}</h1>
        <p className="hero-date">{posts[0].date}</p>
      </div>
    </section>

    {/* GRID PRINCIPAL */}
    <section className="grid">
      {/* TECNOLOGIA */}
      <div>
        <h2>🖥 Tecnologia</h2>
        {tech.map((post: any) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div className="card">
              {post.title}
            </div>
          </Link>
        ))}
      </div>

      {/* NEGÓCIOS */}
      <div>
        <h2>💼 Negócios</h2>
        {business.map((post: any) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div className="card">
              {post.title}
            </div>
          </Link>
        ))}
      </div>
    </section>

    <style>{`
      .hero {
        background: #111;
        color: #fff;
        padding: 30px;
        border-radius: 12px;
      }

      .hero-title {
        font-size: 28px;
        margin: 0 0 10px 0;
      }

      .hero-date {
        color: #aaa;
      }

      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
      }

      .card {
        padding: 16px;
        border: 1px solid #eee;
        border-radius: 8px;
        margin-bottom: 12px;
        background: #fafafa;
        transition: 0.2s;
      }

      .card:hover {
        background: #f0f0f0;
        transform: translateY(-2px);
      }
    `}</style>
  </main>
);
}
  const posts = getAllPosts();

  const main = posts[0];
  const tech = posts.filter((p: any) => p.category === "tecnologia");

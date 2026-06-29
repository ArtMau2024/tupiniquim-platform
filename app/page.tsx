import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function Home() {
  const posts = getAllPosts();

  // ✅ Definições consistentes
  const main = posts[0];
  const tech = posts.filter((p: any) => p.category === "tecnologia");
  const business = posts.filter((p: any) => p.category === "negócios");
  const sports = posts.filter((p: any) => p.category === "esportes");
  const innovation = posts.filter((p: any) => p.category === "Empreendedorismo");
  const health = posts.filter((p: any) => p.category === "Saúde e Lazer");

  return (
    <main>
      <h1>ID BUILD: 001</h1>

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
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="card">{post.title}</div>
            </Link>
          ))}
        </div>

        {/* NEGÓCIOS */}
        <div>
          <h2>💼 Negócios</h2>
          {business.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="card">{post.title}</div>
            </Link>
          ))}
        </div>

        {/* ESPORTES */}
        <div>
          <h2>⚽ Esportes</h2>
          {sports.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="card">{post.title}</div>
            </Link>
          ))}
        </div>

        {/* EMPREENDEDORISMO */}
        <div>
          <h2>🚀 Empreendedorismo</h2>
          {innovation.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="card">{post.title}</div>
            </Link>
          ))}
        </div>

        {/* SAÚDE E LAZER */}
        <div>
          <h2>🧘 Saúde e Lazer</h2>
          {health.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="card">{post.title}</div>
            </Link>
          ))}
        </div>

      </section>

      {/* ESTILO */}
      <style>{`
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
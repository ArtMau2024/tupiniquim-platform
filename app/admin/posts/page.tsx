import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "../actions";
import { hasValidAdminSession } from "@/lib/cms/admin-session";
import { listEditorialPosts } from "@/lib/cms/editorial-catalog";

export default async function AdminPostsPage() {
  if (!(await hasValidAdminSession())) {
    redirect("/admin/login");
  }

  const posts = listEditorialPosts();

  return (
    <section aria-labelledby="cms-posts-title" style={{ maxWidth: 1100, margin: "48px auto", padding: 24 }}>
      <header style={{ display: "flex", justifyContent: "space-between", gap: 24, alignItems: "center" }}>
        <div>
          <h1 id="cms-posts-title">Artigos</h1>
          <p>Modo somente leitura — salvamento será disponibilizado em etapa posterior.</p>
        </div>
        <form action={logoutAdmin}>
          <button type="submit" style={{ padding: 12, cursor: "pointer" }}>Sair</button>
        </form>
      </header>

      <div style={{ display: "grid", gap: 16 }}>
        {posts.map((post) => (
          <article key={post.slug} style={{ padding: 20, background: "#fff", borderRadius: 12 }}>
            <h2 style={{ marginTop: 0 }}>{post.title}</h2>
            <p><strong>Slug:</strong> {post.slug}</p>
            <p><strong>Categoria:</strong> {post.category}</p>
            <p><strong>Data:</strong> {post.date}</p>
            {post.author ? <p><strong>Autor:</strong> {post.author}</p> : null}
            <Link href={`/admin/posts/${post.slug}/editar`}>Abrir em modo somente leitura</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
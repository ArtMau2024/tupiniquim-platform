import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogCategoryBySlug, getBlogCategoryByValue } from "@/lib/blog-categories";
import { listPublicEditorialPosts } from "@/lib/cms/public-editorial-catalog";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const category = getBlogCategoryBySlug(categoria);
  if (!category) notFound();
  const posts = (await listPublicEditorialPosts()).filter((post) => getBlogCategoryByValue(post.category)?.slug === category.slug);
  return (
    <main className="category-page">
      <header className="category-header">
        <Link className="category-back-top" href="/blog" aria-label="Voltar para o Blog">← Voltar ao Blog</Link>
        <p className="category-eyebrow">Editoria Tupiniquim</p>
        <h1>{category.label}</h1>
        <p>{category.description}</p>
        <span>{posts.length} {posts.length === 1 ? "publicação" : "publicações"}</span>
      </header>
      <section className="category-results" aria-label={`Publicações de ${category.label}`}>
        {posts.length ? <div className="category-grid">{posts.map((post) => (
          <article className="category-card" key={post.slug}>
            <p>{getBlogCategoryByValue(post.category)?.label ?? post.category}</p>
            <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
            <p>{post.description}</p>
            <time dateTime={post.date}>{post.date}</time>
          </article>
        ))}</div> : <div className="category-empty"><h2>Novos conteúdos estão sendo preparados</h2><p>Explore as outras editorias ou converse com a Tupiniquim Conexões sobre este tema.</p></div>}
      </section>
      <section className="category-actions">
        <Link href="/blog">Explorar todo o Blog</Link>
        <Link className="category-contact" href="/contato">Conversar sobre seu projeto</Link>
      </section>
      <style>{`
        .category-page { width:100%; color:#111; }
        .category-header { padding:clamp(48px,8vw,92px) clamp(20px,6vw,72px); background:linear-gradient(120deg,#111,#1b5e20); color:#fff; }
        .category-back-top { display:inline-flex; align-items:center; margin-bottom:28px; padding:10px 14px; border:1px solid rgba(255,255,255,.55); border-radius:6px; color:#fff; font-weight:800; text-decoration:none; }
        .category-back-top:hover, .category-back-top:focus-visible { border-color:#ffb300; color:#ffb300; outline:none; }
        .category-eyebrow { color:#ffb300; font-size:.78rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; }
        .category-header h1 { margin:10px 0 16px; font-size:clamp(2.5rem,6vw,5rem); line-height:1; }
        .category-header > p:not(.category-eyebrow) { max-width:760px; color:#e7e7e7; line-height:1.7; }
        .category-header span { display:inline-block; margin-top:18px; font-weight:800; }
        .category-results { padding:clamp(42px,6vw,72px) clamp(20px,5vw,64px); }
        .category-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; }
        .category-card { padding:26px; border-top:5px solid #2e7d32; background:#f5f5f5; }
        .category-card > p:first-child { color:#2e7d32; font-size:.75rem; font-weight:800; text-transform:uppercase; }
        .category-card h2 { margin:12px 0; line-height:1.15; }
        .category-card h2 a { color:#111; text-decoration:none; }
        .category-card > p:not(:first-child) { color:#444; line-height:1.6; }
        .category-card time { color:#666; font-size:.85rem; }
        .category-empty { padding:32px; background:#f5f5f5; }
        .category-actions { display:flex; justify-content:space-between; gap:16px; padding:32px clamp(20px,5vw,64px); background:#111; }
        .category-actions a { color:#fff; font-weight:800; }
        .category-actions .category-contact { padding:12px 18px; border-radius:6px; background:#ffb300; color:#111; text-decoration:none; }
        @media(max-width:900px){.category-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
        @media(max-width:640px){.category-grid{grid-template-columns:1fr}.category-actions{align-items:flex-start;flex-direction:column}.category-contact{width:100%;box-sizing:border-box;text-align:center}}
      `}</style>
    </main>
  );
}

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogCategories, getBlogCategoryBySlug, getBlogCategoryByValue } from "@/lib/blog-categories";
import { listPublicEditorialPosts } from "@/lib/cms/public-editorial-catalog";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params;
  const category = getBlogCategoryBySlug(categoria);
  if (!category) notFound();
  const posts = (await listPublicEditorialPosts()).filter((post) => getBlogCategoryByValue(post.category)?.slug === category.slug);
  const categories = getBlogCategories();
  return (
    <main className="category-page">
      <header className="category-header">
        <Link className="category-back-top" href="/blog" aria-label="Voltar para o Blog">← Voltar ao Blog</Link>
        <p className="category-eyebrow">Editoria Tupiniquim</p>
        <h1>{category.label}</h1>
        <p>{category.description}</p>
        <span>{posts.length} {posts.length === 1 ? "publicação" : "publicações"}</span>
      </header>
      <nav className="category-switcher" aria-label="Navegar entre editorias">
        <div className="category-switcher-heading">
          <p>Explore outras editorias</p>
          <span>Continue navegando pelos temas da Tupiniquim Conexões.</span>
        </div>
        <div className="category-switcher-list">
          <Link className="category-switcher-item" href="/blog">Todos</Link>
          {categories.map((item) => (
            <Link
              className={`category-switcher-item${item.slug === category.slug ? " category-switcher-item-active" : ""}`}
              href={`/blog/categoria/${item.slug}`}
              key={item.slug}
              aria-current={item.slug === category.slug ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <section className="category-results" aria-label={`Publicações de ${category.label}`}>
        {posts.length ? <div className="category-grid">{posts.map((post) => (
          <article className="category-card" key={post.slug}>
            {post.image ? (
              <Link className="category-card-image-link" href={`/blog/${post.slug}`} aria-label={`Abrir ${post.title}`}>
                <Image
                  className="category-card-image"
                  src={post.image}
                  alt={post.title}
                  width={720}
                  height={450}
                />
              </Link>
            ) : null}
            <div className="category-card-content">
              <p>{getBlogCategoryByValue(post.category)?.label ?? post.category}</p>
            <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
            <p>{post.description}</p>
              <time dateTime={post.date}>{post.date}</time>
            </div>
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
        .category-switcher { display:grid; grid-template-columns:minmax(220px,.7fr) minmax(0,1.3fr); align-items:center; gap:28px; margin:28px clamp(20px,5vw,64px) 0; padding:24px; border:1px solid #d9e2da; border-left:5px solid #2e7d32; border-radius:10px; background:linear-gradient(135deg,#fff 0%,#f1f7f2 100%); box-shadow:0 12px 28px rgba(17,58,25,.08); }
        .category-switcher-heading p { margin:0; color:#1b5e20; font-size:.78rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; }
        .category-switcher-heading span { display:block; margin-top:7px; color:#4d5a50; font-size:.92rem; line-height:1.5; }
        .category-switcher-list { display:flex; justify-content:flex-end; flex-wrap:wrap; gap:10px; }
        .category-switcher-item { padding:11px 16px; border:1px solid #ccd7ce; border-radius:999px; background:#fff; color:#222; font-weight:700; text-decoration:none; }
        .category-switcher-item:hover, .category-switcher-item:focus-visible { border-color:#2e7d32; background:#e9f4eb; color:#1b5e20; outline:none; }
        .category-switcher-item-active { border-color:#1b5e20; background:#1b5e20; color:#fff; }
        .category-results { padding:clamp(42px,6vw,72px) clamp(20px,5vw,64px); }
        .category-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:24px; }
        .category-card { overflow:hidden; border-top:5px solid #2e7d32; border-radius:4px; background:#f5f5f5; box-shadow:0 12px 26px rgba(17,58,25,.08); }
        .category-card-image-link { display:block; overflow:hidden; aspect-ratio:16/10; background:#e8eee9; }
        .category-card-image { width:100%; height:100%; object-fit:cover; transition:transform .25s ease; }
        .category-card-image-link:hover .category-card-image, .category-card-image-link:focus-visible .category-card-image { transform:scale(1.025); }
        .category-card-content { padding:26px; }
        .category-card-content > p:first-child { color:#2e7d32; font-size:.75rem; font-weight:800; text-transform:uppercase; }
        .category-card h2 { margin:12px 0; line-height:1.15; }
        .category-card h2 a { color:#111; text-decoration:none; }
        .category-card-content > p:not(:first-child) { color:#444; line-height:1.6; }
        .category-card time { color:#666; font-size:.85rem; }
        .category-empty { padding:32px; background:#f5f5f5; }
        .category-actions { display:flex; justify-content:space-between; gap:16px; padding:32px clamp(20px,5vw,64px); background:#111; }
        .category-actions a { color:#fff; font-weight:800; }
        .category-actions .category-contact { padding:12px 18px; border-radius:6px; background:#ffb300; color:#111; text-decoration:none; }
        @media(max-width:900px){.category-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
        @media(max-width:760px){.category-switcher{grid-template-columns:1fr;gap:18px}.category-switcher-list{justify-content:flex-start;overflow-x:auto;flex-wrap:nowrap;padding-bottom:4px}.category-switcher-item{flex:0 0 auto}}
        @media(max-width:640px){.category-grid{grid-template-columns:1fr}.category-actions{align-items:flex-start;flex-direction:column}.category-contact{width:100%;box-sizing:border-box;text-align:center}}
      `}</style>
    </main>
  );
}

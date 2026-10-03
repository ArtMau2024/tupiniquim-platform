import { listPublicEditorialPosts } from "@/lib/cms/public-editorial-catalog";
import {
  getBlogCategories,
  getBlogCategoryByValue,
} from "@/lib/blog-categories";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Blog | Tupiniquim Conexões",
  description:
    "Estratégias, ideias e experiências sobre marketing, conteúdo e tecnologia para fortalecer a presença digital das empresas.",
};

function formatDate(date: string) {
  const parsedDate = new Date(`${date}T12:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await listPublicEditorialPosts();
  const featuredPost = posts[0];
  const secondaryPosts = posts.slice(1, 3);
  const categories = getBlogCategories();

  return (
    <div className="blog-page">
      {/* HERO */}
      <section className="hero-blog">
        <p className="hero-eyebrow">Conhecimento para transformar presença em oportunidade</p>
        <h1>Ideias para fortalecer marcas e negócios no digital</h1>
        <p>Estratégias, conteúdos e aprendizados práticos para empresas que desejam comunicar valor, ampliar sua presença e evoluir com tecnologia.</p>
      </section>

      {/* CATEGORIAS */}
      <nav className="category-nav" aria-label="Categorias do blog">
        <div className="category-nav-intro">
          <span className="category-nav-title">Explore por editoria</span>
          <p>Encontre conteúdos alinhados aos desafios e interesses do seu negócio.</p>
        </div>
        <div className="category-list">
          <Link
            href="/blog"
            className="category-item category-item-active"
            aria-current="page"
          >
            Todos
          </Link>

          {categories.map((category) => (
            <Link
              className="category-item"
              href={`/blog/categoria/${category.slug}`}
              key={category.slug}
            >
              {category.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* DESTAQUES EDITORIAIS */}
      {featuredPost && (
        <section
          className="editorial-grid"
          aria-label="Publicações em destaque"
        >
          <article className="lead-story">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="story-link lead-story-link"
            >
              <div className="lead-content">
                <p className="story-category">
                  {getBlogCategoryByValue(featuredPost.category)?.label ??
                    featuredPost.category}
                </p>
                <h2>{featuredPost.title}</h2>
                <p className="story-description">
                  {featuredPost.description}
                </p>
                <p className="story-meta">
                  {featuredPost.author ? <span>Por {featuredPost.author}</span> : null}
                  {featuredPost.author ? <span aria-hidden="true">•</span> : null}
                  <time dateTime={featuredPost.date}>{formatDate(featuredPost.date)}</time>
                </p>
              </div>

              {featuredPost.image && (
                <div className="lead-image-wrapper">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    width={960}
                    height={600}
                    className="lead-image"
                    priority
                  />
                </div>
              )}
            </Link>
          </article>

          <div className="secondary-stories">
            {secondaryPosts.map((post) => (
              <article className="secondary-story" key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="story-link secondary-story-link"
                >
                  {post.image && (
                    <div className="secondary-image-wrapper">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={520}
                        height={320}
                        className="secondary-image"
                      />
                    </div>
                  )}

                  <div className="secondary-content">
                    <p className="story-category">
                      {getBlogCategoryByValue(post.category)?.label ??
                        post.category}
                    </p>
                    <h3>{post.title}</h3>
                    <p className="secondary-description">
                      {post.description}
                    </p>
                    <p className="story-meta">
                      {post.author ? <span>Por {post.author}</span> : null}
                      {post.author ? <span aria-hidden="true">•</span> : null}
                      <time dateTime={post.date}>{formatDate(post.date)}</time>
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ÚLTIMAS PUBLICAÇÕES */}
      <section className="latest-section">
        <header className="section-heading">
          <div>
            <p className="section-kicker">Atualizações</p>
            <h2>Últimas publicações</h2>
          </div>
          <span>{posts.length} publicações</span>
        </header>

        <div className="latest-grid">
          {posts.map((post) => (
            <article className="latest-story" key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="story-link">
                {post.image && (
                  <div className="latest-image-wrapper">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={640}
                      height={400}
                      className="latest-image"
                    />
                  </div>
                )}

                <div className="latest-content">
                  <p className="story-category">
                    {getBlogCategoryByValue(post.category)?.label ??
                      post.category}
                  </p>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <p className="story-meta">
                    {post.author ? <span>Por {post.author}</span> : null}
                    {post.author ? <span aria-hidden="true">•</span> : null}
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="blog-commercial-cta">
        <div>
          <p className="section-kicker">Transforme conhecimento em próximo passo</p>
          <h2>Quer aplicar essas ideias na presença digital da sua empresa?</h2>
          <p>Conte os objetivos e desafios do negócio. A Tupiniquim Conexões analisará o cenário e retornará em breve.</p>
        </div>
        <Link className="blog-commercial-link" href="/contato">Falar sobre seu projeto</Link>
      </section>
      <style>{`
        .blog-page {
          width: 100%;
        }
        .blog-commercial-cta { display:flex; align-items:center; justify-content:space-between; gap:32px; margin-top:48px; padding:clamp(32px,5vw,56px); background:#1b5e20; color:#fff; }
        .blog-commercial-cta > div { max-width:760px; }
        .blog-commercial-cta h2 { margin:0; font-size:clamp(1.8rem,4vw,3rem); line-height:1.05; }
        .blog-commercial-cta p:not(.section-kicker) { margin:16px 0 0; color:#e7e7e7; line-height:1.7; }
        .blog-commercial-link { flex:0 0 auto; padding:14px 20px; border-radius:6px; background:#ffb300; color:#111; font-weight:800; text-decoration:none; }


        .hero-blog {
          background: linear-gradient(120deg, #111, #1b5e20);
          color: white;
          padding: 44px 40px;
          margin-bottom: 0;
        }

        .hero-blog h1 {
          margin: 6px 0 10px;
          font-size: clamp(2.25rem, 5vw, 4rem);
          line-height: 1;
        }

        .hero-blog > p:last-child {
          margin: 0;
          color: #e7e7e7;
          font-size: 1.05rem;
        }

        .hero-eyebrow,
        .story-category,
        .section-kicker {
          margin: 0;
          color: #2e7d32;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .hero-eyebrow {
          color: #a5d6a7;
        }

        .category-nav {
          display: grid;
          grid-template-columns: minmax(220px, 0.7fr) minmax(0, 1.3fr);
          align-items: center;
          gap: 28px;
          margin: 24px 0 38px;
          padding: 24px;
          border: 1px solid #d9e2da;
          border-left: 5px solid #2e7d32;
          border-radius: 10px;
          background: linear-gradient(135deg, #ffffff 0%, #f1f7f2 100%);
          box-shadow: 0 12px 28px rgba(17, 58, 25, 0.08);
        }
        .category-nav-intro p {
          margin: 7px 0 0;
          color: #4d5a50;
          font-size: 0.92rem;
          line-height: 1.5;
        }

        .category-nav-title {
          color: #111;
          font-weight: 800;
          text-transform: uppercase;
        }

        .category-list {
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .category-item {
          padding: 2px 18px 7px;
          border-bottom: 3px solid transparent;
          border-left: 1px solid #cfcfcf;
          color: #333;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .category-item:hover,
        .category-item-active {
          border-bottom-color: #2e7d32;
          color: #2e7d32;
        }

        .editorial-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(300px, 1fr);
          gap: 28px;
          padding: 30px 0 34px;
          border-bottom: 4px solid #111;
        }

        .story-link {
          color: inherit;
          text-decoration: none;
        }

        .lead-story-link,
        .secondary-story-link {
          display: block;
        }

        .lead-image-wrapper,
        .secondary-image-wrapper,
        .latest-image-wrapper {
          overflow: hidden;
          background: #ececec;
        }

        .lead-image-wrapper {
          aspect-ratio: 16 / 9;
        }

        .lead-image,
        .secondary-image,
        .latest-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.25s ease;
        }

        .story-link:hover img {
          transform: scale(1.02);
        }

        .lead-content {
          padding-bottom: 18px;
        }

        .lead-content h2 {
          max-width: 900px;
          margin: 8px 0 12px;
          color: #111;
          font-size: clamp(2rem, 4vw, 3.65rem);
          line-height: 1.02;
          letter-spacing: -0.03em;
        }

        .story-description {
          max-width: 820px;
          margin: 0 0 13px;
          color: #444;
          font-size: 1.05rem;
          line-height: 1.55;
        }

        time {
          color: #666;
          font-size: 0.82rem;
        }
        .story-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 7px;
          margin: 0;
          color: #666;
          font-size: 0.82rem;
        }
        .story-meta time {
          color: inherit;
          font-size: inherit;
        }

        .secondary-stories {
          padding-left: 28px;
          border-left: 1px solid #cfcfcf;
        }

        .secondary-story + .secondary-story {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid #cfcfcf;
        }

        .secondary-image-wrapper {
          aspect-ratio: 16 / 9;
          margin-bottom: 13px;
        }

        .secondary-content h3 {
          margin: 7px 0 9px;
          color: #111;
          font-size: clamp(1.2rem, 2vw, 1.65rem);
          line-height: 1.12;
        }

        .secondary-description {
          display: -webkit-box;
          margin: 0 0 10px;
          overflow: hidden;
          color: #4b4b4b;
          line-height: 1.45;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }

        .lead-story-link:hover h2,
        .secondary-story-link:hover h3,
        .latest-story:hover h3 {
          color: #2e7d32;
        }

        .latest-section {
          padding-top: 34px;
        }

        .section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 2px solid #111;
        }

        .section-heading h2 {
          margin: 4px 0 0;
          color: #111;
          font-size: clamp(1.7rem, 3vw, 2.35rem);
        }

        .section-heading > span {
          color: #666;
          font-size: 0.9rem;
        }

        .latest-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 26px;
        }

        .latest-story {
          min-width: 0;
          padding-bottom: 22px;
          border-bottom: 1px solid #cfcfcf;
        }

        .latest-image-wrapper {
          aspect-ratio: 16 / 10;
          margin-bottom: 14px;
        }

        .latest-content h3 {
          margin: 7px 0 9px;
          color: #111;
          font-size: 1.25rem;
          line-height: 1.15;
        }

        .latest-content > p:not(.story-category) {
          display: -webkit-box;
          margin: 0 0 10px;
          overflow: hidden;
          color: #4b4b4b;
          line-height: 1.45;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        @media (max-width: 900px) {
          .editorial-grid {
            grid-template-columns: 1fr;
          }

          .secondary-stories {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 24px;
            padding-left: 0;
            border-left: 0;
          }

          .secondary-story + .secondary-story {
            margin-top: 0;
            padding-top: 0;
            border-top: 0;
          }

          .latest-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 760px) {
          .category-nav { grid-template-columns: 1fr; gap: 18px; }
          .category-list { justify-content: flex-start; overflow-x: auto; padding-bottom: 4px; }
          .category-item { flex: 0 0 auto; }
        }
        @media (max-width: 640px) {
          .blog-commercial-cta { align-items:flex-start; flex-direction:column; }
          .blog-commercial-link { width:100%; box-sizing:border-box; text-align:center; }
          .hero-blog {
            padding: 32px 22px;
          }

          .category-nav {
            align-items: flex-start;
            gap: 12px;
          }

          .editorial-grid {
            gap: 24px;
            padding-top: 24px;
          }

          .secondary-stories,
          .latest-grid {
            grid-template-columns: 1fr;
          }

          .secondary-story + .secondary-story {
            padding-top: 24px;
            border-top: 1px solid #cfcfcf;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
}

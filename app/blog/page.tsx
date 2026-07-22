import { generatedPosts } from "@/lib/generated-posts";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Blog | Tupiniquim",
  description:
    "Conteúdos sobre tecnologia, negócios e inovação da Tupiniquim.",
};

function formatCategory(category: string) {
  const normalizedCategory = category.trim().toLocaleLowerCase("pt-BR");

  const categoryNames: Record<string, string> = {
    empreendedorismo: "Empreendedorismo",
    tecnologia: "Tecnologia",
    saude: "Saúde",
  };

  return categoryNames[normalizedCategory] ?? category;
}

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

export default function BlogPage() {
  const posts = generatedPosts;
  const featuredPost =
    posts.find((post) => post.slug === "construindo-um-blog") ?? posts[0];
  const secondaryPosts = posts
    .filter((post) => post.slug !== featuredPost?.slug)
    .slice(0, 2);
  const categories = Array.from(
    new Set(posts.map((post) => formatCategory(post.category)))
  );

  return (
    <main className="blog-page">
      {/* HERO */}
      <section className="hero-blog">
        <p className="hero-eyebrow">Conteúdo e informação</p>
        <h1>Blog Tupiniquim</h1>
        <p>Conteúdos sobre tecnologia e crescimento digital.</p>
      </section>

      {/* CATEGORIAS */}
      <nav className="category-nav" aria-label="Categorias do blog">
        <span className="category-nav-title">Editorias</span>
        <div className="category-list">
          {categories.map((category) => (
            <span className="category-item" key={category}>
              {category}
            </span>
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

              <div className="lead-content">
                <p className="story-category">
                  {formatCategory(featuredPost.category)}
                </p>
                <h2>{featuredPost.title}</h2>
                <p className="story-description">
                  {featuredPost.description}
                </p>
                <time dateTime={featuredPost.date}>
                  {formatDate(featuredPost.date)}
                </time>
              </div>
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
                      {formatCategory(post.category)}
                    </p>
                    <h3>{post.title}</h3>
                    <p className="secondary-description">
                      {post.description}
                    </p>
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
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
                    {formatCategory(post.category)}
                  </p>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .blog-page {
          width: 100%;
        }

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
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 15px 0;
          border-bottom: 1px solid #cfcfcf;
          overflow-x: auto;
          white-space: nowrap;
        }

        .category-nav-title {
          color: #111;
          font-weight: 800;
          text-transform: uppercase;
        }

        .category-list {
          display: flex;
          align-items: center;
        }

        .category-item {
          padding: 0 18px;
          border-left: 1px solid #cfcfcf;
          color: #333;
          font-weight: 600;
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
          padding-top: 18px;
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

        @media (max-width: 640px) {
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
    </main>
  );
}

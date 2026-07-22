import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generatedPosts } from "@/lib/generated-posts";
import {
  getBlogCategories,
  getBlogCategoryBySlug,
  getPostsByBlogCategory,
} from "@/lib/blog-categories";

type Props = {
  params: Promise<{ categoria: string }>;
};


export function generateStaticParams() {
  return getBlogCategories().map((category) => ({
    categoria: category.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { categoria: categorySlug } = await params;
  const category = getBlogCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  return {
    title: `${category.label} | Blog`,
    description: category.description,
    openGraph: {
      title: `${category.label} | Blog Tupiniquim`,
      description: category.description,
      type: "website" as const,
    },
  };
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

export default async function CategoryPage({ params }: Props) {
  const { categoria: categorySlug } = await params;
  const category = getBlogCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const categories = getBlogCategories();
  const posts = getPostsByBlogCategory(generatedPosts, category.slug);
  const publicationLabel = posts.length === 1 ? "publicação" : "publicações";

  return (
    <main className="category-page">
      <nav className="category-navigation" aria-label="Editorias do blog">
        <span className="category-navigation-label">Editorias</span>

        <div className="category-navigation-list">
          <Link href="/blog" className="category-navigation-link">
            Todos
          </Link>

          {categories.map((item) => {
            const isActive = item.slug === category.slug;

            return (
              <Link
                key={item.slug}
                href={`/blog/categoria/${item.slug}`}
                className={`category-navigation-link${
                  isActive ? " category-navigation-link-active" : ""
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <header className="category-header">
        <p className="category-eyebrow">Editoria</p>
        <h1>{category.label}</h1>
        <p className="category-description">{category.description}</p>
        <p className="category-count">
          {posts.length} {publicationLabel}
        </p>
      </header>

      <section
        className="category-results"
        aria-label={`Publicações de ${category.label}`}
      >
        {posts.length > 0 ? (
          <div className="category-grid">
            {posts.map((post) => (
              <article className="category-card" key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="category-card-link"
                >
                  {post.image && (
                    <div className="category-image-wrapper">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={720}
                        height={450}
                        className="category-image"
                      />
                    </div>
                  )}

                  <div className="category-card-content">
                    <p className="category-card-label">{category.label}</p>
                    <h2 className="category-card-title">{post.title}</h2>
                    <p className="category-card-description">
                      {post.description}
                    </p>
                    <time className="category-card-date" dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="category-empty">
            Nenhuma publicação disponível nesta editoria no momento.
          </p>
        )}
      </section>

      <style>{`
        .category-page {
          width: 100%;
        }

        .category-navigation {
          display: flex;
          align-items: center;
          gap: 24px;
          overflow-x: auto;
          padding: 15px 0;
          border-bottom: 1px solid #cfcfcf;
          white-space: nowrap;
        }

        .category-navigation-label {
          color: #111;
          font-weight: 800;
          text-transform: uppercase;
        }

        .category-navigation-list {
          display: flex;
          align-items: center;
        }

        .category-navigation-link {
          padding: 2px 18px 7px;
          border-bottom: 3px solid transparent;
          border-left: 1px solid #cfcfcf;
          color: #333;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease, border-color 0.2s ease;
        }

        .category-navigation-link:hover,
        .category-navigation-link-active {
          border-bottom-color: #2e7d32;
          color: #2e7d32;
        }

        .category-header {
          padding: 58px 0 38px;
          border-bottom: 4px solid #111;
        }

        .category-eyebrow,
        .category-card-label {
          margin: 0;
          color: #2e7d32;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .category-header h1 {
          margin: 8px 0 14px;
          color: #111;
          font-size: clamp(2.5rem, 6vw, 5rem);
          line-height: 0.98;
          letter-spacing: -0.04em;
        }

        .category-description {
          max-width: 800px;
          margin: 0;
          color: #444;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .category-count {
          margin: 18px 0 0;
          color: #666;
          font-size: 0.9rem;
        }

        .category-results {
          padding: 34px 0 20px;
        }

        .category-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
        }

        .category-card {
          min-width: 0;
          padding-bottom: 24px;
          border-bottom: 1px solid #cfcfcf;
        }

        .category-card-link {
          display: block;
          color: inherit;
          text-decoration: none;
        }

        .category-image-wrapper {
          overflow: hidden;
          aspect-ratio: 16 / 10;
          margin-bottom: 15px;
          background: #ececec;
        }

        .category-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.25s ease;
        }

        .category-card-link:hover .category-image {
          transform: scale(1.02);
        }

        .category-card-title {
          margin: 8px 0 10px;
          color: #111;
          font-size: clamp(1.35rem, 2.4vw, 2rem);
          line-height: 1.12;
          transition: color 0.2s ease;
        }

        .category-card-link:hover .category-card-title {
          color: #2e7d32;
        }

        .category-card-description {
          display: -webkit-box;
          margin: 0 0 12px;
          overflow: hidden;
          color: #4b4b4b;
          line-height: 1.55;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        .category-card-date {
          color: #666;
          font-size: 0.82rem;
        }

        .category-empty {
          margin: 0;
          padding: 42px 0;
          border-bottom: 1px solid #cfcfcf;
          color: #555;
          font-size: 1.05rem;
        }

        @media (max-width: 900px) {
          .category-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .category-navigation {
            align-items: flex-start;
            gap: 12px;
          }

          .category-header {
            padding: 42px 0 30px;
          }

          .category-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}

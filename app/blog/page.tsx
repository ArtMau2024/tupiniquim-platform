import { generatedPosts } from "@/lib/generated-posts";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Blog | Tupiniquim",
  description:
    "Conteúdos sobre tecnologia, negócios e inovação da Tupiniquim.",
};

export default function BlogPage() {
  const posts = generatedPosts;

  return (
    <main>
      {/* HERO */}
      <section className="hero-blog">
        <h1>Blog Tupiniquim</h1>
        <p>Conteúdos sobre tecnologia e crescimento digital.</p>
      </section>

      {/* LISTA */}
      <section className="list">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="post-card">
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.title}
                  width={120}
                  height={80}
                  className="thumb"
                />
              )}

              <div>
                <h2 className="post-title">{post.title}</h2>
                <p>{post.date}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <style>{`
        .hero-blog {
          background: linear-gradient(120deg,#111,#1B5E20);
          color: white;
          padding: 40px;
          border-radius: 10px;
          margin-bottom: 30px;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .post-card {
          display: flex;
          gap: 16px;
          align-items: center;
          padding: 16px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #fff;
          transition: 0.2s;
          cursor: pointer;
        }

        .post-card:hover {
          border-color: #2E7D32;
        }

        .post-title {
          margin-bottom: 5px;
          transition: 0.2s;
        }

        .post-card:hover .post-title {
          color: #2E7D32;
        }

        .thumb {
          border-radius: 8px;
          object-fit: cover;
        }
      `}</style>
    </main>
  );
}
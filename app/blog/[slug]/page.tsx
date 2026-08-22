import Image from "next/image";
import { notFound } from "next/navigation";
import { generatedPosts } from "@/lib/generated-posts";
import { findPublicEditorialPostBySlug } from "@/lib/cms/public-editorial-catalog";
import { getBlogCategoryByValue } from "@/lib/blog-categories";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(date: string) {
  const parsedDate = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsedDate);
}

export async function generateStaticParams() {
  return generatedPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const post = await findPublicEditorialPostBySlug(slug);

  if (!post) {
    return {
      title: "Post não encontrado | Tupiniquim",
    };
  }

  return {
    title: `${post.title} | Tupiniquim`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
      type: "article",
    },
  };
}

// Safe markdown renderer.
// All user text is HTML-escaped before being placed in the output.
// Links only allow http/https protocols to prevent javascript: XSS.

function safeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMd(text: string): string {
  const e = safeHtml(text);

  return e
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      (_, label, url) =>
        `<a href="${safeHtml(url)}" rel="noopener noreferrer">${label}</a>`
    );
}

function markdownToHtml(markdown: string): string {
  const normalizedMarkdown = markdown.replace(/\r\n?/g, "\n");
  const blocks = normalizedMarkdown.split(/\n\n+/);
  const html: string[] = [];

  for (const raw of blocks) {
    const block = raw.trim();

    if (!block) continue;

    if (block === "---") {
      html.push("<hr />");
    } else if (block.startsWith("### ")) {
      html.push(`<h3>${inlineMd(block.slice(4))}</h3>`);
    } else if (block.startsWith("## ")) {
      html.push(`<h2>${inlineMd(block.slice(3))}</h2>`);
    } else if (block.startsWith("# ")) {
      html.push(`<h1>${inlineMd(block.slice(2))}</h1>`);
    } else if (block.startsWith("> ")) {
      const inner = block
        .split("\n")
        .map((line) => inlineMd(line.replace(/^> ?/, "")))
        .join("<br />");

      html.push(`<blockquote>${inner}</blockquote>`);
    } else if (/^[-*] /m.test(block)) {
      const items = block
        .split("\n")
        .filter((line) => /^[-*] /.test(line))
        .map((line) => `<li>${inlineMd(line.replace(/^[-*] /, ""))}</li>`);

      html.push(`<ul>${items.join("")}</ul>`);
    } else {
      const lines = block.split("\n").map((line) => inlineMd(line));

      html.push(`<p>${lines.join("<br />")}</p>`);
    }
  }

  return html.join("\n");
}

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await findPublicEditorialPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const htmlContent = markdownToHtml(post.content);

  return (
    <article className="post-page">
      <header className="post-header">
        <p className="post-category">
          {getBlogCategoryByValue(post.category)?.label ?? post.category}
        </p>
        <h1>{post.title}</h1>
        <p className="post-description">{post.description}</p>
        <p className="post-meta">
          {post.author ? <span>Por {post.author}</span> : null}
          {post.author ? <span aria-hidden="true">•</span> : null}
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </p>
      </header>
      {post.image && (
        <div className="post-image-wrapper">
          <Image
            src={post.image}
            alt={post.title}
            width={1200}
            height={675}
            className="post-image"
            priority
          />
        </div>
      )}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <style>{`
        .post-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 28px 20px 52px;
        }
        .post-header {
          max-width: 900px;
          margin-bottom: 28px;
        }
        .post-category {
          margin: 0 0 10px;
          color: #2e7d32;
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .post-header h1 {
          margin: 0;
          color: #111;
          font-size: clamp(2.35rem, 6vw, 4.8rem);
          line-height: 0.98;
          letter-spacing: -0.045em;
        }
        .post-description {
          max-width: 820px;
          margin: 20px 0 14px;
          color: #444;
          font-size: clamp(1.05rem, 2vw, 1.3rem);
          line-height: 1.55;
        }
        .post-meta {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }
        .post-image-wrapper {
          overflow: hidden;
          margin-bottom: 32px;
          border-radius: 10px;
          background: #ececec;
          aspect-ratio: 16 / 9;
        }
        .post-image {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .post-content p {
          line-height: 1.8;
          margin-bottom: 16px;
          color: #333;
        }

        .post-content h1,
        .post-content h2,
        .post-content h3 {
          margin: 28px 0 12px;
          color: #111;
        }

        .post-content h2 {
          font-size: 22px;
        }

        .post-content h3 {
          font-size: 18px;
        }

        .post-content ul {
          padding-left: 24px;
          margin-bottom: 16px;
        }

        .post-content li {
          margin-bottom: 6px;
          line-height: 1.7;
        }

        .post-content blockquote {
          border-left: 4px solid #2E7D32;
          padding: 8px 16px;
          margin: 16px 0;
          background: #f9f9f9;
          color: #444;
          font-style: italic;
          border-radius: 0 6px 6px 0;
        }

        .post-content hr {
          border: none;
          border-top: 1px solid #eee;
          margin: 24px 0;
        }

        .post-content strong {
          color: #111;
        }

        .post-content a {
          color: #2E7D32;
          text-decoration: underline;
        }
        @media (max-width: 640px) {
          .post-page {
            padding: 22px 0 42px;
          }
          .post-header h1 {
            line-height: 1.04;
          }
          .post-image-wrapper {
            border-radius: 0;
          }
        }
      `}</style>
    </article>
  );
}
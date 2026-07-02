import Image from "next/image";
import { notFound } from "next/navigation";
import { generatedPosts } from "@/lib/generated-posts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return generatedPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const post = generatedPosts.find((item) => item.slug === slug);

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

// ─── Safe markdown renderer ───────────────────────────────────────────────────
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
  const blocks = markdown.split(/\n\n+/);
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

// ─────────────────────────────────────────────────────────────────────────────

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = generatedPosts.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  const htmlContent = markdownToHtml(post.content);

  return (
    <article style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={800}
          height={400}
          style={{
            borderRadius: "10px",
            marginBottom: "20px",
            width: "100%",
            height: "auto",
          }}
        />
      )}

      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>{post.title}</h1>

      {post.author && (
        <p style={{ color: "#444", marginBottom: "4px", fontWeight: "bold" }}>
          Por {post.author}
        </p>
      )}

      <p style={{ color: "#666", marginBottom: "20px" }}>{post.date}</p>

      <hr />

      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      <style>{`
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
      `}</style>
    </article>
  );
}
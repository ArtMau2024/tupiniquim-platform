import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";
import { getAllPosts } from "@/lib/posts";

// Generate static params at build time so fs is never called at Cloudflare runtime
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Do not try to render unknown slugs at runtime — return 404 instead
export const dynamicParams = false;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  const filePath = path.join(
    process.cwd(),
    "content",
    "posts",
    `${slug}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    return {
      title: "Post não encontrado | Tupiniquim",
    };
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    title: `${data.title} | Tupiniquim`,
    description: data.description,

    openGraph: {
      title: data.title,
      description: data.description,
      images: data.image ? [data.image] : [],
      type: "article",
    },
  };
}

// Minimal markdown-to-HTML converter (runs at build time, no runtime dependency needed)
function markdownToHtml(markdown: string): string {
  return markdown
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr />")
    // Unordered lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    // Wrap consecutive <li> blocks in <ul>
    .replace(/(<li>[\s\S]*?<\/li>)(\n(?!<li>)|$)/g, (m) =>
      `<ul>${m}</ul>`
    )
    // Links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    // Paragraphs: wrap non-tag lines
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (/^<(h[1-6]|ul|ol|li|blockquote|hr|pre|div)/.test(trimmed))
        return trimmed;
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const filePath = path.join(
    process.cwd(),
    "content/posts",
    `${slug}.mdx`
  );

  if (!fs.existsSync(filePath)) {
    return <h1>Post não encontrado</h1>;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const htmlContent = markdownToHtml(content);

  return (
    <article style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>

      {data.image && (
        <Image
          src={data.image}
          alt={data.title}
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

      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
        {data.title}
      </h1>

      {data.author && (
        <p style={{ color: "#444", marginBottom: "4px", fontWeight: "bold" }}>
          Por {data.author}
        </p>
      )}

      <p style={{ color: "#666", marginBottom: "20px" }}>
        {data.date}
      </p>

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
        .post-content h2 { font-size: 22px; }
        .post-content h3 { font-size: 18px; }
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
        .post-content strong { color: #111; }
        .post-content a {
          color: #2E7D32;
          text-decoration: underline;
        }
      `}</style>

    </article>
  );
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Image from "next/image";

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
    title: data.title,
    description: data.description,

    openGraph: {
      title: data.title,
      description: data.description,
      images: [data.image],
      type: "article",
    },
  };
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

  return (
    <article style={{ padding: "20px" }}>
      
      {data.image && (
        <Image
          src={data.image}
          alt={data.title}
          width={800}
          height={400}
          style={{ borderRadius: "10px", marginBottom: "20px" }}
        />
      )}

      <h1 style={{ fontSize: "28px", marginBottom: "10px" }}>
        {data.title}
      </h1>

      <p style={{ color: "#666", marginBottom: "20px" }}>
        {data.date}
      </p>

      <hr />

      <div style={{ marginTop: "20px" }}>{content}</div>

    </article>
  );
}
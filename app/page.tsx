import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default function Home() {
  const posts = getAllPosts();

  return (
    <main>
      <h1>Blog</h1>

      {posts.map((post: any) => (
        <div key={post.slug}>
          <Link href={`/blog/${post.slug}`}>
            <h2>{post.title}</h2>
          </Link>
          <p>{post.date}</p>
        </div>
      ))}
    </main>
  );
}
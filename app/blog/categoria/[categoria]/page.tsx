import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogCategoryBySlug, getBlogCategoryByValue } from "@/lib/blog-categories";
import { listPublicEditorialPosts } from "@/lib/cms/public-editorial-catalog";
export const dynamic = "force-dynamic";
export default async function CategoryPage({params}:{params:Promise<{categoria:string}>}){const{categoria}=await params;const category=getBlogCategoryBySlug(categoria);if(!category)notFound();const posts=(await listPublicEditorialPosts()).filter(post=>getBlogCategoryByValue(post.category)?.slug===category.slug);return <main className="category-page"><header className="category-header"><p className="category-eyebrow">Editoria</p><h1>{category.label}</h1><p>{category.description}</p></header><section className="category-results"><div className="category-grid">{posts.map(post=><article className="category-card" key={post.slug}><Link href={`/blog/${post.slug}`}><h2>{post.title}</h2><p>{post.description}</p><time dateTime={post.date}>{post.date}</time></Link></article>)}</div></section></main>}

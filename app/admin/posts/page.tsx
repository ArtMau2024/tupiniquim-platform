import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "../actions";
import { hasValidAdminSession } from "@/lib/cms/admin-session";
import { listEditorialPosts } from "@/lib/cms/editorial-catalog";
import { getCmsDatabase } from "@/lib/cms/cloudflare-context";
import { listDrafts } from "@/lib/cms/draft-repository";
import type { DraftRecord } from "@/lib/cms/draft";
export default async function AdminPostsPage(){
  if(!(await hasValidAdminSession()))redirect("/admin/login");
  const posts=listEditorialPosts();let drafts: DraftRecord[]=[];let draftError="";
  try{drafts=await listDrafts(getCmsDatabase());}catch(error){draftError=error instanceof Error?error.message:"Rascunhos indisponíveis.";}
  return <section aria-labelledby="cms-posts-title" style={{maxWidth:1100,margin:"48px auto",padding:24}}>
    <header style={{display:"flex",justifyContent:"space-between",gap:16}}><div><h1 id="cms-posts-title">Artigos</h1><Link href="/admin/posts/novo">Novo artigo</Link></div><form action={logoutAdmin}><button type="submit">Sair</button></form></header>
    <h2>Rascunhos</h2>{draftError?<p role="status">{draftError}</p>:drafts.length?<div>{drafts.map(d=><article key={d.id}><h3>{d.title}</h3><p>{d.slug}</p><Link href={`/admin/rascunhos/${d.id}/editar`}>Editar rascunho</Link></article>)}</div>:<p>Nenhum rascunho.</p>}
    <h2>Artigos publicados</h2><p>Conteúdo público atual em modo somente leitura.</p>{posts.map(post=><article key={post.slug}><h3>{post.title}</h3><p><strong>Slug:</strong> {post.slug}</p><p><strong>Categoria:</strong> {post.category}</p><Link href={`/admin/posts/${post.slug}/editar`}>Abrir em modo somente leitura</Link></article>)}
  </section>;
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "../actions";
import { hasValidAdminSession } from "@/lib/cms/admin-session";
import { getPostService } from "@/lib/cms/cloudflare-context";
import { listEditorialPosts } from "@/lib/cms/editorial-catalog";
import type { Post } from "@/lib/cms/post";

export const dynamic = "force-dynamic";

type SafeError={name:string;message:string};
function safeError(error:unknown):SafeError{return error instanceof Error?{name:error.name,message:error.message}:{name:"UnknownError",message:String(error)}}
function logAdminPosts(event:string,details:Record<string,unknown>={}){console.info(JSON.stringify({scope:"admin.posts",event,...details}))}
function logAdminPostsError(event:string,error:unknown,details:Record<string,unknown>={}){console.error(JSON.stringify({scope:"admin.posts",event,error:safeError(error),...details}))}

export default async function AdminPostsPage(){
  if(!(await hasValidAdminSession()))redirect("/admin/login");
  logAdminPosts("admin.posts.session.ok");
  let legacy:ReturnType<typeof listEditorialPosts>=[];
  try{legacy=listEditorialPosts();logAdminPosts("admin.posts.legacy.loaded",{count:legacy.length})}catch(error){logAdminPostsError("admin.posts.legacy.error",error);throw error}
  let drafts:Post[]=[];let published:Post[]=[];let databaseError="";
  try{const service=getPostService();logAdminPosts("admin.posts.database.available");[drafts,published]=await Promise.all([service.drafts(),service.published()]);logAdminPosts("admin.posts.drafts.loaded",{count:drafts.length});logAdminPosts("admin.posts.published.loaded",{count:published.length})}catch(error){databaseError=error instanceof Error?error.message:"Banco editorial indisponivel.";logAdminPostsError("admin.posts.database.unavailable",error)}
  logAdminPosts("admin.posts.render.ready",{draftCount:drafts.length,publishedCount:published.length,legacyCount:legacy.length,databaseAvailable:!databaseError});
  const cards=(items:Post[],state:"draft"|"published")=><div className="cms-admin-grid">{items.map(post=><article className="cms-admin-card" key={post.id}><span className={`cms-admin-badge cms-admin-badge-${state}`}>{state==="draft"?"Rascunho":"Publicado"}</span><h3>{post.title}</h3><p className="cms-admin-meta"><strong>Slug</strong><span>{post.slug}</span></p><p className="cms-admin-meta"><strong>Categoria</strong><span>{post.category}</span></p><Link className="cms-admin-card-link" href={`/admin/posts/${post.id}/editar`}>{state==="draft"?"Continuar edicao":"Editar publicado"}</Link></article>)}</div>;
  return <section className="cms-admin-page"><header className="cms-admin-page-header"><div><span className="cms-admin-eyebrow">Gestao de conteudo</span><h1>Artigos</h1><p>Gerencie rascunhos e publicacoes diretamente no CMS.</p></div><div className="cms-admin-actions"><Link className="cms-admin-button cms-admin-button-primary" href="/admin/posts/novo">Novo artigo</Link><form action={logoutAdmin}><button className="cms-admin-button cms-admin-button-secondary" type="submit">Sair</button></form></div></header><section className="cms-admin-summary" aria-label="Resumo editorial"><article><strong>{drafts.length}</strong><span>Rascunhos</span></article><article><strong>{published.length}</strong><span>Publicados pelo CMS</span></article><article><strong>{legacy.length}</strong><span>MDX legados</span></article><article><strong>{databaseError?"Indisponivel":"Disponivel"}</strong><span>Banco editorial</span></article></section>{databaseError?<p className="cms-admin-alert" role="status">{databaseError}</p>:null}<section className="cms-admin-section"><h2>Rascunhos</h2>{drafts.length?cards(drafts,"draft"):<p className="cms-admin-empty">Nenhum rascunho.</p>}</section><section className="cms-admin-section"><h2>Publicados pelo CMS</h2>{published.length?cards(published,"published"):<p className="cms-admin-empty">Nenhum artigo publicado pelo CMS.</p>}</section><section className="cms-admin-section"><h2>MDX legados</h2><div className="cms-admin-grid">{legacy.map(post=><article className="cms-admin-card" key={post.slug}><span className="cms-admin-badge cms-admin-badge-published">Legado somente leitura</span><h3>{post.title}</h3><p className="cms-admin-meta"><strong>Slug</strong><span>{post.slug}</span></p><Link className="cms-admin-card-link" href={`/blog/${post.slug}`}>Ver no Blog</Link></article>)}</div></section></section>
}

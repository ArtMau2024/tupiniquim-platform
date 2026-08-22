import { notFound, redirect } from "next/navigation";
import { hasValidAdminSession } from "@/lib/cms/admin-session";
import { getPostService } from "@/lib/cms/cloudflare-context";
import { PostForm } from "../../post-form";
import { publishPostAction, unpublishPostAction, updatePostAction } from "../../post-actions";
export const dynamic = "force-dynamic";
export default async function EditPostPage({params}:{params:Promise<{id:string}>}){if(!(await hasValidAdminSession()))redirect("/admin/login");const{id}=await params;const post=await getPostService().find(id);if(!post)notFound();return <section className="cms-admin-page"><span className={`cms-admin-badge cms-admin-badge-${post.status}`}>{post.status==="draft"?"Rascunho":"Publicado"}</span><h1>Editar artigo</h1><PostForm action={updatePostAction.bind(null,id)} initial={post} slugLocked={post.status==="published"}/><div className="cms-admin-actions" style={{marginTop:24}}><form action={post.status==="draft"?publishPostAction.bind(null,id):unpublishPostAction.bind(null,id)}><button className="cms-admin-button cms-admin-button-primary" type="submit">{post.status==="draft"?"Publicar":"Retirar do ar"}</button></form></div></section>}

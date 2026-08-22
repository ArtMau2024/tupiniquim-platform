import { redirect } from "next/navigation";
import { hasValidAdminSession } from "@/lib/cms/admin-session";
import { PostForm } from "../post-form";
import { createPostAction } from "../post-actions";
export const dynamic = "force-dynamic";
export default async function NewPostPage(){if(!(await hasValidAdminSession()))redirect("/admin/login");return <section className="cms-admin-page"><span className="cms-admin-eyebrow">Novo conteudo</span><h1>Novo artigo</h1><p>O artigo sera salvo como rascunho. A publicacao e uma acao separada.</p><PostForm action={createPostAction} initial={{author:"Greyce"}}/></section>}

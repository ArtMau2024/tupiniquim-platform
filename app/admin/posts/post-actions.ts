"use server";
import { redirect } from "next/navigation";
import { hasValidAdminSession } from "@/lib/cms/admin-session";
import { getPostService } from "@/lib/cms/cloudflare-context";
import { validatePostInput, type PostErrors } from "@/lib/cms/post";
export type PostActionState={errors?:PostErrors;formError?:string};
const raw=(formData:FormData):Record<string,unknown>=>Object.fromEntries(formData.entries());
async function requireAdmin(){if(!(await hasValidAdminSession()))redirect("/admin/login")}
export async function createPostAction(_:PostActionState,formData:FormData):Promise<PostActionState>{await requireAdmin();const parsed=validatePostInput(raw(formData));if(!parsed.ok)return{errors:parsed.errors};let post;try{post=await getPostService().create(parsed.value)}catch(error){return{formError:error instanceof Error?error.message:"Nao foi possivel criar o artigo."}}redirect(`/admin/posts/${post.id}/editar`)}
export async function updatePostAction(id:string,_:PostActionState,formData:FormData):Promise<PostActionState>{await requireAdmin();const parsed=validatePostInput(raw(formData));if(!parsed.ok)return{errors:parsed.errors};try{await getPostService().update(id,parsed.value)}catch(error){return{formError:error instanceof Error?error.message:"Nao foi possivel atualizar o artigo."}}redirect(`/admin/posts/${id}/editar?saved=1`)}
export async function publishPostAction(id:string):Promise<void>{await requireAdmin();await getPostService().publish(id);redirect(`/admin/posts/${id}/editar?published=1`)}
export async function unpublishPostAction(id:string):Promise<void>{await requireAdmin();await getPostService().unpublish(id);redirect(`/admin/posts/${id}/editar?unpublished=1`)}

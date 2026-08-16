import Link from "next/link";
import { redirect } from "next/navigation";
import { logoutAdmin } from "../actions";
import { hasValidAdminSession } from "@/lib/cms/admin-session";
import { listEditorialPosts } from "@/lib/cms/editorial-catalog";
import { getCmsDatabase } from "@/lib/cms/cloudflare-context";
import { listDrafts } from "@/lib/cms/draft-repository";
import type { DraftRecord } from "@/lib/cms/draft";

export default async function AdminPostsPage() {
  if (!(await hasValidAdminSession())) redirect("/admin/login");
  const posts = listEditorialPosts();
  let drafts: DraftRecord[] = [];
  let draftError = "";
  try {
    drafts = await listDrafts(getCmsDatabase());
  } catch (error) {
    draftError = error instanceof Error ? error.message : "Rascunhos indisponiveis.";
  }

  return (
    <section aria-labelledby="cms-posts-title" className="cms-admin-page">
      <header className="cms-admin-page-header">
        <div>
          <span className="cms-admin-eyebrow">Gestao de conteudo</span>
          <h1 id="cms-posts-title">Artigos</h1>
          <p>Crie rascunhos no D1 e acompanhe o conteudo publicado no Blog.</p>
        </div>
        <div className="cms-admin-actions">
          <Link className="cms-admin-button cms-admin-button-primary" href="/admin/posts/novo">Novo artigo</Link>
          <form action={logoutAdmin}>
            <button className="cms-admin-button cms-admin-button-secondary" type="submit">Sair</button>
          </form>
        </div>
      </header>

      <div className="cms-admin-summary" aria-label="Resumo editorial">
        <article className="cms-admin-summary-card"><span>Rascunhos</span><strong>{drafts.length}</strong></article>
        <article className="cms-admin-summary-card"><span>Publicados</span><strong>{posts.length}</strong></article>
        <article className="cms-admin-summary-card"><span>Operacao</span><strong className="cms-admin-status-ok">CMS local</strong></article>
      </div>

      <section className="cms-admin-section" aria-labelledby="cms-drafts-title">
        <div className="cms-admin-section-heading"><div><span className="cms-admin-eyebrow">Em producao</span><h2 id="cms-drafts-title">Rascunhos</h2></div></div>
        {draftError ? <p className="cms-admin-alert" role="status">{draftError}</p> : drafts.length ? (
          <div className="cms-admin-grid">
            {drafts.map((draft) => (
              <article className="cms-admin-card" key={draft.id}>
                <span className="cms-admin-badge cms-admin-badge-draft">Rascunho</span>
                <h3>{draft.title}</h3>
                <p className="cms-admin-meta"><strong>Slug</strong><span>{draft.slug}</span></p>
                <Link className="cms-admin-card-link" href={`/admin/rascunhos/${draft.id}/editar`}>Continuar edicao</Link>
              </article>
            ))}
          </div>
        ) : <div className="cms-admin-empty"><strong>Nenhum rascunho.</strong><p>Crie um novo artigo para iniciar o fluxo editorial.</p></div>}
      </section>

      <section className="cms-admin-section" aria-labelledby="cms-published-title">
        <div className="cms-admin-section-heading"><div><span className="cms-admin-eyebrow">Somente leitura</span><h2 id="cms-published-title">Artigos publicados</h2></div><p>Conteudo publico atual.</p></div>
        <div className="cms-admin-grid">
          {posts.map((post) => (
            <article className="cms-admin-card" key={post.slug}>
              <span className="cms-admin-badge cms-admin-badge-published">Publicado</span>
              <h3>{post.title}</h3>
              <p className="cms-admin-meta"><strong>Categoria</strong><span>{post.category}</span></p>
              <p className="cms-admin-meta"><strong>Slug</strong><span>{post.slug}</span></p>
              <Link className="cms-admin-card-link" href={`/admin/posts/${post.slug}/editar`}>Abrir em modo somente leitura</Link>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

import Link from "next/link";

export const metadata = { title: "Administracao" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-cms-admin="true" className="cms-admin-shell">
      <div className="cms-admin-frame">
        <aside className="cms-admin-sidebar" aria-label="Navegacao administrativa">
          <div>
            <span className="cms-admin-eyebrow">CMS Tupiniquim</span>
            <strong className="cms-admin-sidebar-title">Painel editorial</strong>
          </div>
          <nav className="cms-admin-nav">
            <Link href="/admin/posts">Artigos</Link>
            <Link href="/admin/posts/novo">Novo artigo</Link>
            <Link href="/blog">Ver Blog</Link>
          </nav>
        </aside>
        <main className="cms-admin-content">{children}</main>
      </div>
    </div>
  );
}

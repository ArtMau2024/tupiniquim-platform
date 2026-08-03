import { notFound, redirect } from "next/navigation";
import { hasValidAdminSession } from "@/lib/cms/admin-session";
import { findEditorialPostBySlug } from "@/lib/cms/editorial-catalog";

type AdminPostPageProps = {
  params: Promise<{ slug: string }>;
};

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <strong>{label}</strong>
      <input value={value} readOnly aria-readonly="true" style={{ padding: 10 }} />
    </label>
  );
}

export default async function AdminPostPage({ params }: AdminPostPageProps) {
  if (!(await hasValidAdminSession())) {
    redirect("/admin/login");
  }

  const { slug } = await params;
  const post = findEditorialPostBySlug(slug);
  if (!post) notFound();

  return (
    <section aria-labelledby="cms-post-title" style={{ maxWidth: 900, margin: "48px auto", padding: 24 }}>
      <h1 id="cms-post-title">{post.title}</h1>
      <p role="status"><strong>Modo somente leitura — salvamento será disponibilizado em etapa posterior.</strong></p>

      <div style={{ display: "grid", gap: 16 }}>
        <ReadOnlyField label="Título" value={post.title} />
        <ReadOnlyField label="Descrição" value={post.description} />
        <ReadOnlyField label="Categoria" value={post.category} />
        <ReadOnlyField label="Data" value={post.date} />
        <ReadOnlyField label="Autor" value={post.author ?? ""} />
        <ReadOnlyField label="Imagem" value={post.image ?? ""} />
        <label style={{ display: "grid", gap: 6 }}>
          <strong>Conteúdo</strong>
          <textarea value={post.content} readOnly aria-readonly="true" rows={24} style={{ padding: 12, resize: "vertical" }} />
        </label>
      </div>
    </section>
  );
}
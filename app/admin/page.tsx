import { redirect } from "next/navigation";
import { logoutAdmin } from "./actions";
import { hasValidAdminSession } from "@/lib/cms/admin-session";

export default async function AdminPage() {
  if (!(await hasValidAdminSession())) redirect("/admin/login");

  return (
    <section aria-labelledby="cms-title" style={{ maxWidth: 760, margin: "48px auto", padding: 24, background: "#fff", borderRadius: 12 }}>
      <h1 id="cms-title">CMS da Plataforma Editorial</h1>
      <p>Acesso administrativo confirmado.</p>
      <p>Este é o Corte A: autenticação, sessão e proteção do painel.</p>
      <p>A gestão de posts será implementada no Corte B.</p>
      <form action={logoutAdmin}><button type="submit" style={{ padding: 12, cursor: "pointer" }}>Sair</button></form>
    </section>
  );
}

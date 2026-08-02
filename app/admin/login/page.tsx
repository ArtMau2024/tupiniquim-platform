import { redirect } from "next/navigation";
import { loginAdmin } from "../actions";
import { hasValidAdminSession } from "@/lib/cms/admin-session";

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await hasValidAdminSession()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <section aria-labelledby="cms-login-title" style={{ maxWidth: 420, margin: "48px auto", padding: 24, background: "#fff", borderRadius: 12 }}>
      <h1 id="cms-login-title">Acesso administrativo</h1>
      <p>Entre para acessar o CMS da Plataforma Editorial.</p>
      {error === "1" ? <p role="alert">Não foi possível autenticar com as credenciais informadas.</p> : null}
      <form action={loginAdmin} style={{ display: "grid", gap: 16 }}>
        <label>Usuário<input name="username" autoComplete="username" required style={{ display: "block", width: "100%", padding: 10 }} /></label>
        <label>Senha<input name="password" type="password" autoComplete="current-password" required style={{ display: "block", width: "100%", padding: 10 }} /></label>
        <button type="submit" style={{ padding: 12, cursor: "pointer" }}>Entrar</button>
      </form>
    </section>
  );
}

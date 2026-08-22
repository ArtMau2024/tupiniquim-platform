import { redirect } from "next/navigation";
import { hasValidAdminSession } from "@/lib/cms/admin-session";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await hasValidAdminSession())) {
    redirect("/admin/login");
  }

  redirect("/admin/posts");
}

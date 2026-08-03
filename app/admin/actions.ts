"use server";

import { redirect } from "next/navigation";
import { validateAdminCredentials } from "@/lib/cms/admin-config";
import { clearAdminSession, setAdminSession } from "@/lib/cms/admin-session";

export async function loginAdmin(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!validateAdminCredentials(username, password)) {
    redirect("/admin/login?error=1");
  }

  await setAdminSession();
  redirect("/admin/posts");
}

export async function logoutAdmin(): Promise<void> {
  await clearAdminSession();
  redirect("/admin/login");
}
import { cookies } from "next/headers";
import { getAdminConfig } from "./admin-config";
import { CMS_SESSION_MAX_AGE_SECONDS, createSessionToken, verifySessionToken } from "./admin-session-token";

export const CMS_SESSION_COOKIE = "tupiniquim_cms_session";
export async function hasValidAdminSession(): Promise<boolean> {
  const config = getAdminConfig();
  if (!config) return false;
  const store = await cookies();
  return verifySessionToken(store.get(CMS_SESSION_COOKIE)?.value, config.sessionSecret);
}
export async function setAdminSession(): Promise<void> {
  const config = getAdminConfig();
  if (!config) throw new Error("CMS session configuration is unavailable.");
  const store = await cookies();
  store.set(CMS_SESSION_COOKIE, createSessionToken(config.sessionSecret), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/admin", maxAge: CMS_SESSION_MAX_AGE_SECONDS });
}
export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(CMS_SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/admin", expires: new Date(0) });
}

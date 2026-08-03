import { cookies } from "next/headers";
import { getAdminConfig } from "./admin-config";
import { CMS_SESSION_COOKIE } from "./admin-session-constants";
import { createSessionToken, verifySessionToken } from "./admin-session-token";
import { getClearedSessionCookieOptions, getSessionCookieOptions } from "./admin-session-options";


export async function hasValidAdminSession(): Promise<boolean> {
  const config = getAdminConfig();
  if (!config) return false;

  const store = await cookies();
  return verifySessionToken(
    store.get(CMS_SESSION_COOKIE)?.value,
    config.sessionSecret,
  );
}

export async function setAdminSession(): Promise<void> {
  const config = getAdminConfig();
  if (!config) {
    throw new Error("CMS session configuration is unavailable.");
  }

  const store = await cookies();
  store.set(
    CMS_SESSION_COOKIE,
    createSessionToken(config.sessionSecret),
    getSessionCookieOptions(process.env.NODE_ENV === "production"),
  );
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(
    CMS_SESSION_COOKIE,
    "",
    getClearedSessionCookieOptions(process.env.NODE_ENV === "production"),
  );
}

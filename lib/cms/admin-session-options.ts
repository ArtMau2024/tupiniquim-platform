import { CMS_SESSION_MAX_AGE_SECONDS } from "./admin-session-token";

export function getSessionCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/" as const,
    maxAge: CMS_SESSION_MAX_AGE_SECONDS,
  };
}

export function getClearedSessionCookieOptions(isProduction: boolean) {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/" as const,
    maxAge: 0,
    expires: new Date(0),
  };
}
import { createHmac, timingSafeEqual } from "node:crypto";

export const CMS_SESSION_VERSION = 1;
export const CMS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 4;

type SessionPayload = { version: number; authenticated: true; issuedAt: number; expiresAt: number };

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}
function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left, "utf8");
  const b = Buffer.from(right, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
export function createSessionToken(secret: string, now = Date.now(), maxAgeSeconds = CMS_SESSION_MAX_AGE_SECONDS): string {
  if (secret.length < 32) throw new Error("CMS session configuration is unavailable.");
  if (!Number.isFinite(now) || !Number.isFinite(maxAgeSeconds) || maxAgeSeconds <= 0) throw new Error("Invalid CMS session timing.");
  const value: SessionPayload = { version: CMS_SESSION_VERSION, authenticated: true, issuedAt: now, expiresAt: now + maxAgeSeconds * 1000 };
  const payload = Buffer.from(JSON.stringify(value), "utf8").toString("base64url");
  return `${payload}.${sign(payload, secret)}`;
}
export function verifySessionToken(token: string | undefined, secret: string, now = Date.now()): boolean {
  if (!token || secret.length < 32 || !Number.isFinite(now)) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return false;
  const [payload, signature] = parts;
  if (!safeEqual(signature, sign(payload, secret))) return false;
  try {
    const value = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as Partial<SessionPayload>;
    return value.version === CMS_SESSION_VERSION && value.authenticated === true && typeof value.issuedAt === "number" && typeof value.expiresAt === "number" && Number.isFinite(value.issuedAt) && Number.isFinite(value.expiresAt) && value.issuedAt <= now && value.expiresAt > value.issuedAt && value.expiresAt > now;
  } catch { return false; }
}

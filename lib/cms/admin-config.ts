import { timingSafeEqual } from "node:crypto";

export type AdminConfig = {
  username: string;
  password: string;
  sessionSecret: string;
};

const REQUIRED_KEYS = [
  "CMS_ADMIN_USERNAME",
  "CMS_ADMIN_PASSWORD",
  "CMS_SESSION_SECRET",
] as const;

export function getAdminConfig(
  env: NodeJS.ProcessEnv = process.env,
): AdminConfig | null {
  const values = REQUIRED_KEYS.map((key) => env[key]?.trim() ?? "");
  if (values.some((value) => value.length === 0)) return null;

  const [username, password, sessionSecret] = values;
  if (sessionSecret.length < 32 || sessionSecret === password) return null;

  return { username, password, sessionSecret };
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left, "utf8");
  const rightBuffer = Buffer.from(right, "utf8");
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function validateAdminCredentials(
  username: string,
  password: string,
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  const config = getAdminConfig(env);
  if (!config || !username || !password) return false;
  return safeEqual(username, config.username) && safeEqual(password, config.password);
}

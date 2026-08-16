import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { CmsDatabase } from "./draft-repository";
export function getCmsDatabase(): CmsDatabase {
  const database = (getCloudflareContext().env as unknown as { CMS_DB?: CmsDatabase }).CMS_DB;
  if (!database) throw new Error("CMS_DB binding is unavailable.");
  return database;
}
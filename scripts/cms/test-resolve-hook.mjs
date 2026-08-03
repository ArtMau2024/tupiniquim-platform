import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !specifier.match(/\.[cm]?[jt]sx?$/)) {
    const parent = context.parentURL ?? import.meta.url;
    const candidate = new URL(`${specifier}.ts`, parent);

    if (existsSync(fileURLToPath(candidate))) {
      return nextResolve(candidate.href, context);
    }
  }

  return nextResolve(specifier, context);
}
import { BLOG_CATEGORIES } from "../blog-categories";
export type DraftInput = { title: string; slug: string; description: string; category: string; content: string; author?: string | null; image?: string | null };
export type DraftRecord = DraftInput & { id: string; status: "draft"; createdAt: string; updatedAt: string };
export type DraftErrors = Partial<Record<keyof DraftInput, string>>;
export type DraftValidation = { ok: true; value: DraftInput } | { ok: false; errors: DraftErrors };
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const categories = new Set<string>(BLOG_CATEGORIES.map((item) => item.slug));
const clean = (value: unknown) => typeof value === "string" ? value.trim() : "";
export function validateDraftInput(raw: Record<string, unknown>): DraftValidation {
  const value: DraftInput = { title: clean(raw.title), slug: clean(raw.slug).toLowerCase(), description: clean(raw.description), category: clean(raw.category), content: clean(raw.content), author: clean(raw.author) || null, image: clean(raw.image) || null };
  const errors: DraftErrors = {};
  if (!value.title) errors.title = "Informe o título.";
  if (!value.slug) errors.slug = "Informe o slug."; else if (!SLUG.test(value.slug)) errors.slug = "Use apenas letras minúsculas, números e hífens.";
  if (!value.description) errors.description = "Informe a descrição.";
  if (!categories.has(value.category)) errors.category = "Selecione uma categoria válida.";
  if (!value.content) errors.content = "Informe o conteúdo.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

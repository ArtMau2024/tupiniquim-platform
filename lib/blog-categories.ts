import type { GeneratedPost } from "@/lib/generated-posts";

export type BlogCategory = Readonly<{
  slug: string;
  label: string;
  description: string;
}>;

export const BLOG_CATEGORIES = [
  {
    slug: "empreendedorismo",
    label: "Empreendedorismo",
    description:
      "Conteúdos sobre negócios, presença digital, criação de projetos e crescimento no ambiente online.",
  },
  {
    slug: "tecnologia",
    label: "Tecnologia",
    description:
      "Conteúdos sobre programação, ferramentas digitais, inteligência artificial e inovação tecnológica.",
  },
  {
    slug: "saude",
    label: "Saúde",
    description:
      "Conteúdos sobre bem-estar, autocuidado, qualidade de vida e práticas para uma rotina mais saudável.",
  },
] as const satisfies readonly BlogCategory[];

export function normalizeCategoryValue(value: string): string {
  return value
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getBlogCategories(): readonly BlogCategory[] {
  return BLOG_CATEGORIES;
}

export function getBlogCategoryBySlug(
  slug: string
): BlogCategory | undefined {
  const normalizedSlug = normalizeCategoryValue(slug);

  if (!normalizedSlug) {
    return undefined;
  }

  return BLOG_CATEGORIES.find(
    (category) => category.slug === normalizedSlug
  );
}

export function getBlogCategoryByValue(
  value: string
): BlogCategory | undefined {
  return getBlogCategoryBySlug(value);
}

export function getPostsByBlogCategory(
  posts: readonly GeneratedPost[],
  categorySlug: string
): GeneratedPost[] {
  const requestedCategory = getBlogCategoryBySlug(categorySlug);

  if (!requestedCategory) {
    return [];
  }

  return posts.filter((post) => {
    const postCategory = getBlogCategoryByValue(post.category);

    return postCategory?.slug === requestedCategory.slug;
  });
}

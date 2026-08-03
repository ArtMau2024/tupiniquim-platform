import type { GeneratedPost } from "../generated-posts";
import { generatedPosts } from "../generated-posts";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type EditorialPost = Omit<GeneratedPost, "author"> & {
  author: string | null;
};

function normalizePost(post: GeneratedPost): EditorialPost {
  return {
    ...post,
    author: post.author.trim() || null,
  };
}

export function isValidEditorialSlug(slug: string): boolean {
  return SLUG_PATTERN.test(slug);
}

export function listEditorialPosts(
  posts: readonly GeneratedPost[] = generatedPosts,
): EditorialPost[] {
  const seen = new Set<string>();

  for (const post of posts) {
    if (!isValidEditorialSlug(post.slug)) {
      throw new Error(`Invalid editorial slug: ${post.slug}`);
    }
    if (seen.has(post.slug)) {
      throw new Error(`Duplicate editorial slug: ${post.slug}`);
    }
    seen.add(post.slug);
  }

  return posts
    .map(normalizePost)
    .sort((left, right) => {
      const byDate = right.date.localeCompare(left.date);
      return byDate !== 0 ? byDate : left.slug.localeCompare(right.slug);
    });
}

export function findEditorialPostBySlug(
  slug: string,
  posts: readonly GeneratedPost[] = generatedPosts,
): EditorialPost | null {
  if (!isValidEditorialSlug(slug)) return null;

  const matches = posts.filter((post) => post.slug === slug);
  if (matches.length > 1) {
    throw new Error(`Duplicate editorial slug: ${slug}`);
  }

  return matches[0] ? normalizePost(matches[0]) : null;
}
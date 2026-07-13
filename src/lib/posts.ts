import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import readingTime from "reading-time";

import { markdownToHtml } from "@/lib/mdx-plugins";
import { rewriteImagePath } from "@/lib/remark-rewrite-images";
import type { Post, PostFrontmatter } from "@/lib/types";

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts");

function assertRequiredFrontmatter(
  slug: string,
  data: Record<string, unknown>,
): PostFrontmatter {
  const title = data.title;
  const date = data.date;
  const category = data.category;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error(`Post "${slug}" is missing required frontmatter field: title`);
  }

  if (date === undefined || date === null || date === "") {
    throw new Error(`Post "${slug}" is missing required frontmatter field: date`);
  }

  if (typeof category !== "string" || category.trim().length === 0) {
    throw new Error(
      `Post "${slug}" is missing required frontmatter field: category`,
    );
  }

  const normalizedDate =
    date instanceof Date
      ? date.toISOString().slice(0, 10)
      : String(date).slice(0, 10);

  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === "string")
    : [];

  const description =
    typeof data.description === "string" ? data.description : undefined;

  const thumbnail =
    typeof data.thumbnail === "string" ? data.thumbnail : undefined;

  return {
    title: title.trim(),
    date: normalizedDate,
    category: category.trim(),
    tags,
    description,
    thumbnail,
  };
}

function getPostFilePath(slug: string): string {
  return path.join(POSTS_DIRECTORY, slug, "index.md");
}

export function getPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIRECTORY)) {
    return [];
  }

  return fs
    .readdirSync(POSTS_DIRECTORY, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((slug) => fs.existsSync(getPostFilePath(slug)))
    .sort();
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = getPostFilePath(slug);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Post not found: ${slug}`);
  }

  const source = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(source);
  const frontmatter = assertRequiredFrontmatter(slug, data);
  const validSlugs = new Set(getPostSlugs());
  const stats = readingTime(content);

  const thumbnail = frontmatter.thumbnail
    ? rewriteImagePath(slug, frontmatter.thumbnail)
    : undefined;

  const { html, headings } = await markdownToHtml(content, {
    slug,
    validSlugs,
  });

  return {
    slug,
    title: frontmatter.title,
    date: frontmatter.date,
    category: frontmatter.category,
    tags: frontmatter.tags ?? [],
    description: frontmatter.description,
    thumbnail,
    readingTime: stats.text,
    content,
    html,
    headings,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const posts = await Promise.all(getPostSlugs().map((slug) => getPostBySlug(slug)));

  return posts.sort((left, right) => right.date.localeCompare(left.date));
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await getAllPosts();

  return posts.filter((post) => post.category === category);
}

export async function getAllCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const categories = new Set(posts.map((post) => post.category));

  return [...categories].sort((left, right) => left.localeCompare(right));
}

export function groupPostsByCategory(
  posts: Post[],
): Record<string, Post[]> {
  return posts.reduce<Record<string, Post[]>>((groups, post) => {
    if (!groups[post.category]) {
      groups[post.category] = [];
    }

    groups[post.category].push(post);
    return groups;
  }, {});
}

export type AdjacentPosts = {
  previous: Pick<Post, "slug" | "title"> | null;
  next: Pick<Post, "slug" | "title"> | null;
};

export async function getAdjacentPosts(slug: string): Promise<AdjacentPosts> {
  const posts = await getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  const previous = index < posts.length - 1 ? posts[index + 1] : null;
  const next = index > 0 ? posts[index - 1] : null;

  return {
    previous: previous
      ? { slug: previous.slug, title: previous.title }
      : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  };
}

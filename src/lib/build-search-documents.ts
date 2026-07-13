import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { toString } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";

import type { SearchDocument } from "@/lib/search-index";

const POSTS_DIRECTORY = path.join(process.cwd(), "content", "posts");

function getPostFilePath(slug: string): string {
  return path.join(POSTS_DIRECTORY, slug, "index.md");
}

function getPostSlugs(): string[] {
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

function markdownToPlainText(markdown: string): string {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);

  return toString(tree).replace(/\s+/g, " ").trim();
}

function assertRequiredFields(
  slug: string,
  data: Record<string, unknown>,
): Pick<SearchDocument, "title" | "description" | "category"> {
  const title = data.title;
  const category = data.category;

  if (typeof title !== "string" || title.trim().length === 0) {
    throw new Error(`Post "${slug}" is missing required frontmatter field: title`);
  }

  if (typeof category !== "string" || category.trim().length === 0) {
    throw new Error(
      `Post "${slug}" is missing required frontmatter field: category`,
    );
  }

  const description =
    typeof data.description === "string" ? data.description.trim() : "";

  return {
    title: title.trim(),
    description,
    category: category.trim(),
  };
}

export function buildSearchDocuments(): SearchDocument[] {
  return getPostSlugs().map((slug) => {
    const source = fs.readFileSync(getPostFilePath(slug), "utf8");
    const { data, content } = matter(source);
    const { title, description, category } = assertRequiredFields(slug, data);

    return {
      id: slug,
      slug,
      title,
      description,
      content: markdownToPlainText(content),
      category,
    };
  });
}

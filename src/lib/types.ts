export type PostFrontmatter = {
  title: string;
  date: string;
  category: string;
  tags?: string[];
  description?: string;
  thumbnail?: string;
};

export type Post = PostFrontmatter & {
  slug: string;
  tags: string[];
  readingTime: string;
  content: string;
  html: string;
};

export type MarkdownToHtmlOptions = {
  slug: string;
  validSlugs: Set<string>;
};

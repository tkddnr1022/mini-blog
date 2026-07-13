export type PostFrontmatter = {
  title: string;
  date: string;
  category: string;
  tags?: string[];
  description?: string;
  thumbnail?: string;
};

export type PostHeading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type Post = PostFrontmatter & {
  slug: string;
  tags: string[];
  readingTime: string;
  content: string;
  html: string;
  headings: PostHeading[];
};

export type MarkdownToHtmlOptions = {
  slug: string;
  validSlugs: Set<string>;
};

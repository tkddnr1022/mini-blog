import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMermaid from "remark-mermaidjs";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import type { MarkdownToHtmlOptions, PostHeading } from "@/lib/types";
import { remarkCallout } from "@/lib/remark-callout";
import { remarkCollectHeadings } from "@/lib/remark-collect-headings";
import { remarkRewriteImages } from "@/lib/remark-rewrite-images";
import { remarkWikilink } from "@/lib/remark-wikilink";

export type MarkdownToHtmlResult = {
  html: string;
  headings: PostHeading[];
};

export async function markdownToHtml(
  markdown: string,
  options: MarkdownToHtmlOptions,
): Promise<MarkdownToHtmlResult> {
  const headings: PostHeading[] = [];

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikilink, { validSlugs: options.validSlugs })
    .use(remarkCallout)
    .use(remarkRewriteImages, { slug: options.slug })
    .use(remarkCollectHeadings, headings)
    .use(remarkMermaid)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeStringify)
    .process(markdown);

  return {
    html: String(file),
    headings,
  };
}

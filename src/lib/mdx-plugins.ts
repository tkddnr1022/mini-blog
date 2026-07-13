import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMermaid from "remark-mermaidjs";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import type { MarkdownToHtmlOptions } from "@/lib/types";
import { remarkCallout } from "@/lib/remark-callout";
import { remarkRewriteImages } from "@/lib/remark-rewrite-images";
import { remarkWikilink } from "@/lib/remark-wikilink";

export async function markdownToHtml(
  markdown: string,
  options: MarkdownToHtmlOptions,
): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikilink, { validSlugs: options.validSlugs })
    .use(remarkCallout)
    .use(remarkRewriteImages, { slug: options.slug })
    .use(remarkMermaid)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

"use client";

import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

export type CodeBlockPart = {
  type: "code";
  language: string;
  title: string;
  code: string;
  html: string;
};

export type HtmlPart = {
  type: "html";
  html: string;
};

export type PostContentPart = CodeBlockPart | HtmlPart;

const FIGURE_RE =
  /<figure\b[^>]*\bdata-rehype-pretty-code-figure\b[^>]*>[\s\S]*?<\/figure>/gi;

function getAttribute(html: string, name: string): string {
  const doubleQuoted = new RegExp(`\\b${name}="([^"]*)"`, "i").exec(html);
  if (doubleQuoted?.[1]) {
    return doubleQuoted[1];
  }

  const singleQuoted = new RegExp(`\\b${name}='([^']*)'`, "i").exec(html);
  return singleQuoted?.[1] ?? "";
}

function decodeHtmlEntities(value: string): string {
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ");
}

function stripTags(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, ""));
}

function parseFigure(figureHtml: string): CodeBlockPart {
  const titleMatch = /<figcaption\b[^>]*data-rehype-pretty-code-title\b[^>]*>([\s\S]*?)<\/figcaption>/i.exec(
    figureHtml,
  );
  const title = titleMatch ? stripTags(titleMatch[1]).trim() : "";
  const preMatch = /<pre\b[^>]*>[\s\S]*?<\/pre>/i.exec(figureHtml);
  const preHtml = preMatch?.[0] ?? "";
  const language =
    getAttribute(preHtml, "data-language") ||
    getAttribute(figureHtml, "data-language");
  const code = stripTags(preHtml).replace(/\n$/, "");

  return {
    type: "code",
    language,
    title,
    code,
    html: preHtml,
  };
}

export function parsePostHtml(html: string): PostContentPart[] {
  const parts: PostContentPart[] = [];
  let lastIndex = 0;

  for (const match of html.matchAll(FIGURE_RE)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      parts.push({ type: "html", html: html.slice(lastIndex, index) });
    }

    parts.push(parseFigure(match[0]));
    lastIndex = index + match[0].length;
  }

  if (lastIndex < html.length) {
    parts.push({ type: "html", html: html.slice(lastIndex) });
  }

  return parts.length > 0 ? parts : [{ type: "html", html }];
}

type CodeBlockProps = {
  language: string;
  title?: string;
  code: string;
  html: string;
  className?: string;
};

export function CodeBlock({
  language,
  title,
  code,
  html,
  className,
}: CodeBlockProps) {
  const label = title?.trim() || language || "code";

  return (
    <figure
      data-rehype-pretty-code-figure=""
      data-slot="code-block"
      className={cn("not-typeset group relative overflow-hidden", className)}
    >
      <div
        data-slot="code-block-header"
        className="flex items-center justify-between gap-2 border-b border-border/60 px-3 py-1.5"
      >
        <span className="truncate font-mono text-xs text-muted-foreground">
          {label}
        </span>
        <CopyButton value={code} />
      </div>
      <div
        data-slot="code-block-body"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}

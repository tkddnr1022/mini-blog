import type { Blockquote, Paragraph, Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const CALLOUT_PATTERN = /^\[!([a-z]+)\](?:[ \t]+([^\n]+))?$/i;

const CALLOUT_LABELS: Record<string, string> = {
  note: "Note",
  tip: "Tip",
  important: "Important",
  warning: "Warning",
  caution: "Caution",
};

function getCalloutMeta(blockquote: Blockquote): {
  type: string;
  title: string;
} | null {
  const firstChild = blockquote.children[0];

  if (!firstChild || firstChild.type !== "paragraph") {
    return null;
  }

  const paragraph = firstChild as Paragraph;
  const firstText = paragraph.children.find((child) => child.type === "text");

  if (!firstText || firstText.type !== "text") {
    return null;
  }

  const lines = firstText.value.split("\n");
  const match = CALLOUT_PATTERN.exec(lines[0].trim());

  if (!match) {
    return null;
  }

  const type = match[1].toLowerCase();
  const title = match[2]?.trim() || CALLOUT_LABELS[type] || type;
  const remainderLines = [
    lines[0].replace(CALLOUT_PATTERN, "").trim(),
    ...lines.slice(1),
  ].filter((line) => line.trim().length > 0);

  if (remainderLines.length === 0 && paragraph.children.length === 1) {
    blockquote.children.shift();
  } else if (remainderLines.length > 0) {
    firstText.value = remainderLines.join("\n");
  } else {
    paragraph.children = paragraph.children.filter((child) => child !== firstText);

    if (paragraph.children.length === 0) {
      blockquote.children.shift();
    }
  }

  return { type, title };
}

function blockquoteToHtml(blockquote: Blockquote, type: string, title: string) {
  const contentNodes = blockquote.children
    .map((child) => {
      if (child.type === "paragraph") {
        const text = child.children
          .map((inline) => (inline.type === "text" ? inline.value : ""))
          .join("");
        return `<p>${escapeHtml(text)}</p>`;
      }

      return "";
    })
    .join("");

  return {
    type: "html" as const,
    value: `<div class="callout callout-${type}"><div class="callout-title">${escapeHtml(title)}</div><div class="callout-content">${contentNodes}</div></div>`,
  };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export const remarkCallout: Plugin<[], Root> = () => (tree) => {
  visit(tree, "blockquote", (node, index, parent) => {
    if (!parent || index === undefined) {
      return;
    }

    const meta = getCalloutMeta(node);

    if (!meta) {
      return;
    }

    parent.children[index] = blockquoteToHtml(node, meta.type, meta.title);
  });
};

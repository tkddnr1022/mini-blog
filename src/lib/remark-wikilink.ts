import type { PhrasingContent, Root, Text } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

const WIKILINK_PATTERN = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

type WikilinkOptions = {
  validSlugs: Set<string>;
};

function splitTextByWikilinks(
  value: string,
  validSlugs: Set<string>,
): PhrasingContent[] {
  const nodes: PhrasingContent[] = [];
  let lastIndex = 0;

  for (const match of value.matchAll(WIKILINK_PATTERN)) {
    const matchIndex = match.index ?? 0;

    if (matchIndex > lastIndex) {
      nodes.push({
        type: "text",
        value: value.slice(lastIndex, matchIndex),
      });
    }

    const targetSlug = match[1].trim();
    const label = (match[2] ?? targetSlug).trim();

    if (validSlugs.has(targetSlug)) {
      nodes.push({
        type: "link",
        url: `/posts/${targetSlug}`,
        children: [{ type: "text", value: label }],
      });
    } else {
      nodes.push({
        type: "html",
        value: `<span class="broken-wikilink">${escapeHtml(label)}</span>`,
      });
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < value.length) {
    nodes.push({
      type: "text",
      value: value.slice(lastIndex),
    });
  }

  return nodes;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function replaceWikilinksInParent(
  parent: { children: PhrasingContent[] },
  index: number,
  validSlugs: Set<string>,
) {
  const node = parent.children[index];

  if (node.type !== "text") {
    return;
  }

  const textNode = node as Text;

  if (!WIKILINK_PATTERN.test(textNode.value)) {
    return;
  }

  WIKILINK_PATTERN.lastIndex = 0;
  const replacement = splitTextByWikilinks(textNode.value, validSlugs);

  if (replacement.length === 1 && replacement[0].type === "text") {
    return;
  }

  parent.children.splice(index, 1, ...replacement);
}

export const remarkWikilink: Plugin<[WikilinkOptions], Root> =
  ({ validSlugs }) =>
  (tree) => {
    visit(tree, "text", (node, index, parent) => {
      if (!parent || index === undefined) {
        return;
      }

      replaceWikilinksInParent(
        parent as { children: PhrasingContent[] },
        index,
        validSlugs,
      );
    });
  };

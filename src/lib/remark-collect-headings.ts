import GithubSlugger from "github-slugger";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

import type { PostHeading } from "@/lib/types";

export function remarkCollectHeadings(headings: PostHeading[]) {
  const slugger = new GithubSlugger();

  return (tree: Root) => {
    visit(tree, "heading", (node) => {
      if (node.depth !== 2 && node.depth !== 3) {
        return;
      }

      const text = toString(node);

      headings.push({
        id: slugger.slug(text),
        text,
        depth: node.depth,
      });
    });
  };
}

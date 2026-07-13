import type { Image, Root } from "mdast";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

type RewriteImagesOptions = {
  slug: string;
};

export function rewriteImagePath(slug: string, src: string): string {
  if (src.startsWith("./images/")) {
    return `/posts/${slug}/images/${src.slice("./images/".length)}`;
  }

  if (src.startsWith("images/")) {
    return `/posts/${slug}/images/${src.slice("images/".length)}`;
  }

  return src;
}

export const remarkRewriteImages: Plugin<[RewriteImagesOptions], Root> =
  ({ slug }) =>
  (tree) => {
    visit(tree, "image", (node: Image) => {
      if (node.url) {
        node.url = rewriteImagePath(slug, node.url);
      }
    });
  };

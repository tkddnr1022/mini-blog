"use client";

import Giscus from "@giscus/react";

import { siteConfig } from "@/lib/config";

export function GiscusComments() {
  const { giscus } = siteConfig();

  if (!giscus) {
    return null;
  }

  return (
    <section
      aria-label="댓글"
      className="mt-12 border-t border-border pt-8"
    >
      <Giscus
        repo={giscus.repo as `${string}/${string}`}
        repoId={giscus.repoId}
        category={giscus.category}
        categoryId={giscus.categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="ko"
        loading="lazy"
      />
    </section>
  );
}

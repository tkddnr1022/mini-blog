"use client";

import Giscus from "@giscus/react";
import { useTheme } from "next-themes";

import { useMounted } from "@/hooks/use-mounted";
import { siteConfig } from "@/lib/config";

export function GiscusComments() {
  const { giscus } = siteConfig();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted();

  if (!giscus) {
    return null;
  }

  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <section
      aria-label="댓글"
      className="mt-12 border-t border-border pt-8"
    >
      <Giscus
        key={theme}
        repo={giscus.repo as `${string}/${string}`}
        repoId={giscus.repoId}
        category={giscus.category}
        categoryId={giscus.categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme}
        lang="ko"
        loading="lazy"
      />
    </section>
  );
}

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { AdjacentPosts } from "@/lib/posts";

type PostNavigationProps = {
  adjacent: AdjacentPosts;
};

export function PostNavigation({ adjacent }: PostNavigationProps) {
  if (!adjacent.previous && !adjacent.next) {
    return null;
  }

  return (
    <nav
      aria-label="이전/다음 글"
      className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2"
    >
      {adjacent.previous ? (
        <Link
          href={`/posts/${adjacent.previous.slug}`}
          className="group flex flex-col gap-1 rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
        >
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <ChevronLeft className="size-4" />
            이전 글
          </span>
          <span className="font-medium transition-opacity group-hover:opacity-70">
            {adjacent.previous.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {adjacent.next ? (
        <Link
          href={`/posts/${adjacent.next.slug}`}
          className="group flex flex-col items-end gap-1 rounded-lg border border-border p-4 text-right transition-colors hover:bg-muted/50 sm:col-start-2"
        >
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            다음 글
            <ChevronRight className="size-4" />
          </span>
          <span className="font-medium transition-opacity group-hover:opacity-70">
            {adjacent.next.title}
          </span>
        </Link>
      ) : null}
    </nav>
  );
}

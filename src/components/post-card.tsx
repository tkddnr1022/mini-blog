import Link from "next/link";

import { getCategoryPath } from "@/lib/category";
import type { Post } from "@/lib/types";

type PostCardProps = {
  post: Pick<
    Post,
    "slug" | "title" | "date" | "category" | "readingTime" | "description" | "thumbnail"
  >;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="flex flex-col gap-3 border-b border-border py-8 first:pt-0 last:border-b-0">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.date}>{post.date}</time>
          <span aria-hidden>·</span>
          <Link
            href={getCategoryPath(post.category)}
            className="transition-colors hover:text-foreground"
          >
            {post.category}
          </Link>
          <span aria-hidden>·</span>
          <span>{post.readingTime}</span>
        </div>
        <h2 className="text-xl font-semibold tracking-tight">
          <Link
            href={`/posts/${post.slug}`}
            className="transition-opacity hover:opacity-70"
          >
            {post.title}
          </Link>
        </h2>
        {post.description ? (
          <p className="text-muted-foreground">{post.description}</p>
        ) : null}
      </div>

      {post.thumbnail ? (
        <Link
          href={`/posts/${post.slug}`}
          className="block overflow-hidden border border-border transition-opacity hover:opacity-90"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnail}
            alt=""
            className="aspect-[16/9] w-full object-cover"
          />
        </Link>
      ) : null}
    </article>
  );
}

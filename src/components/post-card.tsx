"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { getCategoryPath } from "@/lib/category";
import type { Post } from "@/lib/types";

type PostCardProps = {
  post: Pick<
    Post,
    "slug" | "title" | "date" | "category" | "readingTime" | "description" | "thumbnail"
  >;
  index?: number;
};

export function PostCard({ post, index = 0 }: PostCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      className="flex flex-col gap-3 border-b border-border py-8 first:pt-0 last:border-b-0"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.25,
        delay: prefersReducedMotion ? 0 : index * 0.05,
        ease: "easeOut",
      }}
      whileHover={prefersReducedMotion ? undefined : { y: -2 }}
    >
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
    </motion.article>
  );
}

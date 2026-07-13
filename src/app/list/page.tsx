import type { Metadata } from "next";

import { CategoryFilter } from "@/components/category-filter";
import { PostCard } from "@/components/post-card";
import {
  getAllPosts,
  getCategoriesWithCounts,
} from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return {
    title: "목록",
    description: "카테고리별로 포스트를 모아 봅니다.",
    alternates: {
      canonical: "/list",
    },
    openGraph: {
      title: "목록",
      description: "카테고리별로 포스트를 모아 봅니다.",
      url: absoluteUrl("/list"),
    },
  };
}

export default async function ListPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getCategoriesWithCounts(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">목록</h1>
        <p className="text-muted-foreground">
          카테고리를 선택하면 해당 게시물만 볼 수 있습니다.
        </p>
      </header>

      <CategoryFilter categories={categories} totalCount={posts.length} />

      <section aria-label="전체 포스트 목록">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            아직 게시된 포스트가 없습니다.
          </p>
        ) : (
          <div className="flex flex-col">
            {posts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

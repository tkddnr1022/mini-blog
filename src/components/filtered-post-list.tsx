"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import { CategoryFilter } from "@/components/category-filter";
import { PostCard } from "@/components/post-card";
import type { CategoryWithCount } from "@/lib/posts";
import type { Post } from "@/lib/types";

type FilteredPostListProps = {
  posts: Post[];
  categories: CategoryWithCount[];
};

function FilteredPostListInner({ posts, categories }: FilteredPostListProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? undefined;

  const filteredPosts = activeCategory
    ? posts.filter((post) => post.category === activeCategory)
    : posts;

  return (
    <>
      <CategoryFilter
        categories={categories}
        totalCount={posts.length}
        activeCategory={activeCategory}
      />

      <section
        aria-label={
          activeCategory ? `${activeCategory} 포스트 목록` : "최신 포스트"
        }
      >
        {filteredPosts.length === 0 ? (
          <p className="text-muted-foreground">
            {activeCategory
              ? "이 카테고리에 해당하는 포스트가 없습니다."
              : "아직 게시된 포스트가 없습니다. content/posts/에 마크다운을 추가해 주세요."}
          </p>
        ) : (
          <div className="flex flex-col">
            {filteredPosts.map((post, index) => (
              <PostCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export function FilteredPostList(props: FilteredPostListProps) {
  return (
    <Suspense
      fallback={
        <>
          <CategoryFilter
            categories={props.categories}
            totalCount={props.posts.length}
          />
          <section aria-label="최신 포스트">
            <div className="flex flex-col">
              {props.posts.map((post, index) => (
                <PostCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          </section>
        </>
      }
    >
      <FilteredPostListInner {...props} />
    </Suspense>
  );
}

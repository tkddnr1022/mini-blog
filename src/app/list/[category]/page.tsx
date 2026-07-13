import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CategoryFilter } from "@/components/category-filter";
import { PostCard } from "@/components/post-card";
import { decodeCategoryParam, getCategoryPath } from "@/lib/category";
import {
  getAllCategories,
  getAllPosts,
  getCategoriesWithCounts,
  getPostsByCategory,
} from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

type ListCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export async function generateMetadata({
  params,
}: ListCategoryPageProps): Promise<Metadata> {
  const { category: categoryParam } = await params;
  const category = decodeCategoryParam(categoryParam);
  const categories = await getAllCategories();

  if (!categories.includes(category)) {
    return {
      title: "목록",
    };
  }

  const canonical = getCategoryPath(category);

  return {
    title: category,
    description: `${category} 카테고리 포스트 목록`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: category,
      description: `${category} 카테고리 포스트 목록`,
      url: absoluteUrl(canonical),
    },
  };
}

export default async function ListCategoryPage({
  params,
}: ListCategoryPageProps) {
  const { category: categoryParam } = await params;
  const category = decodeCategoryParam(categoryParam);
  const [allCategories, allPosts, categoriesWithCounts, posts] =
    await Promise.all([
      getAllCategories(),
      getAllPosts(),
      getCategoriesWithCounts(),
      getPostsByCategory(category),
    ]);

  if (!allCategories.includes(category)) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">목록</h1>
        <p className="text-muted-foreground">
          {category} · {posts.length}개의 포스트
        </p>
      </header>

      <CategoryFilter
        categories={categoriesWithCounts}
        totalCount={allPosts.length}
        activeCategory={category}
      />

      <section aria-label={`${category} 포스트 목록`}>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            이 카테고리에 해당하는 포스트가 없습니다.
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

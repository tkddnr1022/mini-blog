import type { Metadata } from "next";

import { FilteredPostList } from "@/components/filtered-post-list";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";
import { getAllPosts, getCategoriesWithCounts } from "@/lib/posts";

export function generateMetadata(): Metadata {
  const { name, description } = siteConfig();

  return {
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: name,
      description,
      url: absoluteUrl("/"),
    },
  };
}

export default async function Home() {
  const { name, description } = siteConfig();
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getCategoriesWithCounts(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>

      <FilteredPostList posts={posts} categories={categories} />
    </div>
  );
}

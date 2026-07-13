import Link from "next/link";
import { notFound } from "next/navigation";

import { PostContent } from "@/components/post-content";
import { PostNavigation } from "@/components/post-navigation";
import { Toc } from "@/components/toc";
import { getCategoryPath } from "@/lib/category";
import {
  getAdjacentPosts,
  getPostBySlug,
  getPostSlugs,
} from "@/lib/posts";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const slugs = getPostSlugs();

  if (!slugs.includes(slug)) {
    notFound();
  }

  const post = await getPostBySlug(slug);
  const adjacent = await getAdjacentPosts(slug);
  const hasHeadings = post.headings.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <div
        className={
          hasHeadings
            ? "lg:grid lg:grid-cols-[minmax(0,1fr)_12rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_14rem]"
            : "mx-auto max-w-3xl"
        }
      >
        <div className="min-w-0">
          <header className="mb-8 flex flex-col gap-3 border-b border-border pb-6">
            <p className="text-sm text-muted-foreground">
              <time dateTime={post.date}>{post.date}</time>
              <span aria-hidden> · </span>
              <Link
                href={getCategoryPath(post.category)}
                className="transition-colors hover:text-foreground"
              >
                {post.category}
              </Link>
              <span aria-hidden> · </span>
              {post.readingTime}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {post.title}
            </h1>
            {post.description ? (
              <p className="text-muted-foreground">{post.description}</p>
            ) : null}
            {post.thumbnail ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.thumbnail}
                alt=""
                className="mt-2 w-full border border-border"
              />
            ) : null}
          </header>

          {hasHeadings ? (
            <Toc headings={post.headings} variant="collapsible" />
          ) : null}

          <PostContent html={post.html} />
          <PostNavigation adjacent={adjacent} />
        </div>

        {hasHeadings ? (
          <aside className="hidden lg:block">
            <Toc headings={post.headings} variant="sidebar" />
          </aside>
        ) : null}
      </div>
    </div>
  );
}

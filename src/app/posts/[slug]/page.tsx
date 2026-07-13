import { notFound } from "next/navigation";

import { getPostBySlug, getPostSlugs } from "@/lib/posts";

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

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-16">
      <header className="flex flex-col gap-3 border-b border-border pb-6">
        <p className="text-sm text-muted-foreground">
          {post.date} · {post.category} · {post.readingTime}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{post.title}</h1>
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

      <article
        className="post-content max-w-none"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
    </main>
  );
}

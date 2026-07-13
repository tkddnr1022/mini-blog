import { PostCard } from "@/components/post-card";
import { siteConfig } from "@/lib/config";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  const { name, description } = siteConfig();
  const posts = await getAllPosts();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>

      <section aria-label="최신 포스트">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            아직 게시된 포스트가 없습니다. content/posts/에 마크다운을 추가해
            주세요.
          </p>
        ) : (
          <div className="flex flex-col">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

import { PostCard } from "@/components/post-card";
import { decodeCategoryParam } from "@/lib/category";
import { getAllCategories, getPostsByCategory } from "@/lib/posts";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = await getAllCategories();

  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryParam } = await params;
  const category = decodeCategoryParam(categoryParam);
  const posts = await getPostsByCategory(category);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">카테고리</p>
        <h1 className="text-3xl font-semibold tracking-tight">{category}</h1>
        <p className="text-muted-foreground">
          {posts.length}개의 포스트
        </p>
      </header>

      <section aria-label={`${category} 포스트 목록`}>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            이 카테고리에 해당하는 포스트가 없습니다.
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

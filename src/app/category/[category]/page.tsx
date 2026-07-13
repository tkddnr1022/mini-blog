import { siteConfig } from "@/lib/config";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export function generateStaticParams() {
  return [{ category: "_placeholder" }];
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Category</h1>
      <p className="text-muted-foreground">
        {siteConfig().name} — category: {category}
      </p>
    </main>
  );
}

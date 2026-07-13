import { siteConfig } from "@/lib/config";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [{ slug: "_placeholder" }];
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Post</h1>
      <p className="text-muted-foreground">
        {siteConfig().name} — slug: {slug}
      </p>
    </main>
  );
}

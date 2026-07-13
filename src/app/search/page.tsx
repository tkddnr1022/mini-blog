import { siteConfig } from "@/lib/config";

export default function SearchPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Search</h1>
      <p className="text-muted-foreground">{siteConfig().description}</p>
    </main>
  );
}

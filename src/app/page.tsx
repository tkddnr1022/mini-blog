import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";

export default function Home() {
  const { name, description } = siteConfig();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">{name}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button>Get started</Button>
    </main>
  );
}

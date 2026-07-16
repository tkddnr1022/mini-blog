import { siteConfig } from "@/lib/config";

export function Footer() {
  const { author } = siteConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-container items-center justify-between px-6 py-8 text-sm text-muted-foreground">
        <p>
          © {year} {author}
        </p>
        <p>생각 창고</p>
      </div>
    </footer>
  );
}

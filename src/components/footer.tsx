import { siteConfig } from "@/lib/config";

export function Footer() {
  const { name } = siteConfig();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8 text-sm text-muted-foreground">
        <p>
          © {year} {name}
        </p>
        <p>정적 블로그</p>
      </div>
    </footer>
  );
}

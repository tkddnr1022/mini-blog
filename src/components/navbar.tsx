import Link from "next/link";
import { ExternalLink, Mail, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCategoryPath } from "@/lib/category";
import { siteConfig } from "@/lib/config";
import { getAllCategories } from "@/lib/posts";

export async function Navbar() {
  const { name } = siteConfig();
  const categories = await getAllCategories();
  const categoryHref =
    categories.length > 0 ? getCategoryPath(categories[0]) : "/";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight transition-opacity hover:opacity-70"
          >
            {name}
          </Link>
          <nav className="hidden items-center gap-4 sm:flex" aria-label="Main">
            <Link
              href="/"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              목록
            </Link>
            <Link
              href={categoryHref}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              카테고리
            </Link>
            <Link
              href="/search"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              검색
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" asChild>
            <Link href="/search" aria-label="검색">
              <Search />
            </Link>
          </Button>
          <Button variant="ghost" size="icon-sm" asChild>
            <a href="#" aria-label="GitHub" title="GitHub (M5에서 연결)">
              <ExternalLink />
            </a>
          </Button>
          <Button variant="ghost" size="icon-sm" asChild>
            <a href="#" aria-label="이메일" title="이메일 (M5에서 연결)">
              <Mail />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

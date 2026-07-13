import Link from "next/link";

import { getCategoryPath } from "@/lib/category";
import type { CategoryWithCount } from "@/lib/posts";
import { cn } from "@/lib/utils";

type CategoryFilterProps = {
  categories: CategoryWithCount[];
  totalCount: number;
  activeCategory?: string;
};

export function CategoryFilter({
  categories,
  totalCount,
  activeCategory,
}: CategoryFilterProps) {
  return (
    <nav aria-label="카테고리 목록">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/list"
            className={cn(
              "inline-flex min-h-9 items-center gap-1.5 border px-3 text-sm transition-colors",
              !activeCategory
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
            )}
            aria-current={!activeCategory ? "page" : undefined}
          >
            전체
            <span className="tabular-nums opacity-70">{totalCount}</span>
          </Link>
        </li>
        {categories.map((category) => {
          const isActive = activeCategory === category.name;

          return (
            <li key={category.name}>
              <Link
                href={getCategoryPath(category.name)}
                className={cn(
                  "inline-flex min-h-9 items-center gap-1.5 border px-3 text-sm transition-colors",
                  isActive
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {category.name}
                <span className="tabular-nums opacity-70">{category.count}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

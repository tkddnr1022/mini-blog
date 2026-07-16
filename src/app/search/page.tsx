import type { Metadata } from "next";

import { Search } from "@/components/search";
import { absoluteUrl } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return {
    title: "검색",
    description: "제목, 요약, 본문 키워드로 포스트를 검색합니다.",
    alternates: {
      canonical: "/search",
    },
    openGraph: {
      title: "검색",
      description: "제목, 요약, 본문 키워드로 포스트를 검색합니다.",
      url: absoluteUrl("/search"),
    },
  };
}

export default function SearchPage() {
  return (
    <div className="mx-auto flex w-full max-w-container flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">검색</h1>
        <p className="text-muted-foreground">
          제목, 요약, 본문 키워드로 포스트를 찾을 수 있습니다.
        </p>
      </header>

      <Search />
    </div>
  );
}

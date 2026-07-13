import { Search } from "@/components/search";

export default function SearchPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">검색</h1>
        <p className="text-muted-foreground">
          제목, 요약, 본문 키워드로 포스트를 찾을 수 있습니다.
        </p>
      </header>

      <Search />
    </main>
  );
}

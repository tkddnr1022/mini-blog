"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { getCategoryPath } from "@/lib/category";
import {
  createSearchIndex,
  type SearchDocument,
  searchDocuments,
} from "@/lib/search-index";
import type MiniSearch from "minisearch";

type SearchState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; index: MiniSearch<SearchDocument> };

export function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [searchState, setSearchState] = useState<SearchState>({
    status: "loading",
  });

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadIndex() {
      try {
        const response = await fetch("/search-index.json");

        if (!response.ok) {
          throw new Error(`Failed to load search index: ${response.status}`);
        }

        const documents = (await response.json()) as SearchDocument[];

        if (cancelled) {
          return;
        }

        setSearchState({
          status: "ready",
          index: createSearchIndex(documents),
        });
      } catch {
        if (!cancelled) {
          setSearchState({ status: "error" });
        }
      }
    }

    void loadIndex();

    return () => {
      cancelled = true;
    };
  }, []);

  const trimmedQuery = deferredQuery.trim();
  const results =
    searchState.status === "ready" && trimmedQuery.length > 0
      ? searchDocuments(searchState.index, trimmedQuery)
      : [];

  return (
    <div className="flex flex-col gap-6" role="search">
      <Input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="제목, 요약, 본문으로 검색"
        aria-label="포스트 검색"
      />

      <div aria-live="polite" className="min-h-8">
        {searchState.status === "loading" ? (
          <p className="text-sm text-muted-foreground">검색 인덱스를 불러오는 중…</p>
        ) : null}

        {searchState.status === "error" ? (
          <p className="text-sm text-muted-foreground">
            검색 인덱스를 불러오지 못했습니다. 빌드 후 다시 시도해 주세요.
          </p>
        ) : null}

        {searchState.status === "ready" && trimmedQuery.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            검색어를 입력하면 관련 포스트가 표시됩니다.
          </p>
        ) : null}

        {searchState.status === "ready" &&
        trimmedQuery.length > 0 &&
        results.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            &quot;{trimmedQuery}&quot;에 대한 결과가 없습니다.
          </p>
        ) : null}

        {searchState.status === "ready" && results.length > 0 ? (
          <ul className="flex flex-col">
            {results.map((result) => (
              <li
                key={result.id}
                className="border-b border-border py-6 first:pt-0 last:border-b-0"
              >
                <article className="flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">
                    <Link
                      href={getCategoryPath(result.category)}
                      className="transition-colors hover:text-foreground"
                    >
                      {result.category}
                    </Link>
                  </div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    <Link
                      href={`/posts/${result.slug}`}
                      className="transition-opacity hover:opacity-70"
                    >
                      {result.title}
                    </Link>
                  </h2>
                  {result.description ? (
                    <p className="text-muted-foreground">{result.description}</p>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

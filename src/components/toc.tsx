"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import type { PostHeading } from "@/lib/types";

type TocProps = {
  headings: PostHeading[];
  variant?: "sidebar" | "collapsible";
};

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  rootMargin: "-20% 0px -70% 0px",
  threshold: [0, 0.25, 0.5, 1],
};

function getConnectedHeadingElements(
  article: Element,
  headings: PostHeading[],
): HTMLElement[] {
  return headings
    .map((heading) => document.getElementById(heading.id))
    .filter(
      (element): element is HTMLElement =>
        element !== null && element.isConnected && article.contains(element),
    );
}

export function Toc({ headings, variant = "sidebar" }: TocProps) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const article = document.querySelector("article.post-content");

    if (!article) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let frameId = 0;

    const bindObserver = () => {
      observer?.disconnect();

      const elements = getConnectedHeadingElements(article, headings);

      if (elements.length === 0) {
        observer = null;
        return;
      }

      observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      }, OBSERVER_OPTIONS);

      for (const element of elements) {
        observer.observe(element);
      }
    };

    const scheduleBind = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(bindObserver);
    };

    bindObserver();
    scheduleBind();

    const mutationObserver = new MutationObserver(scheduleBind);
    mutationObserver.observe(article, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frameId);
      observer?.disconnect();
      mutationObserver.disconnect();
    };
  }, [headings]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  };

  const list = (
    <ul className="flex flex-col gap-2 text-sm">
      {headings.map((heading) => (
        <li
          key={heading.id}
          className={cn(heading.depth === 3 && "pl-3")}
        >
          <button
            type="button"
            onClick={() => handleClick(heading.id)}
            className={cn(
              "w-full text-left transition-colors hover:text-foreground",
              activeId === heading.id
                ? "font-medium text-foreground"
                : "text-muted-foreground",
            )}
          >
            {heading.text}
          </button>
        </li>
      ))}
    </ul>
  );

  if (variant === "collapsible") {
    return (
      <details className="mb-6 border border-border bg-muted/40 px-4 py-3 lg:hidden">
        <summary className="cursor-pointer text-sm font-medium">목차</summary>
        <nav aria-label="목차" className="mt-3">
          {list}
        </nav>
      </details>
    );
  }

  return (
    <nav aria-label="목차" className="sticky top-20">
      <p className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        목차
      </p>
      {list}
    </nav>
  );
}

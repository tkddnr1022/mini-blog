"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";

import { CodeBlock, parsePostHtml } from "@/components/code-block";

import "yet-another-react-lightbox/styles.css";

type PostContentProps = {
  html: string;
};

type Slide = {
  src: string;
  alt?: string;
};

export function PostContent({ html }: PostContentProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const parts = useMemo(() => parsePostHtml(html), [html]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const images = Array.from(container.querySelectorAll("img"));

    setSlides(
      images.map((image) => ({
        src: image.src,
        alt: image.alt || undefined,
      })),
    );

    for (const [imageIndex, image] of images.entries()) {
      image.tabIndex = 0;
      image.role = "button";
      image.setAttribute(
        "aria-label",
        image.alt ? `${image.alt} 확대 보기` : `이미지 ${imageIndex + 1} 확대 보기`,
      );
    }

    const openImage = (target: HTMLImageElement) => {
      const imageIndex = images.indexOf(target);

      if (imageIndex >= 0) {
        setIndex(imageIndex);
        setOpen(true);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLImageElement)) {
        return;
      }

      openImage(target);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLImageElement)) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openImage(target);
      }
    };

    container.addEventListener("click", handleClick);
    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [html]);

  return (
    <>
      <article ref={containerRef} className="post-content max-w-none">
        {parts.map((part, partIndex) =>
          part.type === "code" ? (
            <CodeBlock
              key={`code-${partIndex}`}
              language={part.language}
              title={part.title}
              code={part.code}
              html={part.html}
            />
          ) : (
            <div
              key={`html-${partIndex}`}
              dangerouslySetInnerHTML={{ __html: part.html }}
            />
          ),
        )}
      </article>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={slides}
        controller={{ closeOnBackdropClick: true }}
      />
    </>
  );
}

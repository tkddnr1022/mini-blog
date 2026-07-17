"use client";

import {
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
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
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const parts = useMemo(() => parsePostHtml(html), [html]);

  const decorateImages = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    const images = Array.from(container.querySelectorAll("img"));

    for (const [imageIndex, image] of images.entries()) {
      image.tabIndex = 0;
      image.role = "button";
      image.setAttribute(
        "aria-label",
        image.alt ? `${image.alt} 확대 보기` : `이미지 ${imageIndex + 1} 확대 보기`,
      );
    }
  }, []);

  const openImage = useCallback(
    (container: HTMLElement, target: HTMLImageElement) => {
      const images = Array.from(container.querySelectorAll("img"));
      const imageIndex = images.indexOf(target);

      if (imageIndex >= 0) {
        setSlides(
          images.map((image) => ({
            src: image.src,
            alt: image.alt || undefined,
          })),
        );
        setIndex(imageIndex);
        setOpen(true);
      }
    },
    [],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const target = event.target;

      if (!(target instanceof HTMLImageElement)) {
        return;
      }

      openImage(event.currentTarget, target);
    },
    [openImage],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const target = event.target;

      if (!(target instanceof HTMLImageElement)) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openImage(event.currentTarget, target);
      }
    },
    [openImage],
  );

  return (
    <>
      <article
        ref={decorateImages}
        className="post-content max-w-none"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
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

"use client";

import { useEffect, useRef, useState } from "react";
import Lightbox from "yet-another-react-lightbox";

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

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLImageElement)) {
        return;
      }

      const imageIndex = images.indexOf(target);

      if (imageIndex >= 0) {
        setIndex(imageIndex);
        setOpen(true);
      }
    };

    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [html]);

  return (
    <>
      <article
        ref={containerRef}
        className="post-content max-w-none"
        dangerouslySetInnerHTML={{ __html: html }}
      />
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

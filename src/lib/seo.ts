import type { Metadata } from "next";

import { siteConfig } from "@/lib/config";
import type { Post } from "@/lib/types";

export function absoluteUrl(path: string): string {
  const { url } = siteConfig();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${url}${normalized}`;
}

export function resolveOgImage(thumbnail?: string): string {
  if (thumbnail) {
    if (thumbnail.startsWith("http://") || thumbnail.startsWith("https://")) {
      return thumbnail;
    }

    return absoluteUrl(thumbnail);
  }

  return absoluteUrl(siteConfig().ogImage);
}

export function createDefaultMetadata(): Metadata {
  const { name, description } = siteConfig();
  const ogImage = resolveOgImage();

  return {
    metadataBase: new URL(siteConfig().url),
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: "ko_KR",
      siteName: name,
      title: name,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [ogImage],
    },
  };
}

export function createPostMetadata(post: Post): Metadata {
  const { name } = siteConfig();
  const ogImage = resolveOgImage(post.thumbnail);
  const description = post.description ?? siteConfig().description;
  const canonical = `/posts/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      locale: "ko_KR",
      siteName: name,
      title: post.title,
      description,
      url: absoluteUrl(canonical),
      publishedTime: post.date,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [ogImage],
    },
  };
}

export function createBlogPostingJsonLd(post: Post): Record<string, unknown> {
  const { author, name } = siteConfig();
  const url = absoluteUrl(`/posts/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? siteConfig().description,
    datePublished: post.date,
    image: resolveOgImage(post.thumbnail),
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
  };
}

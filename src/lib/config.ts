export type GiscusConfig = {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
};

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  author: string;
  github: string;
  email: string;
  ogImage: string;
  giscus: GiscusConfig | null;
  gaId: string | null;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : undefined;
}

export function siteConfig(): SiteConfig {
  const giscusRepo = readEnv("NEXT_PUBLIC_GISCUS_REPO");
  const giscusRepoId = readEnv("NEXT_PUBLIC_GISCUS_REPO_ID");
  const giscusCategory = readEnv("NEXT_PUBLIC_GISCUS_CATEGORY");
  const giscusCategoryId = readEnv("NEXT_PUBLIC_GISCUS_CATEGORY_ID");

  const hasGiscus = Boolean(
    giscusRepo && giscusRepoId && giscusCategory && giscusCategoryId,
  );

  return {
    name: "Mini Blog",
    description: "Personal technical blog",
    url: (readEnv("NEXT_PUBLIC_SITE_URL") ?? "https://example.com").replace(
      /\/$/,
      "",
    ),
    author: readEnv("NEXT_PUBLIC_AUTHOR") ?? "Author",
    github:
      readEnv("NEXT_PUBLIC_GITHUB_URL") ?? "https://github.com/your-username",
    email: readEnv("NEXT_PUBLIC_EMAIL") ?? "hello@example.com",
    ogImage: "/og/default.png",
    giscus: hasGiscus
      ? {
          repo: giscusRepo!,
          repoId: giscusRepoId!,
          category: giscusCategory!,
          categoryId: giscusCategoryId!,
        }
      : null,
    gaId: readEnv("NEXT_PUBLIC_GA_ID") ?? null,
  };
}

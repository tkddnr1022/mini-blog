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

const site = {
  name: "생각 창고",
  description: "고민하고 배운 것들의 기록",
  url: "https://blog.sanguk.site",
  author: "tkddnr1022",
  github: "https://github.com/tkddnr1022",
  email: "tkddnr10222@gmail.com",
  ogImage: "/og/default.png",
} as const;

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
    name: site.name,
    description: site.description,
    url: site.url.replace(/\/$/, ""),
    author: site.author,
    github: site.github,
    email: site.email,
    ogImage: site.ogImage,
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

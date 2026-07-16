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

function readEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : undefined;
}

export function siteConfig(): SiteConfig {
  // Static keys required — Next.js only inlines NEXT_PUBLIC_* for client bundles.
  const giscusRepo = readEnv(process.env.NEXT_PUBLIC_GISCUS_REPO);
  const giscusRepoId = readEnv(process.env.NEXT_PUBLIC_GISCUS_REPO_ID);
  const giscusCategory = readEnv(process.env.NEXT_PUBLIC_GISCUS_CATEGORY);
  const giscusCategoryId = readEnv(process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID);

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
    gaId: readEnv(process.env.NEXT_PUBLIC_GA_ID) ?? null,
  };
}

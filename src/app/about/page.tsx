import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";

export function generateMetadata(): Metadata {
  const { name, description } = siteConfig();

  return {
    title: "About",
    description: `${name} 소개, 약력, 연락처`,
    alternates: {
      canonical: "/about",
    },
    openGraph: {
      title: `About | ${name}`,
      description,
      url: absoluteUrl("/about"),
    },
  };
}

export default function AboutPage() {
  const { name, description, author, github, email } = siteConfig();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <p className="text-muted-foreground">{description}</p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">소개</h2>
        <p className="leading-relaxed text-muted-foreground">
          {author}입니다. {name}에서 기술 학습 기록, 프로젝트 회고, 실험
          결과를 정리합니다. Obsidian으로 작성한 마크다운을 그대로 발행하는
          정적 블로그를 운영합니다.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">약력</h2>
        <ul className="flex flex-col gap-4 border-l border-border pl-4">
          <li className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">현재</span>
            <p className="leading-relaxed">
              개인 기술 블로그 운영 및 사이드 프로젝트 개발
            </p>
          </li>
          <li className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">관심 분야</span>
            <p className="leading-relaxed">
              프론트엔드, 정적 사이트, 개발자 경험(DX), 콘텐츠 워크플로우
            </p>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">연락처</h2>
        <ul className="flex flex-col gap-2">
          <li>
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-foreground text-muted-foreground"
            >
              <img
                src="/github.svg"
                alt=""
                width={16}
                height={16}
                className="size-4 dark:invert"
                aria-hidden
              />
              GitHub
            </a>
          </li>
          <li>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-foreground text-muted-foreground"
            >
              <Mail className="size-4" aria-hidden />
              {email}
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
}

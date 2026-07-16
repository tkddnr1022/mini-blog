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
  const { github, email } = siteConfig();

  return (
    <div className="mx-auto flex w-full max-w-container flex-1 flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">About</h1>
        <p className="text-muted-foreground">저자에 대하여</p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">소개</h2>
        <p className="leading-relaxed text-muted-foreground">
          주니어 풀스택 엔지니어로서 React + Node.js 개발을 하고 있습니다.
          <br />
          디자인, DevOps 등 다양한 분야에 관심이 있습니다.
          <br />
          프로젝트를 진행하며 배운 것을 정리하고 있습니다.
          <br />
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
            <span className="text-sm text-muted-foreground">2025</span>
            <p className="leading-relaxed">
              풀스택 엔지니어 근무(올콘텐츠앤에이아이)
            </p>
          </li>
        </ul>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-medium tracking-tight">관심 분야</h2>
        <p className="leading-relaxed">
          객체 지향, 프로덕트 개발, 서비스 운영, UI/UX 디자인
        </p>
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

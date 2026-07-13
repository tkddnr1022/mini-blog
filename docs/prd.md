# 개인 기술 블로그 PRD (Product Requirements Document)

- 문서 버전: v1.1
- 작성일: 2026-07-13
- 작성자: (작성자명)
- 상태: Draft

---

## 1. 개요

### 1.1 배경
Obsidian으로 작성한 마크다운 포스트를 그대로 저장소에 업로드해 발행할 수 있는, 정적 빌드 기반의 개인 기술 블로그를 구축한다. 외부 백엔드/API 없이 GitHub Pages만으로 호스팅하며, 검색·댓글 등 동적으로 보이는 기능도 정적 인프라 안에서 해결한다.

### 1.2 목적
- 기술 학습 및 프로젝트 기록을 게시하는 개인 채널 확보
- Obsidian 작성 워크플로우를 그대로 발행 파이프라인에 연결
- 유지보수 비용(서버, DB, API 비용)이 없는 완전 정적 아키텍처 구현

### 1.3 목표 사용자
- 1차: 블로그 운영자 본인 (작성자 겸 관리자)
- 2차: 블로그 방문자 (기술 콘텐츠 독자, 채용 담당자 등)

### 1.4 목표가 아닌 것 (Non-goals)
- 다중 저자/CMS 형태의 협업 편집 기능
- 회원가입/로그인, 뉴스레터 발송 등 백엔드가 필요한 기능
- 실시간 조회수/애널리틱스 대시보드 자체 구축 (GA4 등 외부 스크립트 삽입으로 대체)

---

## 2. 성공 지표 (Success Metrics)

| 지표 | 목표 |
|---|---|
| 빌드/배포 자동화 | push 후 5분 이내 자동 배포 완료 |
| 검색 응답 속도 | 클라이언트 검색 입력 후 100ms 이내 결과 표시 |
| 페이지 로딩 | Lighthouse Performance 90점 이상 |
| SEO | Lighthouse SEO 95점 이상, 포스트별 OG 이미지 정상 노출 |
| 신규 포스트 발행 소요 시간 | Obsidian 작성 완료 후 업로드~배포까지 10분 이내 |

---

## 3. 요구사항

### 3.1 필수 기능 요구사항 (Functional Requirements)

| ID | 요구사항 | 상세 설명 |
|---|---|---|
| FR-01 | 정적 빌드 + GitHub Pages 호스팅 | `next build` 결과를 GitHub Pages로 배포. 서버 런타임 없음 |
| FR-02 | Markdown 지원 (Obsidian 호환) | 위키링크(`[[...]]`), 콜아웃(`> [!note]`), 프론트매터 등 Obsidian 문법을 표준 HTML로 변환 |
| FR-03 | Mermaid 다이어그램 | 마크다운 내 mermaid 코드 블록을 빌드 시점에 SVG로 렌더링 |
| FR-04 | 카테고리 분류 | frontmatter 기반 카테고리 지정, 카테고리별 목록 페이지 자동 생성 |
| FR-05 | 정적 검색 | 외부 API 없이 빌드 시 생성된 인덱스(제목·요약·본문 전체)를 클라이언트에서 로드해 검색 |
| FR-06 | 예상 읽는 시간 | 포스트 본문 단어 수 기반으로 자동 계산해 표시 |
| FR-07 | 스크롤 목차(TOC) | 포스트 헤딩 기반 목차 생성, 스크롤 위치에 따라 현재 섹션 하이라이트 |
| FR-08 | 이미지 + 라이트박스 | 이미지는 리포지토리 내 포함(외부 CDN 미사용), 클릭 시 확대 보기 |
| FR-09 | 이전/다음 글 네비게이션 | 발행일 기준 정렬된 인접 포스트로 이동하는 링크 |
| FR-10 | 댓글 (giscus) | GitHub Discussions 기반 댓글 위젯 삽입 |
| FR-11 | About 페이지 | 소개, 약력, 연락처 정보 |
| FR-12 | 외부 링크 | GitHub 프로필, 이메일 링크를 상단바 또는 About에 노출 |
| FR-13 | SEO | 메타 태그, OG 태그, sitemap.xml, robots.txt, JSON-LD(BlogPosting) 자동 생성 |
| FR-14 | 애널리틱스 (GA4) | Google Analytics 4 측정 ID를 정적 페이지에 삽입해 방문자 통계 수집 |

### 3.2 디자인 요구사항 (Design Requirements)

| ID | 요구사항 | 상세 설명 |
|---|---|---|
| DR-01 | UI 컴포넌트 | shadcn/ui 기반 컴포넌트 사용 |
| DR-02 | 애니메이션 | Framer Motion을 활용한 절제된 전환/인터랙션 효과 |
| DR-03 | 라이트/다크 모드 | 시스템 설정 감지 + 수동 토글, 전환 시 깜빡임(FOUC) 없음 |
| DR-04 | 비주얼 스타일 | 미니멀리즘, 흑백(그레이스케일) 기반 컬러 팔레트 |
| DR-05 | 반응형 레이아웃 | 모바일/태블릿/데스크톱 대응 |
| DR-06 | 유연한 상단바 | 스크롤에 반응해 축소/블러 등 동적으로 변화하는 상단 네비게이션 |

### 3.3 운영 워크플로우 요구사항

| ID | 요구사항 | 상세 설명 |
|---|---|---|
| OR-01 | Obsidian 작성 | 포스트는 Obsidian vault에서 작성 |
| OR-02 | 업로드 방식 | 완성된 포스트(마크다운 + 이미지)를 리포지토리의 지정 폴더로 이동 후 git push |
| OR-03 | 자동 배포 | push 시 GitHub Actions가 검색 인덱스 생성, mermaid 렌더링, 빌드, 배포를 자동 수행 |

---

## 4. 비기능 요구사항 (Non-Functional Requirements)

| 구분 | 내용 |
|---|---|
| 성능 | 정적 리소스만 사용, 이미지 최적화(적정 해상도/포맷) |
| 접근성 | 시맨틱 마크업, 키보드 내비게이션, 명도 대비 WCAG AA 수준 |
| 유지보수성 | 컴포넌트 단위 분리, 포스트 추가 시 코드 수정 불필요 |
| 확장성 | 포스트/카테고리 수가 늘어나도 검색 인덱스·빌드 시간이 급격히 증가하지 않도록 설계 |
| 비용 | 무료 티어(GitHub Pages, giscus) 내에서 운영, 외부 유료 API 미사용 |

---

## 5. 기술 스택

| 영역 | 선택 기술 | 비고 |
|---|---|---|
| 프레임워크 | Next.js (App Router, `output: 'export'`) | 정적 export로 GitHub Pages 호환 |
| UI | shadcn/ui + Tailwind CSS | 디자인 요구사항 충족 |
| 애니메이션 | Framer Motion | 절제된 인터랙션 |
| 콘텐츠 파싱 | gray-matter, remark/rehype 플러그인 체인 | Obsidian 문법 변환 포함 |
| 다이어그램 | remark-mermaidjs (빌드 타임 SVG 렌더링) | 클라이언트 JS 부담 최소화 |
| 검색 | MiniSearch (또는 Lunr.js) | 정적 인덱스 기반 (제목·요약·본문 전체) |
| 읽는 시간 | reading-time (npm) | 빌드 시 계산 |
| 라이트박스 | yet-another-react-lightbox | 경량 라이브러리 |
| 댓글 | giscus | GitHub Discussions 연동 |
| 애널리틱스 | Google Analytics 4 | 클라이언트 스크립트 삽입 |
| 배포 | GitHub Actions → GitHub Pages | 커스텀 도메인 + push 트리거 자동화 |

---

## 6. 정보 구조 / 사이트맵

```
/                       홈 (최신 포스트 목록)
/posts/[slug]           포스트 상세
/category/[category]    카테고리별 목록
/search                 검색 페이지
/about                  소개 페이지
```

---

## 7. 콘텐츠 데이터 모델 (Frontmatter 스펙)

```yaml
---
title: "포스트 제목"
date: 2026-07-13
category: "카테고리명"
tags: ["tag1", "tag2"]
description: "SEO/카드 미리보기용 요약"
thumbnail: "./images/thumbnail.png"
---
```

- `title`, `date`, `category`: 필수
- `tags`, `description`, `thumbnail`: 선택(권장)
- `tags`는 frontmatter에 보관만 하며, UI 필터링은 카테고리만 제공
- 읽는 시간(`readingTime`)은 빌드 시 자동 계산되어 별도 입력 불필요

---

## 8. 프로젝트 구조 (예시)

```
tech-blog/
├── content/
│   └── posts/
│       └── 2026-07-13-example-post/
│           ├── index.md
│           └── images/
├── public/
│   ├── search-index.json
│   └── og/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── posts/[slug]/page.tsx
│   │   ├── category/[category]/page.tsx
│   │   ├── search/page.tsx
│   │   └── about/page.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── navbar.tsx
│   │   ├── toc.tsx
│   │   ├── lightbox.tsx
│   │   ├── giscus.tsx
│   │   └── post-card.tsx
│   ├── lib/
│   │   ├── posts.ts
│   │   ├── mdx-plugins.ts
│   │   └── search-index.ts
│   └── styles/
├── scripts/
│   └── build-search-index.ts
├── .github/workflows/deploy.yml
├── next.config.js
└── tailwind.config.ts
```

---

## 9. 사용자 시나리오 (User Flows)

### 9.1 포스트 발행 (운영자)
1. Obsidian vault에서 포스트 작성 (이미지 자동 첨부)
2. 완성된 포스트 폴더를 리포지토리 `content/posts/`로 이동
3. frontmatter 필수 필드 확인
4. `git push`
5. GitHub Actions가 검색 인덱스 생성 → mermaid 렌더링 → 빌드 → 배포
6. 배포 완료 후 URL로 접속 확인

### 9.2 방문자 열람
1. 홈에서 최신 포스트 목록 확인 또는 카테고리 필터링
2. 포스트 클릭 → 상세 페이지 진입, 목차로 원하는 섹션 이동
3. 이미지 클릭 시 라이트박스 확대
4. 포스트 하단에서 이전/다음 글 이동 또는 댓글 작성(giscus, GitHub 로그인 필요)

### 9.3 검색
1. 검색 페이지 진입 또는 상단바 검색 아이콘 클릭
2. 키워드 입력 → 클라이언트에서 `search-index.json` 기반 즉시 결과 표시
3. 결과 클릭 시 해당 포스트로 이동

---

## 10. 마일스톤 / 로드맵

| 단계 | 내용 | 예상 기간 |
|---|---|---|
| M1 | 프로젝트 셋업 (Next.js, Tailwind, shadcn, Actions 스켈레톤) | 2~3일 |
| M2 | 마크다운 파이프라인 (Obsidian 호환, mermaid, reading-time) | 3~4일 |
| M3 | 포스트 목록/상세, 카테고리, 이전·다음 글, TOC, 라이트박스 | 4~5일 |
| M4 | 검색 인덱스 빌드 + 검색 UI | 2일 |
| M5 | About, 외부 링크, giscus, SEO 메타데이터, GA4 | 2일 |
| M6 | 디자인 다듬기 (다크모드, 반응형, 애니메이션) | 3~4일 |
| M7 | 배포 파이프라인 테스트, 커스텀 도메인 확정 | 1~2일 |

---

## 11. 리스크 및 유의사항

| 리스크 | 영향 | 대응 방안 |
|---|---|---|
| GitHub Pages는 서버리스 환경 | 검색·댓글이 전부 클라이언트 사이드 동작 필요 | 정적 인덱스 + giscus로 해결, 서버 의존 기능 배제 |
| 검색 인덱스 파일 크기 증가 | 본문 전체 포함으로 포스트 수 증가 시 초기 로딩 지연 | 카테고리별 인덱스 분할 또는 지연 로딩(lazy load) 고려 |
| Mermaid Puppeteer 렌더링 | 빌드 시간 증가 | 빌드 캐싱 전략 적용 |
| 커스텀 도메인 DNS/`CNAME` | 설정 오류 시 배포 URL·자산 경로 깨짐 | `basePath` 미사용(루트 도메인), DNS/`CNAME` 절차를 README에 문서화 |

---

## 12. Decisions (구 Open Questions)

| ID | 결정 | 상세 |
|---|---|---|
| OQ-1 | 커스텀 도메인 사용 | `github.io` 서브패스/`basePath` 미사용. DNS + `CNAME`으로 루트(또는 apex) 도메인 연결 |
| OQ-2 | 검색 인덱스에 제목·요약·본문 전체 포함 | `title` + `description` + 본문 전문을 인덱싱해 본문 키워드 검색 지원 |
| OQ-3 | 태그 필터링 미제공 | v1 UI는 카테고리만 제공. `tags`는 frontmatter 보관만 |
| OQ-4 | GA4 애널리틱스 사용 | Google Analytics 4 측정 ID를 레이아웃에 삽입 |

---

## 13. 부록: 요구사항 추적 매트릭스

| 요구사항 ID | 관련 컴포넌트/모듈 | 완료 기준 (DoD) |
|---|---|---|
| FR-01 | `.github/workflows/deploy.yml`, `next.config.js` | push 후 Pages에 정상 배포 확인 |
| FR-02 | `lib/mdx-plugins.ts` | Obsidian 위키링크/콜아웃이 정상 렌더링 |
| FR-03 | `remark-mermaidjs` 설정 | mermaid 코드 블록이 SVG로 표시 |
| FR-04 | `app/category/[category]/page.tsx` | 카테고리별 목록 페이지 정상 생성 |
| FR-05 | `scripts/build-search-index.ts`, `search-index.json` | 검색어 입력 시 관련 포스트 노출 |
| FR-06 | `lib/posts.ts` (reading-time) | 포스트 상단에 "N분 읽기" 표시 |
| FR-07 | `components/toc.tsx` | 스크롤 시 현재 섹션 하이라이트 동작 |
| FR-08 | `components/lightbox.tsx` | 이미지 클릭 시 확대 모달 표시 |
| FR-09 | `components/post-card.tsx` 또는 상세 페이지 내 네비게이션 | 이전/다음 글 링크 정상 이동 |
| FR-10 | `components/giscus.tsx` | 댓글 위젯 정상 로드 및 작성 가능 |
| FR-11 | `app/about/page.tsx` | About 페이지 접근 가능 |
| FR-12 | `components/navbar.tsx` | GitHub/이메일 링크 클릭 가능 |
| FR-13 | `app/sitemap.ts`, `robots.txt`, `generateMetadata` | Lighthouse SEO 95점 이상 |
| FR-14 | `components/analytics.tsx` (또는 layout 스크립트) | GA4 측정이 배포 환경에서 수집됨 |
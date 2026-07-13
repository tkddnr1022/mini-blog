# Mini Blog

Obsidian으로 작성한 마크다운을 정적 빌드로 발행하는 개인 기술 블로그입니다.

## 로컬 실행

```bash
pnpm install
pnpm prebuild:mermaid
pnpm dev
```

개발 서버: [http://localhost:3000](http://localhost:3000)

## 빌드

```bash
pnpm install
pnpm prebuild:mermaid
pnpm build
```

정적 산출물은 `out/` 디렉터리에 생성됩니다.

## 포스트 발행

1. Obsidian에서 포스트 작성
2. 완성된 폴더를 `content/posts/{slug}/`에 추가
3. `git push`로 배포 트리거

### 콘텐츠 규약

```
content/posts/{slug}/
├── index.md      # frontmatter + 본문
└── images/       # 썸네일·본문 이미지 (선택)
```

**필수 frontmatter:** `title`, `date`, `category`  
**선택 frontmatter:** `tags`, `description`, `thumbnail` (`./images/...` 상대 경로)  
`tags`는 데이터 보관만 하며 UI 태그 필터는 제공하지 않습니다.  
`readingTime`은 빌드 시 자동 계산됩니다.

빌드 전 `prebuild` 단계에서 `content/posts/**/images`가 `public/posts/{slug}/images`로 복사되어 정적 export에서도 이미지가 서빙됩니다.

### 이미지 가이드

콘텐츠 이미지는 리포지토리에 포함하며, 아래 권장 사항을 따르면 로딩·가독성·Lighthouse 점수에 유리합니다.

| 항목 | 권장 |
|------|------|
| 저장 경로 | `content/posts/{slug}/images/` (frontmatter `thumbnail`은 `./images/...` 상대 경로) |
| 본문 이미지 너비 | 최대 1600px (블로그 본문 최대 폭 65ch 기준으로 충분) |
| 썸네일 비율 | 16:9 권장 (`aspect-[16/9]`로 표시) |
| 포맷 | WebP 또는 JPEG (PNG는 스크린샷·투명 배경에만) |
| 파일 크기 | 본문 이미지 500KB 이하, 썸네일 200KB 이하 목표 |
| alt 텍스트 | 마크다운 `![설명](...)`에 의미 있는 설명 작성 (장식용은 빈 alt 허용) |

대용량 원본은 업로드 전 리사이즈·압축한 뒤 커밋하세요.

## GitHub Pages 배포

- Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**
- `master` 브랜치 push 시 `.github/workflows/deploy.yml`이 빌드 후 배포합니다.
- 커스텀 도메인 설정은 M7에서 확정합니다.

## 사이트 설정

사이트 이름, 설명, URL, 작성자, GitHub·이메일 링크 등은 `src/lib/config.ts`의 `site` 객체에서 직접 수정합니다.

## 환경 변수

giscus·GA4만 환경 변수로 설정합니다. `.env.example`을 복사해 `.env.local`을 만든 뒤 값을 채웁니다.

```bash
cp .env.example .env.local
```

| 변수 | 용도 |
|------|------|
| `NEXT_PUBLIC_GISCUS_*` | 포스트 댓글 (giscus) |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 측정 ID |

### giscus 설정 (댓글)

1. GitHub 저장소 **Settings → General → Features**에서 **Discussions** 활성화
2. [giscus.app](https://giscus.app)에서 저장소 연결 후 `repo`, `repoId`, `category`, `categoryId` 복사
3. `.env.local`(로컬) 또는 GitHub Actions **Secrets**에 `NEXT_PUBLIC_GISCUS_*` 주입
4. 배포 후 포스트 하단에서 댓글 위젯 로드·작성 확인

### GA4 설정 (애널리틱스)

1. [Google Analytics](https://analytics.google.com/)에서 GA4 속성 생성
2. **관리 → 데이터 스트림**에서 측정 ID(`G-XXXXXXXXXX`) 복사
3. `.env.local` 또는 Actions Secrets에 `NEXT_PUBLIC_GA_ID` 설정
4. 배포 후 GA4 **실시간** 보고서에서 방문 이벤트 확인

미설정 시 giscus·GA4는 렌더되지 않으며 빌드는 정상 동작합니다.

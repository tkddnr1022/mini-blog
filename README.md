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

## GitHub Pages 배포

- Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**
- `master` 브랜치 push 시 `.github/workflows/deploy.yml`이 빌드 후 배포합니다.
- 커스텀 도메인 설정은 M7에서 확정합니다.

## 환경 변수

`.env.example`을 참고해 `.env.local`을 생성하세요. (giscus, GA4 등은 후속 마일스톤에서 사용)

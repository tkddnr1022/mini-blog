# Mini Blog

Obsidian으로 작성한 마크다운을 정적 빌드로 발행하는 개인 기술 블로그입니다.

## 로컬 실행

```bash
pnpm install
pnpm dev
```

개발 서버: [http://localhost:3000](http://localhost:3000)

## 빌드

```bash
pnpm build
```

정적 산출물은 `out/` 디렉터리에 생성됩니다.

## 포스트 발행

1. Obsidian에서 포스트 작성
2. 완성된 폴더를 `content/posts/{slug}/`에 추가 (`index.md` + `images/`)
3. `git push`로 배포 트리거

## GitHub Pages 배포

- Repository **Settings → Pages → Build and deployment → Source: GitHub Actions**
- `master` 브랜치 push 시 `.github/workflows/deploy.yml`이 빌드 후 배포합니다.
- 커스텀 도메인 설정은 M7에서 확정합니다.

## 환경 변수

`.env.example`을 참고해 `.env.local`을 생성하세요. (giscus, GA4 등은 후속 마일스톤에서 사용)

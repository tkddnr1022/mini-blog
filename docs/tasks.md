# 개인 기술 블로그 — Task Breakdown

- 기준 문서: [prd.md](./prd.md) v1.1
- 작성일: 2026-07-13
- 상태: Ready

체크박스(`- [ ]`)를 작업 완료 시 `- [x]`로 갱신한다. 각 task의 **완료 기준**을 충족해야 완료로 본다.

---

## 진행 규칙

1. 마일스톤 순서(M1 → M7)를 기본으로 하되, 의존성이 없는 task는 병렬 진행 가능
2. task ID는 `T-{마일스톤}-{순번}` 형식
3. 관련 요구사항 ID(FR/DR/OR)를 반드시 명시
4. 샘플 포스트 1편은 M2 이후 파이프라인 검증용으로 유지

### Decisions (구 Open Questions)

| ID | 결정 | 작업 반영 |
|---|---|---|
| OQ-1 | 커스텀 도메인 사용 | `basePath`/`assetPrefix` 미설정(루트). DNS/`CNAME`은 T-M7-02 |
| OQ-2 | 검색 인덱스에 제목·요약·본문 전체 포함 | T-M4-01 필드에 `title`, `description`, `content`(본문) 포함 |
| OQ-3 | 태그 필터링 미제공 | UI는 카테고리만. `tags`는 frontmatter 보관만 (T-M2-01) |
| OQ-4 | GA4 애널리틱스 사용 | T-M5-07에서 GA4 스크립트 삽입 |

---

## M1. 프로젝트 셋업

예상: 2~3일 | 의존: 없음

### T-M1-01. Next.js 프로젝트 초기화

- [x] `create-next-app`으로 App Router + TypeScript + Tailwind + `/src` 경로 사용하는 프로젝트 생성
- [x] `output: 'export'` 및 `images.unoptimized: true` 설정 (`next.config`)
- [x] 커스텀 도메인(OQ-1) 기준으로 `basePath`/`assetPrefix` 미설정(루트 배포)
- **관련:** FR-01
- **완료 기준:** `next build`가 `out/` 정적 산출물을 생성한다

### T-M1-02. 폴더 구조 및 경로 alias 정리

- [x] PRD §8 기준으로 `content/posts/`, `src/app/`, `src/components/`, `src/lib/`, `scripts/` 디렉터리 생성
- [x] `@/` path alias 동작 확인
- **관련:** 유지보수성(NFR)
- **완료 기준:** 빈 스켈레톤 라우트(`page.tsx`)가 빌드에 포함된다

### T-M1-03. shadcn/ui + Tailwind 기반 스타일 토큰

- [x] shadcn/ui 초기화 및 기본 컴포넌트(Button, Input 등) 설치
- [x] 흑백(그레이스케일) CSS 변수 / 테마 토큰 정의 (DR-04)
- **관련:** DR-01, DR-04
- **완료 기준:** 샘플 페이지에서 shadcn Button이 그레이스케일 테마로 렌더된다

### T-M1-04. GitHub Actions 배포 스켈레톤

- [x] `.github/workflows/deploy.yml` 작성 (checkout → install → build → Pages upload)
- [x] GitHub Pages 소스: GitHub Actions 로 설정 가이드를 README에 1줄 메모
- **관련:** FR-01, OR-03
- **완료 기준:** workflow 파일이 존재하고, 수동/푸시 트리거로 dry-run 빌드 단계까지 통과한다 (Pages 실제 배포는 M7에서 확정)

### T-M1-05. 환경·문서 기초

- [x] `.gitignore`, `README.md`(로컬 실행/발행 방법 초안), 샘플 `.env.example`(필요 시 giscus 등)
- **관련:** OR-01, OR-02
- **완료 기준:** `pnpm/npm/yarn install && npm run build` 로컬 절차가 README에 적혀 있다

---

## M2. 마크다운 파이프라인

예상: 3~4일 | 의존: M1

### T-M2-01. Frontmatter 파싱 및 Post 타입 정의

- [x] `gray-matter`로 frontmatter 파싱
- [x] Post 타입: `title`, `date`, `category`(필수), `tags`, `description`, `thumbnail`(선택), `slug`, `readingTime`(계산값)
- [x] `tags`는 데이터 보관만 — UI 태그 필터/페이지는 만들지 않음 (OQ-3)
- [x] `content/posts/{slug}/index.md` 규약 문서화
- **관련:** FR-04, FR-06, PRD §7
- **완료 기준:** 샘플 포스트 1편의 frontmatter가 타입 안전하게 파싱된다

### T-M2-02. 포스트 로더 (`lib/posts.ts`)

- [x] 전체 포스트 목록 조회 (date 내림차순)
- [x] slug로 단건 조회
- [x] 카테고리별 그룹핑 헬퍼
- [x] `reading-time`으로 읽는 시간 계산 후 메타에 포함
- **관련:** FR-04, FR-06, FR-09
- **완료 기준:** 로컬에서 포스트 목록/단건/카테고리 헬퍼가 올바른 데이터를 반환한다

### T-M2-03. remark/rehype 플러그인 체인

- [x] 기본 MD → HTML 파이프라인 구성 (`mdx-plugins.ts` 또는 동등 모듈)
- [x] GFM(테이블, 체크리스트 등) 지원
- **관련:** FR-02
- **완료 기준:** 표준 마크다운이 HTML로 렌더된다

### T-M2-04. Obsidian 호환 — 위키링크

- [x] `[[slug]]`, `[[slug|표시명]]` → 내부 포스트 링크로 변환
- [x] 존재하지 않는 slug는 깨진 링크 스타일 또는 plain text 처리 정책 적용
- **관련:** FR-02
- **완료 기준:** 샘플 포스트의 위키링크가 올바른 `<a>`로 렌더된다

### T-M2-05. Obsidian 호환 — 콜아웃

- [x] `> [!note]`, `> [!warning]` 등 콜아웃을 스타일된 HTML 블록으로 변환
- **관련:** FR-02
- **완료 기준:** note/warning 콜아웃이 시각적으로 구분되어 표시된다

### T-M2-06. Mermaid 빌드타임 SVG 렌더링

- [x] `remark-mermaidjs`(또는 동등)로 mermaid 코드블록 → SVG
- [x] CI/로컬에서 Puppeteer 의존성 설치 확인
- **관련:** FR-03, OR-03
- **완료 기준:** mermaid 포함 샘플 포스트 빌드 결과물에 SVG가 포함된다

### T-M2-07. 로컬 이미지 경로 처리

- [x] 포스트 폴더 내 `images/` 상대 경로가 정적 export 후에도 깨지지 않도록 처리
- **관련:** FR-08
- **완료 기준:** 샘플 썸네일/본문 이미지가 빌드 산출물에서 정상 로드된다

### T-M2-08. 파이프라인 검증용 샘플 포스트

- [x] frontmatter·위키링크·콜아웃·mermaid·이미지·헤딩 구조를 모두 포함한 샘플 1편 추가
- **관련:** FR-02, FR-03, FR-08
- **완료 기준:** 샘플만으로 M2 DoD를 수동 검증할 수 있다

---

## M3. 목록·상세·카테고리·TOC·라이트박스

예상: 4~5일 | 의존: M2

### T-M3-01. 공통 레이아웃 + Navbar 골격

- [x] `app/layout.tsx`에 공통 헤더/푸터 슬롯
- [x] Navbar: 홈, 카테고리(또는 목록), 검색, About 링크
- [x] 외부 링크(GitHub, 이메일) 자리 확보 (실데이터는 M5)
- **관련:** FR-12, DR-05, DR-06
- **완료 기준:** 모든 라우트에서 Navbar가 렌더된다

### T-M3-02. PostCard 컴포넌트

- [x] 제목, 날짜, 카테고리, 읽는 시간, description, thumbnail 표시
- [x] 포스트 상세로 링크
- **관련:** FR-06, DR-01
- **완료 기준:** 카드 클릭 시 `/posts/[slug]`로 이동한다

### T-M3-03. 홈 — 최신 포스트 목록

- [x] `/`에서 date 기준 최신순 목록 렌더
- [x] 빈 상태(포스트 0개) UI
- **관련:** PRD §6, §9.2
- **완료 기준:** 샘플 포스트가 홈에 노출된다

### T-M3-04. 포스트 상세 페이지

- [x] `/posts/[slug]` SSG (`generateStaticParams`)
- [x] 제목, 날짜, 카테고리, 읽는 시간, 본문 HTML 렌더
- [x] 존재하지 않는 slug는 빌드에서 제외(정적 export 특성 준수)
- **관련:** FR-06, PRD §6
- **완료 기준:** 샘플 포스트 상세가 정적 HTML로 생성된다

### T-M3-05. 카테고리 목록 페이지

- [x] `/category/[category]` SSG
- [x] 해당 카테고리 포스트만 PostCard로 나열
- [x] 홈/상세에서 카테고리 클릭 시 이동
- **관련:** FR-04
- **완료 기준:** 카테고리 URL로 필터된 목록이 표시된다

### T-M3-06. 이전/다음 글 네비게이션

- [x] date 정렬 기준 인접 포스트 링크를 상세 하단에 표시
- [x] 첫/마지막 글은 한쪽만 표시
- **관련:** FR-09
- **완료 기준:** 인접 포스트로 이동이 가능하다 (샘플 2편 이상 필요 시 추가)

### T-M3-07. TOC (스크롤 목차)

- [x] 헤딩(h2/h3) 기반 목차 생성
- [x] 앵커 클릭 시 해당 섹션으로 스크롤
- [x] Intersection Observer(또는 동등)로 현재 섹션 하이라이트
- [x] 데스크톱: 사이드, 모바일: 접이식/상단 등 반응형 배치
- **관련:** FR-07, DR-05
- **완료 기준:** 스크롤 시 현재 섹션이 하이라이트된다

### T-M3-08. 이미지 라이트박스

- [x] `yet-another-react-lightbox` 연동
- [x] 본문 이미지 클릭 시 확대, Esc/오버레이로 닫기
- [x] 키보드 접근 가능
- **관련:** FR-08, NFR 접근성
- **완료 기준:** 이미지 클릭 시 확대 모달이 열린다

---

## M4. 정적 검색

예상: 2일 | 의존: M2 (인덱스), M3 (UI 골격)

### T-M4-01. 검색 인덱스 빌드 스크립트

- [x] `scripts/build-search-index.ts` 작성
- [x] MiniSearch(또는 Lunr)용 JSON을 `public/search-index.json`에 출력
- [x] 필드: `title`, `description`, `content`(본문 전체), `category`, `slug` (OQ-2)
- [x] `package.json`에 `prebuild` 또는 CI 스텝으로 연결
- **관련:** FR-05, OR-03
- **완료 기준:** 빌드 전/중 인덱스가 생성되고 제목·요약·본문으로 검색 가능한 데이터가 포함된다

### T-M4-02. 검색 페이지 UI

- [x] `/search` 페이지: 입력창 + 결과 목록
- [x] 클라이언트에서 인덱스 fetch → MiniSearch 쿼리
- [x] 입력 후 체감 100ms 이내 결과 갱신(로컬 인덱스 기준)
- [x] 결과 클릭 시 포스트 이동, 결과 없음 상태
- **관련:** FR-05, PRD §9.3
- **완료 기준:** 키워드 입력 시 관련 포스트가 노출된다

### T-M4-03. Navbar 검색 진입점

- [x] 상단바 검색 아이콘/링크로 `/search` 이동 (또는 인라인 검색 — v1은 페이지 이동으로 충분)
- **관련:** FR-05, DR-06
- **완료 기준:** Navbar에서 검색 페이지로 진입 가능하다

---

## M5. About · 외부 링크 · giscus · SEO · GA4

예상: 2일 | 의존: M3

### T-M5-01. About 페이지

- [x] `/about` — 소개, 약력, 연락처
- [x] 콘텐츠는 마크다운 또는 정적 TSX 중 하나 선택해 구현
- **관련:** FR-11
- **완료 기준:** About 페이지가 접근·렌더된다

### T-M5-02. 외부 링크 노출

- [x] Navbar 및/또는 About에 GitHub 프로필, 이메일 `mailto:` 링크
- [x] 설정값(URL/이메일)을 상수 또는 환경변수로 분리
- **관련:** FR-12
- **완료 기준:** GitHub/이메일 링크가 클릭 가능하다

### T-M5-03. giscus 댓글

- [x] GitHub Discussions + giscus 앱 설정 (저장소 측 수동 설정 체크리스트 포함)
- [x] `components/giscus.tsx`를 포스트 상세 하단에 삽입
- [x] 테마가 라이트/다크 모드와 동기화되도록 준비(다크모드는 M6과 연동)
- **관련:** FR-10
- **완료 기준:** 배포(또는 로컬 preview)에서 댓글 위젯이 로드되고 작성 가능하다

### T-M5-04. SEO — 페이지 메타데이터

- [x] `generateMetadata`: title, description, canonical
- [x] OG/Twitter 카드 태그 (포스트별 thumbnail 우선)
- **관련:** FR-13
- **완료 기준:** 포스트별 `<meta>` / OG 태그가 HTML에 존재한다

### T-M5-05. SEO — sitemap · robots · JSON-LD

- [x] `sitemap.xml` 생성 (정적 export 호환 방식)
- [x] `robots.txt` 추가
- [x] 포스트 상세에 JSON-LD `BlogPosting` 삽입
- **관련:** FR-13
- **완료 기준:** sitemap/robots가 산출물에 포함되고, JSON-LD가 유효하다

### T-M5-06. OG 이미지 전략

- [x] thumbnail 있으면 사용, 없으면 기본 OG 이미지(`public/og/`) fallback
- **관련:** FR-13
- **완료 기준:** OG 이미지 URL이 깨지지 않는다 (커스텀 도메인 절대 URL 기준)

### T-M5-07. GA4 애널리틱스

- [x] GA4 측정 ID를 환경변수(또는 설정 상수)로 분리
- [x] 공통 레이아웃에 GA4 스크립트 삽입 (정적 export 호환)
- [x] `.env.example` / README에 측정 ID 설정 방법 안내
- **관련:** FR-14, OQ-4
- **완료 기준:** 배포 환경에서 GA4 실시간/이벤트 수집이 확인된다

---

## M6. 디자인 다듬기

예상: 3~4일 | 의존: M3~M5 UI 존재

### T-M6-01. 라이트/다크 모드

- [ ] 시스템 설정 감지 + 수동 토글
- [ ] FOUC 방지 (`class` 전략 + 인라인 스크립트 또는 next-themes)
- [ ] giscus 테마 동기화
- **관련:** DR-03, FR-10
- **완료 기준:** 토글/시스템 전환 시 깜빡임 없이 테마가 적용된다

### T-M6-02. 반응형 레이아웃 점검

- [ ] 모바일/태블릿/데스크톱에서 홈, 상세(TOC), 검색, About 레이아웃 확인·수정
- [ ] 터치 타깃·가독성(본문 줄간격) 조정
- **관련:** DR-05
- **완료 기준:** 주요 뷰포트에서 레이아웃이 깨지지 않는다

### T-M6-03. 스크롤 반응형 Navbar

- [ ] 스크롤 시 축소/블러 등 동적 변화 (절제된 범위)
- **관련:** DR-06
- **완료 기준:** 스크롤에 따라 Navbar 시각 상태가 변한다

### T-M6-04. Framer Motion 인터랙션

- [ ] 페이지/목록 전환, 카드 hover 등 2~3곳 절제된 모션 적용
- [ ] `prefers-reduced-motion` 존중
- **관련:** DR-02
- **완료 기준:** 핵심 화면에 의도된 전환이 있고, 모션 감소 설정 시 과하지 않다

### T-M6-05. 접근성 패스

- [ ] 시맨틱 헤딩/랜드마크, 키보드 포커스, 명도 대비 WCAG AA
- [ ] 라이트박스·토글·검색 입력 포커스 트랩/복귀 점검
- **관련:** NFR 접근성
- **완료 기준:** 키보드만으로 주요 플로우(목록→상세→검색)가 가능하다

### T-M6-06. 성능·이미지 점검

- [ ] 불필요한 클라이언트 JS 최소화
- [ ] 콘텐츠 이미지 해상도/포맷 가이드를 README에 한 절 추가
- [ ] Lighthouse Performance 목표(90+) 로컬 측정
- **관련:** NFR 성능, 성공 지표
- **완료 기준:** 대표 페이지 Lighthouse Performance ≥ 90 (로컬 기준 기록)

---

## M7. 배포 파이프라인 확정

예상: 1~2일 | 의존: M1~M6 기능 완료

### T-M7-01. CI 파이프라인 완성

- [ ] Actions: 의존성 설치 → 검색 인덱스 생성 → (mermaid 포함) 빌드 → Pages 배포
- [ ] Node/캐시 설정으로 빌드 시간 완화
- **관련:** FR-01, OR-03
- **완료 기준:** `main`(또는 배포 브랜치) push 후 5분 이내 배포 완료

### T-M7-02. 커스텀 도메인 확정

- [ ] OQ-1 반영: `basePath` 미사용, 내부 링크·자산·sitemap/OG를 커스텀 도메인 절대 URL 기준으로 정리
- [ ] DNS/`CNAME` 절차 및 GitHub Pages 커스텀 도메인 설정 문서화
- **관련:** FR-01, FR-13, 리스크 커스텀 도메인
- **완료 기준:** 커스텀 도메인에서 CSS/JS/이미지/내부 링크가 모두 정상이다

### T-M7-03. 발행 워크플로우 E2E 검증

- [ ] Obsidian → `content/posts/` 복사 → push → 배포 → URL 확인 시나리오 수행
- [ ] README에 운영자 체크리스트(frontmatter 필수 필드, 이미지 경로) 정리
- **관련:** OR-01, OR-02, OR-03, 성공 지표(10분 이내 발행)
- **완료 기준:** 신규 샘플 포스트가 업로드~배포까지 10분 이내에 공개된다

### T-M7-04. 최종 품질 게이트

- [ ] Lighthouse: Performance ≥ 90, SEO ≥ 95
- [ ] FR-01~FR-14 / DR-01~DR-06 수동 스모크 체크
- [ ] giscus 실작성 1회, 검색·TOC·라이트박스·다크모드·GA4 스모크
- **관련:** 성공 지표, PRD §13
- **완료 기준:** 아래 추적 매트릭스의 DoD가 모두 충족된다

---

## 요구사항 → Task 추적 매트릭스

| 요구사항 | Task IDs | DoD 요약 |
|---|---|---|
| FR-01 | T-M1-01, T-M1-04, T-M7-01, T-M7-02 | push 후 Pages 배포 |
| FR-02 | T-M2-03, T-M2-04, T-M2-05, T-M2-08 | 위키링크/콜아웃 렌더 |
| FR-03 | T-M2-06, T-M2-08 | mermaid → SVG |
| FR-04 | T-M2-01, T-M2-02, T-M3-05 | 카테고리 목록 SSG |
| FR-05 | T-M4-01, T-M4-02, T-M4-03 | 정적 검색 동작 |
| FR-06 | T-M2-02, T-M3-02, T-M3-04 | "N분 읽기" 표시 |
| FR-07 | T-M3-07 | TOC 하이라이트 |
| FR-08 | T-M2-07, T-M3-08 | 라이트박스 |
| FR-09 | T-M3-06 | 이전/다음 글 |
| FR-10 | T-M5-03, T-M6-01 | giscus 로드·작성 |
| FR-11 | T-M5-01 | About 접근 |
| FR-12 | T-M3-01, T-M5-02 | GitHub/이메일 링크 |
| FR-13 | T-M5-04, T-M5-05, T-M5-06, T-M7-02 | 메타/sitemap/OG/JSON-LD |
| FR-14 | T-M5-07 | GA4 수집 확인 |
| DR-01 | T-M1-03, T-M3-02 | shadcn 사용 |
| DR-02 | T-M6-04 | Framer Motion |
| DR-03 | T-M6-01 | 다크모드 FOUC 없음 |
| DR-04 | T-M1-03 | 그레이스케일 팔레트 |
| DR-05 | T-M3-07, T-M6-02 | 반응형 |
| DR-06 | T-M3-01, T-M4-03, T-M6-03 | 동적 Navbar |
| OR-01 | T-M1-05, T-M7-03 | Obsidian 작성 흐름 |
| OR-02 | T-M1-05, T-M7-03 | content 폴더 push |
| OR-03 | T-M1-04, T-M4-01, T-M7-01, T-M7-03 | Actions 자동 배포 |

---

## 권장 실행 순서 (요약)

```text
M1 셋업
 → M2 마크다운 파이프라인 (+ 샘플 포스트)
 → M3 페이지/컴포넌트 (목록·상세·카테고리·TOC·라이트박스)
 → M4 검색 ∥ M5 About/giscus/SEO/GA4   (병렬 가능)
 → M6 디자인·접근성·성능
 → M7 배포 확정·E2E·Lighthouse 게이트
```

---

## 완료 정의 (프로젝트 DoD)

- [ ] FR-01~FR-14, DR-01~DR-06, OR-01~OR-03 모두 충족
- [ ] push 후 5분 이내 GitHub Pages 배포
- [ ] 검색 입력 후 체감 100ms 이내 결과
- [ ] Lighthouse Performance ≥ 90, SEO ≥ 95
- [ ] Obsidian 작성 → 업로드 → 배포 ≤ 10분
- [ ] Decisions(OQ-1~4) 반영 완료 (커스텀 도메인, 본문 검색, 카테고리만, GA4)

---
title: "Nest.js + Prisma ORM ESM 에러 해결하기"
date: 2026-01-22
category: "Backend"
description: "Nest.js와 Prisma ORM을 함께 사용할 때 발생할 수 있는 ESM 에러에 대하여 다룹니다."
---

## 개요

본 글에서는 **2026년 1월 22일 기준** 최신 버전인 Nest 11과 Prisma ORM v7을 함께 사용할 때 발생하는 런타임 에러에 대하여 다룹니다.

편의상 **commonJS**를 **CJS**, **ES Module**을 **ESM**으로 축약하여 부르겠습니다.

---

## 요약

1. Nest.js는 기본적으로 **CJS** 런타임을 전제로 작성되었다.
2. 어떠한 이유에서 인지 `tsconfig.json`에는 **nodenext**를 기본값으로 사용한다.
3. `prisma generate` 수행 시점에서 `client.ts`에 **ESM** 대응 코드가 삽입된다.
4. `nest build` 수행 시점에서 `client.ts`는 **CJS**로 컴파일되지만, **ESM** 대응 코드도 그대로 삽입된다.
5. 빌드 결과물 `client.js`에는 **CJS** 코드와 **ESM** 코드가 혼용되어 있어 런타임에서 에러가 발생한다.
6. `schema.prisma`에 **CJS** 포맷을 명시하면 문제가 해결된다.

---

## 문제 상황

`nest-cli`로 생성되는 최신 버전의 Nest.js 프로젝트와 Prisma ORM v7이 런타임에서 충돌을 일으킵니다.

![](https://velog.velcdn.com/images/tkddnr1022/post/e87490c6-4baa-4b58-aae7-069c74da175b/image.png)

### 오류 해석

```
exports is not defined in ES module scope
```

Node 런타임이 `client.js`를 ESM으로 감지하고 로드하였으나, 실제 코드에는 ESM에서 지원하지 않는 문법이 사용되었음을 의미합니다.

`client.js`에서 오류가 발생하는 라인을 확인해보면 아래와 같은 코드가 있습니다.

![](https://velog.velcdn.com/images/tkddnr1022/post/fc4fd4bb-cd01-4b9a-bae0-c005a6f9d7fa/image.png)

`exports.Prisma...` 문법은 CJS 문법입니다. 그러나 `import.meta...`는 ESM 문법입니다.

Node 런타임은 js 파일을 실행할 때 CJS와 ESM 중 어느 런타임을 사용할 지 판단해야 합니다. 하나의 파일을 여러 런타임으로 동시에 실행할 수 없고, **CJS/ESM 코드를 혼용한 스크립트를 받아들일 수 없습니다.**

위 코드의 경우 Node 런타임이 `import.meta...` 구문을 읽고 이 파일을 ESM으로 간주하였기 때문에, ESM 런타임에서 `exports.Prisma...` 라는 CJS 문법을 마주치게 되어 에러를 발생시키게 됩니다.

---

## 문제 원인

Nest.js나 Prisma 어느 한 쪽의 버그라기 보다는, 두 패키지의 설계 의도가 충돌하는 문제입니다.

### Nest.js의 기본 설정

먼저 Nest.js의 기본 설정과 **nodenext** 컴파일 모듈을 이해해야 합니다.

`nest-cli`로 생성한 Nest.js 프로젝트는 기본적으로 CJS 런타임을 전제하도록 설정되어 있습니다. 이는 공식 문서에 언급되지는 않지만, ESM 라이브러리와 호환이 좋지 않은 것이 커뮤니티에서의 정설입니다.

> The NestJS CLI creates apps assuming CommonJS, so pure ESM libraries won't work out of the box.
[nest-cli #2851](https://github.com/nestjs/nest-cli/issues/2851)

그러나 `tsconfig.json`에는 CJS/ESM을 유연하게 지원하는 nodenext 모듈을 사용하도록 기본값이 설정되어 있습니다.

![](https://velog.velcdn.com/images/tkddnr1022/post/ee6a22b5-7009-4026-8eed-f23f9b2988ca/image.png)

이는 Nest.js가 적어도 개발 환경 자체에서는 ESM을 지원한다는 의미로 해석됩니다.

다만, nodenext는 실제 컴파일 결과에서 CJS/ESM 런타임을 결정하는 데에 직접적인 영향을 행사하지 않습니다. 즉, **Nest.js의 기본 설정 하에서는 여전히 CJS 런타임을 사용하게 됩니다.**

### Prisma ORM v7의 ESM 지원

Prisma 팀은 2025년 3월 로드맵에서 `prisma-client`의 ESM 호환성을 언급하였습니다.

> We’re also improving the developer experience by making Prisma-generated code ESM-compatible.
[prisma #26592](https://github.com/prisma/prisma/issues/26592)

이후 릴리즈에서 실제로 `prisma-client`가 ESM 런타임을 지원하도록 구현되었고, **ESM-First** 전략을 내세웠습니다.

[공식 문서](https://www.prisma.io/docs/orm/prisma-schema/overview/generators#prisma-client)에는 `prisma-client`가 프로젝트 환경 설정을 참고하여 ESM 대응 코드(`import.meta.url`)를 사용한다는 내용이 추가되었습니다.

![](https://velog.velcdn.com/images/tkddnr1022/post/be90d9bd-8da8-4735-9ad2-bad19cab8e6d/image.png)

### `tsconfig.json` 설정

`nest-cli`는 `tsconfig.json`에 `"module": "nodenext"`를 설정하였습니다. 이후 `prisma-client`가 클라이언트 코드 생성 시 프로젝트 환경 설정으로 이 파일을 참고합니다.

nodenext 사용을 감지한 `prisma-client`는 프로젝트 런타임이 ESM일 것이라 판단하고, ESM에 존재하지 않는 `__dirname`을 대체하기 위해 `client.ts`에 `import.meta...`를 삽입합니다.

![](https://velog.velcdn.com/images/tkddnr1022/post/16f04328-43f1-4b05-a8e5-018ea5abc293/image.png)

그러나 실제 프로젝트 런타임은 CJS이고, 빌드 결과 `client.js`에는 CJS/ESM 코드가 혼재되어 실행 시 런타임 에러를 발생시키게 됩니다.

---

## 문제 해결

`prisma-client`가 프로젝트 환경을 ESM으로 자동 감지하는 행위를 막고, ESM 대응 코드를 삽입하지 않도록 `schema.prisma`에서 `moduleFormat`을 CJS로 명시하면 해결됩니다.

![](https://velog.velcdn.com/images/tkddnr1022/post/e66ca582-f0db-4b98-85d9-0e1e75775a21/image.png)

이제 `prisma-client`는 클라이언트 생성 시 ESM 대응 코드를 사용하지 않게 됩니다.

![](https://velog.velcdn.com/images/tkddnr1022/post/32c12c93-2239-429c-b16c-8e0fb48ff88a/image.png)

자연스럽게 빌드 결과물(`client.js`)에서도 런타임 에러를 발생시키는 `import.meta...` 코드가 사라지게 됩니다.

![](https://velog.velcdn.com/images/tkddnr1022/post/e2b87efa-5cc5-4969-8950-2756e19559cb/image.png)

---

## 맺음말

공식 문서의 관련 내용이나 커뮤니티의 유사 사례를 쉽게 찾아볼 수 없어 많이 헤맸는데, 글을 쓰며 자료를 정리하는 과정에서 [Nest.js 공식 문서](https://docs.nestjs.com/recipes/prisma#configure-the-module-format)에 정확하게 언급되어 있었다는 것을 뒤늦게 발견하였습니다.

![](https://velog.velcdn.com/images/tkddnr1022/post/5e9dca23-57ed-4399-b57c-cff2a5ec6798/image.png)

이걸 왜 못봤나 자책하면서도 다음부터는 더 꼼꼼히 읽어야지 다짐하게 되는 날이었습니다..

---

## 참고 자료

[Nest.js Prisma Recipe](https://docs.nestjs.com/recipes/prisma#configure-the-module-format)
[NestJs: Cannot find module 'generated/prisma' or its corresponding type declarations](https://docs.nestjs.com/recipes/prisma#configure-the-module-format)
[nest-cli #2851](https://github.com/nestjs/nest-cli/issues/2851)
[Prisma Client Generator](https://www.prisma.io/docs/orm/prisma-schema/overview/generators#prisma-client)
[prisma #26592](https://github.com/prisma/prisma/issues/26592)
[prisma #28627](https://github.com/prisma/prisma/issues/28627)
[prisma #28866](https://github.com/prisma/prisma/discussions/28866)

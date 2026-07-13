---
title: "JavaScript Date 객체와 Timezone"
date: 2025-11-21
category: "Frontend"
description: "로컬(KST)과 서버(UTC)의 타임존 차이로 발생한 날짜 계산 문제를 분석하였습니다."
---

## 개요

사내 프로젝트에서 출석체크 기능을 구현하며 타임존에 대해 고민했던 경험을 기록하려고 합니다.
출석체크 API에 필요한 기능과 실행 환경의 타임존에 따른 동작 차이를 고려하였습니다.

어떻게 보면 당연한 내용들일 수 있지만, 훗날 같은 문제로 헤매지 않기 위해 해결 과정을 정리하였습니다.

---

## 개념 정리

문제 상황에 앞서 등장하는 개념을 정확히 짚고 넘어가보겠습니다.

### Timezone과 UTC

#### Timezone

Timezone은 특정 국가나 지역에서 사용하는 현지 시간입니다. 같은 국가라도 지역에 따라 다른 타임존을 사용할 수 있습니다.

#### UTC

UTC는 전 세계에서 기준으로 사용하는 표준 시간입니다.
모든 지역의 시간대(Timezone)는 UTC를 기준으로 오프셋(offset)을 더하거나 빼서 계산합니다.

예를 들어 한국 기준 시간(KST, UTC+9) **2025년 11월 16일 오전 5시**는 협정 세계시 기준으로 **2025년 11월 15일 오후 8시**입니다.

### `Date` 객체

JavaScript의 `Date` 객체는 내부적으로는 항상 UTC 타임스탬프를 저장하지만,
이를 표현하거나 가져오는 방식은 두 가지 API로 나뉩니다.

#### 로컬 타임존을 사용하는 메소드

서버 또는 브라우저가 실행되는 환경의 로컬 타임존을 기준으로
연, 월, 일, 시, 분을 계산합니다.

- `getFullYear()`
- `getMonth()`
- `getDate()`
- `getHours()`
- `toString()`

#### UTC 메소드

로컬 타임존과 무관하게 항상 UTC 기준으로 날짜와 시간을 계산합니다.

- `getUTCFullYear()`
- `getUTCMonth()`
- `getUTCDate()`
- `getUTCHours()`
- `toISOString()`

---

## 문제 상황

비즈니스 요구사항에 따라, 한국 시간을 기준으로 출석을 처리하고 DB에 기록을 저장해야 합니다.
따라서 출석체크 테이블을 다음과 같은 속성으로 구성하였습니다.

- `id`: 유저 ID
- **`date`**: 출석 날짜 `YYYY-MM-DD` (KST)
- `streak`: 연속 출석 횟수

또한 다음과 같은 API를 클라이언트에게 제공하려고 합니다.

- 출석 생성 API
- 캘린더 조회 API

각 API는 대략적으로 다음과 같은 과정을 수행하게 됩니다.

**출석 생성 API**

1. 현재 `Date` 확인
2. **`Date`를 `YYYY-MM-DD`로 변환**
3. 변환한 날짜로 중복 검사
4. 출석 DB에 저장
5. 리워드 지급

> 예를 들어 한국 시간 2025년 11월 15일에 출석을 시도한다면, `2025-11-15`에 해당하는 출석 기록이 DB에 없어야 가능합니다.

**캘린더 조회 API**

1. 클라이언트가 요청한 `year`, `month` 확인
2. **해당 월의 시작, 끝 `YYYY-MM-DD`로 `Date` 생성**
3. 생성한 `Date` 구간을 조건으로 DB 조회
4. 출석 날짜를 배열로 응답

> 예를 들어 `2025-10-31`, `2025-11-01`, `2025-11-30`에 대한 출석 기록이 존재한다면, 2025년 11월에 대한 캘린더 요청 시 `[15, 30]`를 반환해야 합니다.

문제는 각 API의 2번 과정에서 발생합니다.

### 개발 및 배포 환경

저희 팀은 서버와 DB를 모두 로컬 환경에 두고 개발 후 문제가 없으면 클라우드 환경(AWS EC2, RDS)에 배포합니다. 이 때 로컬 PC의 타임존은 `Asia/Seoul(KST, UTC+9)` 이고, 클라우드의 타임존은 `Etc/UTC(UTC, UTC+0)` 입니다.

따라서 서버와 DB는 실행 환경에 따라 다른 타임존을 사용합니다.

### 연월일 다루기

`Date` 객체가 가지고 있는 시간 값은 절대적(UNIX Timestamp)이며, 어느 타임존에서나 같은 값을 가집니다. 그러나 이 시간을 사람이 보는 형태(연, 월, 일 등)로 계산할 때에는 타임존이 적용됩니다.

출석 생성 API는 `Date`로 `YYYY-MM-DD`를 구해야 하고, 캘린더 조회 API는 `YYYY-MM`으로 월의 시작 시간과 끝 시간 `Date`를 구해야 합니다.

#### `YYYY-MM-DD` 구하기

```javascript
const now = new Date();
const year = now.getFullYear();
const month = (now.getMonth() + 1).toString().padStart(2, 0);
const day = now.getDate().toString().padStart(2, 0);

console.log(`${year}-${month}-${day}`);
```

만약 한국 시간 기준으로 **2025년 11월 16일 오전 1시**에 이 코드를 실행한다면 결과는 다음과 같습니다.

- 로컬 PC(KST): `2025-11-16` 출력
- 클라우드(UTC): `2025-11-15` 출력

#### 월 시작 시간과 끝 시간 구하기

```javascript
const startOfMonth = new Date(year, month - 1, 1, 0, 0, 0, 0);
const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

console.log(startOfMonth, endOfMonth);
```

만약 요청한 연월이 **2025년 11월**이라면 실행 결과는 다음과 같습니다.

- 로컬 PC(KST): `2025-10-31T15:00:00.000Z 2025-11-30T14:59:59.999Z` 출력
- 클라우드(UTC): `2025-11-01T00:00:00.000Z 2025-11-30T23:59:59.999Z` 출력

#### 타임존에 따른 동작 차이

위와 같이 타임존에 따라 계산 결과가 다르기 때문에, 로컬 PC에서 잘 동작하던 출석체크 기능이 배포 후 클라우드 환경에서는 의도와 다르게 동작하게 됩니다.

---

## 문제 해결

모든 환경에서의 일관적인 날짜 계산을 위해 두 가지 해결 방법을 떠올렸습니다.

### A. 클라우드 타임존을 KST로 변경

복잡하게 생각하지 않고 모든 실행 환경의 타임존을 KST로 통일하는 근본적인 해결 방법입니다. 이 경우 EC2와 RDS에서 모두 설정해주어야 합니다.

**장점**

- 한국 시간으로 직관적인 디버깅 가능
- 코드 변경 필요 없음

**단점**

- 시스템 환경 설정에 의존적임
- 스케일 아웃과 같은 특정 상황에서 유지보수 문제 발생 가능

### B. UTC 메소드 사용

`Date` 객체가 제공하는 UTC 메소드를 사용하여 날짜 계산 시 타임존을 배제하는 방법입니다. 로컬 PC나 클라우드의 타임존과 무관하게 일관적으로 동작하게 됩니다.

**장점**

- 모든 날짜를 UTC로 표준화하여 유연하게 동작
- 어떠한 환경에서도 일관적으로 동작

**단점**

- KST 연월일 구하는 과정에서 정확한 계산과 검증 필요
- 항상 UTC 시간으로 계산하기 때문에 디버깅 불편함

### 의사결정

저희 팀은 **UTC 메소드를 사용하는 방법**을 선택하였습니다. 시스템 환경 설정이라는 변수가 유지보수를 분명히 불리하게 만들 것이라 판단하였고, UTC라는 표준을 준수함으로써 얻는 이점이 더 크기 때문에 애플리케이션 레벨에서 해결하게 되었습니다.

### 변경된 연월일 다루기

모든 날짜 생성 및 계산에 UTC 메소드를 사용합니다.

#### 변경된 `YYYY-MM-DD` 구하기

```javascript
const now = new Date();
const year = now.getUTCFullYear();
const month = (now.getUTCMonth() + 1).toString().padStart(2, 0);
const day = now.getUTCDate().toString().padStart(2, 0);

console.log(`${year}-${month}-${day}`);
```

만약 한국 시간 기준으로 **2025년 11월 16일 오전 1시**에 이 코드를 실행한다면 결과는 다음과 같습니다.

- 로컬 PC(KST): `2025-11-15` 출력
- 클라우드(UTC): `2025-11-15` 출력

#### 변경된 월 시작 시간과 끝 시간 구하기

```javascript
const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

console.log(startOfMonth, endOfMonth);
```

만약 요청한 연월이 **2025년 11월**이라면 실행 결과는 다음과 같습니다.

- 로컬 PC(KST): `2025-11-01T00:00:00.000Z 2025-11-30T23:59:59.999Z` 출력
- 클라우드(UTC): `2025-11-01T00:00:00.000Z 2025-11-30T23:59:59.999Z` 출력

#### 변경된 코드의 동작

이제 타임존에 관계 없이 일관적으로 날짜가 계산되므로, 날짜 계산에 한해서는 로컬 PC에서 출석 체크 기능이 잘 동작한다면 클라우드에서도 제대로 동작할 수 있도록 보장됩니다.

### 실제 구현

모든 날짜 계산에 UTC 시간을 사용하지만, 출석체크 DB의 `date` 컬럼은 여전히 KST 기준 연월일을 사용합니다.

ORM에서 MySQL의 `date` 타입, 즉 `YYYY-MM-DD` 와 자바스크립트의 `Date` 객체가 비교될 때에는 `Date`를 ISO 형식으로 변환 후 `YYYY-MM-DD`에 해당하는 부분만 비교하게 됩니다.

![](https://velog.velcdn.com/images/tkddnr1022/post/f0d99477-0f59-4515-93aa-42b83a502869/image.svg)

그런데 이 ISO 형식은 항상 UTC 기준이기 때문에, KST 기준으로 저장하는 `date` 컬럼과 정확한 비교를 하기 위해서는 UTC로 생성한 `Date` 객체에 **임의로 9시간을 더해주어야 합니다.**

![](https://velog.velcdn.com/images/tkddnr1022/post/5ce8bef6-a305-4185-9b22-2aaaef692f43/image.svg)


따라서 출석 생성 API의 실제 코드는 다음과 같이 작성됩니다.

```javascript
const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
const kstMidnight = new Date(Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate()));
```

캘린더 조회 API는 이미 KST 기준인 `YYYY-MM`을 받아 `Date`로 생성만 하기 때문에, 날짜 비교를 위해 필요한 ISO 문자열을 바로 얻을 수 있습니다. 따라서 별도의 9시간 보정은 필요하지 않습니다.

```javascript
const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
const endOfMonth = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

// prisma orm
await checkIn.findMany({
  where: {
    userId,
    date: {
      gte: startOfMonth,
      lte: endOfMonth,
    },
  },
});
```

---

## 정리

애플리케이션, DB 모두 날짜 계산에 UTC라는 표준 타임존을 사용함으로써 유지보수와 이식성을 확보하였습니다.

다만, 비즈니스 요구사항에 따라 출석 날짜 `date`는 여전히 KST를 기준으로 저장하기 때문에 데이터베이스의 관점에서 바라볼 때 이질감이 있을 수 있습니다.

그러나 DB에 저장된 `YYYY-MM-DD`는 타임존에 관계 없이 문자열처럼 취급되기 때문에 실제 계산에는 전혀 영향이 없다는 점에서 상쇄될 수 있습니다.

> 데이터베이스(MySQL) 관점에서 `date`는 단순한 날짜 라벨이지만, 비즈니스 관점에서는 KST 시간을 보장받아야 합니다. 이러한 간극을 애플리케이션에서 매꾸어주는 것입니다.

이제 애플리케이션 레벨에서 날짜를 출력할 때 복잡한 고민 없이 `UTC -> KST` 변환만 수행해준다면, 타임존 문제에서 벗어날 수 있게 되었습니다.

---

## 참고 자료

- [MDN Reference](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [NHN Cloud - 자바스크립트에서 타임존 다루기 (1)](https://meetup.nhncloud.com/posts/125)
- [NHN Cloud - 자바스크립트에서 타임존 다루기 (2)](https://meetup.nhncloud.com/posts/130)
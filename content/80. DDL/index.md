---
emoji: 👨🏻‍🏫
title: 80. DDL
date: '2024-01-22 00:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## DDL(Data Define Language, 데이터 정의어)의 개요

> - DDL(데이터 정의어)는 DB 구조, 데이터 형식, 접근 방식 등 DB를 구축하거나 수정 할 목적으로 사용하는 언어이다.

- DDL은 번역한 결과가 데이터 사전(Data Dictionary)이라는 특별한 파일에 여러 개의 테이블로서 저장된다.
- DDL에는 CREATE SCHEMA, CREATE DOMAIN, CREATE TABLE, CREATE VIEW, CREATE INDEX, ALTER TABLE, DROP 등이 있다.

## CREATE SCHEMA

> - CREATE SCHEMA는 스키마를 정의하는 명령문이다.

- 스키마의 식별을 위해 스키마 이름과 소유권자나 허가권자를 정의한다.
- 표기 형식

```
CREATE SCHEMA 스키마 AUTHORIZATION 사용자_id;
```

- 예제: 소유권자의 사용자 ID가 '홍길동'인 스키마 '대학교'를 정의하는 SQL문은 다음과 같다.

```
CREATE SCHEMA 대학교 AUTHORIZATION 홍길동;
```

## CREATE DOMAIN

> - CREATE DOMAIN은 도메인을 정의하는 명령문이다.

- 임의의 속성에서 취할 수 있는 값의 범위가 SQL에서 지원하는 전체 데이터 타입의 값이 아니고 일부분일 때, 사용자는 그 값의 범위를 도메인으로 정의할 수 있다.
- 정의된 도메인명은 일반적인 데이터 타입처럼 사용한다.
- 표기 형식

```
CREATE DOMAIN 도메인명 [AS] 데이터_타입
  [DEFAULT 기본값]
  [CONSTRAINT 제약조건명 CHECK (범위값)];
```

- 데이터 타입: SQL에서 지원하는 데이터 타입
- 기본값: 데이터를 입력하지 않았을 때 자동으로 입력되는 값
- 예제: '성별'을 '남' 또는 '여'와 같이 정해진 1개의 문자로 표현되는 도메인 SEX를 정의하는 SQL문은 다음과 같다.

```
CREATE DOMAIN SEX CHAR(1)
DEFAULT '남'
CONSTRAINT VALID-SEX CHECK(VALUE N(남','여'));
```

### SQL에서 지원하는 기본 데이터 타입

- 정수(Integer): INTEGER(4Byte 정수), SMALLINT(2Byte 정수)
- 실수(Float): FLOAT, REAL, DOUBLE, PRECISION
- 형식화된 숫자: DEC(i, j), 단 i: 전체 자릿수, j: 소수부 자릿수
- 고정길이 문자: CHAR(n), CHARACTER(n), 단 n: 문자수
- 가변길이 문자: VARCHAR(n), CHARACTER VARYNG(n), 단 n: 최대 문자수
- 고정길이 비트열(Bit String): BIT(n)
- 가변길이 비트열: VARBIT(n)
- 날짜: DATE
- 시간: TIME

## CREATE TABLE

> - CREATE TABLE은 테이블을 정의하는 명령문이다.

- 표기 형식

```
CREATE TABLE 테이블명
  (속성명 데이터_타입 [DEFAULT 기본값] [NOT NULL], ...
  [, PRIMARY KEY(기본키_속성명, ...)]
  [, UNIQUE(대체키_속성명, ...]
  [, FOREIGN KEY(외래키_속성명, ...]
    [REFERENCES 참조테이블(기본키_속성명, ...)]
    [ON DELETE 옵션]
    [ON UPDATE 옵션]
  [, CONSTRAINT 제약조건명] [CHECK (조건식)]);
```

- 기본 테이블에 포함될 모든 속성에 대하여 속성명과 그 속성의 데이터 타입, 기본 값, NOT NULL 여부를 지정한다.
- PRIMARY KEY: 기본키로 사용할 속성 또는 속성의 집합을 지정한다.
- UNIQUE: 대체키로 사용할 속성 또는 속성의 집합을 지정하는 것으로 UNIQUE로 지정한 속성은 중복된 값을 가질 수 없다.
- FOREIGN KEY ~ REFERENCES ~
  - 참조할 다른 테이블과 그 테이블을 참조할 때 사용할 외래키 속성을 지정한다.
  - 외래키가 지정되면 참조 무결성의 CASCADE 법칙이 적용된다.
  - ON DELETE 옵션: 참조 테이블의 듀플이 삭제되었을 때 기본 테이블에 취해야 할 사항을 지정한다. 옵션에는 NO ACTION, CASCADE, SET NULL, SET DEFAULT가 있다.
    ▶ NO ACTION: 참조 테이블에 변화가 있어도 기본 테이블에는 아무런 조취를 취하지 않는다.
    ▶ CASCADE: 참조 테이블의 튜플이 삭제되면 기본 테이블의 관련 튜플도 모두 삭제되고, 속성이 변경되면 관련 튜플의 속성 값도 모두 변경된다.
    ▶ SET NULL: 참조 테이블에 변화가 있으면 기본 테이블의 관련 튜플의 속성 값을 NULL로 변경한다.
    ▶ SET DEFAULT: 참조 테이블에 변화가 있으면 기본 테이블의 관련 튜플의 속성 값을 기본값으로 변경한다.
  - ON UPDATE 옵션: 참조 테이블의 참조 속성 값이 변경되었을 때 기본 테이블에 취해야 할 사항을 지정한다. 옵션에는 NO ACTION, CASCADE, SET NULL, SET DEFAULT가 있다.
- CONSTRAINT: 제약 조건의 이름을 지정한다. 이름을 지정할 필요가 없으면 CHECK절만 사용하여 속성 값에 대한 제약 조건을 명시한다.
- CHECK: 속성 값에 대한 제약 조건을 정의한다.
- 예제: '이름', '학번', '전공', '성별', '생년월일'로 로 구성된 <학생> 테이블을 정의하는 SQL문을 작성하시오. 단, 제약조건은 다음과 같다.
  - '이름'은 NULL이 올 수 없고, '학번'은 기본키이다.
  - '전공'은 <학과> 테이블의 '학과코드'를 참조하는 외래키로 사용된다.
  - <학과> 테이블에서 삭제가 일어나면 관련된 튜플들의 전공 값을 NULL로 만든다.
  - <학과> 테이블에서 '학과코드'가 변경되면 전공 값도 같은 값으로 변경한다.
  - '생년월일'은 1980-01-01 이후의 데이터만 저장할 수 있다.
  - 제약 조건의 이름은 '생년월일제약'으로 한다.
  - 각 속성의 데이터 타입은 적당하게 지정한다. 단 '성별'은 도메인 'SEX'를 사용 한다.

```
CREATE TABLE 학생
  (이름 VARCHAR(15) NOT NULL,
  학번 CHAR(8),
  전공 CHAR(5),
  성별 SEX,
  생년월일 DATE,
  PRIMARY KEY(학번),
  FOREIGN KEY(전공) REFERENCES 학과(학과코드)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT 생년월일제약
    CHECK(생년월일>='1980-01-01'));
```

### 다른 테이블을 이용한 테이블 정의

- 기존 테이블의 정보를 이용해 새로운 테이블을 정의할 수 있습니다.
- 표기 형식

```
CREATE TABLE 신규테이블명 AS SELECT 속성명[, 속성명, ...] FROM 기존테이블명;
```

- 기존 테이블에서 추출되는 속성의 데이터 타입과 길이는 신규 테이블에 그대로 적용됩니다.
- 기존 테이블의 NOT NULL의 정의는 신규 테이블에 그대로 적용됩니다.
- 기존 테이블의 제약 조건은 신규 테이블에 적용되지 않으므로 신규 테이블을 정의한 후 ALTER TABLE 명령을 이용해 제약 조건을 추가해야 합니다.
- 기존 테이블의 일부 속성만 신규 테이블로 생성할 수 있으며, 기존 테이블의 모든 속성을 신규 테이블로 생성할 때는 속성명 부분에 ''를 입력합니다.
- 예제: <학생> 테이블의 '학번', '이름', '학년' 속성을 이용하여 <재학생> 테이블을 정의하는 SQL문을 작성하시오.

```
CREATE TABLE 재학생 AS SELECT 학번, 이름, 학년 FROM 학생;
```

## CREATE VIEW

> - CREATE VIEW는 뷰(View)를 정의하는 명령문이다.

- 표기 형식

```
CREATE VIEW 뷰명 [(속성명[, 속성명, ...])]
AS SELECT문;
```

- SELECT문을 서브 쿼리로 사용하여 SELECT문의 결과로서 뷰를 생성한다.
- 서브 쿼리인 SELECT문에는 UNION이나 ORDER BY절을 사용할 수 없다.
- 속성명을 기술하지 않으면 SELECT문의 성명이 자동으로 사용된다.
- 예제: <고객> 테이블에서 '주소'가 '안산시' 고객들의 '성명'과 '전화번호'를 '안산고객' 이라는 뷰로 정의하시오.

```
CREATE VIEW 안산고객(성명, 전화번호)
AS SELECT 성명, 전화번호
FROM 고객
WHERE 주소 = '안산시';
```

## CREATE INDEX

> - CREATE INDEX는 인텍스를 정의하는 명령문이다.

- 표기형식

```
CREATE [UNIQUE] INDEX 인덱스
ON 테이블명(속성명 [ASC | DESC] [,속성명 [ASC | DESC]])
[CLUSTER];
```

- UNIQUE
  - 사용된 경우: 중복값이 없는 속성으로 인덱스를 생성한다.
  - 생략된 경우: 중복값을 허용하는 속성으로 인덱스를 생성한다.
- 정렬 여부 지정
  - ASC: 오름차순 정렬
  - DESC: 내림차순 정렬
  - 생략된 경우: 오름차순으로 정렬됨
- CLUSTER: 사용하면 인덱스가 클러스터드 인덱스로 설정됨
- 예제: <고객> 테이블에서 UNIQUE한 특성을 갖는 '고객번호' 속성에 대해 내림차순으로 정렬하여 '고객번호\_idx'라는 이름으로 인덱스를 정의하시오.

```
CREATE UNIQUE INDEX 고객번호_idx
ON 고객(고객번호 DESC);
```

## ALTER TABLE

> - ALTER TABLE 테이블에 대한 정의를 변경하는 명령문이다.

- 표기 형식

```
ALTER TABLE 테이블명 ADD 속성명 데이터_타입 [DEFAULT '기본값'];
ALTER TABLE 테이블명 ALTER 속성명 [SET DEFAULT '기본값'];
ALTER TABLE 테이블명 DROP COLUMN 속성명 [CASCADE];
```

- ADD: 새로운 속성(열)을 추가할 때 사용한다.
- ALTER: 특정 속성의 Default 값을 변경할 때 사용한다.
- DROP COLUMN: 특정 속성을 삭제할 때 사용한다.
- 예제 1: <학생> 테이블에 최대 3문자로 구성되는 '학년' 속성 추가하시오.

```
ALTER TABLE 학생 ADD 학년 VARCHAR(3);
```

- 예제 2: <학생> 테이블의 '학번' 필드의 데이터 타입과 크기를 VARCHAR(10)으로 하고 NULL값이 입력되지 않도록 변경하시오.

```
ALTER TABLE 학생 ALTER 학번 VARCHAR(10) NOT NULL;
```

## DROP

> - DROP 스키마, 도메인, 기본 테이블, 뷰 테이블, 인덱스, 제약 조건 등을 제거하는 명령문이다.

- 표기 형식

```
DROP SCHEMA 스키마명 [CASCADE | RESTRICT];
DROP DOMAIN 도메인명 [CASCADE | RESTRICT];
DROP TABLE 테이블명 [CASCADE | RESTRICT];
DROP VIEW 뷰명 [CASCADE | RESTRICT];
DROP INDEX 인덱스 [CASCADE | RESTRICT);
DROP CONSTRAINT 제약조건명:
```

- DROPSCHEMA: 스키마를 제거한다.
- DROPDOMAIN: 도메인을 제거한다.
- DROP TABLE: 테이블을 제거한다.
- DROP VIEW: 뷰를 제거한다.
- DROP INDEX: 인덱스를 제거한다.
- DROP CONSTRAINT: 제약 조건을 제거한다.
- CASCADE: 제거할 요소를 참조하는 다른 모든 개체를 함께 제거한다. 즉 주 테이블의 데이터 제거 시 각 외래키와 관계를 맺고 있는 모든 데이터를 제거하는 참조 무결성 제약 조건을 설정하기 위해 사용된다.
- RESTRICT: 다른 개체가 제거할 요소를 참조중일 때는 제거를 취소한다.
- 예제: <학생> 테이블을 제거하되, <학생> 테이블을 참조하는 모든 데이터를 함께 제거하시오.

```
DROP TABLE 학생 CASCADE:
```

출처: 2024 시나공 정보처리기사 필기 기본서

```toc

```

<script src="https://utteranc.es/client.js"
        repo="alpaka206/alpaka206.github.io"
        issue-term="pathname"
        label="utterances"
        theme="github-light"
        crossorigin="anonymous"
        async>
</script>

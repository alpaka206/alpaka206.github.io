---
emoji: 👨🏻‍🏫
title: 87. 트리거(Trigger)
date: '2024-01-28 02:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## 트리거(Trigger)의 개요

> - 트리거는 데이터베이스 시스템에서 데이터의 삽입(Insert), 갱신(Update), 삭제(Delete) 등의 이벤트(Event)가 발생할 때마다 관련 작업이 자동으로 수행되는 절차형 SQL이다.

- 트리거는 데이터베이스에 저장되며, 데이터 변경 및 무결성 유지, 로그 메시지 출력 등의 목적으로 사용된다.
- 트리거의 구문에는 DCL(데이터 제어어)을 사용할 수 없으며, DCL이 포함된 프로시저나 함수를 호출하는 경우에도 오류가 발생한다.
- 트리거에 오류가 있는 경우 트리거가 처리하는 데이터에도 영향을 미치므로 트리거를 생성할 때 세심한 주의가 필요하다.

## 트리거의 구성

> - 트리거는 선언, 이벤트, 시작, 종료로 구성되며, 시작과 종료 구문 사이에는 제어(CONTROL), SQL, 예외(EXCEPTION)가 포함된다.

- 트리거 구성도
  ![](https://velog.velcdn.com/images/alpaka206/post/4d2eb126-5dda-435a-b322-b9abd5ec4d94/image.png)
- DECLARE: 트리거의 명칭, 변수 및 상수, 데이터 타입을 정의하는 선언부이다.
- EVENT: 트리거가 실행되는 조건을 명시한다.
- BEGIN / END: 트리거의 시작과 종료를 의미한다.
- CONTROL: 조건문 또는 반복문이 삽입되어 순차적으로 처리된다.
- SQL: DML문이 삽입되어 데이터 관리를 위한 조회, 추가, 수정, 삭제 작업을 수행한다.
- EXCEPTION: BEGIN ~ END 안의 구문 실행 시 예외가 발생하면 이를 처리하는 방법을 정의한다.

## 트리거의 생성

> - 트리거를 생성하기 위해서는 CREATE TRIGGER 명령어를 사용한다.

- 표기 형식

```
CREATE [OR REPLACE] TRIGGER 트리거 동작시기 동작 ON 테이블명
[REFERENCING NEW | OLD AS 테이블명]
[FOR EACH ROW [WHEN 조건식]]
BEGIN
  트리거 BODY;
END;
```

- OR REPLACE: 선택적인(Optional) 예약어이다. 이 예약어를 사용하면 동일한 트리거 이름이 이미 존재하는 경우, 기존의 트리거를 대체할 수 있다.
- 동작시기: 트리거가 실행될 때를 지정한다. 종류에는 AFTER와 BEFORE가 있다.
  - AFTER: 테이블이 변경된 후에 트리거가 실행된다.
  - BEFORE: 테이블이 변경되기 전에 트리거가 실행된다.
- 동작: 트리거가 실행되게 할 작업의 종류를 지정한다. 종류에는 INSERT, DELETE, UPDATE가 있다.
  입할 때 트리거가 실행된
  - INSERT: 테이블에 새로운 튜플을 삽입할 때 트리거가 실행된다.
  - DELETE: 테이블의 튜플을 삭제할 때 트리거가 실행된다.
  - UPDATE: 테이블의 튜플을 수정할 때 트리거가 실행된다.
- NEW | OLD: 트리거가 적용될 테이블의 별칭을 지정한다.
  - NEW: 추가되거나 수정에 참여할 튜플들의 집합(테이블)을 의미한다.
  - OLD: 수정되거나 삭제 전 대상이 되는 튜플들의 집합(테이블)을 의미한다.
- FOR EACH ROW: 각 튜플마다 트리거를 적용한다는 의미이다.
- WHEN 조건식: 선택적인(Optional) 예약어이다. 트리거를 적용할 튜플의 조건을 지정한다.
- 트리거 BODY
  - 트리거의 본문 코드를 입력하는 부분이다.
  - BEGIN으로 시작해서 END로 끝나는데, 적어도 하나 이상의 SQL문이 있어야 한다. 그렇지 않으면 오류가 발생한다.
- 예제: <학생> 테이블에 새로운 튜플이 삽입될 때, 삽입되는 튜플에 학년 정보가 누락됐으면 '학년' 필드에 "신입생"을 치환하는 트리거를 '학년정보\_tri'라는 이름으로 정의하시오.

```
1. CREATE TRIGGER 학년정보_tri BEFORE INSERT ON 학생
2. REFERENCING NEW AS new_table
3. FOR EACH ROW
4. WHEN (new_table.학년 IS NULL)
   BEGIN
5.   new_table.학년 := '신입생';
   END;
- 코드 해설
1. <학생> 테이블에 튜플을 삽입하기 전에 동작하는 트리거 '학년정보_tri'를 생성한다.
2. 새로 추가될 튜플들의 집합 NEW의 별칭을 (new_table)로 명명한다.
3. 모든 튜플을 대상으로 한다.
4. <new_table>에서 '학년' 속성이 NULL인 튜플에 '학년정보_tri'가 적용된다.
5. <new_table>의 '학년' 속성에 "신입생"을 치환한다.
   - 2에서 NEW 또는 OLD로 지정된 테이블 이름 앞에는 콜론(;)이 들어간다.
   - A := A : B를 치환하라는 의미로 '='가 아닌 ':='를 사용한다.
```

## 트리거의 제거

> - 트리거를 제거하기 위해서는 DROP TRIGGER 명령어를 사용한다.

- 표기 형식

```
DROP TRIGGER 트리거명:
```

- 예제: '학년정보\_tri'라는 트리거를 제거하는 SQL문을 작성하시오.

```
DROP TRIGGER 학년정보_tri;
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

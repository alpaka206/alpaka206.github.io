---
emoji: 👨🏻‍🏫
title: 86. 프로시저(Procedure)
date: '2024-01-28 01:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## 프로시저(Procedure)의 개요

> - 프로시저란 절차형 SQL을 활용하여 특정 기능을 수행하는 일종의 트랜잭션 언어로, 호출을 통해 실행되어 미리 저장해 놓은 SQL 작업을 수행한다.

- 프로시저를 만들어 데이터베이스에 저장하면 여러 프로그램에서 호출하여 사용할 수 있다.
- 프로시저는 데이터베이스에 저장되어 수행되기 때문에 스토어드(Stored) 프로시저라고도 불린다.
- 프로시저는 시스템의 일일 마감 작업, 일괄(Batch) 작업 등에 주로 사용된다.
- 프로시저의 구성도![](https://velog.velcdn.com/images/alpaka206/post/d9ffb024-69c0-47ec-826c-d4c62d931870/image.png)
- DECLARE: 프로시저의 명칭, 변수, 인수, 데이터 타입을 정의하는 선언이다.
- BEGIN/END: 프로시저의 시작과 종료를 의미한다.
- CONTROL: 조건문 또는 반복문이 삽입되어 순차적으로 처리된다.
- SQL: DML, DCL이 삽입되어 데이터 관리를 위한 조회, 추가, 수정, 삭제 작업을 수행한다.
- EXCEPTION: BEGIN ~ END 안의 구문 실행 시 예외가 발생하면 이를 처리하는 방법을 정의한다.
- TRANSACTION: 수행된 데이터 작업들을 DB에 적용할지 취소할지를 결정하는 처리부이다.

## 프로시저 생성

> - 프로시저를 생성하기 위해서는 CREATE PROCEDURE 명령어를 사용한다.

- 표기 형식

```
CREATE [OR REPLACE] PROCEDURE 프로시저명(파라미터)
[지역변수 선언]
BEGIN
  프로시저 BODY;
END;
```

- OR REPLACE: 선택적인(Optional) 예약어이다. 이 예약어를 사용하면 동일한 프로시저 이름이 이미 존재하는 경우, 기존의 프로시저를 대체할 수 있다.
- 프로시저명: 생성하려는 프로시저의 이름을 지정한다.
- 파라미터: 프로시저 파라미터로는 다음과 같은 것들이 올 수 있다.
  - IN: 호출 프로그램이 프로시저에게 값을 전달할 때 지정한다.
  - OUT: 프로시저가 호출 프로그램에게 값을 반환할 때 지정한다.
  - INOUT : 호출 프로그램이 프로시저에게 값을 전달하고, 프로시저 실행 후 호출 프로그램에 값을 반환할 때 지정한다.
  - 매개변수명: 호출 프로그램으로부터 전달받은 값을 저장할 변수의 이름을 지정한다.
  - 자료형: 변수의 자료형을 지정한다.
- 프로시저 BODY
  - 프로시저의 코드를 기록하는 부분이다.
  - BEGIN에서 시작하여 END로 끝나며, BEGIN END 사이에는 적어도 하나의 SQL문이 있어야 한다.
- 예제: '사원번호'를 입력받아 해당 사원의 '지급방식'을 "S"로 변경하는 프로시저를 생성하시오.

```
1. CREATE OR REPLACE PROCEDURE emp_change_s(i_사원번호 IN INT)
2. IS
3. BEGIN
4.   UPDATE 급여 SET 지급방식 = 'S' WHERE 사원번호 = i_사원번호;
5.   EXCEPTION
6.     WHEN PROGRAM_ERROR THEN
7.       ROLLBACK;
8.   COMMIT;
9. END;
```

- 해설
  1. 파라미터로 'i\_사원번호'를 전달받는 프로시저 'emp_change_s'를 생성한다.
  2. 변수를 선언하는 예약어로 변수를 사용하지 않으므로 예약어만 입력한다.
  3. 프로시저 BODY의 시작을 알리는 예약어로, 4부터 8까지가 하나의 블록이 된다.
  4. <급여> 테이블에서 '사원번호'가 'i\_사원번호'로 받은 값과 같은 튜플의 '지급방식'을 "S"로 갱신한다.
  5. 예외처리의 시작을 알리는 예약어이다.
  6. SQL이 DBMS 내부 문제로 종료되었을 때 다음 문장을 수행한다.
  7. ERROR가 발생할 경우 수행되는 문장으로 ROLLBACK을 수행한다.
  8. 4에서 변경한 내역을 데이터베이스에 반영하는 트랜잭션 명령어이다.
  9. 프로시저 BODY의 종료를 알리는 예약어이다.

## 프로시저 실행

> - 프로시저를 실행하기 위해서는 EXECUTE 명령어 또는 CALL 명령어를 사용하며, EXECUTE 명령어를 줄여서 EXEC로 사용하기도 한다.

- 표기 형식

```
EXECUTE 프로시저명;
EXEC 프로시저명;
CALL 프로시저명;
```

- 예제: '사원번호' 32를 인수로 하여 위에서 생성된 emp_change_s 프로시저를 실행하시오.

```
EXECUTE emp_change_s(32);
```

## 프로시저 제거

> - 프로시저를 제거하기 위해서는 DROP PROCEDURE 명령어를 사용한다.

- 표기 형식

```
DROP PROCEDURE 프로시저명;
```

- 예제: 위에서 생성된 프로시저 emp_change_s를 제거하시오.

```
DROP PROCEDURE emp_change_s;
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

---
emoji: 👨🏻‍🏫
title: 81. DCL
date: '2024-01-24 00:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## DCL(Data Control Language, 데이터 제어어)의 개요

> - DCLO(데이터 제어어)는 데이터의 보안，무결성，회복，병행 제어 등을 정의하는 데 사용하는 언어이다.

- DCL은 데이터베이스 관리자(DBA)가 데이터 관리를 목적으로 사용한다.
- DCL에는 GRANT, REVOKE, COMMIT, ROLLBACK, SAVEPOINT 등이 있다.

## GRANT / REVOKE

> - 데이터베이스 관리자가 데이터베이스 사용자에게 권한을 부여하거나 취소하기 위한
>   명령어이다.

- GRANT: 권한 부여를 위한 명령어
- REVOKE: 권한 취소를 위한 명령어
- 사용자등급 지정 및 해제
  - GRANT 사용자등급 TO 사용자*ID*리스트 [IDENTIFIED BY 암호];
  - REVOKE 사용자등급 FROM 사용자*ID*리스트;
- 예제 1: 사용자 ID가 "NABI"인 사람에게 데이터베이스 및 테이블을 생성할 수 있는 권한을 부여하는 SQL문을 작성하시오.

```
GRANT RESOURCE TO NABI;
```

- 예제 2: 사용자 ID가 "STAR"인 사람에게 단순히 데이터베이스에 있는 정보를 검색할
  수 있는 권한을 부여하는 SQL문을 작성하시오.

```
GRANT CONNECT TO STAR;
```

- 테이블 및 속성에 대한 권한 부여 및 취소
  - GRANT 권한\_리스트 ON 개체 TO 사용자 [WITH GRANT OPTION];
  - REVOKE [GRANT OPTION FOR] 권한\_리스트 ON 개체 FROM 사용자 [CASCADE];
  - 권한 종류: ALL, SELECT, INSERT, DELETE, UPDATE, ALTER 등
  - WITH GRANT OPTION: 부여받은 권한을 다른 사용자에게 다시 부여할 수 있는 권한을 부여함
  - GRANT OPTION FOR: 다른 사용자에게 권한을 부여할 수 있는 권한을 취소함
  - CASCADE: 권한 취소 시 권한을 부여받았던 사용자가 다른 사용자에게 부여한 권한도 연쇄적으로 취소함
- 예제 3: 사용자 ID가 "NABI"인 사람에게<고객>테이블에 대한 모든 권한과 다른 사람에게 권한을 부여할 수 있는 권한까지 부여하는 SQL문을 작성하시오.

```
GRANT ALL ON 고객 TO NABI WITH GRANT OPTION;
```

- 예제 4: 사용자 ID가 "STAR"인 사람에게 부여한<고객>테이블에 대한 권한 중 UPDATE 권한을 다른 사람에게 부여할 수 있는 권한만 취소하는 SQL문을 작성하시오.

```
REVOKE GRANT OPTION FOR UPDATE ON 고객 FROM STAR;
```

## COMMIT

> - 트랜잭션이 성공적으로 끝나면 데이터베이스가 새로운 일관성(Consistency) 상태를 가지기 위해 변경된 모든 내용을 데이터베이스에 반영하여야 하는데，이때 사용하는 명령이 COMMIT이다.

- COMMIT 명령을 실행하지 않아도 DML문이 성공적으로 완료되면 자동으로 COMMIT되고, DML이 실패하면 자동으로 ROLLBACK이 되도록 Auto Commit 기능을 설정할 수 있다.

## ROLLBACK

> - ROLLBACK은 아직 COMMIT되지 않은 변경된 모든 내용들을 취소하고 데이터베이스를 이전 상태로 되돌리는 명령어이다.

- 트랜잭션 전체가 성공적으로 끝나지 못하면 일부 변경된 내용만 데이터베이스에 반영되는 비일관성(Inconsistency)인 상태를 가질 수 있기 때문에 일부분만 완료된 트랜잭션은 롤백(Rollback)되어야 한다.

## SAVEPOINT

> - SAVEPOINT는 트랜잭션 내에 ROLLBACK 할 위치인 저장점을 지정하는 명령어이다.

- 저장점을 지정할 때는 이름을 부여하며，ROLLBACK 시 지정된 저장점까지의 트
  랜잭션 처리 내용이 취소된다.
  #### <사원>
  | 사원번호 |  이름  |  부서  |
  | :------: | :----: | :----: |
  |    10    | 김기획 | 기획부 |
  |    20    | 박인사 | 인사부 |
  |    30    | 최재무 | 재무부 |
  |    40    | 오영업 | 영업부 |
- 예제 1: <사원>테이블에서 '사원번호'가 40인 사원의 정보를 삭제한 후 COMMIT을 수행하시오

```
DELETE FROM 사원 WHERE 사원번호 = 40;
COMMIT;
```

- 해설
  - DELETE 명령을 수행한 후 COMMIT 명령을 수행했으므로 DELETE 명령으로 삭제된 레코드는 이후 ROLLBACK 명령으로 되돌릴 수 없다.
  #### <사원>테이블 상태
  | 사원번호 |  이름  |  부서  |
  | :------: | :----: | :----: |
  |    10    | 김기획 | 기획부 |
  |    20    | 박인사 | 인사부 |
  |    30    | 최재무 | 재무부 |
- 예제 2: '사원번호'가 30인 사원의 정보를 삭제하시오.

```
DELETE FROM 사원 WHERE 사원번호 = 30;
```

- 해설
  - DELETE 명령을 수행한 후 COMMIT 명령을 수행하지 않았으므로 DELETE 명령으로 삭제된 레코드는 이후 ROLLBACK 명령으로 되돌릴 수 있다.
  #### <사원>테이블 상태
  | 사원번호 |  이름  |  부서  |
  | :------: | :----: | :----: |
  |    10    | 김기획 | 기획부 |
  |    20    | 박인사 | 인사부 |
- 예제 3: SAVEPOINT 'S1'을 설정하고 '사원번호'가 20인 사원의 정보를 삭제하시오.

```
SAVEPOINT S1;
DELETE FROM 사원 WHERE 사원번호 = 20;
```

- 해설
  #### <사원>테이블 상태
  | 사원번호 |  이름  |  부서  |
  | :------: | :----: | :----: |
  |    10    | 김기획 | 기획부 |
- 예제 4: SAVEPOINT 'S2'를 설정하고 '사원번호'가 10인 사원의 정보를 삭제하시오.

```
SAVEPOINT S2;
DELETE FROM 사원 WHERE 사원번호 = 10;
```

- 해설
  #### <사원>테이블 상태
  | 사원번호 | 이름 | 부서 |
  | :------: | :--: | :--: |
- 예제 5: SAVEPOINT 'S2'까지 ROLLBACK을 수행하시오.

```
ROLLBACK TO S2;
```

- 해설
  - ROLLBACK이 적용되는 시점을 'S2'로 지정했기 때문에 예제 5의 ROLLBACK에 의해 <사원> 테이블의 상태는 예제 4의 작업을 수행하기 전으로 되돌려진다.
  #### <사원> 테이블 상태
  | 사원번호 |  이름  |  부서  |
  | :------: | :----: | :----: |
  |    10    | 김기획 | 기획부 |
- 예제 6: SAVEPOINT 'S1'까지 ROLLBACK을 수행하시오.

```
ROLLBACK TO S1;
```

- 해설
  - ROLLBACK이 적용되는 시점을 'S1'로 지정했기 때문에 예제 6의 ROLLBACK에 의해 <사원> 테이블의 상태는 예제 3의 작업을 수행하기 전으로 되돌려진다.
  #### <사원> 테이블 상태
  | 사원번호 |  이름  |  부서  |
  | :------: | :----: | :----: |
  |    10    | 김기획 | 기획부 |
  |    20    | 박인사 | 인사부 |
- 예제 7: SAVEPOINT 없이 ROLLBACK을 수행하시오.

```
ROLLBACK;
```

- 해설
  - '사원번호'가 40인 사원의 정보를 삭제한 후 COMMIT을 수행했으므로 예제 7의 ROLLBACK이 적용되는 시점은 예제 1의 COMMIT 이후 새롭게 작업이 수행되는 예제 2의 작업부터이다.
  #### <사원> 테이블 상태
  | 사원번호 |  이름  |  부서  |
  | :------: | :----: | :----: |
  |    10    | 김기획 | 기획부 |
  |    20    | 박인사 | 인사부 |
  |    30    | 최재무 | 재무부 |

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

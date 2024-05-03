---
emoji: 👨🏻‍🏫
title: 110. 예외 처리
date: '2024-02-01 02:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## 예외 처리의 개요

> - 프로그램의 정상적인 실행을 방해하는 조건이나 상태를 예외(Exception)라고 하며, 이러한 예외가 발생했을 때 프로그래머가 해당 문제에 대비해 작성해 놓은 처리 루틴을 수행하도록 하는 것을 예외 처리(Exception Handling)라고 한다.

- 예외가 발생했을 때 일반적인 처리 루틴은 프로그램을 종료시키거나 로그를 남기도록 하는 것이다.
- C++, Ada, JAVA, 자바스크립트와 같은 언어에는 예외 처리 기능이 내장되어 있으며, 그 외의 언어에서는 필요한 경우 조건문을 이용해 예외 처리 루틴을 작성한다. - 예외의 원인에는 컴퓨터 하드웨어 문제, 운영체제의 설정 실수, 라이브러리 손상, 사용자의 입력 실수, 받아들일 수 없는 연산, 할당하지 못하는 기억장치 접근 등 다양하다.

## JAVA의 예외 처리

> - JAVA는 잘못된 동작이나 결과에 영향을 줄 수 있는 예외를 객체로 취급하며, 예외와 관련된 클래스를 java.lang 패키지에서 제공한다.

- JAVA에서는 try ~ catch 문을 이용해 예외를 처리한다.
- try 블록 코드를 수행하다 예외가 발생하면 예외를 처리하는 catch 블록으로 이동하여 예외 처리 코드를 수행하므로 예외가 발생한 이후의 코드는 실행되지 않는다.
- catch 블록에서 선언한 변수는 해당 catch 블록에서만 유효하다.
- try ~ catch 문 안에 또 다른 try ~ catch 문을 포함할 수 있다.
- try ~ catch 문 안에서는 실행 코드가 한 줄이라도 중괄호({})를 생략할 수 없다.
- 기본 형식

```
try {
  예외가 발생할 가능성이 있는 코드;
}
catch (예외객체1 매개변수) {
  예외객체1에 해당하는 예외 발생 시 처리 코드;
}
catch (예외객체2 매개변수) {
  예외객체2에 해당하는 예외 발생 시 처리 코드;
}
catch (예외객체n 매개변수) {
  예외객체n에 해당하는 예외 발생 시 처리 코드;
}
catch (Exception 매개변수) {
  예외객체1~n에 해당하지 않는 예외 발생 시 처리 코드;
}
finally {
  예외의 발생 여부와 관계없이 무조건 처리되는 코드;
}
```

## JAVA의 주요 예외 객체

> | 예외 객체                      | 발생원인                                                        |
> | ------------------------------ | --------------------------------------------------------------- |
> | ClassNotFoundException         | 클래스를 찾지 못한 경우                                         |
> | NoSuchMethodException          | 메소드를 찾지 못한 경우                                         |
> | FileNotFoundException          | 파일을 찾지 못한 경우                                           |
> | Interrupted IOException        | 입·출력 처리가 중단된 경우                                      |
> | ArithmeticException            | 0으로 나누는 등의 산술 연산에 대한 예외가 발생한 경우           |
> | IllegalArgumentException       | 잘못된 인자를 전달한 경우                                       |
> | NumberFormatException          | 숫자 형식으로 변환할 수 없는 문자열을 숫자 형식으로 변환한 경우 |
> | ArrayIndexOutOfBoundsException | 배열의 범위를 벗어난 접근을 시도한 경우                         |
> | NegativeArraySizeException     | 0보다 작은 값으로 배열의 크기를 지정한 경우                     |
> | NullPointerException           | 존재하지 않는 객체를 참조한 경우                                |

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

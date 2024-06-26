---
emoji: 👨🏻‍🏫
title: 106. Python의 기초
date: '2024-01-31 12:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## Python의 기본 문법

> - 변수의 자료형에 대한 선언이 없다.

- 문장의 끝을 의미하는 세미콜론(;)을 사용할 필요가 없다.
- 변수에 연속하여 값을 저장하는 것이 가능하다.
- if나 for와 같이 코드 블록을 포함하는 명령문을 작성할 때 코드 블록은 콜론
  (:)과 여백으로 구분한다.
- 여백은 일반적으로 4칸 또는 한 개의 탭만큼 띄워야하며, 같은 수준의 코드
  들은 반드시 동일한 여백을 가져야 한다.

## Python의 데이터 입·출력 함수

> ### input() 함수

- input() 함수는 Python의 표준 입력 함수로, 키보드로 입력받아 변수에 저장하는 함수이다.
- 입력되는 값은 문자열로 취급되어 저장된다.
- 형식 1: 변수 = input(출력문자)
- 형식 2: 변수1, 변수2, ... = input(출력문자).split(분리문자)

### print() 함수

- 형식 1: print(출력값1, 출력값2, ..., sep = 분리문자, end = 종료문자)
- 형식 2: print(서식 문자열\* % (출력값1, 출력값2, ...))

### 입력 값의 형변환(Casting)

- input() 함수는 입력되는 값을 무조건 문자열로 저장하므로, 숫자로 사용하기 위해서는 형을 변환해야 합니다.
- 변환할 데이터가 1개일 때

```
변수 = int(input())
변수 = float(input())
```

- 변환할 데이터가 2개 이상일 때

```
변수1, 변수2, ... = map*(int, input( ).split( )) → 정수로 변환 시
변수1, 변수2, ... = map(float, input().split( )) → 실수로 변환 시
```

## 리스트(List)

> - C와 Java에서는 여러 요소들을 하나의 이름으로 처리할 때 배열을 사용했는데 Python에서는 리스트를 사용한다.

- 리스트는 필요에 따라 개수를 늘이거나 줄일 수 있기 때문에 리스트를 선언할 때 크기를 적지 않는다.
- 배열과 달리 하나의 리스트에 정수, 실수, 문자열 등 다양한 자료형을 섞어서 저장 할 수 있다.
- Python에서 리스트의 위치는 0부터 시작한다.
- 형식

```
리스트명 = [값1, 값2, ... ]
리스트명 = list([값1, 값2, ... ])
```

## 딕셔너리(Dictionary)

> - 딕셔너리는 연관된 값을 묶어서 저장하는 용도로 사용한다.

- 리스트는 저장된 요소에 접근하기 위한 키로 위치에 해당하는 0, 1, 2 등의 숫자를 사용하지만 딕셔너리는 사용자가 원하는 값을 키로 지정해 사용한다.
- 딕셔너리에 접근할 때는 딕셔너리 뒤에 대괄호([])를 사용하며, 대괄호([])안에
  키를 지정한다.
- 형식

```
딕셔너리명 = {키1:값1, 키2:값2, ... }
딕셔너리명 = dict({키1:값1, 키2:값2, ...})
```

## Range

> - Range는 연속된 숫자를 생성하는 것으로, 리스트, 반복문 등에서 많이 사용된다.

- 형식

```
range(최종값)
range(초기값, 최종값)
range(초기값, 최종값, 증가값)
```

## 슬라이스(Slice)

> - 슬라이스는 문자열이나 리스트와 같은 순차형 객체에서 일부를 잘라(slicing) 반환하는 기능이다.

- 형식

```
객체명 [초기위치 : 최종위치]
객체명 [초기위치 : 최종위치 : 증가값]
```

- 슬라이스는 일부 인수를 생략하여 사용할 수 있다.

```
객체명 [:] 또는 객체명 [::]
객체명 [초기위치:]
객체명 [:최종위치]
객체명 [::증가값]
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

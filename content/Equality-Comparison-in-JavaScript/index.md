---
emoji: 𝓡
title: 3. 자바스크립트의 동등 비교
date: '2024-05-29 13:00:00'
author: Alpaka206
tags: React
categories: React
---

## 자바스크립트의 데이터 타입

자바스크립트의 모든 값은 데이터 타입을 가지고 있고, 이 데이터 타입들은 크게 원시 타입, 객체 타입으로 나뉜다.

**원시 타입**(primitive type)

- boolean
- null
- undefined
- number
- string
- symbol
- bigint

**원시 타입**(object/reference type)

- object

### 원시 타입

원시 타입이란 객체가 아닌 다른 모든 타입을 의미한다. 객체가 아니므로 메서드를 가지지 않는다.

- undefined: 선언한 후 값을 할당하지 않은 변수 또는 값이 주어지지 않은 인수에 자동으로 할당되는 값
- null: 아직 값이 없거나 비어있는 값을 표현할 때 사용한다. 다른 원시값과 다르게 typeof로 null을 확인하면 'object'라는 결과가 반환된다. undefined는 '선언되었지만 할당되지 않은 값'이고 null은 '명시적으로 비어 있음을 나타내는 값'이 일반적이다.
- boolean: true, false만을 가질 수 있는 데이터 타입이다.
- number: 정수 및 숫자이다. 2진수, 8진수, 16진수 등 별도의 데이터 타입을 제공하지 않아서 각 진수별로 값을 포현해도 모두 10진수로 해석된다.
- BigInt: number가 다룰수 있는 숫자 크기의 제한을 극복하기 위해 나왔다.
- string: 텍스트 타입의 데이터를 저장하기 위해 사용된다. 자바스크립트 문자열의 특징으로는 문자열이 원시 타입이며 변경이 불가능하다.
- symbol: 중복되지 않는 어떠한 고유한 값을 나타내기 위해 만들어졌다.

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

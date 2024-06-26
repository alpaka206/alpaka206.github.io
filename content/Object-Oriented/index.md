---
emoji: 👨🏻‍🏫
title: 18. 객체지향(Object - Oriented)
date: '2024-01-07 01:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## 객체지향의 개요

> - 객체지향은 현실 세계의 개체(Entity)를 기계의 부품처럼 하나의 객체(Object)로 만들어, 기계적인 부품들을 조립하여 제품을 만들듯이 소프트웨어를 개발할 때에도 객체들을 조립해서 작성할 수 있는 기법을 말한다.

- 객체지향 기법은 구조적 기법의 문제점으로 인한 소프트웨어 위기의 해결책으로 채택되어 사용되고 있다.
- 객체지향은 소프트웨어의 재사용 및 확장이 용이하여 고품질의 소프트웨어를 빠르게 개발할 수 있고 유지보수가 쉽다.
- 객체지향은 복잡한 구조를 단계적 • 계층적으로 표현하고, 멀티미디어 데이터 및 병렬 처리를 지원한다.
- 객체지향은 현실 세계를 모형화하므로 사용자와 개발자가 쉽게 이해할 수 있다.
- 객체지향의 주요 구성 요소와 개념에는 객체(Object), 클래스(Class), 캡슐화(Encapsulation), 상속(Inheritance), 다형성(Polymorphism), 연관성(Relationship)이 있다.

## 객체(Object)

> - 객체는 데이터와 데이터를 처리하는 함수를 묶어 놓은(캡슐화한) 하나의 소프트웨어 모듈이다.

######

|        |                                                                                                                                                                                                                         |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 데이터 | - 객체가 가지고 있는 정보로 속성이나 상태 분류 등을 나타낸다.<br>- 속성(Attribute), 상태, 변수, 상수, 자료구조라고도 한다.                                                                                              |
| 함수   | - 객체가 수행하는 기능으로 객체가 갖는 데이터(속성, 상태)를 처리하는 알고리즘이다.<br>- 객체의 상태를 참조하거나 변경하는 수단이 되는 것으로 메소드(Method, 행위), 서비스(Service), 동작(Operation), 연산이라고도 한다. |

- 객체의 특성
  - 객체는 독립적으로 식별 가능한 이름을 가지고 있다.(자동차는 번호판으로 다른 자동차 객체와 구별된다.)
  - 객체가 가질 수 있는 조건을 상태(State)라고 하는데, 일반적으로 상태는 시간에 따라 변한다.(자동차는 '정지', '이동' 등의 상태가 존재하며, 이러한 '정지'와 '이동'의 상태는 고정된 것이 아니라 시간에 따라 변한다.)
  - 객체와 객체는 상호 연관성에 의한 관계가 형성된다.(화재 발생 시 소방차, 구급차, 경찰차는 긴밀하게 협조하여 화재를 진압하고 환자를 이송하며 교통을 정리하는 관계가 형성된다.)
  - 객체가 반응할 수 있는 메시지(Message)의 집합을 행위라고 하며, 객체는 행위의 특징을 나타낼 수 있다.(자동차 객체는 가속 페달을 밟는 행위를 하면 '가속'하는 특징을 나타내고, 브레이크를 밟는 행위를 하면 '감속하는 특징을 나타낸다.)
  - 객체는 일정한 기억장소를 가지고 있다.(자동차는 주차장에 있거나 도로 위에 있거나, 일정한 물리적 공간을 점유한다.)
- 객체의 메소드는 다른 객체로부터 메시지를 받았을 때 정해진 기능을 수행한다.

## 클래스(Class)

> - 클래스는 공통된 속성과 연산(행위)을 갖는 객체의 집합으로, 객체의 일반적인 타입(Type)을 의미한다.

- 클래스는 각각의 객체들이 갖는 속성과 연산을 정의하고 있는 틀이다.
- 클래스는 객체지향 프로그램에서 데이터를 추상화하는 단위이다.
- 클래스에 속한 각각의 객체를 인스턴스(Instance)라 하며, 클래스로부터 새로운 객체를 생성하는 것을 인스턴스화(Instantiation)라고 한다.
- 동일 클래스에 속한 각각의 객체(인스턴스)들은 공통된 속성과 행위를 가지고 있으면서, 그 속성에 대한 정보가 서로 달라서 동일 기능을 하는 여러 가지 객체를 나타내게 된다.
- 최상위 클래스는 상위 클래스를 갖지 않는 클래스를 의미한다.
- 슈퍼 클래스(Super Class)는 특정 클래스의 상위(부모) 클래스이고, 서브 클래스 (Sub Class)는 특정 클래스의 하위(자식) 클래스를 의미한다.

## 캡슐화(Encapsulation)

> - 캡슐화는 데이터(속성)와 데이터를 처리하는 함수를 하나로 묶는 것을 의미한다.

- 캡슐화된 객체는 인터페이스를 제외한 세부 내용이 은폐(정보 은닉)되어 외부에서의 접근이 제한적이기 때문에 외부 모듈의 변경으로 인한 파급 효과가 적다.
- 캡슐화된 객체들은 재사용이 용이하다.
- 객체들 간의 메시지를 주고받을 때 상대 객체의 세부 내용은 알 필요가 없으므로 인터페이스가 단순해지고, 객체 간의 결합도가 낮아진다.

## 상속(Inheritance)

> - 상속은 이미 정의된 상위 클래스(부모 클래스)의 모든 속성과 연산을 하위 클래스(자식 클래스)가 물려받는 것이다.

- 상속을 이용하면 하위 클래스는 상위 클래스의 모든 속성과 연산을 자신의 클래스내에서 다시 정의하지 않고서도 즉시 자신의 속성으로 사용할 수 있다.
- 하위 클래스는 상위 클래스로부터 상속받은 속성과 연산 외에 새로운 속성과 연산을 첨가하여 사용할 수 있다.
- 상위 클래스의 속성과 연산을 하위 클래스가 사용할 수 있기 때문에 객체와 클래스의 재사용, 즉 소프트웨어의 재사용(Reuse)을 높이는 중요한 개념이다.
- **다중 상속(Multiple Inheritance)**: 한 개의 클래스가 두 개 이상의 상위 클래스로부터 속성과 연산을 상속받는 것이다.

## 다형성(Polymorphism)

> - 다형성은 메시지에 의해 객체(클래스)가 연산을 수행하게 될 때 하나의 메시지에 대해 각각의 객체(클래스)가 가지고 있는 고유한 방법(특성)으로 응답할 수 있는 능력을 의미한다.

- 객체(클래스)들은 동일한 메소드명을 사용하며 같은 의미의 응답을 한다.
- 응용 프로그램 상에서 하나의 함수나 연산자가 두 개 이상의 서로 다른 클래스의 인스턴스들을 같은 클래스에 속한 인스턴스처럼 수행할 수 있도록 하는 것이다.<br>(1. '+'연산자의 경우 숫자 클래스에서는 덧셈 문자 클래스에서는 문자열의 연결 기능으로 사용된다.<br>2. 오버로딩(Overloading) 기능의 경우 메소드(Method)의 이름은 같지만 인수를 받는 자료형과 개수를 달리하여 여러 기능을 정의할 수 있다.<br>3. 오버라이딩(Overriding. 메소드 재정의 기능의 경우 상위 클래스에서 정의한 메소드(Method)와 이름은 같지만 메소드 안의 실행 코드를 달리하여 자식 클래스에서 재정의해서 사용할 수 있다.)

## 연관성(Relationship)

> - 연관성은 두 개 이상의 객체(클래스)들이 상호 참조하는 관계를 말하며 종류는 다음과 같다.

######

| 종류           | 의미                          | 특징                                                   |
| -------------- | ----------------------------- | ------------------------------------------------------ |
| is member of   | 연관화(Association)           | 2개 이상의 객체가 상호 관련되어 있음을 의미함          |
| is instance of | 분류화(Classticalion)         | 동일한 형의 특성을 갖는 객체들을 모아 구성하는 것      |
| is part of     | 집단화(Aggregation)           | 관련 있는 객체들을 묶어 하나의 상위 객체를 구성하는 것 |
| is a           | 일반화(Generalization)        | 공동적인 성질들로 추상화한 상위 객체를 구성하는 것     |
| is a           | 특수화/상세화(Specialization) | 상위 객체를 구체화하여 하위 객체를 구성하는 것         |

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

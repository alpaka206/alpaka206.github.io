---
emoji: 👨🏻‍🏫
title: 62. E-R(개체-관계) 모델
date: '2024-01-15 09:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## E-R(Entity-Relationship, 개체-관계) 모델의 개요

> - E-R 모델은 개념적 데이터 모델의 가장 대표적인 것으로, 1976년 피터 첸(Peter Chen)에 의해 제안되고 기본적인 구성 요소가 정립되었다.

- E-R 모델은 개체와 개체 간의 관계를 기본 요소로 이용하여 현실 세계의 무질서한 데이터를 개념적인 논리 데이터로 표현하기 위한 방법으로 많이 사용되고 있다.
- E-R 모델은 개체 타입(Entity Type)과 이들 간의 관계 타입(Relationship Type)을 이용해 현실 세계를 개념적으로 표현한다.
- E-R 모델에서는 데이터를 개체(Entity), 관계(Relationship), 속성(Attribute) 으로 묘사한다.
- E-R 모델은 특정 DBMS를 고려한 것은 아니다.
- E-R 다이어그램으로 표현하며, 1:1, 1:N, N:M 등의 관계 유형을 제한 없이 나타낼 수 있다.
- 최초에는 개체, 관계, 속성과 같은 개념들로 구성되었으나 나중에는 일반화 계층같은 복잡한 개념들이 첨가되어 확장된 모델로 발전했다.

## E-R 다이어그램(Entity-Relationship Diagram)

> - E-R 다이어그램은 E-R 모델의 기본 아이디어를 시각적으로 표현하기 위한 그림으로, 실체 간의 관계는 물론 조직, 사용자, 프로그램, 데이터 등 시스템 내에서 역할을 가진 모든 실체들을 표현한다.![](https://velog.velcdn.com/images/alpaka206/post/20cf3911-4d2b-48bd-b6d9-29b6e5ea70e3/image.png)

- #### 예제: 다음은 고객과 주문서 간의 관계를 나타낸 E-R 다이어그램이다.![](https://velog.velcdn.com/images/alpaka206/post/516525d9-4a8f-4aad-8bf4-df74b7de2878/image.png)
  #### 해설
  - 개체: 고객, 주문서
  - 속성
    - 고객의 속성: 고객번호, 성명, 주소
    - 주문서의 속성: 주문번호, 품명, 수량, 금액
  - 관계: '고객'과 '주문서'의 '주문' 관계는 일 대 다의 관계, 즉 한 사람의 고객이 다수의 주문을 할 수 있고 주문서 1개는 특정인의 주문서로 되어 있다.
  - 밑줄친 속성은 기본키를 나타낸다.

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

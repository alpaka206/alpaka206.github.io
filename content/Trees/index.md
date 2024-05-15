---
emoji: 👨🏻‍🏫
title: 29. 트리
date: '2024-01-10 01:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## 트리의 개요

> - 트리는 정점(Node, 노드)과 선분(Branch, 가지)을 이용하여 사이클을 이루지 않도록 구성한 그래프(Graph)의 특수한 형태이다.

- 트리는 하나의 기억 공간을 노드(Node)라고 하며, 노드와 노드를 연결하는 선을 링크(Link)라고 한다.
- 트리는 가족의 계보(족보), 조직도 등을 표현하기에 적합하다.
- 트리 관련 용어![](https://velog.velcdn.com/images/alpaka206/post/0491d8f3-8bc7-4042-9986-0cd9bc5ece47/image.png)
  - 노드(Node): 트리의 기본 요소로서 자료 항목과 다른 항목에 대한 가지(Branch)를 합친 것(A, B, C, D, E, F, G, H, I, J, K, L, M)
  - 근 노드(Root Node): 트리의 맨 위에 있는 노드(A)
  - 디그리(Degree, 차수): 각 노드에서 뻗어 나온 가지의 수(A = 3, B = 2, C = 1, D = 3)
  - 단말 노드(Terminal Node) = 잎 노드(Leaf Node): 자식이 하나도 없는 노드, 즉 디그리가 0인 노드(K, L, F, G, M, I, J)
  - 자식 노드(Son Node): 어떤 노드에 연결된 다음 레벨의 노드들(D의 자식 노드 : H, I, J)
  - 부모 노드(Parent Node): 어떤 노드에 연결된 이전 레벨의 노드들(E. F의 부모 노드 : B)
  - 형제 노드(Brother Node, Sibling): 동일한 부모를 갖는 노드들(H의 형제 노드 : I, J)
  - 트리의 디그리 : 노드들의 디그리 중에서 가장 많은 수(노드 A나 D가 3개의 디그리를 가지므로 앞 트리의 디그리는 3이다.)

## 트리의 운행법

> - 트리를 구성하는 각 노드들을 찾아가는 방법을 운행법(Traversal)이라 한다.

- 이진 트리를 운행하는 방법은 산술식의 표기법과 연관성을 갖는다.
- 이진 트리의 운행법은 다음 세 가지가 있다.![](https://velog.velcdn.com/images/alpaka206/post/4e6cf77e-58c0-4b73-bc26-fcd31758cfba/image.png)
  - Preorder 운행: Root→ Left→ Right 순으로 운행한다. A, B, C
  - Inorder 운행: Left → Root → Right 순으로 운행한다. B, A, C - Postorder 운행: Left→ Right Root 순으로 운행한다. B, C, A
    ![](https://velog.velcdn.com/images/alpaka206/post/4caf4640-5a00-480e-bf6b-1e0cc546bc3d/image.png)![](https://velog.velcdn.com/images/alpaka206/post/06bbaec0-fa5e-497d-a61e-8029c07b6f73/image.png)

## 수식의 표기법

> - 산술식을 계산하기 위해 기억공간에 기억시키는 방법으로 이진 트리를 많이 사용한다. 이진 트리로 만들어진 수식을 인오더, 프리오더, 포스트오더로 운행하면 각각 중위(Infix), 전위(Prefix), 후위(Postfix) 표기법이 된다.![](https://velog.velcdn.com/images/alpaka206/post/b93ec6d3-fcb7-48fd-ab53-566cd9dd199b/image.png)

- 전위 표기법(Prefix): 연산자 → Left → Right, +AB
- 중위 표기법(InFix): Left → 연산자 → Right, A+B
- 후위표기법(PostFix): Left → Right → 연산자, AB+

### Infix 표기를 Postfix Prefix로 바꾸기

- Postfix나 Prefix는 스택을 이용하여 처리하므로 Infix는 Postfix나Prefix로 바꾸어 처리한다.
- 예제1. 다음과 같이 Infix로 표기된 수식을 Prefix와 Postfix로 변환하시오.
  X = A / B \* (C + D) + E
- Prefix로 변환하기
  1. 연산 우선순위에 따라 괄호로 묶는다.
     (X = (((A / B) \* (C + D)) + E))
  2. 연산자를 해당 괄호의 앞(왼쪽)으로 옮긴다.
     (X = (((A / B) _ (C + D)) + E)) → = (X + ( _ ( / (AB) + (CD))E))
  3. 필요없는 괄호를 제거한다.
     prefix 표기: = X+\*/AB+CDE
- Postfix로 변환하기
  1. 연산 우선순위에 따라 괄호로 묶는다.
     (X = (((A / B) \* (C + D)) + E))
  2. 연산자를 해당 괄호의 뒤(오른쪽)로 옮긴다.
     (X = (((A/B)* (C+D))+E) → (X(((AB) / (CD)+)*E)+)=
  3. 필요없는 괄호를 제거한다.
     Postfix 표기: XAB/CD+\*E+=

### Postfix Prefix로 표기된 수식을 Infix로 바꾸기

- 예제2. 다음과 같이 Postfix로 표기된 수식을 Infix로 변환하시오.
  ABC-/DEF+\*+
- Postfix Infix 표기법에서 연산자를 해당 피연산자 두 개의 뒤로 이동한 것이므로 연산자를 다시 해당 피연산자 두 개의 가운데로 옮기면 된다.
  1. 먼저 인접한 피연산자 두 개와 오른쪽의 연산자를 괄호로 묶는다.
     ((A(BC-)/)(D(EF+)\*)+)
  2. 연산자를 해당 피연산자의 가운데로 이동시킨다.
     ((A(BC-)/)(D(EF+)\*)+) → ((A/(B-C))+(D\*(E+F)))
  3. 필요 없는 괄호를 제거한다.
     ((A/(B-C))+(D*(E+F))) → A/(B-C)+D*(E+F)
- 예제3. 다음과 같이 Prefix로 표기된 수식을 Infix로 변환하시오.
  +/A-BC\*D+EF
  Prefix는 Infix 표기법에서 연산자를 해당 피연산자 두 개의 앞으로 이동한 것이므로 연산자를 다시 해당 피연산자 두 개의 가운데로 옮기면 된다.
  1. 먼저 인접한 피연산자 두 개와 왼쪽의 연산자를 괄호로 묶는다.
     (+(/A(-BC))(\*D(+EF)))
  2. 연산자를 해당 피연산자 사이로 이동시킨다.
     (+(/A(-BC))(\*D(+EF))) → ((A/(B-C))+(D\*(E+F)))
  3. 필요 없는 괄호를 제거한다.
     ((A/(B-C)) + (D\*(E+F))) → A/(B-C)+D\*(E+F)
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

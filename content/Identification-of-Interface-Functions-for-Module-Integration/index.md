---
emoji: 👨🏻‍🏫
title: 55. 모듈 연계를 위한 인터페이스 기능 식별
date: '2024-01-15 02:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## 모듈 연계의 개요

> - 모듈 연계는 내부 모듈과 외부 모듈 또는 내부 모듈 간 데이터의 교환을 위해 관계를 설정하는 것으로, 대표적인 모듈 연계 방법에는 EAI와 ESB 방식이 있다.

### EAI(Enterprise Application Integration)

- EAI는 기업 내 각종 애플리케이션 및 플랫폼 간의 정보 전달, 연계, 통합 등 상호연동이 가능하게 해주는 솔루션이다.
- EAI는 비즈니스 간 통합 및 연계성을 증대시켜 효율성 및 각 시스템 간의 확정성(Determinacy)을 높여 준다.
  ![](https://velog.velcdn.com/images/alpaka206/post/dc2f201f-a8b3-4f65-92a5-bbf8e13af0fb/image.png)

### ESB(Enterprise Service Bus)

![](https://velog.velcdn.com/images/alpaka206/post/ff95172d-7aca-45a8-9d49-a8fdb7516512/image.png)

- ESB는 애플리케이션 간 연계, 데이터 변환, 웹 서비스 지원 등 표준 기반의 인터페이스를 제공하는 솔루션이다.
- ESB는 애플리케이션 통합 측면에서 EAI와 유사하지만 애플리케이션 보다는 서비스 중심의 통합을 지향한다.
- ESB는 특정 서비스에 국한되지 않고 범용적으로 사용하기 위하여 애플리케이션과의 결합도(Coupling)"를 약하게(Loosely) 유지한다.
- 관리 및 보안 유지가 쉽고, 높은 수준의 품질 지원이 가능하다.

## 모듈 간 연계 기능 식별

> - 모듈 간 공통 기능 및 데이터 인터페이스를 기반으로 모듈과 연계된 기능을 시나리오 형태로 구체화하여 식별한다.

- 식별된 연계 기능은 인터페이스 기능을 식별하는데 사용된다.
- 모듈 간 연계 기능 식별![](https://velog.velcdn.com/images/alpaka206/post/2ac54593-391a-4575-9895-580fad3af6ae/image.png)

## 모듈 간 인터페이스 기능 식별

> - 식별된 모듈 간 관련 기능을 검토하여 인터페이스 동작에 필요한 기능을 식별한다.

- 인터페이스 동작은 대부분 외부 모듈의 결과 또는 요청에 의해 수행되므로 외부 및 인터페이스 모듈 간 동작하는 기능을 통해 인터페이스 기능을 식별한다.
- 내부 모듈의 동작은 외부 모듈에서 호출된 인터페이스에 의해 수행되고 결과를 나타내는 것이므로 해당 업무에 대한 시나리오를 통해 내부 모듈과 관련된 인터페이 스기능을 식별한다.
- 식별된 인터페이스 기능 중에서 실제적으로 필요한 인터페이스 기능을 최종적으로 선별한다.
- 식별된 인터페이스 기능은 인터페이스 기능 구현을 정의하는데 사용된다.

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

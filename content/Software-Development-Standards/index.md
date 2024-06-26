---
emoji: 👨🏻‍🏫
title: 132. 소프트웨어 개발 표준
date: '2024-02-06 01:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## 소프트웨어 개발 표준의 개요

> - 소프트웨어 개발 표준은 소프트웨어 개발 단계에서 수행하는 품질 관리에 사용되는 국제 표준을 의미한다.

- 대표적인 소프트웨어 개발 표준에는 ISO/IEC 12207, CMMI, SPICE 등이 있다.

## ISO/IEC 12207

> - ISO/IEC 12207은 ISO(International Organization for Standardization, 국제표준화기구)에서 만든 표준 소프트웨어 생명 주기 프로세스로 소프트웨어의 개발, 운영, 유지보수 등을 체계적으로 관리하기 위한 소프트웨어 생명 주기 표준을 제공한다.

- ISO/IEC 12207은 기본 생명 주기 프로세스, 지원 생명 주기 프로세스, 조직 생명 주기 프로세스로 구분한다.
  - 기본 생명주기 프로세스: 획득, 공급, 개발, 운영, 유지보수 프로세스
  - 지원 생명주기 프로세스: 품질 보증, 검증, 확인, 활동 검토, 감사, 문서화, 형상 관리, 문제 해결 프로세스
  - 조직 생명주기 프로세스: 관리, 기반 구조, 훈련, 개선 프로세스

## CMMI(Capability Maturity Model Integration)

> - CMMI(능력 성숙도 통합 모델)는 소프트웨어 개발 조직의 업무 능력 및 조직의 성숙도를 평가하는 모델로, 미국 카네기멜론 대학교의 소프트웨어 공학연구소(SEI)에서 개발하였다.

- CMMI의 소프트웨어 프로세스 성숙도는 초기, 관리, 정의, 정량적 관리, 최적화의 5단계로 구분한다.

####

| 단계                                | 프로세스             | 특징                                             |
| ----------------------------------- | -------------------- | ------------------------------------------------ |
| 초기(Initial)                       | 정의된 프로세스 없음 | 작업자 능력에 따라 성공 여부 결정                |
| 관리(Managed)                       | 규칙화된 프로세스    | 특정한 프로젝트 내의 프로세스 정의 및 수행       |
| 정의(Defined)                       | 표준화된 프로세스    | 조직의 표준 프로세스를 활용하여 업무 수행        |
| 정량적 관리(Quantitatively Managed) | 예측 가능한 프로세스 | 프로젝트를 정량적으로 관리 및 통제               |
| 최적화(Optimizing)                  | 지속적 개선 프로세스 | 프로세스 역량 향상을 위해 지속적인 프로세스 개선 |

## SPICE(Software Process Improvement and Capability dEtermination)

> - SPICE(소프트웨어 처리 개선 및 능력 평가 기준)는 정보 시스템 분야에서 소프트웨어의 품질 및 생산성 향상을 위해 소프트웨어 프로세스를 평가 및 개선하는 국제 표준으로, 공식 명칭은 ISO/IEC 15504이다.

- SPICE의 목적
  - 프로세스 개선을 위해 개발 기관이 스스로 평가하는 것
  - 기관에서 지정한 요구조건의 만족여부를 개발 조직이 스스로 평가하는 것
  - 계약 체결을 위해 수탁기관의 프로세스를 평가하는 것
- SPICE는 5개의 프로세스 범주와 40개의 세부 프로세스로 구성된다.

####

| 범주                                   | 특징                                                                                                                                                                                     |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 고객공급자(Customer-Supplier) 프로세스 | - 소프트웨어를 개발하여 고객에게 전달하는 것을 지원하고, 소프트웨어의 정확한 운용 및 사용을 위한 프로세스로 구성된다.<br>- 구성 요소: 인수, 공급, 요구 도출, 운영<br>- 프로세스 수: 10개 |
| 공학(Engineering) 프로세스             | - 시스템과 소프트웨어 제품의 명세화, 구현, 유지보수를 하는데 사용되는 프로세스로 구성된다.<br>- 구성 요소: 개발, 소프트웨어 유지보수<br>- 프로세스 수: 9개                               |
| 지원(Support) 프로세스                 | - 소프트웨어 생명 주기에서 다른 프로세스에 의해 이용되는 프로세스로 구성된다.<br>- 구성 요소: 문서화, 형상, 품질 보증, 검증, 확인, 리뷰, 감사, 품질 문제 해결<br>- 프로세스 수: 8개      |
| 관리(Management) 프로세스              | - 소프트웨어 생명 주기에서 프로젝트 관리자에 의해 사용되는 프로세스로 구성된다.<br>- 구성 요소: 관리, 프로젝트 관리, 품질 및 위험 관리<br>- 프로세스 수: 4개                             |
| 조직(Organization) 프로세스            | - 조직의 업무 목적 수립과 조직의 업무 목표 달성을 위한 프로세스로 구성된다.<br>- 구성 요소: 조직 배치, 개선 활동 프로세스, 인력 관리, 기반 관리, 측정 도구, 재사용<br>- 프로세스 수: 9개 |

- SPICE는 프로세스 수행 능력 단계를 불완전, 수행, 관리, 확립, 예측, 최적화의 6단계로 구분한다.

####

| 단계                         | 특징                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------- |
| Level 0 - 불완전(Incomplete) | 프로세스가 구현되지 않았거나 목적을 달성하지 못한 단계이다.                           |
| Level 1- 수행(Performed)     | 프로세스가 수행되고 목적이 달성된 단계이다.                                           |
| Level 2-관리(Managed)        | 정의된 자원의 한도 내에서 그 프로세스가 작업 산출물을 인도하는 단계이다.              |
| Level 3 - 확립(Established)  | 소프트웨어 공학 원칙에 기반하여 정의된 프로세스가 수행되는 단계이다.                  |
| Level 4-예측(Predictable)    | 프로세스가 목적 달성을 위해 통제되고 양적인 측정을 통해서 일관되게 수행되는 단계이다. |
| Level 5 - 최적화(Optimizing) | 프로세스 수행을 최적화하고, 지속적인 개선을 통해 업무 목적을 만족시키는 단계이다.     |

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

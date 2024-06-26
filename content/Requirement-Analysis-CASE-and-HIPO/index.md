---
emoji: 👨🏻‍🏫
title: 8. 요구사항 분석 CASE와 HIPO
date: '2024-01-05 00:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## 요구사항 분석을 위한 CASE(자동화 도구)

> - 요구사항 분석을 위한 자동화 도구는 요구사항을 자동으로 분석하고, 요구사항 분석 명세서를 기술하도록 개발된 도구를 의미

- 자동화 도구 사용의 이점
  - 표준화와 보고를 통한 문서화 품질 개선
  - 데이터베이스가 모두에게 이용 가능하다는 점에서 분석가들 간의 적절한 조정
  - 교차 참조도와 보고서를 통한 결함, 생략, 불일치 등의 발견 용이성
  - 변경이 주는 영향 추적의 용이성
  - 명세에 대한 유지보수 비용의 축소

### 종류

- #### SADT(Structed Analysis and Design Technique)
  - SoftTech 사에서 개발한 것으로 시스템 정의, 소프트웨어 요구사항 분석, 시스템/ 소프트웨어 설계를 위해 널리 이용되어 온 구조적 분석 및 설계 도구
  - 구조적 요구 분석을 하기 위해 블록 다이어그램을 채택한 자동화 도구
- #### SREM(Softwate Requirement Engineering Methodology) = RSL/REVS
  - TRW 사가 우주 국방 시스템 그룹에 의해 실시간 처리 소프트웨어 시스템에서 요구사항을 명확히 기술하도록 할 목적으로 개발한 것, RSL과 REVS를 사용하는 자동화 도구
  - RSL(Requirement Statement Language): 요소, 속성, 관계, 구조들을 기술하는 요구사항 기술 언어
  #####
  |      |                                                    |
  | ---- | -------------------------------------------------- |
  | 요소 | 요구사항 명세를 개발하기 위해 사용되는 개체와 개념 |
  | 속성 | 요소를 수정하거나 수식하기 위한 것                 |
  | 관계 | 개체들 간의 관계                                   |
  | 구조 | 정보 흐름을 묘사하기 위한것                        |
  - REVS(Requirement Engineering and Validation System): RSL로 기술된 요구사항들을 자동으로 분석하여 요구사항 분석 명세서를 출력하는 요구사항 분석기
- #### PSL/PSA
  - 미시간 대학에서 개발한 것으로 PSL과 PSA를 사용하는 자동화 도구이다.
  - PSL(Problem Statement Language): 문제(요구사항) 기술 언어
  - PSA(Problem Statement Analyzer): PSL로 기술한 요구사항을 자동으로 분석하여 다양한 보고서를 출력하는 문제 분석기
- TAGS(Technology for Automated Generation of Systems)
  - 시스템 공학 방법 응용에 대한 자동 접근 방법으로, 개발 주기의 전 과정에 이용할 수 있는 통합 자동화 도구이다.
  - 구성: IORL, 요구사항 분석과 IORL 처리를 위한 도구, 기초적인 TAGS 방법론
  - IORL: 요구사항 명세 언어

## HIPO

> - 시스템의 분석 및 설계나 문서화할 때 사용되는 기법으로, 시스템 실행 과정인 입력, 처리, 출력의 기능을 나타낸다.

- 기본 시스템 모델은 입력, 처리, 출력으로 구성되며, 하향식 소프트웨어 개발을 위한 문서화 도구
- 체계적인 문서 관리가 가능
- 기호, 도표 등을 사용하므로 보기 쉽고 이해하기도 쉽다
- 기능과 자료의 의존 관계를 동시에 표현할 수 있다.
- 변경, 유지보수가 용이하다.
- 시스템의 기능을 여러개의 고유 모듈들로 분할하여 이들 간의 인터페이스를 계층 구조로 표현한 것을 HIPO Chart라고 한다.

## HIPO Chart 종류

- 가지적 도표: 시스템의 전체적인 기능과 흐름을 보여주는 계층(Tree) 구조도
- 총체적 도표(총괄도표, 개요 도표): 프로그램을 구성하는 기능을 기술한 것으로 입력, 처리, 출력에 대한 전반적인 정보를 제공하는 도표
- 세부적 도표(상세 도표): 총체적 도표에 표시된 기능을 구성하는 기본 요소들을 상세히 기술하는 도표

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

---
emoji: 👨🏻‍🏫
title: 78. 스토리지
date: '2024-01-21 05:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## 스토리지(Storage)의 개요

> - 스토리지는 단일 디스크로 처리할 수 없는 대용량의 데이터를 저장하기 위해 서버와 저장장치를 연결하는 기술이다.

- 스토리지의 종류에는 DAS, NAS, SAN이 있다.

## DAS(Direct Attached Storage)

> - DAS는 서버와 저장장치를 전용 케이블로 직접 연결하는 방식으로, 일반 가정에서 컴퓨터에 외장하드를 연결하는 것이 여기에 해당된다.

- 서버에서 저장장치를 관리한다.
- 저장장치를 직접 연결하므로 속도가 빠르고 설치 및 운영이 쉽다.
- 초기 구축 비용 및 유지보수 비용이 저렴하다.
- 직접 연결 방식이므로 다른 서버에서 접근할 수 없고 파일을 공유할 수 없다.
- 확장성 및 유연성이 상대적으로 떨어진다.
- 저장 데이터가 적고 공유가 필요 없는 환경에 적합하다.
- DAS 구조![](https://velog.velcdn.com/images/alpaka206/post/872e22a3-98ae-403a-b3f1-8c2a64f68ff8/image.png)
  - 서버에 스토리지가 직접 연결되어 있어 속도는 빠르나 다른 서버에서 스토리지에 접근하여 사용할 수 없다.

## NAS(Network Attached Storage)

> - NAS는 서버와 저장장치를 네트워크를 통해 연결하는 방식이다.

- 별도의 파일 관리 기능이 있는 NAS Storage가 내장된 저장장치를 직접 관리한다.
- Ethernet 스위치를 통해 다른 서버에서도 스토리지에 접근할 수 있어 파일 공유가 가능하고, 장소에 구애받지 않고 저장장치에 쉽게 접근할 수 있다.
- DAS에 비해 확장성 및 유연성이 우수하다.
- 접속 증가 시 성능이 저하될 수 있다.
- NAS 구조![](https://velog.velcdn.com/images/alpaka206/post/b5efe0dd-5e9e-4da2-a58c-d4ba07aa177d/image.png)
  - 파일 관리 기능이 있는 NAS Storage가 네트워크 상에 독립적으로 연결되어 있으므로 서버들이 자유롭게 스토리지에 접근하여 파일을 공유할 수 있다.

## SAN(Storage Area Network)

> - SAN은 DAS의 빠른 처리와 NAS의 파일 공유 장점을 혼합한 방식으로, 서버와 저장 장치를 연결하는 전용 네트워크를 별도로 구성하는 방식이다.

- 광 채널(FC) 스위치를 이용하여 네트워크를 구성한다.
- 광 채널 스위치는 서버나 저장장치를 광케이블로 연결하므로 처리 속도가 빠르다.
- 저장장치를 공유함으로써 여러 개의 저장장치나 백업 장비를 단일화시킬 수 있다.
- 확장성, 유연성, 가용성이 뛰어나다.
- 높은 트랜잭션 처리에 효과적이나 기존 시스템의 경우 장비의 업그레이드가 필요하고, 초기 설치 시에는 별도의 네트워크를 구축해야 하므로 비용이 많이 든다.
- SAN 구조![](https://velog.velcdn.com/images/alpaka206/post/fdab6cfc-051f-4144-8203-88be33c82908/image.png)
  - 서버 스토리지가 광 채널 스위치로 연결된 별도의 전용 스토리지 네트워크를 구성하는 방식으로, 서버들이 저장장치 및 파일을 자유롭게 공유할 수 있다.

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

---
emoji: 👨🏻‍🏫
title: 120. 환경 변수
date: '2024-02-05 02:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## 환경 변수의 개요

> - 환경 변수(Environment Variable)란 시스템 소프트웨어의 동작에 영향을 미치는 동적인 값들의 모임을 의미한다.

- 환경 변수는 변수명과 값으로 구성된다.
- 환경 변수는 시스템의 기본 정보를 저장한다.
- 환경 변수는 자식 프로세스에 상속된다.
- 환경 변수는 시스템 전반에 걸쳐 적용되는 시스템 환경 변수와 사용자 계정 내에서만 적용되는 사용자 환경 변수로 구분된다.

## Windows의 주요 환경 변수

> - Windows에서 환경 변수를 명령어나 스크립트에서 사용하려면 변수명 앞뒤에 %를 입력해야 한다.

- Windows에서 set을 입력하면 모든 환경 변수와 값을 출력한다.

####

| 환경 변수         | 용도                                        |
| ----------------- | ------------------------------------------- |
| %ALLUSERPROFILE%  | 모든 사용자의 프로필이 저장된 폴더          |
| %APPDATA%         | 설치된 프로그램의 필요 데이터가 저장된 폴더 |
| %ComSpec%         | 기본명령 프롬프트로 사용할 프로그램명       |
| %HOMEDRIVE%       | 로그인한 계정의 정보가 저장된 드라이브      |
| %HOMEPATH%        | 로그인한 계정의 기본 폴더                   |
| LOGONSERVER%      | 로그인한 계정이 접속한 서버명               |
| %PATH%            | 실행 파일을 찾는 경로                       |
| %PATHEXT%         | cmd에서 실행할 수 있는 파일의 확장자목록    |
| %PROGRAMFILES%    | 기본 프로그램의 설치 폴더                   |
| %SYSTEMDRIVE%     | Windows가 부팅된 드라이브                   |
| %SYSTEMROOT%      | 부팅된 운영체제가 들어 있는 폴더            |
| %TEMP% 또는 %TMP% | 임시 파일이 저장되는 폴더                   |
| %USERDOMAIN%      | 로그인한 시스템의 도메인명                  |
| %USERNAME%        | 로그인한 계정 이름                          |
| %USERPROFILE%     | 로그인한 유저의 프로필이 저장된 폴더명      |

## UNIX/LINUX의 주요 환경 변수

> - UNIX나 LINUX에서 환경 변수를 명령어나 스크립트에서 사용하려면 변수명 앞에 '$'를 입력해야 한다.

- UINIX나 LINUX에서는 set, env, printenv, setenv 중 하나를 입력하면 모든 환경변수와 값을 표시한다.

####

| 환경 변수 | 용도                                      |
| --------- | ----------------------------------------- |
| $DISPLAY  | 현재 X 윈도 디스플레이 위치               |
| $HOME     | 사용자의 홈 디렉터리                      |
| $LANG     | 프로그램 사용 시 기본적으로 지원되는 언어 |
| $MAIL     | 메일을 보관하는 경로                      |
| $PATH     | 실행 파일을 찾는 경로                     |
| $PS1      | 쉘 프롬프트 정보                          |
| $PWD      | 현재 작업하는 디렉터리                    |
| $TERM     | 로긴 터미널 타입                          |
| $USER     | 사용자의 이름                             |

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

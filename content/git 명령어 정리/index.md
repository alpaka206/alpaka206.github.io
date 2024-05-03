---
emoji: 📚
title: git 명령어 정리
date: '2024-02-18 00:00:00'
author: Alpaka206
tags: git
categories: git
---

나도 그렇고 대부분의 사용자들이 주로 add, commit, push, pull, clone, fetch 등을 사용하겠지만 찾아보면 git 명령어는 정말 다양하다. 이 포스팅에서는 간단하게 살펴보고 업로드하는 포스팅을 진행해볼것이다.

# 1. 설정 및 초기화

📌 설정 및 초기화

```
전역적으로 구성하기
git config --global user.name "Your name"
사용자 이름 설정
git config --global user.email "Your email address"
사용자 이메일 설정

저장소별로 구성하기
git config user.name “Your name”
사용자 이름 설정
git config user.email “Your email address”
사용자 이메일 설정

git config --global --list
전역 설정 정보 조회
git config --list
저장소별 설정 정보 조회

git init
새로운 저장소 생성(.git 하위 디렉토리 생성, 폴더를 만든 후, 그 안에서 명령 실행하여 새로운 git 저장소 생성)
git clone <저장소 url>
저장소 복제하기
git remote add <원격 저장소> <저장소 url>
새로운 원격 저장소 추가하기
```

📌 기본적인 사용법

```
git add <파일>
새로운 파일을 추가
git add .
.gitignore파일에 있는 파일명들은 제외하고 파일을 추가
git add *
.gitignore파일에 있는 파일명들도 파일을 추가
git add -p [<파일> [<파일> [기타 파일들…]]]
파일의 일부를 스테이징하기
git commit -m “<메시지>”
커밋하기
git checkout HEAD <파일> [<파일>]
작업 트리의 변경 사항 돌려놓기
git reset HEAD <파일> [<파일>]
커밋되지 않고 스테이징된 변경 사항 재설정하기
git commit -m “<메시지>” --amend
마지막 커밋 고치기
git commit -C HEAD --amend
이전 커밋을 수정하고 커밋 메시지를 재사용하기
```

📌 브랜치

```
git branch
지역 브랜치 목록 보기
git branch -r
원격 브랜치 목록 보기
git branch -a
지역과 원격을 포함한 모든 브랜치 목록 보기
git clone --branch <브랜치> <저장소 url>
특정 브랜치 저장소 복제하기
git branch <새로운 브랜치>
현재 브랜치에서 새로운 브랜치 생성하기
git checkout <브랜치>
다른 브랜치 체크아웃하기
git branch <새로운 브랜치> <브랜치를 생성할 위치>
다른 시작 지점에서 브랜치 생성하기
git branch -f <기존 브랜치> [<브랜치를 생성할 위치>]
기존의 브랜치를 새로운 브랜치로 덮어쓰기
git checkout -m <기존 브랜치> <새로운 브랜치>
브랜치를 옮기거나 브랜치명 변경하기
git merge <브랜치>
다른 브랜치를 현재 브랜치로 합치기
git merge --no-commit <브랜치>
커밋하지 않고 합치기
git cherry-pick <커밋명>
선택하여 합치기
git cherry-pick -n <커밋명>
커밋하지 않고 선택하여 합치기
git merge --squash <브랜치>
브랜치의 이력을 다른 브랜치에 합치기
git branch -d <삭제할 브랜치>
삭제할 브랜치가 현재 브랜치에 합쳐졌을 경우에 브랜치 삭제하기
git branch -D <삭제할 브랜치>
삭제할 브랜치가 현재 브랜치에 합쳐지지 않았을 경우에 브랜치 삭제하기
```

📌 이력

```
git log
모든 이력 보기
git log -p
변경 사항을 보여주는 패치와 함께 로그 표시하기
git log -갯수 -p
특정 갯수의 항목과 패치만 보이도록 로그 제한하기
git log --since=”1 hours”
1시간 동안의 커밋 로그 보기
git log --before=”2 days”
이틀 전까지의 커밋 로그 보기
git log -1 HEAD-5
git log -1 HEAD^^^^^
git log -1 HEAD~1^^^^
HEAD보다 다섯 개 이전의 커밋 로그 보기
git log <시작 지점>…<끝 지점>
두 지점 사이의 커밋 로그 보기
git log --pretty=oneline
각 항목의 로그 이력 한 줄씩 보기
git log --stat
각 항목마다 영향 받은 줄의 통계 보기
git log --name-status
커밋할 시점의 파일 상태 보기
git diff
현재 작업 트리와 인덱스의 차이점 보기
git diff --cached
인덱스와 저장소의 차이점 보기
git diff HEAD
작업 트리와 저장소의 차이점 보기
git diff <시작 지점> <끝 지점>
저장소의 두 지점 사이의 차이점 보기
git diff --stat <시작 지점> [<끝 지점>]
차이점의 통계 보기
git blame <파일>
파일의 커밋 정보 줄 단위로 보기
git blame -C -C <파일>
파일의 줄 단위의 이동과 원본 파일 정보 보기
```

📌 원격저장소

```
git clone --depth 10 <저장소>
마지막 10개의 커밋만 포함하여 저장소 복제하기
git fetch
origin 저장소에서 합치지 않고 지역 브랜치로 변경 사항 가져오기
git fetch <원격 저장소>
원격 저장소에서 합치지 않고 지역 브랜치로 변경 사항 가져오기
git pull <원격 저장소>
원격 저장소에서 변경 사항을 가져와 현재 브랜치에 합치기
git pull
origin 저장소에서 변경 사항을 가져와 현재 브랜치에 합치기
git push <원격 저장소> <지역 브랜치>:<원격 브랜치>
지역 브랜치를 원격 브랜치에 푸싱하기
git push <원격 저장소> <지역 브랜치>
지역 브랜치를 동일한 이름의 원격 브랜치에 푸싱하기
git remote prune <원격 저장소>
원격 저장소에서 쓸모가 없어진 원격 브랜치 제거하기
git remote rm <원격 저장소>
원격 저장소를 제거하고 관련된 브랜치도 제거하기
```

더 많은 명령어들을 알아보고 싶다면 아래 링크에서 알아보면 된다.
[git 명령어 더 알아보기](https://git-scm.com/docs)

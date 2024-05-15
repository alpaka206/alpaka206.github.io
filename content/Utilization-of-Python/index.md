---
emoji: 👨🏻‍🏫
title: 107. Python의 활용
date: '2024-01-31 13:00:00'
author: Alpaka206
tags: 정보처리기사
categories: 정보처리기사
---

## if문

> - 형식 1: 조건이 참일 때만 실행한다.

```
if 조건:
  실행할 문장
```

- 형식 2: 조건이 참일 때와 거짓일 때 실행할 문장이 다르다.

```
if 조건:
  실행할 문장1
else:
  실행할 문장2
```

- 형식 3: 조건이 여러 개이고, 조건마다 실행할 문장이 다르다.

```
if 조건1:
  실행할 문장1
elif 조건2:
  실행할 문장2
elif 조건3:
  실행할 문장3
else:
  실행할 문장 4
```

- 형식 4: if문 안에 if문이 포함된다.

```
if 조건1:
  if 조건2:
    실행할 문장1
  else:
    실행할 문장2
else:
  실행할 문장3
```

## for문

> - 형식 1: range를 이용하는 방식이다.

```
for 변수 in range(최종값):
  실행할 문장
```

- 형식 2: 리스트(List)를 이용하는 방식이다.

```
for 변수 in 리스트
  실행할 문장
```

## While문

> - 형식

```
while 조건:
  실행할 문장
```

## 클래스

> - 정의 형식

```
class 클래스명:
  실행할 문장
  def 메소드명(self, 인수):
    실행할 문장
    return 값
```

- 객체의 선언 형식

```
변수명 = 클래스명()
```

### 클래스 없는 메소드의 사용

- C언어의 사용자 정의 함수와 같이 클래스 없이 메소드만 단독으로 사용할 수 있습니다.

```
def calc(x, y):
  x *= 3
  y /= 3
  print(x, y) ⊙
  return x
a, b = 3, 12
a = calc(a,b)
print(a, b)
```

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

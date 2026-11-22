# alpaka206.github.io

김규원의 포트폴리오. 데스크톱에서는 macOS, 휴대폰에서는 iOS처럼 동작하는 웹입니다.
처음 켜는 순간부터 로그인, Dock, 메뉴 막대, Spotlight, 창 관리, 휴대폰의 앱 열고 닫기까지 브라우저 안에서 그대로 재현했습니다.

- 사이트: https://alpaka206.github.io
- 텍스트 버전: https://alpaka206.github.io/text (자바스크립트 없이도 같은 내용)

## 실행

```bash
npm install
npm run dev        # 이미지 생성 후 개발 서버
npm test           # 단위 테스트 (Vitest)
npm run build      # 타입 검사, 빌드, 페이지별 정적 HTML 생성
```

Node 22.18 이상이 필요합니다. `scripts/*.ts`를 Node가 바로 실행합니다. CI는 `.node-version`의 Node LTS(26)로 빌드하고, npm 패키지와 GitHub Actions는 Dependabot이 매주 업데이트를 제안합니다. Actions는 커밋 SHA로 고정하고, CI에서 `npm audit signatures`로 패키지 서명을 확인합니다.

## 구조

```
assets/            원본 이미지. 배경화면, 아이콘, 화면 캡처, PDF 쪽
scripts/           build-images.ts (AVIF, WebP 생성), prerender.ts (페이지별 HTML)
src/
  content/         모든 문구와 숫자. 화면은 여기서만 읽습니다
  os/              운영체제 상태: 창, 세션, 설정, 메뉴, 단축키, 검색, 딥 링크
  lib/             스프링 물리, 드래그, Liquid Glass 굴절, 효과음, 기기 상태
  ui/              두 셸이 함께 쓰는 Glass, AppIcon, Symbol
  desktop/         macOS 셸: 부팅, 로그인, 메뉴 막대, Dock, 창, Spotlight, 제어 센터
  phone/           iOS 셸: 잠금 화면, 홈 화면, 폴더, 앱 열기와 닫기 제스처
  apps/<app>/      앱마다 desktop.tsx와 phone.tsx. 열 때 내려받습니다
  reader/          텍스트 버전. 빌드할 때 모든 페이지에 미리 렌더링됩니다
```

### 원칙

- **내용은 한 곳에.** `src/content`가 유일한 출처입니다. 데스크톱 창, 휴대폰 앱, 텍스트 버전, 검색 색인, 페이지별 메타 태그가 모두 같은 데이터를 읽습니다. 문구 규칙(가운뎃점과 줄표 금지, 전화번호 비공개)은 테스트가 지킵니다.
- **메뉴가 곧 단축키.** 메뉴 항목의 단축키 표기(`⌥⌘H`)를 그대로 읽어 키 입력과 연결합니다. 메뉴와 키보드 동작이 어긋날 수 없고, 한글 입력 상태에서도 `KeyboardEvent.code`로 동작합니다.
- **창 관리는 순수 함수.** `os/windows.ts`의 상태 전이는 테스트하기 쉬운 함수이고, Zustand 스토어는 연결만 합니다.
- **가짜 상태 표시 없음.** 배터리와 네트워크 아이콘은 방문자 기기의 실제 값입니다. 브라우저가 알려 주지 않으면 그리지 않습니다. 제어 센터의 모든 버튼은 실제로 화면을 바꿉니다.

### 성능

- 데스크톱 셸과 휴대폰 셸, 각 앱은 따로 나뉜 청크입니다. 기기에 필요한 코드만 받습니다.
- 이미지는 `assets/`의 원본에서 AVIF와 WebP를 여러 크기로 만들고, `<picture>`와 `srcset`으로 골라 받습니다. 크기 정보가 있어 레이아웃이 밀리지 않고, 사진은 대표 색을 먼저 칠합니다.
- 첫 화면의 배경화면만 기기와 색상 모드에 맞춰 미리 불러옵니다.
- Apple 기기는 시스템 글꼴(SF Pro, Apple SD Gothic Neo)을 쓰고, 그 밖의 기기만 Pretendard를 유니코드 범위별로 받습니다.
- 애니메이션은 `transform`과 `opacity`만 움직입니다. 스프링은 CSS `linear()` 이징으로 만들어 브라우저가 처리하고, 제스처를 놓는 순간에만 손가락 속도를 이어받는 rAF 스프링을 씁니다.

### 접근성

- 처음 Tab을 누르면 텍스트 버전으로 가는 링크가 나옵니다.
- 동작 줄이기, 투명도 줄이기는 시스템 설정을 따르고 시스템 설정 앱에서 바꿀 수 있습니다.
- 메뉴는 `menubar`, `menu`, `menuitem` 역할과 화살표 키 탐색을 지원합니다.

## 에셋

배경화면과 앱 아이콘은 이 사이트를 위해 새로 만든 이미지입니다(OpenAI 이미지 생성, Codex). Apple의 로고, 아이콘, 배경화면, 글꼴 파일은 포함하지 않습니다. 앱 아이콘 윤곽선은 Apple UI 키트의 연속 곡률 모양을 따랐습니다.

import type { ExperienceSection } from '../types';

export const EXPERIENCE: ExperienceSection[] = [
  {
    title: '🖥️ Frontend Development',
    lines: [
      'React와 TypeScript 기반의 SPA 개발에 익숙하며, 서비스의 구조 설계부터 사용자 흐름, 상태 관리까지 전체적인 화면 동작을 고려한 개발을 지향합니다.',
      'Recoil, Zustand 등 다양한 상태 관리 도구를 프로젝트 상황에 맞게 선택하고 구조화해본 경험이 있으며, 최근에는 Zustand 기반 구조 개선 및 리팩토링 작업에 참여했습니다.',
      'React Query를 활용한 데이터 요청, 캐싱, 무한스크롤 구성 등 사용자 중심의 데이터 흐름 처리에 익숙하며, 실시간성이 요구되는 서비스에서는 SockJS + STOMP 기반의 채팅 및 알림 기능을 직접 구현했습니다.',
      'Next.js를 활용한 서버사이드 렌더링 경험과 Vite 기반 번들러 설정 및 성능 최적화도 경험하였습니다.',
      'Lighthouse 분석을 통한 성능 디버깅과 개선을 반복적으로 수행해왔습니다.',
      'OAuth 2.0 기반의 소셜 로그인(Kakao, Google 등)을 직접 구현하고, React Native WebView와의 앱 연동 방식도 학습하여 실제 적용 사례에 대비하고 있습니다.',
    ],
  },
  {
    title: 'Component & UI Design',
    lines: [
      'Atomic Design 패턴 기반으로 컴포넌트의 재사용성과 유지보수성을 고려한 구조 설계를 해왔으며, 디자인 시스템 관점의 일관된 UI 구현 경험을 갖고 있습니다.',
      'Storybook을 활용해 컴포넌트 문서화 및 협업용 UI 테스트 환경을 구성해보았고, 스타일링은 styled-components, vanilla-extract 기반의 CSS-in-JS 방식에 익숙합니다.',
      '크로스 브라우징, 반응형 UI, 웹 접근성 등을 고려한 실무 UI를 직접 구현해왔고, Keyframe을 활용한 인터랙션 중심 애니메이션 구성 경험도 보유하고 있습니다.',
    ],
  },
  {
    title: 'Testing & Tooling',
    lines: [
      'Jest 기반의 단위 테스트 작성과 사용자 시나리오 중심의 테스트 케이스 정의 경험이 있으며, 실제로 주요 로직이나 라이브러리 리팩토링 시 테스트 코드 기반 검증을 진행했습니다.',
      'Vite 및 Webpack을 활용해 번들링 구조를 설정하고, 코드 스플리팅, Lazy loading 등을 통해 초기 로딩 성능을 개선한 경험도 있습니다.',
    ],
  },
  {
    title: 'Backend & System Integration',
    lines: [
      '실제 프로젝트에서 프론트엔드와 백엔드가 맞물려 동작하는 구조를 고려하여 API 스펙 정의, 인터페이스 설계, 연동 테스트까지 End-to-End 흐름을 관리해본 경험이 있습니다.',
      'FastAPI와 Node.js, NestJS 기반의 간단한 백엔드 서버 개발도 경험해 보았습니다.',
      'Java 기반의 TCP/UDP 통신 구조를 활용한 소형 프로그램 개발 경험을 통해 네트워크 구조에 대한 기본 이해를 쌓았습니다.',
    ],
  },
];

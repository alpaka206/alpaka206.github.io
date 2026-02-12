import type { Project } from '../types';

export const PROJECTS: Project[] = [
  {
    title: 'COMATCHING',
    subtitle: 'AI 기반 실시간 커플 매칭 서비스',
    role: 'Frontend Leader',
    period: '2023.09 - 2024.10',
    teamSize: 'FE 3 / BE 3 / AI 3 / Design 2 / PM 2',
    highlights: [
      '코드 스플리팅 및 불필요 렌더링 제거로 초기 로딩 속도 30% 개선',
      '총 2,095명 이상의 사용자가 참여한 실서비스 운영',
    ],
    points: [
      '실시간 포인트 관리 및 사용자 매칭 로직 구현',
      'Recoil 기반 상태 구조 설계로 프로필 카드, 포인트 흐름 등 전체 UX 설계',
      '코드 스플리팅 및 불필요 렌더링 제거로 초기 로딩 속도 30% 개선',
      '총 2,095명 이상의 사용자가 참여한 실서비스 운영',
      '지속적인 사용자 피드백 반영 및 리팩토링으로 UI/UX 개선 및 유지보수성 향상',
    ],
    stacks: [
      'React',
      'TypeScript',
      'Recoil',
      'vanilla-extract',
      'Vite',
      'SockJS',
      'STOMP',
      'AWS',
    ],
    link: 'https://github.com/COMAtching',
  },
  {
    title: '부천FC - Friends Community',
    subtitle: '응원 성향 기반 축구 팬 매칭 플랫폼',
    role: 'Frontend Developer',
    period: '2024.08 - 2024.10',
    teamSize: 'FE 3 / BE 3 / AI 3 / Design 2 / PM 2',
    highlights: [
      '실시간 매칭 UI 구현 및 관리자 기능 추가',
      '운영성과 유지보수성을 고려한 구조 개선',
    ],
    points: [
      'COMATCHING 기반 확장, 실시간 팬 매칭 서비스 외주 개발',
      '응원 성향에 따른 실시간 매칭 UI 구현 및 관리자 기능 추가',
      'STOMP 기반 실시간 데이터 흐름과 사용자 중심 페이지 전환 구조 설계',
      '운영성과 유지보수성을 고려한 구조 개선',
    ],
    stacks: ['React', 'TypeScript', 'Recoil', 'SockJS', 'STOMP', 'AWS'],
    link: 'https://github.com/COMAtching/COMATCHING_FC_FE',
  },
  {
    title: 'Share-It',
    subtitle: '교내 중고 물품 공유 및 대여 플랫폼',
    role: 'Frontend Developer',
    period: '2024.01 - 2024.06',
    teamSize: 'FE 2 / BE 2 / Design 1',
    highlights: [
      '무한 스크롤 목록 조회 및 실시간 채팅 기능 직접 구현',
      '인증부터 반납까지의 상태 흐름 구조화로 UX 향상',
    ],
    points: [
      '대여 주기를 고려한 상품 등록/검색/예약 UI 흐름 설계/구현',
      '무한 스크롤 목록 조회 및 실시간 채팅 기능 직접 구현',
      '인증부터 반납까지의 상태 흐름 구조화로 UX 향상',
      '종합설계프로젝트1 A+ 달성',
    ],
    stacks: ['React', 'Firebase', 'Axios', 'Recoil'],
    link: 'https://github.com/share-it-cuk/share-it-frontend',
  },
  {
    title: '새차처럼',
    subtitle: '손세차 매장 정보 및 예약 플랫폼',
    role: 'Frontend Developer',
    period: '2023.10 - 2023.08',
    teamSize: 'FE 1 / BE 1 / Design 1 / PM 1',
    highlights: [
      '상세 정보/리뷰/예약 흐름 UI 및 데이터 흐름 설계',
      '창업유망팀 300 최종 선정, 하나금융 소셜벤처 유니버시티 우수팀',
    ],
    points: [
      '매장 정보 제공, 예약 및 리뷰가 가능한 웹 플랫폼',
      '상인 홍보/예약 시스템, 사용자 정보 탐색/합리 가격 연결',
      '상세 정보/리뷰/예약 흐름 UI 및 데이터 흐름 설계',
      '창업유망팀 300 최종 선정, 하나금융 소셜벤처 유니버시티 우수팀',
    ],
    stacks: ['React', 'Firebase', 'Axios'],
  },
];

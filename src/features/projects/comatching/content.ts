import type { ProjectSection } from '@/features/projects/common/types';

export const COMATCHING_SUMMARY =
  '대학 축제 기간 동안 실사용자를 대상으로 운영된 AI 기반 실시간 커플 매칭 서비스';

export const COMATCHING_HIGHLIGHTS = [
  '프론트엔드 리더: 기획부터 개발·배포·운영까지 총괄',
  '실사용자 2,095명 참여 서비스 안정 운영',
  '실시간 매칭 및 포인트 시스템 운영 완주율 확보',
];

export const COMATCHING_RESPONSIBILITIES = [
  {
    title: '프론트엔드 아키텍처 설계 및 핵심 기능 개발',
    items: [
      '사용자 주요 플로우 전반의 프론트엔드 기능 구현',
      '관리자 포인트 충전 및 사용자 상태 실시간 관리 로직 설계/구현',
      '서비스 특성에 맞춘 상태 관리 구조 설계 및 책임 분리',
    ],
  },
  {
    title: '실시간 매칭 및 상태 관리 구조 설계',
    items: [
      'WebSocket(SockJS, STOMP) 기반 실시간 통신 처리',
      'Recoil로 사용자 포인트/매칭 상태 전역 관리',
      '실시간 충전/차감 상태 불일치 문제 리팩토링으로 해결',
    ],
  },
  {
    title: '성능 최적화 및 사용자 경험 개선',
    items: [
      '코드 스플리팅 및 Lazy Loading으로 초기 로딩 30%+ 개선',
      'Chart.js로 결과 이해를 돕는 UX 개선',
      'Lighthouse 기반 병목 분석 및 개선',
    ],
  },
  {
    title: '팀 리딩 및 협업 주도',
    items: [
      'Figma, Notion 기반 협업 리딩 및 일정/우선순위 관리',
      'Storybook으로 UI 문서화 및 컴포넌트 일관성 향상',
    ],
  },
];

export const COMATCHING_OUTCOMES = [
  '대학 축제 기간 2,095명 참여 서비스 안정 운영',
  '실시간 매칭/포인트 시스템 문제 없이 운영',
  '부천FC 외주 제안으로 Friends Community 서비스 추가 개발',
];

export const COMATCHING_SECTIONS: ProjectSection[] = [
  {
    title: '기능 - 회원가입',
    bullets: [
      'Oauth 2.0을 도입하여 kakao 소셜 로그인을 도입',
      '채팅 형식으로 정보 받음',
      '취향 입력 받음',
      '순서대로 추가 정보를 입력 받음',
    ],
    images: [
      '/assets/projects/Comatching/register/login.webp',
      '/assets/projects/Comatching/register/chat.webp',
      '/assets/projects/Comatching/register/hobby.webp',
      '/assets/projects/Comatching/register/user-info.webp',
    ],
  },
  {
    title: '메인페이지',
    bullets: [
      '간단한 개인 정보 및 추가 정보 확인 가능',
      '충전 요청 보낼 수 있음',
      'QR코드로 빠르게 진행 가능',
    ],
    images: [
      '/assets/projects/Comatching/main.webp',
      '/assets/projects/Comatching/charge.webp',
    ],
  },
  {
    title: '매칭',
    bullets: [
      '기본 조건으로 MBTI를 고를 수 있고 유료 조건도 사용 가능',
      'AI를 활용하여 본인이 고른 조건과 가장 유사한 사람 제공',
    ],
    images: [
      '/assets/projects/Comatching/matching/matching.webp',
      '/assets/projects/Comatching/matching/loading.webp',
      '/assets/projects/Comatching/matching/result.webp',
    ],
  },
  {
    title: '결과 모아보기',
    bullets: ['본인이 뽑은 내역 확인 가능 및 사후평가'],
    images: ['/assets/projects/Comatching/result-overview.webp'],
  },
  {
    title: '관리자 충전 내역 관리',
    bullets: ['관리자가 포인트 충전 및 뽑힐 횟수 증가 가능'],
    images: [
      '/assets/projects/Comatching/admin/admin-login.webp',
      '/assets/projects/Comatching/admin/request.webp',
    ],
  },
];

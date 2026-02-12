import type { ProjectSection } from '@/features/projects/common/types';

export const SHAREIT_SUMMARY =
  '교내 구성원을 대상으로 한 중고 물품 대여 플랫폼';

export const SHAREIT_HIGHLIGHTS = [
  '실시간 채팅·검색·리뷰 핵심 기능 설계 및 구현',
  '다중 조건 검색/자동완성으로 탐색 UX 개선',
  '페이지 단위 상태 초기화 및 API 최적화로 성능 향상',
];

export const SHAREIT_RESPONSIBILITIES = [
  {
    title: '핵심 사용자 기능 설계 및 구현',
    items: [
      '실시간 채팅, 검색/필터링, 리뷰, 회원가입/로그인 페이지 개발',
      '소켓 통신 기반 실시간 채팅으로 빠른 커뮤니케이션 환경 제공',
    ],
  },
  {
    title: '검색 및 탐색 UX 개선',
    items: [
      '카테고리/대여 상태/키워드 다중 조건 필터링 구현',
      '자동완성 및 연관 검색어로 탐색 속도 개선',
    ],
  },
  {
    title: '사용자 중심 UI 흐름 및 성능 최적화',
    items: [
      '리뷰 작성/조회, 인증 플로우 등 사용자 관점 UI 흐름 재설계',
      '페이지 단위 상태 초기화 로직 구성',
      'API 호출 최적화로 불필요 렌더링 감소',
    ],
  },
];

export const SHAREIT_OUTCOMES = [
  '실시간 채팅/검색/리뷰 핵심 기능 안정 구현',
  '페이지 기반 상태 관리 및 API 최적화로 UX·성능 개선',
];

export const SHAREIT_SECTIONS: ProjectSection[] = [
  {
    title: '기능 - 회원가입',
    bullets: [
      'Oauth 2.0 카카오 로그인',
      '일반 회원가입',
      '이메일 인증',
      '입력 시 다음 단계 슬라이딩',
    ],
    images: [
      '/assets/projects/ShareIt/register/login_kakao.webp',
      '/assets/projects/ShareIt/register/login_email.webp',
    ],
  },
  {
    title: '메인페이지',
    bullets: [
      '개인 정보/반납 & 대여 일정 확인',
      '최근 등록 물건',
      '사이드바',
      '최근 검색어 & 자동완성',
    ],
    images: [
      '/assets/projects/ShareIt/search.webp',
      '/assets/projects/ShareIt/sidebar.webp',
    ],
  },
  {
    title: '등록',
    bullets: [
      '필요해요/빌려주기 등록',
      '사진 & 가격 & 해시태그 & 부가설명',
      '빌려주기만 사진 필수',
    ],
    images: ['/assets/projects/ShareIt/registration.webp'],
  },
  {
    title: '리스트',
    bullets: ['최근 등록순 기본', '무한 스크롤', '인기 해시태그'],
    images: [
      '/assets/projects/ShareIt/borrow/list.webp',
      '/assets/projects/ShareIt/need/list.webp',
    ],
  },
  {
    title: '상세페이지',
    bullets: ['평점/좋아요 확인'],
    images: [
      '/assets/projects/ShareIt/borrow/detail.webp',
      '/assets/projects/ShareIt/need/detail.webp',
    ],
  },
  {
    title: '채팅페이지',
    bullets: ['약속 잡기, 거래 완료'],
    images: [
      '/assets/projects/ShareIt/chat/chat.webp',
      '/assets/projects/ShareIt/chat/widget.webp',
    ],
  },
  {
    title: '리뷰페이지',
    bullets: ['거래내역 확인, 별점 부여'],
    images: ['/assets/projects/ShareIt/review.webp'],
  },
  {
    title: '개발한 내역',
    bullets: [
      '무한 스크롤 리스트',
      '웹소켓 채팅',
      '카카오 로그인',
      '이메일 인증',
      '파일 형식 제안으로 보안 강화',
    ],
  },
];

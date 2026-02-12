import type { ProjectSection } from '@/features/projects/common/types';

export const ALNC_SUMMARY =
  '손세차 업체와 사용자를 연결하는 예약 기반 중개 서비스';

export const ALNC_HIGHLIGHTS = [
  '위치 기반 조회와 예약 기능을 안정적으로 구현',
  '예약 정확성 확보를 위한 상태 관리 로직 설계',
  '협업 과정에서 UI/UX 개선 사이클 경험',
];

export const ALNC_RESPONSIBILITIES = [
  {
    title: '핵심 사용자 기능 구현',
    items: [
      '회원가입/로그인, 위치 기반 업체 조회, 예약 기능 구현',
      '날짜·시간 선택 기반 예약 플로우 설계',
      '운영 시간/가격/후기 정보 시각화로 탐색 비용 절감',
    ],
  },
  {
    title: '예약 신뢰도 개선',
    items: [
      '예약 정보와 연동되는 상태 관리 로직 설계',
      '중복 예약 방지 및 예약 정확성 확보',
      '예약 완료 알림 포함 전 과정 UX 구현',
    ],
  },
  {
    title: '협업 기반 UI 개선',
    items: [
      '기획자/디자이너와 협업하여 레이아웃·컴포넌트 개선',
      '사용자 피드백 기반 UI/UX 지속 개선',
    ],
  },
];

export const ALNC_OUTCOMES = [
  '위치 기반 조회와 예약 기능을 안정적으로 구현해 서비스 완성도 개선',
  '협업과 반복 개선 사이클을 통해 실서비스 수준의 커뮤니케이션 경험 확보',
];

export const ALNC_SECTIONS: ProjectSection[] = [
  {
    title: '기능 - 로그인',
    bullets: ['사용자 구분을 위한 로그인 기능'],
    images: ['/assets/projects/ALNC/login.webp'],
  },
  {
    title: '메인페이지',
    bullets: ['날씨정보 확인 가능', '간단한 게시글 열람 가능'],
    images: ['/assets/projects/ALNC/main.webp'],
  },
  {
    title: '견적 신청',
    bullets: [
      '고압수, 스팀 세차 선택 가능',
      '우선순위 선택 가능',
      '사진 및 정보 작성 가능',
    ],
    images: [
      '/assets/projects/ALNC/selection/select-service.webp',
      '/assets/projects/ALNC/selection/select-option.webp',
      '/assets/projects/ALNC/selection/select-priority.webp',
    ],
  },
  {
    title: '견적서 보기',
    bullets: ['견적서 보낸 업체 리스트 열람', '업체 상세정보 열람'],
    images: [
      '/assets/projects/ALNC/list/history.webp',
      '/assets/projects/ALNC/list/detail.webp',
    ],
  },
  {
    title: '견적함',
    bullets: ['예약 내역 열람 가능'],
    images: ['/assets/projects/ALNC/quotes-overview.webp'],
  },
];

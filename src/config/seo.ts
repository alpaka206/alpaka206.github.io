export const SEO_BASE_URL = 'https://alpaka206.github.io';

export const SEO_SITE_NAME = '김규원 포트폴리오';

export const SEO_IMAGE_URL = `${SEO_BASE_URL}/assets/common/desktop/windows-cloud-wallpaper.webp`;

export type RouteSeo = {
  title: string;
  description: string;
  canonicalPath: string;
};

export const DEFAULT_SEO: RouteSeo = {
  title: '김규원 | Frontend Developer Portfolio',
  description:
    '사용자 흐름, 실시간성, 유지보수성을 고려해 제품 경험을 설계하는 프론트엔드 개발자 김규원의 포트폴리오입니다.',
  canonicalPath: '/',
};

export const ROUTE_SEO: Record<string, RouteSeo> = {
  '/': DEFAULT_SEO,
  '/profile': {
    title: 'Profile | 김규원 포트폴리오',
    description:
      '김규원의 프론트엔드 경력, 기술 스택, 프로젝트, 교육 이력을 정리한 포트폴리오 페이지입니다.',
    canonicalPath: '/profile/',
  },
  '/prize': {
    title: 'Awards | 김규원 포트폴리오',
    description:
      '김규원의 수상, 대외활동, 프로젝트 성과를 확인할 수 있는 포트폴리오 페이지입니다.',
    canonicalPath: '/prize/',
  },
  '/github': {
    title: 'GitHub | 김규원 포트폴리오',
    description:
      '김규원의 GitHub 활동과 개발 프로젝트를 확인할 수 있는 포트폴리오 페이지입니다.',
    canonicalPath: '/github/',
  },
  '/comatching': {
    title: 'COMATCHING | 김규원 포트폴리오',
    description:
      'AI 기반 실시간 커플 매칭 서비스 COMATCHING에서 프론트엔드 리더로 구현한 성능 개선과 실시간 UX 경험입니다.',
    canonicalPath: '/comatching/',
  },
  '/share-it': {
    title: 'Share-It | 김규원 포트폴리오',
    description:
      '교내 중고 물품 공유 및 대여 플랫폼 Share-It에서 구현한 상품 탐색, 예약, 무한 스크롤, 실시간 채팅 경험입니다.',
    canonicalPath: '/share-it/',
  },
  '/shareit': {
    title: 'Share-It | 김규원 포트폴리오',
    description:
      '교내 중고 물품 공유 및 대여 플랫폼 Share-It에서 구현한 상품 탐색, 예약, 무한 스크롤, 실시간 채팅 경험입니다.',
    canonicalPath: '/share-it/',
  },
  '/alnc': {
    title: '새차처럼 | 김규원 포트폴리오',
    description:
      '손세차 매장 정보와 예약 흐름을 설계한 새차처럼 프로젝트의 프론트엔드 구현 경험입니다.',
    canonicalPath: '/alnc/',
  },
};

import type { ProjectData } from '@/features/projects/common/types';

export const SHAREIT_DATA: ProjectData = {
  title: 'ShareIt',
  hero: '/assets/ShareIt/mainpage.webp',
  skills: [
    { label: 'React', color: '#61DBFB' },
    { label: 'JavaScript', color: '#F0DB4F' },
    { label: 'Recoil', color: '#007AF4' },
    { label: 'axios', color: '#0A99E0' },
  ],
  tools: [
    { label: 'Visual Studio Code', color: '#b0a1ec' },
    { label: 'Notion', color: '#eeeeee' },
    { label: 'Figma', color: '#F24E1E' },
    { label: 'Firebase', color: '#FFCA28' },
  ],
  period: '2024.01.25 ~ 2024.06.03',
  members: '5명',
  roles: [
    { label: '프론트엔드 개발', color: '#dbebdb' },
    { label: '퍼블리싱', color: '#ffe2dd' },
    { label: '기획', color: '#f1c40f' },
  ],
  contribution: '100%',
  category: { label: 'WEB', color: '#f1780f' },
  githubUrl: 'https://github.com/share-it-cuk/share-it-frontend',
  sections: [
    {
      title: '기능 - 회원가입',
      bullets: [
        'Oauth 2.0 카카오 로그인',
        '일반 회원가입',
        '이메일 인증',
        '입력 시 다음 단계 슬라이딩',
      ],
      images: ['/assets/ShareIt/KaKaologin.webp', '/assets/ShareIt/Email.webp'],
    },
    {
      title: '메인페이지',
      bullets: [
        '개인 정보/반납·대여 일정 확인',
        '최근 등록 물건',
        '사이드바',
        '최근 검색어 & 자동완성',
      ],
      images: ['/assets/ShareIt/Search.webp', '/assets/ShareIt/sidebar.webp'],
    },
    {
      title: '등록',
      bullets: [
        '필요해요/빌려주기 등록',
        '사진·가격·해시태그·부가설명',
        '빌려주기만 사진 필수',
      ],
      images: ['/assets/ShareIt/registration.webp'],
    },
    {
      title: '리스트',
      bullets: ['최근 등록순 기본', '무한 스크롤', '인기 해시태그'],
      images: [
        '/assets/ShareIt/borrowpage.webp',
        '/assets/ShareIt/needpage.webp',
      ],
    },
    {
      title: '상세페이지',
      bullets: ['평점/좋아요 확인'],
      images: [
        '/assets/ShareIt/borrowDetail.webp',
        '/assets/ShareIt/needDetail.webp',
      ],
    },
    {
      title: '채팅페이지',
      bullets: ['약속 잡기, 거래 완료'],
      images: ['/assets/ShareIt/chat.webp', '/assets/ShareIt/chatwidget.webp'],
    },
    {
      title: '리뷰페이지',
      bullets: ['거래내역 확인, 별점 부여'],
      images: ['/assets/ShareIt/review.webp'],
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
  ],
};

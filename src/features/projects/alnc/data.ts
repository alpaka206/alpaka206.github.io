import type { ProjectData } from '@/features/projects/common/types';

export const ALNC_DATA: ProjectData = {
  title: '새차처럼',
  hero: '/assets/ALNC/mainpage.webp',
  skills: [
    { label: 'React', color: '#61DBFB' },
    { label: 'JavaScript', color: '#F0DB4F' },
    { label: 'axios', color: '#0A99E0' },
  ],
  tools: [
    { label: 'Visual Studio Code', color: '#b0a1ec' },
    { label: 'Notion', color: '#eeeeee' },
    { label: 'Figma', color: '#F24E1E' },
    { label: 'Firebase', color: '#FFCA28' },
  ],
  period: '2022.11.10 ~ 2023.08.25',
  membersLabel: '참가 인원',
  members: '4명',
  roles: [
    { label: '프론트엔드 개발', color: '#dbebdb' },
    { label: '퍼블리싱', color: '#ffe2dd' },
    { label: '기획', color: '#f1c40f' },
    { label: '운영 및 홍보', color: '#fe340f' },
  ],
  contribution: '100%',
  result: [
    '학생창업유망팅 선정 및 k-300 출정',
    '하나 소셜벤처 유니버시티 우수팀 선정',
    '가톨릭대학교 창업경진대회 장려상 수상',
  ],
  category: { label: 'WEB', color: '#f1780f' },
  sections: [
    {
      title: '기능 - 로그인',
      bullets: ['사용자 구분을 위한 로그인 기능'],
      images: ['/assets/ALNC/login.webp'],
    },
    {
      title: '메인페이지',
      bullets: ['날씨정보 확인 가능', '간단한 게시글 열람 가능'],
      images: ['/assets/ALNC/mainpage.webp'],
    },
    {
      title: '견적 신청',
      bullets: [
        '고압수, 스팀 세차 선택 가능',
        '우선순위 선택 가능',
        '사진 및 정보 작성 가능',
      ],
      images: [
        '/assets/ALNC/pick_first.webp',
        '/assets/ALNC/pick_second.webp',
        '/assets/ALNC/pick_final.webp',
      ],
    },
    {
      title: '견적서 보기',
      bullets: ['견적서 보낸 업체 리스트 열람', '업체 상세정보 열람'],
      images: ['/assets/ALNC/list.webp', '/assets/ALNC/list_detail.webp'],
    },
    {
      title: '견적함',
      bullets: ['예약 내역 열람 가능'],
      images: ['/assets/ALNC/pick_list.webp'],
    },
  ],
};

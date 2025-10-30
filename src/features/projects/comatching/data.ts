import type { ProjectData } from '@/features/projects/common/types';

export const COMATCHING_DATA: ProjectData = {
  title: 'COMATCHING',
  hero: '/assets/Comatching/mainpage.webp',
  skills: [
    { label: 'React', color: '#61DBFB' },
    { label: 'JavaScript', color: '#F0DB4F' },
    { label: 'Typescript', color: '#007acc' },
    { label: 'Recoil', color: '#007AF4' },
    { label: 'vanilla-extract', color: '#99F6E4' },
    { label: 'vite', color: '#9575CD' },
    { label: 'axios', color: '#0A99E0' },
  ],
  tools: [
    { label: 'Visual Studio Code', color: '#b0a1ec' },
    { label: 'Notion', color: '#eeeeee' },
    { label: 'Figma', color: '#F24E1E' },
    { label: 'AWS', color: '#777777' },
  ],
  period: '2023.09.07 ~ 2024.10.18',
  membersLabel: '개발 인원',
  members: '13명',
  roles: [
    { label: '프론트엔드 개발', color: '#dbebdb' },
    { label: '퍼블리싱', color: '#ffe2dd' },
    { label: '기획', color: '#f1c40f' },
    { label: '운영 및 홍보', color: '#fe340f' },
  ],
  contribution: '100%',
  result: '총 사용자 2095명',
  category: { label: 'WEB', color: '#f1780f' },
  githubUrl: 'https://github.com/COMAtching/COMAtching_FE',
  sections: [
    {
      title: '기능 - 회원가입',
      bullets: [
        'Oauth 2.0을 도입하여 kakao 소셜 로그인을 도입',
        '채팅 형식으로 정보 받음',
        '취향 입력 받음',
        '순서대로 추가 정보를 입력 받음',
      ],
      images: [
        '/assets/Comatching/loginpage.webp',
        '/assets/Comatching/registerchat.webp',
        '/assets/Comatching/registerhobby.webp',
        '/assets/Comatching/registerfinal.webp',
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
        '/assets/Comatching/mainpage.webp',
        '/assets/Comatching/mainpagecharge.webp',
        '/assets/Comatching/QRpage.webp',
      ],
    },
    {
      title: '매칭',
      bullets: [
        '기본 조건으로 MBTI를 고를 수 있고 유료 조건도 사용 가능',
        'AI를 활용하여 본인이 고른 조건과 가장 유사한 사람 제공',
      ],
      images: [
        '/assets/Comatching/matching.webp',
        '/assets/Comatching/matchingresult.webp',
      ],
    },
    {
      title: '결과 모아보기',
      bullets: ['본인이 뽑은 내역 확인 가능 및 사후평가'],
      images: ['/assets/Comatching/review.webp'],
    },
    {
      title: '관리자 충전 내역 관리',
      bullets: ['관리자가 포인트 충전 및 뽑힐 횟수 증가 가능'],
      images: ['/assets/Comatching/admin.webp'],
    },
  ],
};

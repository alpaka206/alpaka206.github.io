import type { Activity, Award, Certificate, Company, SkillGroup, Stat } from './types';

export const PROFILE = {
  name: '김규원',
  nameEn: 'Gyuwon Kim',
  role: '프론트엔드 개발자',
  headline: 'AI 기능을 실제 업무와 서비스로 연결하는 개발자',
  email: 'gyuwon05@gmail.com',
  github: { label: 'github.com/alpaka206', href: 'https://github.com/alpaka206' },
  blog: { label: 'alpaka206.vercel.app', href: 'https://alpaka206.vercel.app/' },
  site: 'https://alpaka206.github.io/',
  portrait: 'profile/portrait',
  /** Cartoon avatar used where a chat or blog identity fits better than a photo. */
  avatar: 'apps/blog',
  current: { company: '이스트에이드', team: 'AI 프로덕트 연구소', since: '2026.10' },
  portfolioPdf: '/files/gyuwon-kim-portfolio.pdf',
} as const;

/** The four confirmed numbers on page 1 of the portfolio PDF, in its order. */
export const STATS: Stat[] = [
  { value: '840명', label: 'AI 더빙 Premiere 플러그인 이용자', project: 'premiere-plugin' },
  { value: '300명+', label: 'AI 음성 알람 앱 AlarmTalk 이용자', project: 'alarmtalk' },
  { value: '26개 언어', label: 'Mearri AI 자막 번역과 YouTube 게시', project: 'mearri' },
  { value: '10분 이내', label: '삼성 91개국 웹 캡처, 기존 2~3시간', project: 'global-web-qa' },
];

export const CAREER: Company[] = [
  {
    name: '이스트에이드',
    period: '2026.10.13 - 현재',
    org: 'AI 프로덕트 연구소 / 계약직 / 팀원',
    summary: '3개 서비스 개발과 운영',
    duties: [
      { service: 'vonvon', text: '프론트엔드와 백엔드 개발, 새 버전 출시와 운영' },
      { service: 'mevu', text: '프롬프트 고도화와 영업 자동화' },
      { service: '알려ZUM', text: '확장 프로그램과 백엔드 개발, 크롤링' },
    ],
  },
  {
    name: '이스트소프트',
    period: '2026.04.01 - 2026.10.12',
    org: 'Dubbing실 / 계약직 / 사원',
    summary: 'AI 더빙 플러그인, 세일즈 자동화, 자막 서비스 Mearri와 알람 앱 AlarmTalk 개발',
  },
  {
    name: '펑타이그레이터차이나',
    period: '2024.12.02 - 2025.09.01',
    org: 'DSG-T9 / 인턴 / 프로',
    summary: '삼성 글로벌 웹과 이미지 QA 자동화, 대시보드와 보고서 개발',
  },
  {
    name: '에이치투비즈',
    period: '2024.06.24 - 2024.08.23',
    org: '개발팀 / 학생 인턴',
    summary: '프로젝트 구조 분석과 리팩터링, 프론트엔드 과제와 백엔드 구현',
  },
];

export const EDUCATION = {
  school: '가톨릭대학교',
  period: '2019.03 - 2025.02',
  degree: '학사',
  majors: ['정보통신전자공학부 주전공', '컴퓨터정보공학부 복수전공'],
  gpa: '3.68 / 4.5',
} as const;

export const CERTIFICATES: Certificate[] = [
  { title: 'SQLD (SQL 개발자)', date: '2026.03.27', issuer: '한국데이터산업진흥원' },
  { title: 'OPIc 영어 IH', date: '2025.08.29', issuer: 'ACTFL' },
];

export const ACTIVITIES: Activity[] = [
  {
    title: 'COMA 웹 스터디장',
    period: '2022.03 - 2024.06',
    body: 'React 학습 커리큘럼을 구성하고 세션과 프로젝트를 진행했습니다.',
  },
  {
    title: 'SOS class 튜터',
    period: '2023.03 - 2023.12',
    body: '프로그래밍 개념을 설명하고 과제 코드 리뷰와 디버깅을 지도했습니다.',
  },
  {
    title: 'ALCUK 알고리즘 동아리',
    period: '2019.06 - 2020.06',
    body: '문제 풀이, 코드 리뷰와 시간 복잡도를 학습했습니다.',
  },
];

/** Page 18, Technology & Experience: tools tied to what was built with them. */
export const SKILLS: SkillGroup[] = [
  {
    title: 'Frontend',
    items: [
      'React, TypeScript, Next.js App Router 기반 화면과 운영 콘솔 개발',
      'React Query 서버 상태, Zustand와 Recoil UI 상태 관리',
      'Konva 편집, 가상 스크롤, 코드 스플리팅과 Lazy Loading',
    ],
  },
  {
    title: 'Quality & Collaboration',
    items: [
      'Jest, Vitest, Playwright 테스트와 GitHub Actions CI',
      'Storybook UI 문서화, Figma와 Notion 협업',
      '로그와 재현 조건 기반 원인 분석',
    ],
  },
  {
    title: 'Integration & Automation',
    items: [
      'FastAPI, Cloudflare Workers와 Hono, Next.js API',
      'Gemini, Perso.ai, ElevenLabs, YouTube, HubSpot 연동',
      'Puppeteer 크롤링, n8n 자동화, PortOne 결제',
    ],
  },
  {
    title: 'Apps & Infra',
    items: [
      'Android 앱(Kotlin, Jetpack Compose)과 iOS 앱(SwiftUI) 출시',
      'Adobe UXP 플러그인, 브라우저 확장 프로그램, PKCE 인증',
      'PostgreSQL, Turso, MySQL과 Cloud Run, Vercel, Docker',
    ],
  },
];

/** Page 20, newest first. Images are the scanned certificates. */
export const AWARDS: Award[] = [
  {
    date: '2023.11.28',
    title: '전공 설계 취업 탐구 소모임 사업 우수상',
    issuer: '가톨릭대학교 정보통신전자공학부 / COMATCHING',
    images: ['awards/2023-major-design-career-exploration-excellence-award'],
  },
  {
    date: '2023.08.28',
    title: '하나 소셜벤처 유니버시티 이수 및 우수팀 선정',
    issuer: '하나금융그룹',
    images: [
      'awards/2023-hana-social-venture-university-outstanding-team-1',
      'awards/2023-hana-social-venture-university-outstanding-team-2',
    ],
  },
  {
    date: '2023.08.17',
    title: '학생 창업유망팀 300 성장트랙 최종 선정',
    issuer: '교육부 / DOT',
    images: ['awards/2023-startup-promising-team-300-final-selection'],
  },
  {
    date: '2022.12.07',
    title: '창업경진대회 장려상',
    issuer: '가톨릭대학교 / OASIS',
    images: ['awards/2022-startup-competition-encouragement-award'],
  },
  {
    date: '2022.11.24',
    title: '학술동아리 발표대회 최우수상',
    issuer: '정보통신전자공학부 / RC카 자율주행 로봇',
    images: ['awards/2022-academic-club-presentation-grand-prize'],
  },
  {
    date: '2019.10.05',
    title: 'ACM-ICPC 예선 교내 동상',
    issuer: '가톨릭대학교',
    images: ['awards/2019-acm-icpc-campus-preliminary-bronze-award'],
  },
  {
    date: '2019.10.05',
    title: 'Programming 대회 교내 개인전 동상',
    issuer: '가톨릭대학교',
    images: ['awards/2019-programming-competition-individual-bronze-award'],
  },
];

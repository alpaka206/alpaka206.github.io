import type { NoteId } from './conversation';
import { ACTIVITIES, CERTIFICATES, EDUCATION, SKILLS } from './profile';

export interface Note {
  id: NoteId;
  title: string;
  /** ISO date shown above the note. */
  updated: string;
  sections: { heading?: string; lines: string[] }[];
}

export const NOTES: readonly Note[] = [
  {
    id: 'how-built',
    title: '이 사이트를 만든 방법',
    updated: '2026-11-22T01:30:00+09:00',
    sections: [
      {
        lines: [
          'React 19, TypeScript, Vite로 만들었습니다. 런타임 의존성은 React와 Zustand, 글꼴뿐입니다.',
          '창 관리, Dock 확대, 스프링 애니메이션, 제스처는 라이브러리 없이 직접 구현했습니다.',
          '데스크톱과 휴대폰 화면을 나눠, 접속한 기기에 필요한 코드만 받습니다.',
          '이미지는 AVIF와 WebP를 화면 크기에 맞춰 골라 받고, 배경화면만 먼저 불러옵니다.',
          '같은 데이터로 텍스트 버전을 빌드할 때 만들어, 자바스크립트 없이도 읽히고 검색엔진에도 보입니다.',
          '동작 줄이기와 투명도 줄이기 설정을 따릅니다.',
        ],
      },
      { heading: '소스 코드', lines: ['github.com/alpaka206/alpaka206.github.io'] },
    ],
  },
  {
    id: 'skills',
    title: '기술과 경험',
    updated: '2026-11-15T18:00:00+09:00',
    sections: SKILLS.map((group) => ({ heading: group.title, lines: group.items })),
  },
  {
    id: 'education',
    title: '학력과 활동',
    updated: '2026-11-15T18:00:00+09:00',
    sections: [
      {
        heading: EDUCATION.school,
        lines: [`${EDUCATION.period} / ${EDUCATION.degree}`, ...EDUCATION.majors, `전체 평점 ${EDUCATION.gpa}`],
      },
      { heading: '자격', lines: CERTIFICATES.map((c) => `${c.title}, ${c.date} / ${c.issuer}`) },
      ...ACTIVITIES.map((a) => ({ heading: a.title, lines: [a.period, a.body] })),
    ],
  },
  {
    id: 'shortcuts',
    title: '단축키',
    updated: '2026-11-22T01:30:00+09:00',
    sections: [
      {
        lines: [
          '⌘K 또는 메뉴 막대의 돋보기: Spotlight',
          'Space: 선택한 항목 빠르게 보기',
          '⌘O, ⌘↓: 열기',
          '⌘[ ⌘]: 뒤로, 앞으로',
          '⌥⌘D: Dock 자동 가리기',
        ],
      },
      {
        heading: '전체 화면에서만',
        lines: [
          '⌘W 윈도우 닫기, ⌘M 최소화, ⌘Q 앱 종료, ⌘Tab 앱 전환, ⌘` 윈도우 전환',
          '브라우저 창에서는 이 키를 브라우저가 먼저 가져갑니다. 전체 화면(⌃⌘F)으로 보면 실제 Mac처럼 동작합니다.',
        ],
      },
    ],
  },
];

export const getNote = (id: NoteId) => NOTES.find((note) => note.id === id);

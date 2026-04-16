import type { DesktopTextFile, TextFileId } from '@/stores/desktopModels';

export const SYSTEM_TEXT_FILES: Record<TextFileId, DesktopTextFile> = {
  readme: {
    id: 'readme',
    title: 'README.txt',
    description: 'Windows portfolio shell overview',
    isReadOnly: true,
    content: `WINDOWS PORTFOLIO SHELL

- Windows 11 inspired portfolio desktop
- Rounded windows, taskbar, launcher search, browser shell
- GitHub API summary, github1s code window, Terminal, Notepad text files

QUICK START

1. 바탕화면 아이콘이나 Start를 눌러 창 열기
2. 작업표시줄 아이콘 클릭으로 포커스 또는 최소화
3. Settings에서 배경 변경
4. Terminal에서 빠른 명령 실행
5. GitHub 페이지에서 프로필과 최근 저장소 요약 확인
`,
  },
  'about-file': {
    id: 'about-file',
    title: 'ABOUT.txt',
    description: 'Short profile summary',
    isReadOnly: true,
    content: `KIM GYUWON
Frontend Developer

- React, TypeScript, Zustand 기반 UI 설계
- 포트폴리오 셸, 제품 페이지, 내부 도구 제작
- 구조 설계, 상태 관리, 사용성 정리에 강점

자세한 내용은 About 페이지와 Projects 페이지에서 확인할 수 있습니다.
`,
  },
  contact: {
    id: 'contact',
    title: 'CONTACT.txt',
    description: 'Contact channels',
    isReadOnly: true,
    content: `CONTACT

Email: gyuwon05@gmail.com
Phone: 010-2412-0339
GitHub: https://github.com/alpaka206
Blog: https://alpaka206.vercel.app/
Instagram: https://www.instagram.com/alpaka_dev/
`,
  },
  now: {
    id: 'now',
    title: 'NOW.txt',
    description: 'Current focus',
    isReadOnly: true,
    content: `NOW

- Windows-inspired portfolio shell refinement
- Browser allowlist and external handoff policy
- GitHub API summary UX
- Terminal command flow and Notepad text-file experience
- Desktop interaction polish and wallpaper personalization
`,
  },
  resume: {
    id: 'resume',
    title: 'RESUME.txt',
    description: 'Resume summary',
    isReadOnly: true,
    content: `RESUME SUMMARY

- Frontend Developer
- React / TypeScript / Zustand / Recoil / Vite
- 실시간 매칭 서비스, 제품 UI, 내부 운영 도구 경험

KEY PROJECTS

- COMATCHING
- Share-It
- 새차처럼

상세 내용은 Projects 페이지와 GitHub 요약 화면에서 확인할 수 있습니다.
`,
  },
};

export const SYSTEM_TEXT_FILE_LIST = Object.values(SYSTEM_TEXT_FILES);

export function getTextFileById(fileId: TextFileId) {
  return SYSTEM_TEXT_FILES[fileId];
}

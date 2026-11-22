import type { Project } from '../types';

// Company work: architecture diagram instead of screenshots, no repository link.
export const premierePlugin: Project = {
  slug: 'premiere-plugin',
  title: 'Premiere Pro Plugin',
  short: 'Premiere',
  name: 'Adobe Premiere Pro AI 더빙 플러그인',
  group: 'estsoft',
  meta: '이스트소프트 / 서비스 중',
  summary: 'React WebView, UXP 호스트, PKCE 인증',
  highlight: '3개월간 840명 이용',
  lead: 'Premiere를 떠나지 않고 패널에서 더빙해,\n결과를 편집 중인 타임라인에 바로 넣습니다.',
  icon: 'icons/plugin',
  tags: ['React', 'TypeScript', 'Adobe UXP', 'WebView', 'PKCE', 'Vite', 'TanStack Virtual'],
  links: [],
  blocks: [
    { type: 'metrics', items: [{ value: '840명', label: '3개월간 실제 이용자' }] },
    {
      type: 'flow',
      title: '플러그인 구조',
      lanes: [
        {
          nodes: [
            { title: '시스템 브라우저', body: 'PKCE 로그인' },
            {
              title: 'UXP 호스트',
              body: 'access token: 메모리\nrefresh token: SecureStorage\nPremiere 시퀀스 조작',
              key: true,
            },
            { title: '원격 WebView', body: 'React UI,\n플러그인 재설치 없이 갱신' },
          ],
          edges: ['일회용 relay\n인증 결과 전달', '허용 목록 요청만 전달'],
        },
      ],
    },
    {
      type: 'bullets',
      items: [
        '화자를 분리해 화자별 오디오 트랙에 넣고, 다시 생성한 문장은 해당 클립만 비리플 방식으로 교체했습니다.',
        '캡션 API 제약으로 트랜스크립트와 MOGRT 그래픽을 통한 자막 삽입을 시험했습니다.',
        'Perso API QA에서 오류를 찾아 수정하고, 기능을 제안해 개발했습니다.',
        "구버전 차단과 버전별 로깅을 적용하고, 시퀀스 삽입 실패 시 중단 단계를 확인해 '프로젝트에 추가'로 전환했습니다.",
      ],
    },
  ],
  keywords: ['프리미어', '더빙', '플러그인', 'UXP', 'Perso', 'Adobe', '자막'],
  pdfPages: [4],
};

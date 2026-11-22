/** Facts about this website itself, shown in 시스템 설정 › 이 사이트에 관하여 and by `neofetch`. */
export const SITE = {
  version: '2026.11',
  builtWith: ['React 19', 'TypeScript', 'Vite'],
  source: {
    label: 'github.com/alpaka206/alpaka206.github.io',
    href: 'https://github.com/alpaka206/alpaka206.github.io',
  },
} as const;

/** Both shells ask before 설정 초기화, which also hands 손쉬운 사용 back to the device's settings. */
export const RESET_QUESTION = '모든 설정을 처음 상태로 되돌릴까요? 동작 줄이기와 투명도 줄이기도 다시 기기 설정을 따르게 돼요.';

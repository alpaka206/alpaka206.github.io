import type { Project } from '../types';

// Owner's note: do not lead with "released on two stores".
export const alarmtalk: Project = {
  slug: 'alarmtalk',
  title: 'AlarmTalk / 알람톡',
  name: 'AI 음성 알람 앱 AlarmTalk',
  group: 'estsoft',
  meta: '이스트소프트에서 Perso API 사업 모델로 개발 / alarm-talk.com',
  summary: 'Android와 iOS 앱, Cloudflare Workers',
  highlight: '실사용자 300명+',
  lead: '300명 이상이 사용하는\nAI 음성 알람 앱을 개발했습니다.',
  icon: 'apps/alarmtalk',
  cover: 'projects/alarmtalk-app',
  tags: ['Kotlin', 'Jetpack Compose', 'SwiftUI', 'Cloudflare Workers', 'Hono', 'Turso', 'R2', 'ElevenLabs'],
  links: [
    { label: 'alarm-talk.com', href: 'https://alarm-talk.com/' },
    { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.alarmtalk.app' },
    { label: 'App Store', href: 'https://apps.apple.com/app/id6799711245' },
    { label: 'github.com/alpaka206/AlarmTalk', href: 'https://github.com/alpaka206/AlarmTalk' },
  ],
  blocks: [
    {
      type: 'columns',
      columns: [
        [
          { type: 'metrics', items: [{ value: '300명+', label: '실사용자' }] },
          {
            type: 'flow',
            title: '구조',
            lanes: [
              {
                nodes: [
                  { title: 'Workers API', body: 'Hono, Zod, Turso,\n브랜치별 자동 배포', key: true },
                  { title: 'ElevenLabs, R2', body: '음성 복제, TTS\n결정적 키 기반 캐시' },
                  { title: 'Android, iOS 앱', body: 'Kotlin, Compose, SwiftUI,\n재부팅 후 예약 복원' },
                ],
                edges: ["'유지' 선택\n렌더 작업 1개", '사전\n다운로드'],
              },
            ],
          },
          {
            type: 'bullets',
            items: [
              '유료 AI 호출은 사용자 선택 시에만 실행하고, 자동 테스트에서는 스텁으로 대체했습니다.',
              'JWT 만료까지 90일 이하면 백그라운드에서 갱신하고, Google과 Apple ID 토큰으로 인증했습니다.',
              'iOS 앱을 SwiftUI로 재구현해 2026년 9월 App Store에 출시했습니다.',
            ],
          },
        ],
        [{ type: 'media', src: 'projects/alarmtalk-app', alt: 'AlarmTalk 앱 알람 목록 화면', frame: 'phone' }],
      ],
    },
  ],
  keywords: ['알람톡', '알람', '음성', 'TTS', 'Android', 'iOS', '앱', 'Kotlin', 'Swift'],
  pdfPages: [9],
};

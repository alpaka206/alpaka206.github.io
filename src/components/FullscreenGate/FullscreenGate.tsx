import { useEffect, useState } from 'react';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useStartStore } from '@/stores/useStartStore';

export default function FullscreenGate() {
  const { request } = useFullscreen();

  const started = useStartStore((s) => s.started);
  const markStarted = useStartStore((s) => s.markStarted);

  const [visible, setVisible] = useState(() => !started);
  useEffect(() => setVisible(!started), [started]);

  const enter = async () => {
    try {
      await request();
      await new Promise<void>((resolve) => {
        let done = false;
        const h = () => {
          if (!done) {
            done = true;
            document.removeEventListener('fullscreenchange', h);
            resolve();
          }
        };
        document.addEventListener('fullscreenchange', h, { once: true });
        setTimeout(() => {
          if (!done) {
            done = true;
            resolve();
          }
        }, 150);
      });
    } catch {}
    markStarted();
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={[
        'fixed inset-0 z-[9999] select-none text-white',
        'bg-[url("/assets/common/system/window/BGimage.webp")] bg-cover bg-center',
      ].join(' ')}
    >
      <div
        className='absolute inset-0 bg-white/10 md:bg-white/5 backdrop-blur-3xl backdrop-saturate-150'
        aria-hidden
      />

      <div className='relative w-full h-full absolute inset-0 grid place-items-center px-4'>
        <div className='w-[360px] max-w-[90vw] rounded-2xl border border-white/20 shadow-2xl bg-white/14 backdrop-blur-2xl p-6 text-center'>
          <div className='mx-auto size-40 rounded-full overflow-hidden ring-1 ring-white/30 shadow-inner'>
            <img
              src='/assets/common/profile/ProfileImage.webp'
              alt='프로필'
              className='w-full h-full object-cover object-[0%_10%]'
              draggable={false}
            />
          </div>
          <div className='mt-4 text-[22px] font-semibold drop-shadow'>
            환영합니다
          </div>
          <div className='mt-1 text-sm opacity-90'>
            김규원의 포트폴리오입니다.
          </div>

          <button
            onClick={enter}
            className='mt-6 w-full rounded-xl py-3 font-medium bg-white text-black hover:bg-white/90 transition-colors'
          >
            전체 화면으로 시작하기
          </button>

          <div className='mt-4 pt-3 border-t border-white/10 text-xs opacity-90 flex items-center justify-center gap-4'>
            <span>로그인 옵션</span>
            <span className='opacity-60'>•</span>
            <span>네트워크</span>
            <span className='opacity-60'>•</span>
            <span>접근성</span>
          </div>
        </div>
      </div>
    </div>
  );
}

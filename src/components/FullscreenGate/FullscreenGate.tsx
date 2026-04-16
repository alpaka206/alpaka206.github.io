import { useEffect, useState } from 'react';
import { getWallpaperStyle } from '@/features/desktop/config/shell';
import { useClock } from '@/hooks/useClock';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useVisitorCount } from '@/hooks/useVisitorCount';
import {
  useDesktopPreferencesStore,
  useStartStore,
} from '@/stores';
import { playSystemSound } from '@/utils/systemSounds';

function formatLockTime(now: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);
}

function formatLockDate(now: Date) {
  return new Intl.DateTimeFormat('ko-KR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(now);
}

export default function FullscreenGate() {
  const { request } = useFullscreen();
  const now = useClock();
  const visitorCount = useVisitorCount();
  const wallpaperId = useDesktopPreferencesStore((s) => s.wallpaperId);

  const started = useStartStore((s) => s.started);
  const markStarted = useStartStore((s) => s.markStarted);

  const [visible, setVisible] = useState(() => !started);
  useEffect(() => setVisible(!started), [started]);

  const enter = async () => {
    try {
      await request();
      await new Promise<void>((resolve) => {
        let done = false;
        const handle = () => {
          if (!done) {
            done = true;
            document.removeEventListener('fullscreenchange', handle);
            resolve();
          }
        };
        document.addEventListener('fullscreenchange', handle, { once: true });
        setTimeout(() => {
          if (!done) {
            done = true;
            resolve();
          }
        }, 180);
      });
    } catch {}

    markStarted();
    setVisible(false);
    playSystemSound('startup');
  };

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = () => {
      void enter();
    };

    window.addEventListener('keydown', onKeyDown, { once: true });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible]);

  if (!visible) return null;

  return (
    <button
      onClick={() => void enter()}
      className='fixed inset-0 z-[10000] block select-none text-left text-white'
      style={getWallpaperStyle(wallpaperId)}
    >
      <div
        className='absolute inset-0 bg-[linear-gradient(180deg,rgba(4,11,24,0.26)_0%,rgba(5,10,20,0.56)_100%)]'
        aria-hidden
      />

      <div className='relative flex h-full flex-col justify-between px-6 py-8 md:px-10 md:py-10'>
        <div className='flex items-start justify-between'>
          <div className='rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-medium tracking-[0.18em] text-white/80 backdrop-blur-xl'>
            Click or press any key to unlock
          </div>
          {visitorCount !== null ? (
            <div className='rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-medium text-white/85 backdrop-blur-xl'>
              Visitors {visitorCount.toLocaleString()}
            </div>
          ) : null}
        </div>

        <div className='max-w-[680px] pb-20'>
          <div className='text-[82px] font-semibold leading-none tracking-[-0.05em] md:text-[112px]'>
            {formatLockTime(now)}
          </div>
          <div className='mt-4 text-[22px] font-medium text-white/88 md:text-[28px]'>
            {formatLockDate(now)}
          </div>
          <div className='mt-6 max-w-[520px] text-sm leading-7 text-white/76 md:text-[15px]'>
            Windows-inspired shell for portfolio, projects, browser previews,
            notes, and a curated code explorer.
          </div>
        </div>
      </div>
    </button>
  );
}

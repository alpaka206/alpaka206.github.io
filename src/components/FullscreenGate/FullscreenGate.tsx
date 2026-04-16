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
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    setVisible(!started);
    if (!started) {
      setIsEntering(false);
    }
  }, [started]);

  const enter = async () => {
    if (isEntering) return;

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

    setIsEntering(true);
    playSystemSound('startup');

    window.setTimeout(() => {
      markStarted();
      setVisible(false);
    }, 220);
  };

  useEffect(() => {
    if (!visible || isEntering) return;

    const onKeyDown = () => {
      void enter();
    };

    window.addEventListener('keydown', onKeyDown, { once: true });
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isEntering, visible]);

  if (!visible) return null;

  return (
    <button
      onClick={() => void enter()}
      type='button'
      aria-label='Enter portfolio'
      className={[
        'fixed inset-0 z-[10000] block select-none text-left text-white',
        'transition-[opacity,transform] duration-300 ease-out',
        isEntering ? 'pointer-events-none opacity-0 scale-[1.015]' : 'opacity-100',
      ].join(' ')}
      style={getWallpaperStyle(wallpaperId)}
    >
      <div
        className='absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.12)_0%,transparent_20%),linear-gradient(180deg,rgba(4,11,24,0.16)_0%,rgba(5,10,20,0.36)_45%,rgba(5,10,20,0.68)_100%)]'
        aria-hidden
      />

      <div className='relative flex h-full flex-col justify-between px-6 py-8 md:px-10 md:py-10'>
        <div className='flex items-start justify-between'>
          <div className='rounded-full border border-white/16 bg-black/18 px-4 py-2 text-[11px] font-medium tracking-[0.16em] text-white/72 backdrop-blur-xl md:text-xs'>
            Press any key or click anywhere
          </div>
          {visitorCount !== null ? (
            <div className='rounded-full border border-white/16 bg-black/18 px-4 py-2 text-[11px] font-medium text-white/78 backdrop-blur-xl md:text-xs'>
              Visitors {visitorCount.toLocaleString()}
            </div>
          ) : null}
        </div>

        <div className='max-w-[680px] pb-10 md:pb-16'>
          <div className='text-[82px] font-semibold leading-none tracking-[-0.05em] md:text-[112px]'>
            {formatLockTime(now)}
          </div>
          <div className='mt-4 text-[22px] font-medium text-white/88 md:text-[28px]'>
            {formatLockDate(now)}
          </div>

          <div className='mt-8 max-w-[620px]'>
            <div className='text-[11px] font-medium uppercase tracking-[0.28em] text-white/62 md:text-xs'>
              Frontend Developer
            </div>
            <div className='mt-3 text-[28px] font-semibold tracking-[-0.04em] text-white md:text-[40px]'>
              김규원 Portfolio
            </div>
            <div className='mt-4 max-w-[560px] text-sm leading-7 text-white/74 md:text-[15px]'>
              Projects, profile, notes, browser previews, and a live GitHub
              workspace inside a Windows-inspired desktop shell.
            </div>
          </div>

          <div className='mt-8 flex flex-wrap items-center gap-3 md:mt-10'>
            <div className='inline-flex min-h-11 items-center rounded-full border border-white/22 bg-white/14 px-5 text-[13px] font-semibold tracking-[0.08em] text-white shadow-[0_12px_30px_rgba(7,12,24,0.18)] backdrop-blur-xl'>
              Enter Portfolio
            </div>
            <div className='text-sm text-white/64'>
              Click anywhere or press any key
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

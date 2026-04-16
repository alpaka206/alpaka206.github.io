import { getWallpaperStyle } from '@/features/desktop/config/shell';
import { DesktopSurface } from '@/features/desktop/components/DesktopSurface';
import { DESKTOP_FEATURED_ASSETS } from '@/config/featured-assets';
import { useDesktopPreferencesStore } from '@/stores';
import Desktop from '@/features/desktop/components/Desktop';
import { useImagePreload } from '@/utils/preloadAssets';

export default function MainPage() {
  const wallpaperId = useDesktopPreferencesStore((s) => s.wallpaperId);

  useImagePreload(DESKTOP_FEATURED_ASSETS);

  return (
    <div
      className='
        relative w-screen h-screen
        bg-cover bg-center bg-no-repeat
        text-white
      '
      style={getWallpaperStyle(wallpaperId)}
    >
      <DesktopSurface />
      <Desktop />
    </div>
  );
}

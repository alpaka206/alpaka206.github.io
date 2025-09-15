import { FolderIcon } from '@/components/FolderIcon';
import { useDesktopStore } from '@/stores/useDesktopStore';
import Desktop from '@/features/desktop/components/Desktop';
import FolderView from '@/features/folder-window/components/FolderView';
import { PAGE_TABS } from '@/features/pages-window/registry/page-registry';

export default function MainPage() {
  const openPage = useDesktopStore((s) => s.openPage);
  const openFolder = useDesktopStore((s) => s.openFolder);

  const openGitHubPage = () => {
    const popupWidth = 1200;
    const popupHeight = 600;
    const popupX = Math.round(
      window.screenX + window.outerWidth / 2 - popupWidth / 2
    );
    const popupY = Math.round(
      window.screenY + window.outerHeight / 2 - popupHeight / 2
    );
    const featureWindow = `width=${popupWidth}, height=${popupHeight}, left=${popupX}, top=${popupY}`;
    return window.open('https://github.com/alpaka206', '_blank', featureWindow);
  };

  return (
    <div
      className='
        relative w-screen h-screen
        bg-cover bg-center bg-no-repeat
        text-white
      '
      style={{ backgroundImage: "url('/assets/BGimage.webp')" }}
    >
      <div className='absolute inset-0 flex flex-col gap-6 md:gap-8 items-start'>
        <FolderIcon
          imageUrl='/assets/Profile.webp'
          title='About Me'
          onClick={() => openPage(PAGE_TABS.about)}
        />
        <FolderIcon
          imageUrl='/assets/folder1.webp'
          title='Projects'
          onClick={() =>
            openFolder({
              id: 'folder:projects',
              title: 'Projects',
              icon: '/assets/folder.webp',
              content: <FolderView />,
              initialPos: { x: 160, y: 120 },
            })
          }
        />
        <FolderIcon
          imageUrl='/assets/Blog.webp'
          title='Tech Blog'
          onClick={() => openPage(PAGE_TABS.blog)}
        />
        <FolderIcon
          imageUrl='/assets/Insta.webp'
          title='Instagram'
          onClick={() => openPage(PAGE_TABS.insta)}
        />
        <FolderIcon
          imageUrl='/assets/prize.webp'
          title='Awards'
          onClick={() => openPage(PAGE_TABS.awards)}
        />
        <FolderIcon
          imageUrl='/assets/Github.webp'
          title='GitHub'
          onClick={openGitHubPage}
        />
      </div>
      <Desktop />
    </div>
  );
}

import { FolderIcon } from '@/components/FolderIcon';
import { useDesktopStore } from '@/stores/useDesktopStore';
import Desktop from '@/features/desktop/components/Desktop';
import { PAGE_TABS } from '@/features/pages-window/registry/page-registry';

export default function MainPage() {
  const openPage = useDesktopStore((s) => s.openPage);
  const openFolder = useDesktopStore((s) => s.openFolder);

  return (
    <div
      className='
        relative w-screen h-screen
        bg-cover bg-center bg-no-repeat
        text-white
      '
      style={{
        backgroundImage: "url('/assets/common/system/window/BGimage.webp')",
      }}
    >
      <div className='absolute inset-0 flex flex-col gap-6 md:gap-8 items-start'>
        <FolderIcon
          imageUrl='/assets/common/system/window/Profile.webp'
          title='About Me'
          onClick={() => openPage(PAGE_TABS.about)}
        />
        <FolderIcon
          imageUrl='/assets/common/system/window/folder.webp'
          title='Projects'
          onClick={() =>
            openFolder({
              id: 'folder:projects',
              title: 'Projects',
              icon: '/assets/common/system/window/folder.webp',
              contentType: 'projects',
              initialPos: { x: 160, y: 120 },
            })
          }
        />
        <FolderIcon
          imageUrl='/assets/common/socials/Blog.webp'
          title='Tech Blog'
          onClick={() => openPage(PAGE_TABS.blog)}
        />
        <FolderIcon
          imageUrl='/assets/common/socials/Insta.webp'
          title='Instagram'
          onClick={() => openPage(PAGE_TABS.insta)}
        />
        <FolderIcon
          imageUrl='/assets/common/prize/icon.webp'
          title='Awards'
          onClick={() => openPage(PAGE_TABS.awards)}
        />
        <FolderIcon
          imageUrl='/assets/common/socials/Github.webp'
          title='GitHub'
          onClick={() =>
            window.open('https://github.com/alpaka206', '_blank', 'noopener')
          }
        />
      </div>
      <Desktop />
    </div>
  );
}

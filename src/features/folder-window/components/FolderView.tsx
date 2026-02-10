import { FolderIcon } from '@/components/FolderIcon';
import { useDesktopStore } from '@/stores/useDesktopStore';
import type { PageTab, PageType } from '@/stores/useDesktopStore';

const FOLDER_ITEMS: Array<{
  id: PageType;
  title: string;
  icon: string;
}> = [
  {
    id: 'comatching',
    title: 'COMATCHING',
    icon: '/assets/projects/Comatching/icon.webp',
  },
  {
    id: 'share-it',
    title: 'Share-It',
    icon: '/assets/projects/ShareIt/icon.webp',
  },
  {
    id: 'alnc',
    title: '새차처럼',
    icon: '/assets/projects/ALNC/icon.webp',
  },
];

export default function FolderView() {
  const openPage = useDesktopStore((s) => s.openPage);

  const openProject = (tab: PageTab) => openPage(tab);

  return (
    <div className='w-full h-full p-4 md:p-5 overflow-auto bg-[#f0f0f0]'>
      <div className='grid grid-cols-10 gap-x-6 gap-y-8'>
        {FOLDER_ITEMS.map((it) => (
          <FolderIcon
            key={it.id}
            imageUrl={it.icon}
            title={it.title}
            variant='folder'
            onClick={() =>
              openProject({
                id: it.id,
                title: it.title,
                icon: it.icon,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

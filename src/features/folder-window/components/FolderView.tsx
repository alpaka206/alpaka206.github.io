import { FolderIcon } from '@/components/FolderIcon';
import { useDesktopStore } from '@/stores/useDesktopStore';
import type { PageTab, PageType } from '@/stores/useDesktopStore';

const FOLDER_ITEMS: Array<{
  id: PageType;
  title: string;
  icon: string;
  iconFrameClassName?: string;
}> = [
  {
    id: 'comatching',
    title: 'COMATCHING',
    icon: '/assets/projects/comatching/comatching-icon.webp',
  },
  {
    id: 'share-it',
    title: 'Share-It',
    icon: '/assets/projects/share-it/share-it-icon.webp',
    iconFrameClassName:
      'rounded-[18px] border border-black/10 bg-white/90 p-1.5 shadow-[0_8px_20px_rgba(15,23,42,0.08)]',
  },
  {
    id: 'alnc',
    title: '새차처럼',
    icon: '/assets/projects/alnc/alnc-icon.webp',
  },
];

export default function FolderView() {
  const openPage = useDesktopStore((s) => s.openPage);

  const openProject = (tab: PageTab) => openPage(tab);

  return (
    <div className='h-full w-full overflow-auto p-4 md:p-5'>
      <div className='grid [grid-template-columns:repeat(auto-fill,minmax(92px,1fr))] justify-items-start gap-x-4 gap-y-6 md:gap-x-6 md:gap-y-8'>
        {FOLDER_ITEMS.map((item) => (
          <FolderIcon
            key={item.id}
            imageUrl={item.icon}
            title={item.title}
            imageFrameClassName={item.iconFrameClassName}
            variant='folder'
            onClick={() =>
              openProject({
                id: item.id,
                title: item.title,
                icon: item.icon,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

import { FolderIcon } from '@/components/FolderIcon';
import { useDesktopStore } from '@/stores/useDesktopStore';
import type { PageTab, PageType } from '@/stores/useDesktopStore';
import { resolveUrl } from '@/utils/resolveUrl';

export default function FolderView() {
  const openPage = useDesktopStore((s) => s.openPage);

  const openProject = (tab: PageTab) => openPage(tab);

  const items: Array<{
    id: PageType;
    title: string;
    icon: string;
    iframeSrc: string;
  }> = [
    {
      id: 'comatching',
      title: 'COMATCHING',
      icon: '/assets/Comatching/icon.webp',
      iframeSrc: resolveUrl('/Comatching'),
    },
    {
      id: 'share-it',
      title: 'Share-It',
      icon: '/assets/ShareIt/icon.webp',
      iframeSrc: resolveUrl('/ShareIt'),
    },
    {
      id: 'alnc',
      title: '새차처럼',
      icon: '/assets/ALNC/icon.webp',
      iframeSrc: resolveUrl('/ALNC'),
    },
  ];

  return (
    <div className='w-full h-full p-4 md:p-5 overflow-auto bg-[#f0f0f0]'>
      <div className='grid grid-cols-10 gap-x-6 gap-y-8'>
        {items.map((it) => (
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
                content: (
                  <iframe
                    src={it.iframeSrc}
                    title={it.title}
                    className='w-full h-full'
                  />
                ),
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

import { FolderIcon } from "@/components/FolderIcon";
import { useDesktopStore } from "@/store/useDesktopStore";
import type { PageTab, PageType } from "@/store/useDesktopStore";

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
      id: "comatching",
      title: "COMATCHING",
      icon: "/assets/Comatching.webp",
      // iframeSrc: "https://alpaka206.github.io/#/Comatching",
      iframeSrc: "http://localhost:5173/#/Comatching",
    },
    {
      id: "share-it",
      title: "Share-It",
      icon: "/assets/Shareit.webp",
      // iframeSrc: "https://alpaka206.github.io/#/ShareIt",
      iframeSrc: "http://localhost:5173/#/ShareIt",
    },
    {
      id: "alnc",
      title: "새차처럼",
      icon: "/assets/ALNC.webp",
      // iframeSrc: "https://alpaka206.github.io/#/ALNC",
      iframeSrc: "http://localhost:5173/#/ALNC",
    },
  ];

  return (
    <div className="w-full h-full p-4 md:p-5 overflow-auto">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-x-6 gap-y-8">
        {items.map((it) => (
          <FolderIcon
            key={it.id}
            imageUrl={it.icon}
            title={it.title}
            onClick={() =>
              openProject({
                id: it.id,
                title: it.title,
                icon: it.icon,
                content: (
                  <iframe
                    src={it.iframeSrc}
                    title={it.title}
                    className="w-full h-full"
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

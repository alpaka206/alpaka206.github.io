import type { FolderWindow, FolderContentType } from '@/stores';
import FolderView from '@/features/folder-window/components/FolderView';

const FOLDER_CONTENT: Record<FolderContentType, React.FC> = {
  projects: FolderView,
};

export function FolderBody({ win }: { win: FolderWindow }) {
  const Content = FOLDER_CONTENT[win.contentType];
  return (
    <div className='w-full h-full min-h-0 overflow-auto'>
      <Content />
    </div>
  );
}

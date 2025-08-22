import { FolderWindow } from '@/store';

export function FolderBody({ win }: { win: FolderWindow }) {
  return (
    <div className='w-full h-full min-h-0 overflow-auto'>{win.content}</div>
  );
}

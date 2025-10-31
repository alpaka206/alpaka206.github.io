import { ProjectImageItem } from './types';

export function ProjectImageGrid({ items }: { items: ProjectImageItem[] }) {
  return (
    <div
      className={[
        'columns-1 sm:columns-2 lg:columns-3',
        '[column-gap:1rem]',
      ].join(' ')}
    >
      {items.map(({ src, alt }) => (
        <div
          key={src}
          className={[
            'mb-4 break-inside-avoid',
            'rounded-[10px] overflow-hidden',
            'shadow-[0_4px_8px_rgba(0,0,0,0.1)]',
            'bg-white/40',
          ].join(' ')}
        >
          <img src={src} alt={alt || ''} className='w-full h-auto block' />
        </div>
      ))}
    </div>
  );
}
